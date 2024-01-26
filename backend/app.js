const express = require("express")
const stytch = require("stytch")
const cookieParser = require("cookie-parser")
require('dotenv').config()
const cors = require('cors')
const { getIntermediateSession, setIntermediateSession, setSession, clearSession, clearIntermediateSession, revokeSession, getDiscoverySessionData } = require("./session")

const stytchEnv =
    process.env.NEXT_PUBLIC_STYTCH_PROJECT_ENV === "live"
        ? stytch.envs.live
        : stytch.envs.test;

const stytchClient = new stytch.B2BClient({
    project_id: process.env.STYTCH_PROJECT_ID || "",
    secret: process.env.STYTCH_SECRET || "",
    env: stytchEnv,
});

function toDomain(email) {
    return email.split("@")[1];
}

const frontendDomain = "http://localhost:5173"

const app = express()

app.use(express.json())
app.use(cors({ origin: frontendDomain, credentials: true }))
app.use(cookieParser())


app.post("/api/discovery/start", async (req, res) => {

    const { email } = req.body

    const params = {
        email_address: email,
        discovery_redirect_url: `${frontendDomain}/auth/callback`
    };

    try {
        let resp = await stytchClient.magicLinks.email.discovery.send(params)

        res.status(200).json({ message: "Email sent" })
    } catch (e) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.post("/api/discovery/create", async (req, res) => {

    const intermediateSession = getIntermediateSession(req, res);

    if (!intermediateSession) {
        return res.redirect(307, "/login");
    }
    const { organization_name, require_mfa } = req.body;

    try {
        const { member, organization, session_jwt, intermediate_session_token } =
            await stytchClient.discovery.organizations.create({
                intermediate_session_token: intermediateSession,
                email_allowed_domains: [],
                organization_name: organization_name,
                session_duration_minutes: 60,
                mfa_policy: require_mfa ? "REQUIRED_FOR_ALL" : "OPTIONAL"
            });

        // Make the organization discoverable to other emails
        try {
            await stytchClient.organizations.update({
                organization_id: organization.organization_id,
                email_jit_provisioning: "RESTRICTED",
                sso_jit_provisioning: "ALL_ALLOWED",
                email_allowed_domains: [toDomain(member.email_address)],
            });
        } catch (e) {
            if (e.error_type == "organization_settings_domain_too_common") {
                console.error("User domain is common email provider, cannot link to organization");
            } else {
                throw e;
            }
        }

        // Mark the first user in the organization as the admin
        await stytchClient.organizations.members.update({
            organization_id: organization.organization_id,
            member_id: member.member_id,
            trusted_metadata: { admin: true },
        });

        if (session_jwt === "") {
            setIntermediateSession(req, res, intermediate_session_token)
            clearSession(req, res)
            res.status(200).json({ message: "Organization created. Proceed for MFA", redirectPath: `/smsmfa?sent=false&org_id=${organization.organization_id}&member_id=${member.member_id}`, organizationId: organization.organization_id });
            return
        }
        clearIntermediateSession(req, res);
        setSession(req, res, session_jwt);
        res.status(200).json({ message: "Organization created", redirectPath: `/dashboard`, organizationId: organization.organization_id });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", redirectPath: `/login` });
    }
})

app.post("/api/discovery/get-organization", async (req, res) => {
    const { organizationId, memberEmail } = req.body

    if (!organizationId || Array.isArray(organizationId)) {
        res.status(500).json({ message: "No org ID found", redirectPath: "/login" });
        return
    }

    try {
        let resp = await stytchClient.organizations.members.get({ organization_id: organizationId, email_address: memberEmail })

        res.status(200).json({ message: "Org retrieved successfully", organization: resp.organization, member: resp.member })
    } catch (e) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.post("/api/discovery/select-organization", async (req, res) => {

    const discoverySessionData = getDiscoverySessionData(req, res);
    if (discoverySessionData.error) {
        console.error("No session tokens found...");
        res.status(400).json({ message: "No session tokens found", redirectPath: "/login" });
        return
    }

    const { organizationId } = req.body

    if (!organizationId || Array.isArray(organizationId)) {
        res.status(500).json({ message: "No org ID found", redirectPath: "/discovery" });
        return
    }

    const exchangeSession = () => {
        if (discoverySessionData.isDiscovery) {
            return stytchClient.discovery.intermediateSessions.exchange({
                intermediate_session_token: discoverySessionData.intermediateSession,
                organization_id: organizationId,
                session_duration_minutes: 60,
            });
        }
        return stytchClient.sessions.exchange({
            organization_id: organizationId,
            session_jwt: discoverySessionData.sessionJWT,
        });
    };

    try {
        const { session_jwt, organization, member, intermediate_session_token } = await exchangeSession();
        if (session_jwt === "") {
            setIntermediateSession(req, res, intermediate_session_token)
            clearSession(req, res)
            res.status(200).json({ message: "2FA started", redirectPath: `/smsmfa?sent=false&org_id=${organization.organization_id}&member_id=${member.member_id}`, organizationId: organization.organization_id })
            return
        }
        setSession(req, res, session_jwt);
        clearIntermediateSession(req, res);
        res.status(200).json({ message: "Auth complete", redirectPath: `/dashboard`, organizationId: organization.organization_id });
        return
    } catch (error) {
        console.error("Could not authenticate in callback", error);
        res.status(500).json({ message: "Could not authenticate", redirectPath: "/discovery" });
    }
})

app.post("/api/auth/callback", async (req, res) => {

    const { token } = req.body

    const params = {
        discovery_magic_links_token: token,
    };

    try {
        let resp = await stytchClient.magicLinks.discovery.authenticate(params)

        setIntermediateSession(req, res, resp.intermediate_session_token);

        res.status(200).json(resp)
    } catch (e) {
        console.error(e)
        res.status(e.status_code).json({ error: e.error_message })
    }
})

app.get("/api/auth/logout", async (req, res) => {
    revokeSession(req, res, stytchClient);
    res.status(200).json({ message: "Logged out", redirectPath: "/login" })
})

app.post("/api/mfa/send", async (req, res) => {
    const { orgID, memberId, phone_number } = req.body;

    try {
        const resp = await stytchClient.otps.sms.send({
            organization_id: orgID,
            member_id: memberId,
            mfa_phone_number: phone_number
        });

        res.status(200).json({ message: "OTP sent", redirectPath: `/smsmfa?sent=true&org_id=${resp.organization.organization_id}&member_id=${resp.member.member_id}` })
    } catch (error) {
        console.error("Could not send in callback", error);

        res.status(200).json({ message: "Could not send OTP", redirectPath: `/discovery` })
    }
})

app.post("/api/mfa/authenticate", async (req, res) => {
    const discoverySessionData = getDiscoverySessionData(req, res);
    if (discoverySessionData.error) {
        console.error("No session tokens found...");
        res.status(400).json({ message: "No session tokens found", redirectPath: "/login" });
        return
    }

    const { orgID, memberId, code } = req.body;

    try {
        const { session_jwt } = await stytchClient.otps.sms.authenticate({
            organization_id: orgID,
            member_id: memberId,
            code: code,
            intermediate_session_token: discoverySessionData.intermediateSession,
        });
        setSession(req, res, session_jwt);
        clearIntermediateSession(req, res);
        res.status(200).json({ message: "OTP Authentication successful", redirectPath: `/dashboard` })
    } catch (error) {
        console.error("Could not authenticate with OTP", error);

        res.status(200).json({ message: "Could not authenticate with OTP" })
    }
})

app.post("/api/mfa/update", async (req, res) => {
    const { organizationId, mfaPolicy } = req.body

    if (!organizationId || Array.isArray(organizationId)) {
        res.status(500).json({ message: "No org ID found", redirectPath: "/login" });
        return
    }

    if (!mfaPolicy || !(mfaPolicy === "REQUIRED_FOR_ALL" || mfaPolicy === "OPTIONAL")) {
        res.status(500).json({ message: "Invalid value for MFA Policy", redirectPath: "/dashboard" });
        return
    }

    try {
        let resp = await stytchClient.organizations.update({ organization_id: organizationId, mfa_policy: mfaPolicy })

        res.status(200).json({ message: "MFA policy updated successfully", organization: resp.organization })
    } catch (e) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.listen(3000, () => {
    console.log("Server started")
})
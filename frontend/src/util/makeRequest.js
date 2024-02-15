const serverBaseUrl = "http://localhost:3000"

export const discoveryStart = async (email) => fetch(`${serverBaseUrl}/api/discovery/start`, {
    method: "POST",
    credentials: 'include',
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        email,
    }),
});


export const authCallback = async (token, stytch_token_type) =>
    fetch(`${serverBaseUrl}/api/auth/callback`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token,
            stytch_token_type
        }),
    })

export const createOrg = async (organizationName, requireMfa) =>
    fetch(`${serverBaseUrl}/api/discovery/create`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            organizationName,
            requireMfa
        }),
    })

export const getOrg = async (organizationId, memberEmail) =>
    fetch(`${serverBaseUrl}/api/discovery/get-organization`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            organizationId, memberEmail
        }),
    })

export const authenticateMFA = async (code, organizationId, memberId) =>
    fetch(`${serverBaseUrl}/api/mfa/authenticate`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code, organizationId, memberId
        })
    })


export const sendMFACode = async (phoneNumber, organizationId, memberId) =>
    fetch(`${serverBaseUrl}/api/mfa/send`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            phoneNumber, organizationId, memberId
        })
    })

export const selectOrganization = async (organizationId) =>
    fetch(`${serverBaseUrl}/api/discovery/select-organization`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            organizationId
        })
    })

export const logout = async () =>
    fetch(`${serverBaseUrl}/api/auth/logout`, {
        method: "GET",
        credentials: 'include',
    })

export const toggleMFA = async (organizationId, memberId, mfaOptIn) =>
    fetch(`${serverBaseUrl}/api/mfa/update`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            organizationId,
            memberId,
            mfaOptIn
        })
    })
export const discoveryStart = async (email) => fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/discovery/start`, {
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
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/callback`, {
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

export const createOrg = async (organization_name, require_mfa) =>
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/discovery/create`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            organization_name,
            require_mfa
        }),
    })

export const getOrg = async (organizationId, memberEmail) =>
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/discovery/get-organization`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            organizationId, memberEmail
        }),
    })

export const authenticateMFA = async (code, orgID, memberId) =>
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/mfa/authenticate`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            code, orgID, memberId
        })
    })


export const sendMFACode = async (phoneNumber, orgID, memberId) =>
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/mfa/send`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            phoneNumber, orgID, memberId
        })
    })

export const selectOrganization = async (organizationId) =>
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/discovery/select-organization`, {
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
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/logout`, {
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
    })
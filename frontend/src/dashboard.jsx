import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrg, logout, toggleMFA } from './util/makeRequest';


export default function Dashboard() {
    const [organization, setOrganization] = useState({})
    const [member, setMember] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        const orgId = localStorage.getItem("organizationId", "")
        const memberEmail = localStorage.getItem("memberEmail", "")

        getOrg(orgId, memberEmail)
        .then(r => r.json())
        .then(r => {
            if (r.message === "No org ID found") {
                navigate(r.redirectPath)
            }
            console.log(r)
            setOrganization(r.organization)
            setMember(r.member)
        })
    }, [])

    const onLogoutClicked = () => {
        logout()
        .then(r => r.json())
        .then(r => {
            localStorage.removeItem("memberEmail")
            localStorage.removeItem("organizationId")
            console.log("logged out")
            navigate(r.redirectPath)
        })
    }

    const onMFAToggle = () => {
        toggleMFA(organization.organization_id, member.member_id, !member.mfa_enrolled)
        .then(r => r.json())
        .then(r => {
            window.location.reload()
        })
        .catch(e => console.error(e))
    }

    return (
        <div className="card">
            <h1>Organization name: {organization.organization_name}</h1>
            <p>
                Organization slug: <span className="code">{organization.organization_slug}</span>
            </p>
            <p>
                Current user: <span className="code">{member.email_address}</span>
            </p>
            <p>
                MFA Setting: <span className="code">{organization.mfa_policy}</span>
            </p>

            <div>
            &nbsp;&nbsp;&nbsp;&nbsp;
                <p style={{cursor: "pointer"}} onClick={onMFAToggle}>
                    <u>
                    {organization.mfa_policy === "OPTIONAL" ? 
                    "Opt " + (member.mfa_enrolled ? "out from" : "in for") + " MFA"
                : ""}
                </u>
                </p>
                <p style={{cursor: "pointer"}} onClick={onLogoutClicked}><u>Log Out</u></p>
            </div>
        </div>
    );
}
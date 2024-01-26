import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getOrg, logout } from './util/makeRequest';


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
                <p></p>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <p onClick={onLogoutClicked}>Log Out</p>
            </div>
        </div>
    );
}
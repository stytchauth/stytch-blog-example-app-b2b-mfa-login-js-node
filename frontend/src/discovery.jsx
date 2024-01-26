import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react"
import { createOrg } from "./util/makeRequest"
import { useNavigate } from 'react-router-dom'
import { selectOrganization } from "./util/makeRequest"

export default function Discovery() {

    const { state } = useLocation();

    const {
        discovered_organizations,
        email_address
    } = state


    useEffect(() => {
        localStorage.setItem("memberEmail", email_address)
    }, [])

    return (
        <div className="card">
            <DiscoveredOrganizationsList
                discovered_organizations={discovered_organizations}
            />
            <CreateNewOrganization />
        </div>
    );
}


const DiscoveredOrganizationsList = ({ discovered_organizations }) => {
    const navigate = useNavigate()
    const formatMembership = ({
        membership,
        organization,
    }) => {
        if (membership.type === "pending_member") {
            return `Join ${organization.organization_name}`;
        }
        if (membership.type === "eligible_to_join_by_email_domain") {
            return `Join ${organization.organization_name} via your ${membership.details.domain} email`;
        }
        if (membership.type === "invited_member") {
            return `Accept Invite for ${organization.organization_name}`;
        }
        return `Continue to ${organization.organization_name}`;
    };

    const onOrganizationSelected = (organization) => {
        selectOrganization(organization.organization_id)
        .then(r => r.json())
        .then(r => {
            localStorage.setItem("organizationId", r.organizationId)
            navigate(r.redirectPath)
        }).catch(e => {
            console.log(e)
        })
    }

    return (
        <div className="section">
            <h3>Your Organizations</h3>
            {discovered_organizations.length === 0 && (
                <p>No existing organizations.</p>
            )}
            <ul>
                {discovered_organizations.map(({ organization, membership, mfa_required}) => (
                    <li key={organization.organization_id}>
                        <span onClick={() => onOrganizationSelected(organization, membership, mfa_required)}>{formatMembership({ organization, membership })}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const CreateNewOrganization = () => {
    const [orgName, setOrgName] = useState("");
    const [requireMFA, setRequireMFA] = useState(false);
    const navigate = useNavigate()

    const onCreateClicked = (e) => {
        e.preventDefault()

        createOrg(orgName, requireMFA)
            .then(r => r.json())
            .then(r => {
                localStorage.setItem("organizationId", r.organizationId)
                navigate(r.redirectPath)
            })
            .catch(err => {
                console.log(err)
                alert("Something went wrong")
                navigate("/login")
            })
    }
    return (
        <div className="section">
            <h3>Or, create a new Organization</h3>

            <form className="row">
                <label htmlFor="organization_name">Organization name</label>
                <input
                    type={"text"}
                    placeholder={`Foo Corp`}
                    name="organization_name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                />
                <div className="radio-sso">
                    <input
                        type="radio"
                        id="require_mfa"
                        name="require_mfa"
                        onClick={() => setRequireMFA(!requireMFA)}
                        checked={requireMFA}
                    />
                    <label htmlFor="require_mfa">Require MFA</label>
                </div>
                <button disabled={orgName.length < 3} onClick={onCreateClicked} className="primary">
                    Create
                </button>
            </form>
        </div>
    );
};


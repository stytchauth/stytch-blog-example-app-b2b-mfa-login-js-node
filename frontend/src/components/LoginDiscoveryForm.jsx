import { useState } from "react";
import { EmailLoginForm } from "./EmailLoginForm";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { discoveryStart } from "../util/makeRequest";

const ContinueToTenantForm = (props) => {
    const [slug, setSlug] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        navigate(`/${slug}/login`);
    };

    return (
        <div>
            <h1>What is your Organization&apos;s Domain?</h1>
            <p>
                Don&apos;t know your organization&apos;s Domain? Find your{" "}
                <Link to="" onClick={props.onBack}>
                    organizations
                </Link>
                .
            </p>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="acme-corp"
                />
                <button className="primary" id="button" type="submit" disabled={!slug}>
                    Continue
                </button>
            </form>
        </div>
    );
};

const LoginDiscoveryForm = () => {
    const [isDiscovery, setIsDiscovery] = useState(true);

    if (isDiscovery) {
        return (
            <>
                <EmailLoginForm title="Sign in" onSubmit={discoveryStart}>
                    <p>
                        We&apos;ll email you a magic code for a password-free sign in.
                        <br />
                        You&apos;ll be able to choose which organization you want to access.
                        <br />
                        Or you can{" "}
                        <Link to="" onClick={() => setIsDiscovery(false)}>
                            sign in manually instead
                        </Link>
                        .
                    </p>
                </EmailLoginForm>
            </>
        );
    } else {
        return <ContinueToTenantForm onBack={() => setIsDiscovery(true)} />;
    }
};

export default LoginDiscoveryForm;

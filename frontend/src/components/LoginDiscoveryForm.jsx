import { EmailLoginForm } from "./EmailLoginForm";
import { discoveryStart } from "../util/makeRequest";


const LoginDiscoveryForm = () => {

    return (
        <>
            <EmailLoginForm title="Sign in" onSubmit={discoveryStart}>
                <p>
                    We&apos;ll email you a magic code for a password-free sign in.
                    <br />
                    You&apos;ll be able to choose which organization you want to access.
                    <br />
                </p>
            </EmailLoginForm>
        </>
    );

};

export default LoginDiscoveryForm;

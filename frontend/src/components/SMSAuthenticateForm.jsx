import { useState } from "react";
import { authenticateMFA } from "../util/makeRequest";
import { useNavigate } from 'react-router-dom';


export const SMSAuthenticateForm = ({ memberID, orgID }) => {

    const [code, setCode] = useState("")
    const navigate = useNavigate()

    const onSubmitClick = (e) => {
        e.preventDefault()
        console.log("OTP submitted")
        authenticateMFA(code, orgID, memberID)
        .then(r => r.json())
        .then(r => {
            console.log(r)
            navigate(r.redirectPath)
            // TODO edit
        })
        .catch(e => console.log(e))
    }

    return (
        <form className="row">
            Please enter the one-time code sent to your phone number
            <input
                type={"text"}
                placeholder={`Code`}
                name="code"
                value={code}
                onChange={e => setCode(e.target.value)}
            />
            <button onClick={onSubmitClick} className="primary">
                Authenticate
            </button>
        </form>
    );
};

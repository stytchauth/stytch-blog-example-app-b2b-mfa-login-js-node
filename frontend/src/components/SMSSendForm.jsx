import { useState } from "react";
import { sendMFACode } from "../util/makeRequest";
import { useNavigate } from 'react-router-dom';


export const SMSSendForm = ({ memberID, orgID }) => {

    const [phoneNumber, setPhoneNumber] = useState("")
    const navigate = useNavigate()

    const onSendClick = (e) => {
        e.preventDefault()
        sendMFACode(phoneNumber, orgID, memberID)
            .then(r => r.json())
            .then(r => {
                navigate(r.redirectPath)
            })
            .catch(e => console.log(e))
    }

    return (
        <form className="row">
            Please enter your phone number
            <input
                type={"text"}
                placeholder={`Phone Number`}
                name="phone_number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
            />
            <button onClick={onSendClick} className="primary">
                Send
            </button>
        </form>
    );
};

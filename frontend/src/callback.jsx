import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authCallback } from './util/makeRequest';

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

export default function Callback() {
    let query = useQuery();
    const navigate = useNavigate()

    const stytch_token_type = query.get("stytch_token_type")
    const token = query.get("token")

    useEffect(() => {

        if (stytch_token_type && token) {
            if (stytch_token_type === "discovery") {
               authCallback(token, stytch_token_type)
               .then(r => r.json())
                .then(r => {
                    navigate("/discovery", { state: r })
                })
                .catch(err => {
                    console.log(err)
                    alert("Something went wrong")
                    navigate("/login")
                })
            }  
        }

    }, [token, stytch_token_type])


    return (
        <div className="card">
            Redirecting... Please wait...
        </div>
    );
}
import {SMSSendForm} from "./components/SMSSendForm";
import {SMSAuthenticateForm} from "./components/SMSAuthenticateForm";
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const MFA = () => {
  let query = useQuery();
  const orgID = query.get("org_id");
  const memberID = query.get("member_id");
  const sent = query.get("sent");

  const Component = sent === "true" ? SMSAuthenticateForm : SMSSendForm;
  return (
    <div className="card">
      <Component
        orgID={orgID}
        memberID={memberID}
      />
    </div>
  )
};

export default MFA;

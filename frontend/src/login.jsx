import LoginDiscoveryForm from "./components/LoginDiscoveryForm";


export default function Login() {
  return (
    <div className="card">
      <LoginDiscoveryForm domain={"http://localhost:3000"}/>
    </div>
  );
}
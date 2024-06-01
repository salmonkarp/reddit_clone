import { useState } from "react";
import "./LoginState.css";

function LoginState({ authorize, isLoggedIn }) {
  const [token, setToken] = useState();
  const handleClick = () => {
    if (!isLoggedIn) {
      authorize();
    }
  };
  if (!isLoggedIn) {
    return (
      <button className="LoginButton" onClick={handleClick()}>
        Login
      </button>
    );
  }
  return <h3 className="LoginState">Logged in as salmonkarp</h3>;
}

export default LoginState;

import { useState } from "react";
import { useSelector } from "react-redux";
import { logout } from "../../store/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import "./LoginState.css";

function LoginState({ authorize }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();

  // if accessToken exists, fetch user data

  useEffect(() => {
    async function getUserData() {
      if (!accessToken) {
        return;
      }
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "Reddit_App",
          Authorization: `bearer ${accessToken}`,
        },
      };
      const response = await fetch(
        "https://oauth.reddit.com/api/v1/me.json",
        options
      );
      const data = await response.json();
      setUserData(data);
    }
    // if access token exist run the function
    if (accessToken) {
      getUserData();
    }
  }, [accessToken]);

  const handleClick = () => {
    if (!accessToken) {
      authorize();
    }
  };

  const handleLogout = () => {
    console.log("logging out");
    dispatch(logout());
  };

  if (Object.keys(userData).length === 0 || !accessToken || userData == {}) {
    return (
      <button
        className="LoginButton"
        onClick={() => handleClick()}
        type="button"
      >
        Login
      </button>
    );
  }
  return (
    <div className="LoginState">
      <h5>{userData.name}</h5>
      <img src={userData.icon_img.split("?")[0]} alt={userData.name} />
      <button type="button" onClick={() => handleLogout()}>
        Logout
      </button>
    </div>
  );
}

export default LoginState;

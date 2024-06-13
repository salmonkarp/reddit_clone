import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { logout } from "../../store/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import "./LoginState.css";

function LoginState({ authorize, toggleMobileSidebar }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const loginRef = useRef();

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
    dispatch(logout());
  };

  let mobileSidebar = <div></div>;
  if (window.innerWidth < 480) {
    mobileSidebar = (
      <div>
        <i
          className="fa-xl fa-solid fa-bars"
          onClick={() => toggleMobileSidebar()}
        ></i>
      </div>
    );
  }

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
    <div className="LoginState" ref={loginRef}>
      <h5>{userData.name}</h5>
      <img src={userData.icon_img.split("?")[0]} alt={userData.name} />
      <button type="button" onClick={() => handleLogout()}>
        Logout
      </button>
      {mobileSidebar}
    </div>
  );
}

export default LoginState;

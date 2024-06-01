import { useState } from "react";
import { useSelector } from "react-redux";
import { logout } from "../../store/store";
import { useDispatch } from "react-redux";
import "./LoginState.css";

function LoginState({ authorize, userData }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();
  const handleClick = () => {
    if (!accessToken) {
      authorize();
    }
  };
  const handleLogout = () => {
    console.log("logging out");
    dispatch(logout());
  };
  if (Object.keys(userData).length === 0 || !accessToken) {
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

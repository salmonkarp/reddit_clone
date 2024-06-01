import "./Header.css";
import Searchbar from "../Searchbar/Searchbar";
import LoginState from "../LoginState/LoginState";

function Header({ authorize, isLoggedIn }) {
  return (
    <div className="Header">
      <i className="fa-brands fa-reddit fa-2xl"></i>
      <h1>Reddit</h1>
      <Searchbar></Searchbar>
      <LoginState authorize={authorize} isLoggedIn={isLoggedIn}></LoginState>
    </div>
  );
}

export default Header;

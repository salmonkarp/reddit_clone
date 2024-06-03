import "./Header.css";
import Searchbar from "../Searchbar/Searchbar";
import LoginState from "../LoginState/LoginState";

function Header({ authorize, userData }) {
  return (
    <div className="Header">
      <div className="HeaderLeft">
        <i className="fa-brands fa-reddit fa-2xl"></i>
        <h1>Reddit</h1>
      </div>
      <Searchbar></Searchbar>
      <LoginState authorize={authorize} userData={userData}></LoginState>
      <script src="./"></script>
    </div>
  );
}

export default Header;

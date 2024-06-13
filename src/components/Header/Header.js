import "./Header.css";
import Searchbar from "../Searchbar/Searchbar";
import LoginState from "../LoginState/LoginState";
import { useEffect, useRef } from "react";

function Header({ authorize, toggleMobileSidebar }) {
  const containerRef = useRef();

  // display script for responsive behaviour
  const handleSearchFocus = () => {
    const searchInput = document.querySelector(".SearchInput");
    const searchBar = document.querySelector(".Searchbar");
    const headerLeft = document.querySelector(".HeaderLeft");
    const headerRight =
      document.querySelector(".LoginButton") ||
      document.querySelector(".LoginState");
    let innerWidth = window.innerWidth;
    searchInput.addEventListener("focus", (event) => {
      if (window.innerWidth < 992) {
        headerLeft.style.opacity = 0;
        headerRight.style.opacity = 0;
        if (innerWidth > 768) {
          searchBar.style.transform = "translateX(-205px)";
          searchInput.style.width = "85vw";
        } else if (innerWidth > 480) {
          searchBar.style.transform = "translateX(-60px)";
          searchInput.style.width = "70vw";
        }
        setTimeout(() => {
          headerRight.style.display = "none";
        }, 50);
      }
    });
    searchInput.addEventListener("blur", (event) => {
      if (window.innerWidth < 992) {
        // console.log("test");
        headerLeft.style.display = "flex";
        headerRight.style.display = "flex";
        searchBar.style.transform = "translateX(0px)";
        searchInput.style.width = "unset";
        setTimeout(() => {
          headerLeft.style.opacity = 1;
          headerRight.style.opacity = 1;
        }, 200);
      }
    });
  };

  useEffect(() => {
    handleSearchFocus();
    window.addEventListener("resize", handleSearchFocus); // Run on reisze
    return () => {
      window.removeEventListener("resize", handleSearchFocus); //Cleanup
    };
  });

  return (
    <div className="Header">
      <div className="HeaderLeft">
        <i className="fa-brands fa-reddit fa-2xl"></i>
        <h1>Reddit</h1>
      </div>
      <Searchbar></Searchbar>
      <LoginState
        authorize={authorize}
        toggleMobileSidebar={toggleMobileSidebar}
      ></LoginState>
      <script src="./"></script>
    </div>
  );
}

export default Header;

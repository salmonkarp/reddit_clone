import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [subreddits, setSubreddits] = useState([]);
  const containerRef = useRef();
  const location = useLocation();

  // display scripts
  const handleCommunityNames = () => {
    if (
      window.innerWidth > 480 &&
      containerRef.current.querySelectorAll(".SidebarCommunitiesItem").length >
        1
    ) {
      let comWidth =
        parseInt(
          window.getComputedStyle(
            containerRef.current.querySelector(".SidebarCommunitiesItem")
          ).width
        ) -
        55 -
        20;
      let comNames = containerRef.current.querySelectorAll(
        ".SidebarCommunitiesItem div"
      );
      comNames.forEach((com) => {
        let tempWidth = parseInt(window.getComputedStyle(com).width);
        com.innerHTML = String(com.attributes.value.value);
        while (tempWidth > comWidth) {
          com.innerHTML = com.innerHTML.slice(0, -1);
          tempWidth = parseInt(window.getComputedStyle(com).width);
          if (tempWidth <= comWidth) {
            com.innerHTML = com.innerHTML + "...";
          }
        }
      });
    }
  };
  const handleSidebar = () => {
    if (window.innerWidth < 480) {
      document.querySelector(".Sidebar").style.display = "none";
    } else if (window.innerWidth < 992) {
      let topItems = document.querySelectorAll(".SidebarTopItem");
      topItems.forEach((item) => {
        item.innerHTML = item.innerHTML.split("</i>")[0];
      });
    } else {
      document.querySelector(".Sidebar").style.display = "unset";
    }
  };
  const handleActiveElements = (pathname) => {
    if (typeof pathname !== "string") {
      console.error("Invalid pathname:", pathname);
      return;
    }
    document.querySelectorAll(".SidebarTopItem").forEach((item) => {
      item.classList.remove("active");
    });
    console.log("path", pathname);
    if (pathname === "/") {
      document.querySelector(".SidebarTopItem.Home").classList.add("active");
    }
    if (pathname === "/popular") {
      document.querySelector(".SidebarTopItem.Popular").classList.add("active");
    }
    if (pathname === "/all") {
      document.querySelector(".SidebarTopItem.All").classList.add("active");
    }
  };

  // fetch user data if accessToken exists
  useEffect(() => {
    async function getUserData(key) {
      if (key === "default") {
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
        "https://oauth.reddit.com/subreddits/mine/subscriber",
        options
      );
      const data = await response.json();
      let subbedList = data.data.children;
      subbedList = subbedList.sort((a, b) =>
        a.data.display_name.localeCompare(b.data.display_name)
      );
      // console.log(subbedList);
      setSubreddits(subbedList);
    }
    // if access token exist run the function
    if (accessToken) {
      getUserData(accessToken);
    } else {
      setSubreddits([]);
    }
  }, [accessToken]);

  // add event listeners
  useEffect(() => {
    handleCommunityNames();
    handleSidebar();
    window.addEventListener("resize", handleCommunityNames);
    window.addEventListener("resize", handleSidebar);
    return () => {
      window.removeEventListener("resize", handleCommunityNames);
      window.removeEventListener("resize", handleSidebar);
    };
  });

  useEffect(() => {
    handleActiveElements(location.pathname);
  }, [location]);

  // mapping for each subreddit item
  const items = subreddits.map((subreddit) => (
    <Link
      className="SidebarCommunitiesItem"
      key={subreddit.data.display_name}
      to={`/r/${subreddit.data.display_name}`}
    >
      <img
        src={
          subreddit.data.community_icon.split("?")[0] || "/subredditDefault.svg"
        }
        alt={subreddit.data.display_name}
      />
      <div value={subreddit.data.display_name}>
        {subreddit.data.display_name}
      </div>
    </Link>
  ));

  return (
    <div className="Sidebar" ref={containerRef}>
      <div className="SidebarTop">
        <Link
          to={`/`}
          className="SidebarTopItem Home"
          value="<i className='fa-solid fa-house fa-xl'></i> Home"
        >
          <i className="fa-solid fa-house fa-xl"></i> Home
        </Link>
        <Link
          to={`/popular`}
          className="SidebarTopItem Popular"
          value="<i className='fa-solid fa-arrow-trend-up fa-xl'></i> Popular"
        >
          <i className="fa-solid fa-arrow-trend-up fa-xl"></i> Popular
        </Link>
        <Link
          to={`/all`}
          className="SidebarTopItem All"
          value='<i className="fa-solid fa-chart-simple fa-xl"></i> All'
        >
          <i className="fa-solid fa-chart-simple fa-xl"></i> All
        </Link>
      </div>
      <div className="SidebarCommunities">
        <h2>Communities</h2>
        {items}
      </div>
    </div>
  );
}

export default Sidebar;

import { useState } from "react";
import "./Sidebar.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function Sidebar() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [subreddits, setSubreddits] = useState([]);
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
  const items = subreddits.map((subreddit) => (
    <a
      className="SidebarCommunitiesItem"
      key={subreddit.data.display_name}
      href={`/${subreddit.data.display_name}`}
    >
      <img
        src={subreddit.data.community_icon.split("?")[0]}
        alt={subreddit.data.display_name}
      />
      <div value={subreddit.data.display_name}>
        {subreddit.data.display_name}
      </div>
    </a>
  ));
  return (
    <div className="Sidebar">
      <div className="SidebarTop">
        <div
          className="SidebarTopItem Home"
          value="<i className='fa-solid fa-house fa-xl'></i> Home"
        >
          <i className="fa-solid fa-house fa-xl"></i> Home
        </div>
        <div
          className="SidebarTopItem Popular"
          value="<i className='fa-solid fa-arrow-trend-up fa-xl'></i> Popular"
        >
          <i className="fa-solid fa-arrow-trend-up fa-xl"></i> Popular
        </div>
        <div
          className="SidebarTopItem All"
          value='<i className="fa-solid fa-chart-simple fa-xl"></i> All'
        >
          <i className="fa-solid fa-chart-simple fa-xl"></i> All
        </div>
      </div>
      <div className="SidebarCommunities">
        <h2>Communities</h2>
        {items}
      </div>
    </div>
  );
}

export default Sidebar;

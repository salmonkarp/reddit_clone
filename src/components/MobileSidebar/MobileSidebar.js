import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "./search-svgrepo-com.svg";
import "./MobileSidebar.css";

function MobileSidebar({ toggleMobileSidebar }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [subreddits, setSubreddits] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
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

  // mapping for each subreddit item
  const items = subreddits.map((subreddit) => (
    <a
      className="MobileSidebarCommunitiesItem"
      key={subreddit.data.display_name}
      href={`/${subreddit.data.display_name}`}
    >
      <img
        src={
          subreddit.data.community_icon.split("?")[0] || "subredditDefault.svg"
        }
        alt={subreddit.data.display_name}
      />
    </a>
  ));

  return (
    <div className="MobileSidebar">
      <div className="MobileSidebarContents">
        <Link className="MobileTop" to={`/`}>
          <i className="fa-solid fa-house fa-xl"></i> Home
        </Link>
        <Link className="MobileTop" to={`/popular`}>
          <i className="fa-solid fa-arrow-trend-up fa-xl"></i> Popular
        </Link>
        <Link className="MobileTop" to={`/all`}>
          <i className="fa-solid fa-chart-simple fa-xl"></i> All
        </Link>
        <img src={SearchIcon} alt="Search" className="MobileSearchIcon" />
        <input
          type="text"
          placeholder="Search Reddit"
          onChange={handleChange}
          value={searchInput}
          className="MobileSearchInput"
        />
        <h2>Communities</h2>
        <div className="MobileSidebarCommunities">{items}</div>
      </div>
      <div
        className="MobileSidebarClickoff"
        onClick={() => toggleMobileSidebar()}
      ></div>
    </div>
  );
}

export default MobileSidebar;

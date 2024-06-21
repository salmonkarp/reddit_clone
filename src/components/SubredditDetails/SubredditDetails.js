import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { decode } from "html-entities";
import shortenNumber from "../../scripts/shortenNumber";
import ReactMarkdown from "react-markdown";

const SubredditDetails = ({ subreddit }) => {
  const [subredditRules, setSubredditRules] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [subredditDetails, setSubredditDetails] = useState({
    community_icon: "subredditDefault.svg",
    banner_background_image: "",
  });

  // function to access the feed content from api
  async function getSubredditAbout() {
    let options;
    if (accessToken == null) {
      options = {
        method: "GET",
        headers: {
          "User-Agent": "Reddit_App",
        },
      };
    } else {
      options = {
        method: "GET",
        headers: {
          "User-Agent": "Reddit_App",
          Authorization: `bearer ${accessToken}`,
        },
      };
    }
    let url = `https://oauth.reddit.com/r/${subreddit}/about/.json`;
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSubredditDetails(data.data);
    } catch (error) {
      console.error("Failed to fetch feed content:", error);
      window.location.href = "/";
    }
  }

  // function to access rules from api
  async function getSubredditRules() {
    let options = {
      method: "GET",
      headers: {
        "User-Agent": "Reddit_App",
      },
    };
    let url = `https://oauth.reddit.com/r/${subreddit}/about/rules/.json`;
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSubredditRules(data.rules);
    } catch (error) {
      console.error("Failed to fetch feed content:", error);
    }
  }

  // subreddit rule collapse event listener
  const toggleCollapse = (el) => {
    let content = el.nextElementSibling;
    // console.log(content);
    if (content.style.display == "inline-block") {
      content.style.display = "none";
      el.querySelector("i").classList.remove("fa-angle-up");
      el.querySelector("i").classList.add("fa-angle-down");
    } else {
      content.style.display = "inline-block";
      el.querySelector("i").classList.remove("fa-angle-down");
      el.querySelector("i").classList.add("fa-angle-up");
    }
  };

  useEffect(() => {
    getSubredditAbout();
    getSubredditRules();
  }, [accessToken, subreddit]);

  let i = 0;
  const rules = subredditRules.map((rule) => {
    i++;
    let expandButton = "";
    if (rule.description) {
      expandButton = <i className="fa-solid fa-angle-down"></i>;
    }
    return (
      <div className="SubredditRule" key={"rule" + i}>
        <button
          type="button"
          onClick={(event) => toggleCollapse(event.currentTarget)}
        >
          <div>
            {i}. {rule.short_name}
          </div>
          {expandButton}
        </button>
        <div className="collapseContent">
          <ReactMarkdown
            children={rule.description}
            subreddit={subreddit}
          ></ReactMarkdown>
        </div>
      </div>
    );
  });

  //   console.log(subredditDetails);
  if (subredditDetails) {
    return (
      <div className="SubredditFeedDetails">
        <h2>{subredditDetails.title || ""}</h2>
        <div className="SubredditDetailsDescription">
          {decode(subredditDetails.public_description || "")}
        </div>
        <div className="SubredditMoreDetails">
          <div>{shortenNumber(subredditDetails.subscribers || 0)} members</div>
          <div className="ActiveSymbol"></div>
          <div>
            {" "}
            {shortenNumber(subredditDetails.active_user_count || 0)} active
          </div>
        </div>
        <h2>Rules</h2>
        <hr />
        {rules}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default SubredditDetails;

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { decode } from "html-entities";
import SubredditFeedContents from "../SubredditFeedContents/SubredditFeedContents";
import ReactMarkdown from "react-markdown";
import "./SubredditFeed.css";

const SubredditFeed = () => {
  const { subreddit } = useParams();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [subredditDetails, setSubredditDetails] = useState({
    community_icon: "subredditDefault.svg",
    banner_background_image: "",
  });
  const [subredditRules, setSubredditRules] = useState([]);
  const [feedContent, setFeedContent] = useState([]);
  const [feedType, setFeedType] = useState("hot");
  const [after, setAfter] = useState(null);
  const loadingRef = useRef(false);
  const parentRef = useRef(null);
  const childRef = useRef(null);

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

  // effect to trigger post fetching
  useEffect(() => {
    loadingRef.current = false;
    setFeedContent([]);
    getSubredditAbout();
    getSubredditRules();
  }, [accessToken, subreddit]);

  // console.log(subredditDetails);

  const shortenNumber = (num) => {
    if (num < 1000) {
      return num.toString();
    }

    const suffixes = ["", "K", "M", "B", "T"];
    const i = Math.floor(Math.log10(num) / 3);
    const shortNum = (num / Math.pow(1000, i)).toFixed(1);

    // Ensure the result is at most 3 characters long
    if (shortNum.length > 3) {
      return `${Math.round(num / Math.pow(1000, i))}${suffixes[i]}`;
    }

    return `${shortNum}${suffixes[i]}`;
  };

  // handle annoying scrolling behaviour
  useEffect(() => {
    const handleScroll = () => {
      if (!parentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
      if (scrollHeight - scrollTop <= clientHeight * 1.2) {
        if (childRef.current) {
          childRef.current.loadMorePosts();
        }
      }
    };
    const parentElement = parentRef.current;
    parentElement.addEventListener("scroll", handleScroll);
    return () => {
      parentElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  return (
    <div className="SubredditFeed" ref={parentRef}>
      <div className="SubredditFeedTop">
        <div
          style={{
            backgroundImage: `url(${
              subredditDetails.banner_background_image?.split("?")[0] || ""
            })`,
            backgroundColor: `${
              subredditDetails.banner_background_color || "gray"
            }`,
          }}
          className="SubredditBanner"
        />
        <div className="SubredditFeedTopDetails">
          <img
            src={
              subredditDetails.community_icon.split("?")[0] ||
              "/subredditDefault.svg"
            }
            className="SubredditIcon"
            alt="Subreddit Icon"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/subredditDefault.svg";
            }}
          />
          <h1 className="SubredditName">r/{subreddit}</h1>
          <button type="button" className="CreatePostButton">
            Create a post
          </button>
          <button
            type="button"
            className={
              "JoinSubredditButton " +
              (subredditDetails.user_is_subscriber ? "joined" : "")
            }
          >
            {subredditDetails.user_is_subscriber ? "Joined" : "Join"}
          </button>
        </div>
      </div>
      <div className="SubredditFeedBottom">
        <div className="SubredditFeedReal">
          <div className="SRTypeSelector">
            <label htmlFor="hot">
              <input
                type="radio"
                name="hot"
                id="hot"
                checked={feedType === "hot"}
                onChange={() => setFeedType("hot")}
              />
              <span>Hot</span>
            </label>

            <label htmlFor="top">
              <input
                type="radio"
                name="top"
                id="top"
                checked={feedType === "top"}
                onChange={() => setFeedType("top")}
              />
              <span>Top</span>
            </label>

            <label htmlFor="new">
              <input
                type="radio"
                name="new"
                id="new"
                checked={feedType === "new"}
                onChange={() => setFeedType("new")}
              />
              <span>New</span>
            </label>

            <label htmlFor="rising">
              <input
                type="radio"
                name="rising"
                id="rising"
                checked={feedType === "rising"}
                onChange={() => setFeedType("rising")}
              />
              <span>Rising</span>
            </label>
          </div>
          <SubredditFeedContents
            feedType={feedType}
            subreddit={subreddit}
            ref={childRef}
          ></SubredditFeedContents>
        </div>
        <div className="SubredditFeedDetails">
          <h2>{subredditDetails.title}</h2>
          <div className="SubredditDetailsDescription">
            {decode(subredditDetails.public_description)}
          </div>
          <div className="SubredditMoreDetails">
            <div>{shortenNumber(subredditDetails.subscribers)} members</div>
            <div className="ActiveSymbol"></div>
            <div>
              {" "}
              {shortenNumber(subredditDetails.active_user_count)} active
            </div>
          </div>
          <h2>Rules</h2>
          <hr />
          <div>{rules}</div>
        </div>
      </div>
    </div>
  );
};

export default SubredditFeed;

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { decode } from "html-entities";
import SubredditFeedContents from "../SubredditFeedContents/SubredditFeedContents";
import SubredditDetails from "../SubredditDetails/SubredditDetails";
import shortenNumber from "../../scripts/shortenNumber";
import ReactMarkdown from "react-markdown";
import "./SubredditFeed.css";

const SubredditFeed = () => {
  const { subreddit } = useParams();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [subredditDetails, setSubredditDetails] = useState({
    community_icon: "subredditDefault.svg",
    banner_background_image: "",
  });

  const [feedContent, setFeedContent] = useState([]);
  const [feedType, setFeedType] = useState("hot");
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
      window.location.href = "/";
    }
  }

  // effect to trigger post fetching
  useEffect(() => {
    loadingRef.current = false;
    setFeedContent([]);
    getSubredditAbout();
    // getSubredditRules();
  }, [accessToken, subreddit]);

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
        <SubredditDetails subreddit={subreddit}></SubredditDetails>
      </div>
    </div>
  );
};

export default SubredditFeed;

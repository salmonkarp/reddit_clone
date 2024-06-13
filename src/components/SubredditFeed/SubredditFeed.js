import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { decode } from "html-entities";
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
  const [after, setAfter] = useState(null);
  const loadingRef = useRef(false);
  const scrollRef = useRef(null);

  // function to access the feed content from api
  async function getFeedAbout(key = "default") {
    let options;
    if (key === "default") {
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

  // effect to trigger post fetching
  useEffect(() => {
    loadingRef.current = false;
    setFeedContent([]);
    getFeedAbout(accessToken);
    // if (accessToken) {
    //   getFeedContent(accessToken);
    // } else {
    //   getFeedContent("default");
    // }
  }, [accessToken, subreddit]);

  console.log(subredditDetails);

  return (
    <div className="SubredditFeed">
      <div className="SubredditFeedTop">
        <div
          style={{
            backgroundImage: `url(${
              subredditDetails.banner_background_image?.split("?")[0]
            })`,
            backgroundColor: `${
              subredditDetails.banner_background_color || "gray"
            }`,
          }}
          className="SubredditBanner"
        />
        <div className="SubredditFeedTopDetails">
          <img
            src={subredditDetails.community_icon.split("?")[0]}
            className="SubredditIcon"
            alt="Subreddit Icon"
          />
          <h1 className="SubredditName">r/{subreddit}</h1>
          <button type="button" className="CreatePostButton">
            Create a post
          </button>
          <button type="button" className="JoinSubredditButton">
            {subredditDetails.user_is_subscriber ? "Joined" : "Join"}
          </button>
        </div>
        <div className="SubredditFeedBottom">
          <div className="SubredditFeedReal"></div>
          <div className="SubredditFeedDetails"></div>
        </div>
      </div>
    </div>
  );
};

export default SubredditFeed;

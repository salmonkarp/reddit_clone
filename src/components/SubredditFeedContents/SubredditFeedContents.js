import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { decode } from "html-entities";
import "./SubredditFeedContents.css";

const SubredditFeedContents = ({ feedType, subreddit }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [feedContent, setFeedContent] = useState([]);
  const [after, setAfter] = useState(null);
  const loadingRef = useRef(false);
  const scrollRef = useRef(null);

  // function to access the feed content from api
  // console.log(subreddit);
  async function getFeedContent(key, afterParam = null) {
    if (loadingRef.current) {
      console.log("still loading");
      return;
    }
    loadingRef.current = true;
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

    let url;
    if (feedType == "hot" || !feedType) {
      url = `https://oauth.reddit.com/r/${subreddit}/hot.json`;
    } else {
      url = `https://oauth.reddit.com/r/${subreddit}/${feedType}.json`;
    }

    if (afterParam) {
      url += `?after=${afterParam}`;
    }
    let previousFeed = feedContent;
    let startFeedFromScratch = false;
    if (previousFeed[0]) {
      if (
        previousFeed[0].isToken != !!accessToken ||
        previousFeed[0].feedType != feedType ||
        previousFeed[0].subreddit != subreddit
      ) {
        startFeedFromScratch = true;
      }
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      let fetchResult = data.data.children;
      fetchResult.forEach((obj) => {
        if (key === "default") {
          obj.isToken = false;
        } else {
          obj.isToken = true;
        }
        obj.feedType = feedType;
        obj.subreddit = subreddit;
      });

      if (startFeedFromScratch) {
        setFeedContent(fetchResult);
      } else {
        setFeedContent(feedContent.concat(fetchResult));
        setAfter(data.data.after);
      }
      setAfter(data.data.after);
    } catch (error) {
      console.error("Failed to fetch feed content:", error);
    } finally {
      loadingRef.current = false;
    }
  }

  const loadMorePosts = () => {
    if (accessToken) {
      getFeedContent(accessToken, after);
    } else {
      getFeedContent("default", after);
    }
  };

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

  // effect to trigger post fetching
  useEffect(() => {
    loadingRef.current = false;
    setFeedContent([]);
    if (accessToken) {
      getFeedContent(accessToken);
    } else {
      getFeedContent("default");
    }
  }, [accessToken, feedType, subreddit]);

  // mapping of posts
  const items = feedContent.map((post) => {
    const postData = post.data;
    const permalink = postData.permalink.slice(1, -1);
    let thumbnail;
    const thumbnailUrl =
      postData.thumbnail !== "image" ? postData.thumbnail : postData.url;
    if (postData.secure_media && postData.secure_media.reddit_video) {
      thumbnail = (
        <video
          src={postData.secure_media.reddit_video.fallback_url}
          controls
          className="FeedThumbnail"
        />
      );
    } else if (
      postData.thumbnail !== "self" &&
      postData.thumbnail !== "default" &&
      postData.thumbnail !== "nsfw" &&
      postData.thumbnail !== "spoiler"
    ) {
      thumbnail = (
        <img
          src={thumbnailUrl.split("?")[0]}
          alt=""
          className="FeedThumbnail"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "../reddit-icon.png";
          }}
        />
      );
    } else if (postData.thumbnail === "nsfw") {
      thumbnail = <div className="FeedThumbnail nsfw">NSFW</div>;
    } else if (postData.thumbnail === "spoiler") {
      thumbnail = <div className="FeedThumbnail nsfw">Spoiler</div>;
    } else {
      thumbnail = (
        <div className="FeedThumbnail">
          <i className="fa-2xl fa-solid fa-list"></i>
        </div>
      );
    }
    return (
      <Link
        key={postData.id}
        className="FeedPost SRFeedPost"
        to={`/${permalink}`}
        feed_access_token={Boolean(accessToken).toString()}
        feed_type={feedType}
      >
        {thumbnail}

        <div className="FeedDetails">
          <h2 className="FeedTitle">
            {decode(
              postData.title.length > 100
                ? postData.title.slice(0, 100) + "..."
                : postData.title
            )}
          </h2>
          <div className="FeedSubreddit">
            {postData.subreddit_name_prefixed}
          </div>
          <div className="FeedAuthor">
            {"by "}
            {postData.author_flair_text
              ? `${postData.author} - ${postData.author_flair_text}`
              : postData.author}
          </div>
          <div className="FeedComments">{`${postData.num_comments} comments`}</div>
        </div>
        <div className="FeedActions">
          <button type="button" className="Upvote">
            <i className="fa-xl fa-solid fa-arrow-up"></i>
          </button>
          <div className="FeedKarma">{shortenNumber(postData.score)}</div>
          <button type="button" className="Downvote">
            <i className="fa-xl fa-solid fa-arrow-down"></i>
          </button>
        </div>
      </Link>
    );
  });

  return (
    <div className="SubredditFeedContents" ref={scrollRef}>
      {items}
      <div className="FeedLoading">loading...</div>
    </div>
  );
};

export default SubredditFeedContents;

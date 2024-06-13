import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { decode } from "html-entities";
import "./Feed.css";

function Feed({ type }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [feedContent, setFeedContent] = useState([]);
  const [after, setAfter] = useState(null);
  const loadingRef = useRef(false);
  const scrollRef = useRef(null);

  // function to access the feed content from api
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
    if (type == "home") {
      url = "https://oauth.reddit.com/.json";
    } else if (type == "popular") {
      url = "https://oauth.reddit.com/r/popular.json";
    } else {
      url = "https://oauth.reddit.com/r/all.json";
    }

    if (afterParam) {
      url += `?after=${afterParam}`;
    }
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      let previousFeed = feedContent;
      // console.log(previousFeed);
      let startFeedFromScratch = false;
      // console.log(previousFeed);
      if (previousFeed) {
        if (!previousFeed.isToken || previousFeed.feedType != type) {
          startFeedFromScratch = true;
        }
      }
      // console.log(startFeedFromScratch);
      let fetchResult = data.data.children;
      if (key === "default") {
        fetchResult.forEach((obj) => {
          obj.isToken = false;
          obj.feedType = type;
        });
      } else {
        fetchResult.forEach((obj) => {
          obj.isToken = true;
          obj.feedType = type;
        });
      }

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

  // shortening function to load more posts
  const loadMorePosts = () => {
    if (accessToken) {
      getFeedContent(accessToken, after);
    } else {
      getFeedContent("default", after);
    }
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
  }, [accessToken, type]);

  // event-listener-esque function to check if element is at end of scroll
  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      if (scrollHeight - scrollTop <= clientHeight * 1.2) {
        // Trigger the function if we are within 20% of the end
        loadMorePosts();
      }
    }
  }, [loadMorePosts]);

  // effect to add eventlistener to scrollabel element through accessing refernce
  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

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

  const items = feedContent.map((post) => {
    const postData = post.data;
    const permalink = postData.permalink.slice(1, -1);
    let thumbnail;
    const thumbnailUrl =
      postData.thumbnail !== "image" ? postData.thumbnail : postData.url;
    console.log(post);
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
      thumbnail = <img src={thumbnailUrl} alt="" className="FeedThumbnail" />;
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

    // console.log(feedContent);
    return (
      <Link
        key={postData.id}
        className="FeedPost"
        to={`/${permalink}`}
        feed_access_token={Boolean(accessToken).toString()}
        feed_type={type}
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
    <>
      <div className="Feed" ref={scrollRef}>
        {items}
        <div className="FeedLoading">loading...</div>
      </div>
    </>
  );
}

export default Feed;

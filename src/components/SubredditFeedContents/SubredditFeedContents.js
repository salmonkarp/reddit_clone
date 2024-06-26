import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { decode } from "html-entities";
import getUrl from "../../scripts/getUrl";
import formatDuration from "../../scripts/formatDuration";
import "./SubredditFeedContents.css";
import Markdown from "react-markdown";

const SubredditFeedContents = forwardRef(({ feedType, subreddit }, ref) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [feedContent, setFeedContent] = useState([]);
  const [after, setAfter] = useState(null);
  const loadingRef = useRef(false);
  const scrollRef = useRef(null);

  useImperativeHandle(ref, () => ({
    loadMorePosts,
  }));

  // function to access the feed content from api
  async function getFeedContent(key, afterParam = null) {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    let options = {
      method: "GET",
      headers: {
        "User-Agent": "Reddit_App",
      },
    };
    if (key !== "default") {
      options.headers.Authorization = `bearer ${accessToken}`;
    }

    let url;
    if (feedType === "hot" || !feedType) {
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
        previousFeed[0].isToken !== !!accessToken ||
        previousFeed[0].feedType !== feedType ||
        previousFeed[0].subreddit !== subreddit
      ) {
        startFeedFromScratch = true;
      }
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      let fetchResult = data.data.children;
      fetchResult.forEach((obj) => {
        obj.isToken = !!accessToken;
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

  // event-listener-esque function to check if element is at end of scroll
  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      if (scrollHeight - scrollTop <= clientHeight * 1.2) {
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

  const getCommentFlair = (commentDetails) => {
    try {
      return (
        <div
          className="CommentFlair"
          style={{
            backgroundColor: commentDetails.link_flair_background_color,
            color:
              commentDetails.link_flair_text_color === "light"
                ? "white"
                : "black",
            marginBlock: "5px",
          }}
        >
          {commentDetails.link_flair_text}
        </div>
      );
    } catch (error) {
      console.error(error);
      return <div className="CommentFlair"></div>;
    }
  };

  const getAuthorFlair = (commentDetails) => {
    try {
      if (!commentDetails.author_flair_text) {
        return;
      }
      return (
        <div
          className="CommentAuthorFlair"
          style={{
            backgroundColor:
              commentDetails.author_flair_background_color || "white",
            color:
              commentDetails.author_flair_text_color === "light"
                ? "white"
                : "black",
          }}
        >
          {commentDetails.author_flair_text}
        </div>
      );
    } catch (error) {
      console.error(error);
      return <div className="CommentAuthorFlair"></div>;
    }
  };

  // mapping of posts
  const items = feedContent.map((post) => {
    // console.log(post);
    const postData = post.data;
    const permalink = postData.permalink.slice(1, -1);
    let thumbnail;
    const thumbnailUrl =
      postData.thumbnail !== "image" ? postData.thumbnail : postData.url;
    if (
      postData.secure_media &&
      postData.secure_media.reddit_video &&
      postData.preview
    ) {
      thumbnail = (
        <img
          src={getUrl(postData.preview.images[0].source.url)}
          alt=""
          className="FeedThumbnail"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/reddit-icon.png";
          }}
        />
      );
    } else if (
      postData.thumbnail !== "self" &&
      postData.thumbnail !== "default" &&
      postData.thumbnail !== "nsfw" &&
      postData.thumbnail !== "spoiler" &&
      !postData.is_gallery &&
      postData.preview
    ) {
      thumbnail = (
        <img
          src={getUrl(postData.preview.images[0].source.url)}
          alt=""
          className="FeedThumbnail"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/reddit-icon.png";
          }}
        />
      );
    } else if (postData.is_gallery) {
      thumbnail = (
        <img
          src={thumbnailUrl}
          alt=""
          className="FeedThumbnail"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/reddit-icon.png";
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
    let galleryIndicator = null;
    if (postData.is_gallery) {
      galleryIndicator = (
        <div className="galleryIndicator">
          <i class="fa-solid fa-images"></i>
          {postData.gallery_data.items.length}
        </div>
      );
    }

    let videoIndicator = null;
    if (postData.is_video) {
      videoIndicator = (
        <div className="videoIndicator">
          <i class="fa-solid fa-circle-play"></i>
          {formatDuration(postData.media.reddit_video.duration)}
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
        {galleryIndicator}
        {videoIndicator}

        <div className="FeedDetails">
          <h2 className="FeedTitle">
            {decode(
              postData.title.length > 100
                ? postData.title.slice(0, 100) + "..."
                : postData.title
            ) + (postData.stickied ? " 📌" : "")}
            {getCommentFlair(postData)}
          </h2>
          <div className="FeedSubreddit">
            {postData.subreddit_name_prefixed}
          </div>
          <div className="FeedAuthor">
            {"by "}
            {postData.author}
            {getAuthorFlair(postData)}
          </div>
          <div className="FeedComments">{`${postData.num_comments} comments`}</div>
        </div>
        <div className="FeedActions">
          <button type="button" className="Upvote">
            <i
              className={
                "fa-xl fa-solid fa-arrow-up" +
                (postData.likes === true ? " upvoted" : "")
              }
            ></i>
          </button>
          <div className="FeedKarma">{shortenNumber(postData.score)}</div>
          <button type="button" className="Downvote">
            <i
              className={
                "fa-xl fa-solid fa-arrow-down" +
                (postData.likes === false ? " downvoted" : "")
              }
            ></i>
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
});

export default SubredditFeedContents;

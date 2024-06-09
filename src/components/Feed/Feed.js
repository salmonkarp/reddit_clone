import { Link } from "react-router-dom";
import "./Feed.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { decode } from "html-entities";

function Feed() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [feedContent, setFeedContent] = useState([]);
  // accessing the feed content from api
  useEffect(() => {
    async function getFeedContent(key) {
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

      const response = await fetch("https://oauth.reddit.com/.json", options);
      const data = await response.json();
      setFeedContent(data.data.children);
      // console.log("finished feed", feedContent);
    }
    if (accessToken) {
      getFeedContent(accessToken);
    } else {
      getFeedContent("default");
    }
  }, [accessToken]);

  const items = feedContent.map((post) => {
    const postData = post.data;
    const permalink = postData.permalink.slice(1, -1);
    let thumbnail;
    const thumbnailUrl =
      postData.thumbnail !== "image" ? postData.thumbnail : postData.url;
    if (postData.secure_media) {
      thumbnail = (
        <video
          src={postData.secure_media.reddit_video.scrubber_media_url}
          controls
          className="FeedThumbnail"
          // onClick={(e) => {
          //   e.preventDefault();
          //   window.location.href = postData.url_overridden_by_dest;
          // }}
        />
      );
    } else if (
      postData.thumbnail !== "self" &&
      postData.thumbnail !== "default" &&
      postData.thumbnail !== "nsfw"
    ) {
      thumbnail = (
        <img
          src={thumbnailUrl}
          alt=""
          className="FeedThumbnail"
          // onClick={(e) => {
          //   e.preventDefault();
          //   window.location.href = postData.url_overridden_by_dest;
          // }}
        />
      );
    } else if (postData.thumbnail == "nsfw") {
      thumbnail = <div className="FeedThumbnail nsfw">NSFW</div>;
    } else {
      thumbnail = (
        <div className="FeedThumbnail">
          <i className="fa-2xl fa-solid fa-list"></i>
        </div>
      );
    }

    // console.log(feedContent);
    return (
      <Link key={postData.id} className="FeedPost" to={`/${permalink}`}>
        {thumbnail}
        <div className="FeedDetails">
          <h2 className="FeedTitle">{decode(postData.title)}</h2>
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
          <div className="FeedKarma">{postData.score}</div>
          <button type="button" className="Downvote">
            <i className="fa-xl fa-solid fa-arrow-down"></i>
          </button>
        </div>
      </Link>
    );
  });

  return <div className="Feed">{items}</div>;
}

export default Feed;

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { decode } from "html-entities";
import ReactMarkdown from "react-markdown";
import SubredditDetails from "../SubredditDetails/SubredditDetails";
import timeAgo from "../../scripts/getTimeAgo";
import "./Comment.css";

const Comment = () => {
  const { subreddit, postId, postTitle } = useParams();
  const [commentDetails, setCommentDetails] = useState({});
  const [commentTree, setCommentTree] = useState({});
  const [subredditDetails, setSubredditDetails] = useState({
    community_icon: "subredditDefault.svg",
    banner_background_image: "",
  });
  let userFlair = null;
  const accessToken = useSelector((state) => state.auth.accessToken);

  // function to access comment details
  async function getCommentDetails() {
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
    let url = `https://oauth.reddit.com/r/${subreddit}/comments/${postId}/${postTitle}/.json`;
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setCommentDetails(data[0].data.children[0].data);
      setCommentTree(data[1].data);
    } catch (error) {
      console.error("Failed to fetch feed content:", error);
    }
  }

  // function to access the feed about from api
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

  useEffect(() => {
    getCommentDetails();
    getSubredditAbout();
  }, [subreddit, postId, postTitle, accessToken]);

  const getAuthorFlair = () => {
    try {
      return (
        <div
          className="CommentAuthorFlair"
          style={{
            backgroundColor: commentDetails.author_flair_background_color,
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

  const getCommentMedia = () => {
    try {
      if (commentDetails.media && commentDetails.media.reddit_video) {
        return (
          <div className="CommentMedia">
            <video
              src={commentDetails.media.reddit_video.fallback_url}
              controls
              alt=""
              className="CommentMediaInside"
            />
          </div>
        );
      }
      if (commentDetails.thumbnail != "self") {
        return (
          <div className="CommentMedia">
            <img
              src={commentDetails.url}
              alt=""
              className="CommentMediaInside"
            />
          </div>
        );
      } else {
        return <div></div>;
      }
    } catch (error) {
      console.error(error);
      return <div className="CommentMedia">Error loading media.</div>;
    }
  };

  const getCommentFlair = () => {
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

  console.log(commentDetails);

  return (
    <div className="Comment">
      <div className="CommentMain">
        <div className="CommentMainDetails">
          <div className="UserDetails">
            <img
              src={
                subredditDetails.community_icon.split("?")[0] ||
                "/subredditDefault.svg"
              }
              alt=""
              className="CommentCommunityIcon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/reddit-icon.png";
              }}
            />
            <div className="UserDetailsHelper">
              <div className="CommentCommunityName">
                {"r/" +
                  subreddit +
                  " - " +
                  (commentDetails ? timeAgo(commentDetails.created_utc) : "")}
              </div>
              <div className="CommentAuthor">
                <div>{commentDetails ? commentDetails.author : ""}</div>
                {getAuthorFlair()}
              </div>
            </div>
          </div>
          <div className="CommentTitle">
            {commentDetails ? commentDetails.title : ""}
          </div>
          <div className="CommentDesc">
            <ReactMarkdown
              children={commentDetails ? commentDetails.selftext : ""}
            ></ReactMarkdown>
          </div>
          {getCommentFlair()}
          <Link
            to={"https://www.reddit.com" + commentDetails.permalink}
            className="CommentOriLink"
          >
            Link to original
          </Link>
          {getCommentMedia()}
          <div className="CommentActions">
            <div className="CommentVote">
              <button type="button">
                <i
                  className={
                    "fa-regular fa-solid fa-arrow-up" +
                    (commentDetails.likes === true ? " upvoted" : "")
                  }
                ></i>
              </button>
              <div className="CommentScore">{commentDetails.score}</div>
              <button type="button">
                <i
                  className={
                    "fa-regular fa-solid fa-arrow-down" +
                    (commentDetails.likes === false ? " downvoted" : "")
                  }
                ></i>
              </button>
            </div>
            <div className="CommentComment">
              <i className="fa-regular fa-solid fa-comment"></i>
              <div className="CommentCommentCount">
                {commentDetails.num_comments}
              </div>
            </div>
            <div className="CommentShare">
              <i className="fa-solid fa-share-from-square"></i>
              <div className="CommentShareText">Share</div>
            </div>
          </div>
          <input
            className="CommentAdd"
            type="text"
            placeholder="Add a comment..."
          ></input>
        </div>
        <div className="CommentMainTree"></div>
      </div>
      <SubredditDetails subreddit={subreddit}></SubredditDetails>
    </div>
  );
};

export default Comment;

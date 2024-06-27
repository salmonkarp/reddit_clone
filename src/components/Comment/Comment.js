import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import SubredditDetails from "../SubredditDetails/SubredditDetails";
import timeAgo from "../../scripts/getTimeAgo";
import "./Comment.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MarkdownComponent from "../../scripts/ReactGFM";
import { Carousel } from "react-responsive-carousel";
import ReplyList from "../../scripts/getCommentTree";

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

  const getUrl = (imgUrl) => {
    let encoded = imgUrl.replace("amp;s", "s");
    let doubleEncoded = encoded.replace("amp;", "");
    let tripleEncoded = doubleEncoded.replace("amp;", "");
    return tripleEncoded;
  };

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
    let url = `https://oauth.reddit.com/r/${subreddit}/comments/${postId}/${postTitle}/.json?limit=20`;
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
            backgroundColor:
              commentDetails.author_flair_background_color ||
              (commentDetails.author_flair_text ? "white" : "none"),
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
        const videoUrl = getUrl(commentDetails.media.reddit_video.fallback_url);
        const audioUrl = getUrl(
          commentDetails.media.reddit_video.fallback_url.split("DASH")[0] +
            "DASH_AUDIO_128.mp4"
        );

        const combineVideoAndAudio = async (
          videoElement,
          videoUrl,
          audioUrl
        ) => {
          const mediaSource = new MediaSource();
          videoElement.src = URL.createObjectURL(mediaSource);

          mediaSource.addEventListener("sourceopen", async () => {
            const videoSourceBuffer = mediaSource.addSourceBuffer(
              'video/mp4; codecs="avc1.64001f"'
            );
            const audioSourceBuffer = mediaSource.addSourceBuffer(
              'audio/mp4; codecs="mp4a.40.2"'
            );

            const videoData = await fetch(videoUrl).then((response) =>
              response.arrayBuffer()
            );
            const audioData = await fetch(audioUrl).then((response) =>
              response.arrayBuffer()
            );

            let videoAppended = false;
            let audioAppended = false;

            const checkEndOfStream = () => {
              if (
                videoAppended &&
                audioAppended &&
                !videoSourceBuffer.updating &&
                !audioSourceBuffer.updating
              ) {
                mediaSource.endOfStream();
              }
            };

            videoSourceBuffer.addEventListener("updateend", () => {
              videoAppended = true;
              checkEndOfStream();
              if (!audioSourceBuffer.updating && !audioAppended) {
                audioSourceBuffer.appendBuffer(audioData);
              }
            });

            audioSourceBuffer.addEventListener("updateend", () => {
              audioAppended = true;
              checkEndOfStream();
            });

            videoSourceBuffer.addEventListener("error", (e) => {
              console.error("Video SourceBuffer error:", e);
            });

            audioSourceBuffer.addEventListener("error", (e) => {
              console.error("Audio SourceBuffer error:", e);
            });

            videoSourceBuffer.appendBuffer(videoData);
          });
        };

        return (
          <div className="CommentMedia">
            <video
              ref={(videoElement) => {
                if (videoElement && !videoElement.src)
                  combineVideoAndAudio(videoElement, videoUrl, audioUrl);
              }}
              controls
              className="CommentMediaInside CommentVideo"
            />
          </div>
        );
      }
      if (commentDetails.is_gallery) {
        const images = [];
        commentDetails.gallery_data.items.forEach((item) => {
          let mediaId = item.media_id;
          if (commentDetails.media_metadata[mediaId].m == "image/jpg") {
            images.push(
              <div className="CommentMedia" onClick={() => displayMediaModal()}>
                <img
                  src={`https://i.redd.it/${item.media_id}.jpg`}
                  alt=""
                  className="CommentMediaInside"
                />
              </div>
            );
          } else {
            images.push(
              <div className="CommentMedia" onClick={() => displayMediaModal()}>
                <img
                  src={`https://i.redd.it/${item.media_id}.png`}
                  alt=""
                  className="CommentMediaInside"
                />
              </div>
            );
          }
        });
        return (
          <Carousel
            showStatus={false}
            showThumbs={false}
            onClickItem={() => generateGalleryModal()}
          >
            {images}
          </Carousel>
        );
      }

      if (
        commentDetails.thumbnail != "self" &&
        commentDetails.is_reddit_media_domain
      ) {
        return (
          <>
            <div
              className="CommentMedia"
              style={{ "--image-url": `url(${getUrl(commentDetails.url)})` }}
              onClick={() => displayMediaModal()}
            >
              <img
                src={commentDetails.url}
                alt=""
                className="CommentMediaInside"
              />
            </div>
            <div
              className="MediaModal"
              style={{ "--image-url": `url(${getUrl(commentDetails.url)})` }}
            >
              <img
                src={commentDetails.url}
                alt=""
                className="MediaModalInside"
              />
              <button
                type="button"
                onClick={() => hideMediaModal()}
                className="CloseMediaModalButton"
              >
                <i class="fa-xl fa-solid fa-xmark"></i>
              </button>
            </div>
          </>
        );
      }
      if (!commentDetails.is_reddit_media_domain && commentDetails.preview) {
        return (
          <div
            className="CommentMedia"
            onClick={() => displayMediaModal()}
            style={{
              "--image-url": `url(${getUrl(
                commentDetails.preview.images[0].source.url
              )})`,
              cursor: "default",
            }}
          >
            <img
              src={getUrl(commentDetails.preview.images[0].source.url)}
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
            backgroundColor:
              commentDetails.link_flair_background_color ||
              (commentDetails.link_flair_text ? "white" : "none"),
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

  const displayMediaModal = () => {
    if (document.querySelector(".MediaModal")) {
      document.querySelector(".MediaModal").style.display = "flex";
    }
  };

  const hideMediaModal = () => {
    if (document.querySelector(".MediaModal")) {
      document.querySelector(".MediaModal").style.display = "none";
    }
    try {
      document
        .querySelector(".Comment")
        .removeChild(document.querySelector(".MediaModal"));
    } catch {
      console.log("lol i'm never gonna fix this");
    }
  };

  const generateGalleryModal = () => {
    let selectedMediaUrl = document
      .querySelector(".slide.selected")
      .querySelector(".CommentMediaInside").src;
    let dynamicModal = document.createElement("div");
    dynamicModal.className = "MediaModal";
    dynamicModal.style.display = "flex";
    dynamicModal.style.setProperty("--image-url", `url(${selectedMediaUrl})`);
    dynamicModal.innerHTML = `
      <img src="${selectedMediaUrl}" alt="" class="MediaModalInside" />
      <button type="button" class="CloseMediaModalButton" onclick="hideMediaModal()">
        <i class="fa-xl fa-solid fa-xmark"></i>
      </button>
    `;
    dynamicModal.querySelector(".CloseMediaModalButton").onclick =
      hideMediaModal;
    document.querySelector(".Comment").appendChild(dynamicModal);
  };

  console.log(commentTree);

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
              <Link className="CommentCommunityName" to={`/r/${subreddit}`}>
                {"r/" +
                  subreddit +
                  " - " +
                  (commentDetails ? timeAgo(commentDetails.created_utc) : "")}
              </Link>
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
            <MarkdownComponent
              content={commentDetails ? commentDetails.selftext : ""}
            ></MarkdownComponent>
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
        <ReplyList
          commentTree={commentTree}
          postId={commentDetails.id}
        ></ReplyList>
      </div>
      <SubredditDetails subreddit={subreddit}></SubredditDetails>
    </div>
  );
};

export default Comment;

import MarkdownComponent from "./ReactGFM";
import timeAgo from "./getTimeAgo";
import shortenNumber from "./shortenNumber";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { cloneElement } from "react";

// let userProfilePicture = "";

const sampleComment = {
  kind: "t1",
  data: {
    subreddit_id: "t5_2v92f",
    approved_at_utc: null,
    author_is_blocked: false,
    comment_type: null,
    awarders: [],
    mod_reason_by: null,
    banned_by: null,
    author_flair_type: "richtext",
    total_awards_received: 0,
    subreddit: "196",
    author_flair_template_id: "234c5a54-6593-11ec-a8ff-1afe6e0db89e",
    likes: null,
    replies: {
      kind: "Listing",
      data: {
        after: null,
        dist: null,
        modhash: null,
        geo_filter: "",
        children: [
          {
            kind: "t1",
            data: {
              subreddit_id: "t5_2v92f",
              approved_at_utc: null,
              author_is_blocked: false,
              comment_type: null,
              awarders: [],
              mod_reason_by: null,
              banned_by: null,
              author_flair_type: "text",
              total_awards_received: 0,
              subreddit: "196",
              author_flair_template_id: null,
              likes: null,
              replies: {
                kind: "Listing",
                data: {
                  after: null,
                  dist: null,
                  modhash: null,
                  geo_filter: "",
                  children: [
                    {
                      kind: "t1",
                      data: {
                        subreddit_id: "t5_2v92f",
                        approved_at_utc: null,
                        author_is_blocked: false,
                        comment_type: null,
                        awarders: [],
                        mod_reason_by: null,
                        banned_by: null,
                        author_flair_type: "richtext",
                        total_awards_received: 0,
                        subreddit: "196",
                        author_flair_template_id:
                          "157e8dbc-08a0-11eb-80bc-0e00cca9e73d",
                        likes: null,
                        replies: "",
                        user_reports: [],
                        saved: false,
                        id: "lac35hu",
                        banned_at_utc: null,
                        mod_reason_title: null,
                        gilded: 0,
                        archived: false,
                        collapsed_reason_code: null,
                        no_follow: false,
                        author: "TZf14",
                        can_mod_post: false,
                        send_replies: true,
                        parent_id: "t1_lac2pwn",
                        score: 371,
                        author_fullname: "t2_36d4o48d",
                        removal_reason: null,
                        approved_by: null,
                        mod_note: null,
                        all_awardings: [],
                        body: "i realize what you are tryna say here but it's worded weird and seems like the opposite at first glance lol",
                        edited: false,
                        top_awarded_type: null,
                        downs: 0,
                        author_flair_css_class: null,
                        name: "t1_lac35hu",
                        is_submitter: false,
                        collapsed: false,
                        author_flair_richtext: [
                          {
                            e: "text",
                            t: "🏳️‍⚧️ trans rights",
                          },
                        ],
                        author_patreon_flair: false,
                        body_html:
                          '&lt;div class="md"&gt;&lt;p&gt;i realize what you are tryna say here but it&amp;#39;s worded weird and seems like the opposite at first glance lol&lt;/p&gt;\n&lt;/div&gt;',
                        gildings: {},
                        collapsed_reason: null,
                        distinguished: null,
                        associated_award: null,
                        stickied: false,
                        author_premium: false,
                        can_gild: false,
                        link_id: "t3_1doqyl5",
                        unrepliable_reason: null,
                        author_flair_text_color: "light",
                        score_hidden: false,
                        permalink: "/r/196/comments/1doqyl5/rule/lac35hu/",
                        subreddit_type: "public",
                        locked: false,
                        report_reasons: null,
                        created: 1719390890,
                        author_flair_text: "🏳️‍⚧️ trans rights",
                        treatment_tags: [],
                        created_utc: 1719390890,
                        subreddit_name_prefixed: "r/196",
                        controversiality: 0,
                        depth: 2,
                        author_flair_background_color: "#ffaef7",
                        collapsed_because_crowd_control: null,
                        mod_reports: [],
                        num_reports: null,
                        ups: 371,
                      },
                    },
                  ],
                  before: null,
                },
              },
              user_reports: [],
              saved: false,
              id: "lac2pwn",
              banned_at_utc: null,
              mod_reason_title: null,
              gilded: 0,
              archived: false,
              collapsed_reason_code: null,
              no_follow: false,
              author: "FALGRIDRANFMSRSD",
              can_mod_post: false,
              created_utc: 1719390576,
              send_replies: true,
              parent_id: "t1_labybfz",
              score: 271,
              author_fullname: "t2_3ir6oqx2",
              removal_reason: null,
              approved_by: null,
              mod_note: null,
              all_awardings: [],
              body: "Should've done that a long time ago",
              edited: false,
              top_awarded_type: null,
              author_flair_css_class: null,
              name: "t1_lac2pwn",
              is_submitter: false,
              downs: 0,
              author_flair_richtext: [],
              author_patreon_flair: false,
              body_html:
                '&lt;div class="md"&gt;&lt;p&gt;Should&amp;#39;ve done that a long time ago&lt;/p&gt;\n&lt;/div&gt;',
              gildings: {},
              collapsed_reason: null,
              distinguished: null,
              associated_award: null,
              stickied: false,
              author_premium: false,
              can_gild: false,
              link_id: "t3_1doqyl5",
              unrepliable_reason: null,
              author_flair_text_color: null,
              score_hidden: false,
              permalink: "/r/196/comments/1doqyl5/rule/lac2pwn/",
              subreddit_type: "public",
              locked: false,
              report_reasons: null,
              created: 1719390576,
              author_flair_text: null,
              treatment_tags: [],
              collapsed: false,
              subreddit_name_prefixed: "r/196",
              controversiality: 0,
              depth: 1,
              author_flair_background_color: null,
              collapsed_because_crowd_control: null,
              mod_reports: [],
              num_reports: null,
              ups: 271,
            },
          },
        ],
        before: null,
      },
    },
    user_reports: [],
    saved: false,
    id: "labybfz",
    banned_at_utc: null,
    mod_reason_title: null,
    gilded: 0,
    archived: false,
    collapsed_reason_code: null,
    no_follow: false,
    author: "Fittsa",
    can_mod_post: false,
    created_utc: 1719387391,
    send_replies: true,
    parent_id: "t3_1doqyl5",
    score: 2336,
    author_fullname: "t2_r3azg0cm",
    approved_by: null,
    mod_note: null,
    all_awardings: [],
    collapsed: false,
    body: "if project 2025 happens I'm never forgiving you Americans\n\nhttps://preview.redd.it/b4fjjc1hdv8d1.jpeg?width=640&amp;format=pjpg&amp;auto=webp&amp;s=d1d9a1893fdd63b1d558f81ec35493e4a986b6ff",
    edited: false,
    top_awarded_type: null,
    author_flair_css_class: null,
    name: "t1_labybfz",
    is_submitter: false,
    downs: 0,
    author_flair_richtext: [
      {
        e: "text",
        t: "that one catboy Warframe player",
      },
    ],
    author_patreon_flair: false,
    body_html:
      '&lt;div class="md"&gt;&lt;p&gt;if project 2025 happens I&amp;#39;m never forgiving you Americans&lt;/p&gt;\n\n&lt;p&gt;&lt;a href="https://preview.redd.it/b4fjjc1hdv8d1.jpeg?width=640&amp;amp;format=pjpg&amp;amp;auto=webp&amp;amp;s=d1d9a1893fdd63b1d558f81ec35493e4a986b6ff"&gt;https://preview.redd.it/b4fjjc1hdv8d1.jpeg?width=640&amp;amp;format=pjpg&amp;amp;auto=webp&amp;amp;s=d1d9a1893fdd63b1d558f81ec35493e4a986b6ff&lt;/a&gt;&lt;/p&gt;\n&lt;/div&gt;',
    removal_reason: null,
    collapsed_reason: null,
    distinguished: null,
    associated_award: null,
    stickied: false,
    author_premium: false,
    can_gild: false,
    gildings: {},
    unrepliable_reason: null,
    author_flair_text_color: "dark",
    score_hidden: false,
    permalink: "/r/196/comments/1doqyl5/rule/labybfz/",
    subreddit_type: "public",
    locked: false,
    report_reasons: null,
    created: 1719387391,
    media_metadata: {
      b4fjjc1hdv8d1: {
        status: "valid",
        e: "Image",
        m: "image/jpeg",
        p: [
          {
            y: 121,
            x: 108,
            u: "https://preview.redd.it/b4fjjc1hdv8d1.jpeg?width=108&amp;crop=smart&amp;auto=webp&amp;s=976800cd8191f78b6b2a05e47c0a4d6a42dbbfa0",
          },
          {
            y: 243,
            x: 216,
            u: "https://preview.redd.it/b4fjjc1hdv8d1.jpeg?width=216&amp;crop=smart&amp;auto=webp&amp;s=054056525899aeca8dac962bb08942bf9c4df5c2",
          },
          {
            y: 360,
            x: 320,
            u: "https://preview.redd.it/b4fjjc1hdv8d1.jpeg?width=320&amp;crop=smart&amp;auto=webp&amp;s=74557b159c58af6362d6363cb152a3eaaa021f6a",
          },
          {
            y: 720,
            x: 640,
            u: "https://preview.redd.it/b4fjjc1hdv8d1.jpeg?width=640&amp;crop=smart&amp;auto=webp&amp;s=08f2bfd71c7bc7ec5a41ba645d56a76d3475857c",
          },
        ],
        s: {
          y: 720,
          x: 640,
          u: "https://preview.redd.it/b4fjjc1hdv8d1.jpeg?width=640&amp;format=pjpg&amp;auto=webp&amp;s=d1d9a1893fdd63b1d558f81ec35493e4a986b6ff",
        },
        id: "b4fjjc1hdv8d1",
      },
    },
    author_flair_text: "that one catboy Warframe player",
    treatment_tags: [],
    link_id: "t3_1doqyl5",
    subreddit_name_prefixed: "r/196",
    controversiality: 0,
    depth: 0,
    author_flair_background_color: "#d3d6da",
    collapsed_because_crowd_control: null,
    mod_reports: [],
    num_reports: null,
    ups: 2336,
  },
};

const getAuthorFlair = (commentDetails) => {
  try {
    return (
      <div
        className="CommentAuthorFlair ReplyAuthorFlair"
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

const getUserProfile = async (username, accessToken) => {
  let options = {
    method: "GET",
    headers: {
      "User-Agent": "Reddit_App",
    },
  };
  if (accessToken) {
    options.Authorization = `bearer ${accessToken}`;
  }
  let url = `https://oauth.reddit.com/user/${username}/about.json`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return (
      <img
        src={data.data.icon_img.split("?")[0]}
        alt=""
        className="ReplyAvatar"
      />
    );
  } catch (error) {
    console.error("Failed to fetch feed content:", error);
    return <img src="/reddit-icon.png" alt="" className="ReplyAvatar" />;
  }
};

const Reply = ({ comment, postId }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const commentData = comment.data;
  const [userProfilePicture, setUserProfilePicture] = useState(
    <img className="ReplyAvatar" src="/reddit-icon.png"></img>
  );
  const [childrenElements, setChildrenElements] = useState([]);
  const replyLineRef = useRef(null);
  const lastChildRef = useRef(null);
  useEffect(() => {
    const fetchUserProfile = async () => {
      const profilePicture = await getUserProfile(
        commentData.author,
        accessToken
      );
      setUserProfilePicture(profilePicture);
    };

    fetchUserProfile();
  }, [commentData.author]);

  useEffect(() => {
    if (commentData.replies) {
      setChildrenElements(
        commentData.replies.data.children
          // .filter((comment) => !!comment.author)
          .map((comment) => (
            <Reply key={comment.data.id} comment={comment}></Reply>
          ))
      );
    }
  }, [commentData.replies]);

  useEffect(() => {
    if (lastChildRef.current && replyLineRef.current) {
      console.log(lastChildHeight.current, replyLineHeight.current);
      const lastChildHeight =
        lastChildRef.current.getBoundingClientRect().height;
      const replyLineHeight = `calc(100% - ${lastChildHeight}px)`;
      replyLineRef.current.style.height = replyLineHeight;
    }
  }, [childrenElements]);

  console.log(commentData);
  return (
    <div className="Reply">
      <div className="ReplyTop">
        <div
          className="ReplyLineHori"
          style={{
            display:
              commentData.parent_id !== "t3_" + postId
                ? "inline-block"
                : "none",
          }}
        ></div>
        {userProfilePicture}
        <div className="ReplyMeta">
          <div className="ReplyAuthor">
            {(commentData ? commentData.author : "") +
              " - " +
              (commentData ? timeAgo(commentData.created_utc) : "")}
          </div>
          {getAuthorFlair(commentData)}
        </div>
      </div>
      <div className="ReplyBottom">
        <div className="ReplyLeft">
          <div
            className="ReplyLine"
            ref={replyLineRef}
            style={{
              display: commentData.replies ? "inline-block" : "none",
            }}
          ></div>
        </div>
        <div className="ReplyContent">
          {
            <MarkdownComponent
              content={commentData ? commentData.body : ""}
            ></MarkdownComponent>
          }

          <div className="ReplyBottomMeta">
            <div className="ReplyActions">
              <button type="button">
                <i
                  className={
                    "fa-regular fa-solid fa-arrow-up" +
                    (commentData.likes === true ? " upvoted" : "")
                  }
                ></i>
              </button>
              <div className="ReplyScore">
                {shortenNumber(commentData.score)}
              </div>
              <button type="button">
                <i
                  className={
                    "fa-regular fa-solid fa-arrow-down" +
                    (commentData.likes === false ? " downvoted" : "")
                  }
                ></i>
              </button>
            </div>

            <div className="ReplyShare">
              <i className="fa-solid fa-share-from-square"></i>
            </div>
          </div>
          {childrenElements.map((child, index) =>
            cloneElement(child, {
              ref: index === childrenElements.length - 1 ? lastChildRef : null,
            })
          )}
        </div>
      </div>
    </div>
  );
};

const ReplyList = ({ commentTree, postId }) => {
  console.log(postId);
  if (!commentTree || !commentTree.children) {
    return "";
  }
  let final = commentTree.children.map((comment) => {
    return (
      <Reply key={comment.data.id} comment={comment} postId={postId}></Reply>
    );
  });

  return <div className="CommentMainTree">{final}</div>;
};

export default ReplyList;

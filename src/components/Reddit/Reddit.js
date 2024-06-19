import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Reddit.css";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import MobileSidebar from "../MobileSidebar/MobileSidebar";
import SubredditFeed from "../SubredditFeed/SubredditFeed";
import { setAccessToken, setUserData, setUserFavSubs } from "../../store/store";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Feed from "../Feed/Feed";

// API Parameters // TODO: HIDE THIS
const REDDIT_CLIENT_ID = process.env.REACT_APP_REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REACT_APP_REDDIT_CLIENT_SECRET;
const REDDIT_REDIRECT_URI = process.env.REACT_APP_REDDIT_REDIRECT_URI;

function Reddit() {
  const dispatch = useDispatch();
  const redditRef = useRef();
  // const userData = useSelector((state) => state.auth.userData);

  // get the access token and store it is a prop so entire thing updates when access token changes
  async function getToken() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const tokenUrl = "https://www.reddit.com/api/v1/access_token";
      const basicAuth = btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`); //encoding in case of special characters
      const options = {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDDIT_REDIRECT_URI}`,
      };
      const response = await fetch(tokenUrl, options);
      if (response.ok) {
        const data = await response.json();
        dispatch(setAccessToken(data.access_token));
      }
      window.history.replaceState({}, "", window.location.pathname);
    } catch (error) {
      console.error(error);
    }
  }

  // get the authorisation code
  function authorize() {
    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=state&redirect_uri=${encodeURIComponent(
      REDDIT_REDIRECT_URI
    )}&duration=temporary&scope=read,identity,history,mysubreddits,subscribe`;
    window.location.href = authUrl;
  }

  // detect any authorisation code, run only once at the start
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    // console.log(code);
    if (code) {
      getToken();
    }
  }, []);

  const toggleMobileSidebar = () => {
    let mobileSidebar = document.querySelector(".MobileSidebar");
    // console.log(mobileSidebar.style.left);
    if (mobileSidebar.style.left != "0px") {
      mobileSidebar.style.left = 0;
    } else mobileSidebar.style.left = "-100%";
  };

  return (
    <div className="Reddit" ref={redditRef}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <Header
        authorize={authorize}
        toggleMobileSidebar={toggleMobileSidebar}
      ></Header>
      <Router>
        <div className="BottomContainer">
          <Sidebar />
          <MobileSidebar
            toggleMobileSidebar={toggleMobileSidebar}
          ></MobileSidebar>

          <Routes>
            <Route index element={<Feed type="home" />} />
            <Route path="/popular" element={<Feed type="popular" />} />
            <Route path="/all" element={<Feed type="all" />} />
            <Route path="/r/:subreddit" element={<SubredditFeed />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default Reddit;

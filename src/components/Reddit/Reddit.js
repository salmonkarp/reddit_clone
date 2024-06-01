import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Reddit.css";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { setAccessToken, setUserData, setUserFavSubs } from "../../store/store";

// API Parameters // TODO: HIDE THIS
const REDDIT_CLIENT_ID = "AIxtzVv0waDI7LRFl1yJlA";
const REDDIT_CLIENT_SECRET = "mDQhGZ7suHpM4NGotFMab5RomaUShQ";
const REDDIT_REDIRECT_URI = "http://127.0.0.1:3000";

function Reddit() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userData = useSelector((state) => state.auth.userData);
  console.log(accessToken);

  // get the access token and store it is a prop
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
      window.history.replaceState({}, "", window.location.pathname); // clean up uri to hide any codes
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
    console.log(code);
    if (code) {
      getToken();
    }
  }, []);

  // get user data
  useEffect(() => {
    async function getUserData() {
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "Reddit_App",
          Authorization: `bearer ${accessToken}`,
        },
      };
      const response = await fetch(
        "https://oauth.reddit.com/api/v1/me.json",
        options
      );
      const data = await response.json();
      console.log("data", data);
      dispatch(setUserData(data));
    }
    // if access token exist run the function
    if (accessToken) {
      getUserData();
    }
  }, [dispatch, accessToken]);

  // get subscribed subreddits data
  useEffect(() => {
    async function getUserData() {
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "Reddit_App",
          Authorization: `bearer ${accessToken}`,
        },
      };
      const response = await fetch(
        "https://oauth.reddit.com/subreddits/mine/subscriber",
        options
      );
      const data = await response.json();
      let subbedList = data.data.children;
      subbedList = subbedList.sort((a, b) =>
        a.data.display_name.localeCompare(b.data.display_name)
      );
      console.log(subbedList);

      dispatch(setUserFavSubs(subbedList));
    }
    // if access token exist run the function
    if (accessToken) {
      getUserData();
    }
  }, [dispatch, accessToken]);

  return (
    <div className="Reddit">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <Header authorize={authorize} userData={userData}></Header>
      <Sidebar></Sidebar>
      {/* <h3>{accessToken}</h3> */}
    </div>
  );
}

export default Reddit;

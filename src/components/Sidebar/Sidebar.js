import "./Sidebar.css";
import { useSelector } from "react-redux";

function Sidebar() {
  const items = useSelector((state) => state.auth.userFavSubs).map(
    (subreddit) => (
      <div className="SidebarCommunitiesItem" key={subreddit.data.display_name}>
        <img
          src={subreddit.data.community_icon.split("?")[0]}
          alt={subreddit.data.display_name}
        />
        <div value={subreddit.data.display_name}>
          {subreddit.data.display_name}
        </div>
      </div>
    )
  );
  return (
    <div className="Sidebar">
      <div className="SidebarTop">
        <div
          className="SidebarTopItem"
          value="<i className='fa-solid fa-house fa-xl'></i> Home"
        >
          <i className="fa-solid fa-house fa-xl"></i> Home
        </div>
        <div
          className="SidebarTopItem"
          value="<i className='fa-solid fa-arrow-trend-up fa-xl'></i> Popular"
        >
          <i className="fa-solid fa-arrow-trend-up fa-xl"></i> Popular
        </div>
        <div
          className="SidebarTopItem"
          value='<i className="fa-solid fa-chart-simple fa-xl"></i> All'
        >
          <i className="fa-solid fa-chart-simple fa-xl"></i> All
        </div>
      </div>
      <div className="SidebarCommunities">
        <h2>Communities</h2>
        {items}
      </div>
    </div>
  );
}

export default Sidebar;

import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="Sidebar">
      <div className="SidebarTop">
        <div className="SidebarTopItem">
          <i class="fa-solid fa-house fa-xl"></i> Home
        </div>
        <div className="SidebarTopItem">
          <i class="fa-solid fa-arrow-trend-up fa-xl"></i> Popular
        </div>
        <div className="SidebarTopItem">
          <i class="fa-solid fa-chart-simple fa-xl"></i> All
        </div>
      </div>
      <div className="SidebarCommunities">
        <h2>Communities</h2>
        <div className="SidebarCommunitiesItem">
          <img
            src="https://b.thumbs.redditmedia.com/vk8EAqzcLRGYh_Yisi68CglMMuheNEFKNaDLZy7h2ZE.png"
            alt="Stuff"
          />
          <div>gaming</div>
        </div>
        <div className="SidebarCommunitiesItem">
          <img
            src="https://b.thumbs.redditmedia.com/vk8EAqzcLRGYh_Yisi68CglMMuheNEFKNaDLZy7h2ZE.png"
            alt="Stuff"
          />
          <div>gaming</div>
        </div>
        <div className="SidebarCommunitiesItem">
          <img
            src="https://b.thumbs.redditmedia.com/vk8EAqzcLRGYh_Yisi68CglMMuheNEFKNaDLZy7h2ZE.png"
            alt="Stuff"
          />
          <div>gaming</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

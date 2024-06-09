window.addEventListener("load", () => {
  refresh();
  handleSearchFocus();
  handleSidebar();
  handleActiveElements();
});

window.addEventListener("resize", () => {
  refresh();
  handleSidebar();
});

const refresh = () => {
  setTimeout(() => handleCommunityNames(), 500);
};

const handleCommunityNames = () => {
  if (
    window.innerWidth > 480 &&
    document.querySelectorAll(".SidebarCommunitiesItem").length > 1
  ) {
    let comWidth =
      parseInt(
        window.getComputedStyle(
          document.querySelector(".SidebarCommunitiesItem")
        ).width
      ) -
      55 -
      20;
    let comNames = document.querySelectorAll(".SidebarCommunitiesItem div");
    comNames.forEach((com) => {
      let tempWidth = parseInt(window.getComputedStyle(com).width);
      com.innerHTML = String(com.attributes.value.value);
      while (tempWidth > comWidth) {
        com.innerHTML = com.innerHTML.slice(0, -1);
        tempWidth = parseInt(window.getComputedStyle(com).width);
        if (tempWidth <= comWidth) {
          com.innerHTML = com.innerHTML + "...";
        }
      }
    });
  }
};

const handleSearchFocus = () => {
  const header = document.querySelector(".Header");
  const searchInput = document.querySelector(".SearchInput");
  const searchIcon = document.querySelector(".SearchIcon");
  const searchBar = document.querySelector(".Searchbar");
  const headerLeft = document.querySelector(".HeaderLeft");
  const headerRight =
    document.querySelector(".LoginButton") ||
    document.querySelector(".LoginState");
  let innerWidth = window.innerWidth;
  searchInput.addEventListener("focus", (event) => {
    if (window.innerWidth < 992) {
      headerLeft.style.opacity = 0;
      headerRight.style.opacity = 0;

      // console.log(innerWidth);
      if (innerWidth > 768) {
        searchBar.style.transform = "translateX(-205px)";
        searchInput.style.width = "85vw";
      } else if (innerWidth > 480) {
        searchBar.style.transform = "translateX(-60px)";
        searchInput.style.width = "70vw";
      }
      setTimeout(() => {
        headerRight.style.display = "none";
      }, 50);
    }
  });
  searchInput.addEventListener("blur", (event) => {
    if (window.innerWidth < 992) {
      // console.log("test");
      headerLeft.style.display = "flex";
      headerRight.style.display = "flex";
      searchBar.style.transform = "translateX(0px)";
      searchInput.style.width = "unset";
      setTimeout(() => {
        headerLeft.style.opacity = 1;
        headerRight.style.opacity = 1;
      }, 200);
    }
  });
};

const handleSidebar = () => {
  if (window.innerWidth < 600) {
    document.querySelector(".Sidebar").style.display = "none";
  } else if (window.innerWidth < 992) {
    let topItems = document.querySelectorAll(".SidebarTopItem");
    topItems.forEach((item) => {
      item.innerHTML = item.innerHTML.split("</i>")[0];
    });
  }
};

const handleActiveElements = () => {
  console.log(window.location.pathname);
  if (window.location.pathname === "/") {
    document.querySelector(".SidebarTopItem.Home").classList.add("active");
  }
  if (window.location.pathname === "/popular") {
    document.querySelector(".SidebarTopItem.Popular").classList.add("active");
  }
  if (window.location.pathname === "/all") {
    document.querySelector(".SidebarTopItem.All").classList.add("active");
  }
};

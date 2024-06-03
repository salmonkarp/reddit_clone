import { useState } from "react";
import "./Searchbar.css";
import SearchIcon from "./search-svgrepo-com.svg";

function Searchbar() {
  const [searchInput, setSearchInput] = useState("");
  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  return (
    <div className="Searchbar">
      <img src={SearchIcon} alt="Search" className="SearchIcon" />
      <input
        type="text"
        placeholder="Search Reddit"
        onChange={handleChange}
        value={searchInput}
        className="SearchInput"
      />
    </div>
  );
}

export default Searchbar;

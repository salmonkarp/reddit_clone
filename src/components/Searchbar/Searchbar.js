import { useState } from "react";
import "./Searchbar.css";

function Searchbar() {
  const [searchInput, setSearchInput] = useState("");
  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  return (
    <div className="Searchbar">
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

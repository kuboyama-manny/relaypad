import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotebookSearch = ({
  changeSearchQuery,
  removeSearchQuery,
  searchQuery
}) => (
  <div id="sidebarSearchContainer">
    <span className="search-icon">
      <FontAwesomeIcon icon={["fal", "search"]} fixedWidth />
    </span>
    <input
      className="form-control"
      id="sidebarSearch"
      onChange={event => changeSearchQuery(event.target.value)}
      placeholder="Search"
      type="search"
      value={searchQuery}
    />
    {searchQuery && (
      <span className="clear-search-icon">
        <FontAwesomeIcon
          onClick={event => removeSearchQuery()}
          icon={["fal", "times-circle"]}
          fixedWidth
        />
      </span>
    )}
  </div>
);

NotebookSearch.propTypes = {
  changeSearchQuery: PropTypes.func.isRequired,
  removeSearchQuery: PropTypes.func.isRequired,
  searchQuery: PropTypes.string
};

NotebookSearch.defaultProps = {
  searchQuery: ""
};

export default NotebookSearch;

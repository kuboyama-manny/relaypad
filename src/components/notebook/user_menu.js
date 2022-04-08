import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Avatar from "../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import displayName from "../utils/display_name";

const UserMenu = ({ changeProfileModalUser, currentMember }) => (
  <div id="sidebarUserMenu" className="dropup">
    <Link
      to="/profile"
      className="dropdown-toggle"
      id="userDropdownToggle"
      data-toggle="dropdown"
      role="button"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <Avatar
        publicId={currentMember.avatar_photo_id}
        firstName={currentMember.first_name}
        lastName={currentMember.last_name}
        sizingCSS="30"
      />{" "}
      <span className="user-name">{displayName(currentMember)}</span>
    </Link>
    <div className="dropdown-menu">
      <Link
        to="#"
        onClick={event => changeProfileModalUser(currentMember.username)}
        data-toggle="modal"
        data-target="#profileModal"
        className="dropdown-item"
      >
        <FontAwesomeIcon icon={["fal", "user-circle"]} fixedWidth />
        Profile
      </Link>

      {/* <Link to="/notifications" className="dropdown-item">
        <FontAwesomeIcon icon={["fal", "bell"]} fixedWidth />
        Notifications
      </Link>

      <Link to="/settings" className="dropdown-item">
        <FontAwesomeIcon icon={["fal", "cogs"]} fixedWidth />
        Settings
      </Link> */}

      <Link to="/support/guidebook" className="dropdown-item">
        <FontAwesomeIcon icon={["fal", "question-circle"]} fixedWidth />
        Help
      </Link>

      <Link to="/signout" className="dropdown-item">
        <FontAwesomeIcon icon={["fal", "sign-out"]} fixedWidth />
        Sign Out
      </Link>
    </div>
  </div>
);

UserMenu.propTypes = {
  changeProfileModalUser: PropTypes.func.isRequired,
  currentMember: PropTypes.object.isRequired
};

export default UserMenu;

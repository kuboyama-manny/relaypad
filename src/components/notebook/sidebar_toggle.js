import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SidebarToggle = ({ toggleSidebar, tooltipText }) => (
  <div className="sidebar-toggle-btn" onClick={e => toggleSidebar()}>
    <FontAwesomeIcon
      icon={["fal", "bars"]}
      fixedWidth
      title={tooltipText}
      data-tip={tooltipText}
    />
  </div>
);

SidebarToggle.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  tooltipText: PropTypes.string
};

SidebarToggle.defaultProps = {
  tooltipText: "Toggle sidebar"
};

export default SidebarToggle;

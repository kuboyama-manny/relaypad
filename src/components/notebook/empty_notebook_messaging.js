import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import isMobile from "../utils/mobile_check";
import SidebarToggle from "./sidebar_toggle";

class EmptyNotebookMsg extends PureComponent {
  constructor(props) {
    super(props);
    this.getIconName = this.getIconName.bind(this);
    this.getMsg = this.getMsg.bind(this);
  }

  getIconName = activeNotebookSection => {
    switch (activeNotebookSection) {
      case "starred":
        return "star";
      case "team":
        return "books";
      case "member":
        return "file-alt";
      default:
        return "file-alt";
    }
  };

  getMsg = (activeNotebookSection, teamName = "") => {
    switch (activeNotebookSection) {
      case "starred":
        return "You haven’t starred any notes yet.";
      case "team":
        return (
          "No notes have been shared with " +
          (this.props.currentMember.team.name
            ? this.props.currentMember.team.name
            : "your team") +
          " yet."
        );
      case "member":
        return "You haven’t created any notes yet.";
      default:
        return "No notes";
    }
  };
  render() {
    return (
      <div id="emptyNotebookNoteMessage">
        {!isMobile() &&
          this.props.hideSidebar && (
            <SidebarToggle
              toggleSidebar={this.props.toggleSidebar}
              tooltipText="Show sidebar"
            />
          )}
        <FontAwesomeIcon
          icon={["fal", this.getIconName(this.props.activeNotebookSection)]}
          fixedWidth
        />
        {this.getMsg(
          this.props.activeNotebookSection,
          this.props.currentMember.team.name
        )}
      </div>
    );
  }
}

export default EmptyNotebookMsg;

EmptyNotebookMsg.propTypes = {
  activeNotebookSection: PropTypes.string.isRequired,
  currentMember: PropTypes.object.isRequired,
  hideSidebar: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired
};

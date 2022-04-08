import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import buildNoteURL from "../utils/build_note_url";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icon_square from "../../img/logos/icon_square.svg";
import isMobile from "../utils/mobile_check";
import SidebarToggle from "./sidebar_toggle";
import TagList from "./nav_tag_list";
import UserMenu from "./user_menu";
import Variables from "../../variables";
import AddToSlack from "../utils/add_to_slack";

const getBrandIcon = (publicId, sizingCSS) => {
  return `${
    Variables.CLOUDINARY_SERVING_URL_PREFIX
  }/c_thumb,h_${sizingCSS},w_${sizingCSS}/${publicId} 1x, ${
    Variables.CLOUDINARY_SERVING_URL_PREFIX
  }/c_thumb,h_${sizingCSS * 2},w_${sizingCSS * 2}/${publicId} 2x, ${
    Variables.CLOUDINARY_SERVING_URL_PREFIX
  }/c_thumb,h_${sizingCSS * 3},w_${sizingCSS * 3}/${publicId} 3x, ${
    Variables.CLOUDINARY_SERVING_URL_PREFIX
  }/c_thumb,h_${sizingCSS * 4},w_${sizingCSS * 4}/${publicId} 4x`;
};

class NotebookNav extends Component {
  constructor(props) {
    super(props);
    this.toggleTagList = this.toggleTagList.bind(this);
    this.state = {
      showTags: false
    };
  }

  toggleTagList = event => {
    event.preventDefault();
    this.setState((prevState, props) => {
      return { showTags: !prevState.showTags };
    });
  };

  render() {
    const {
      activeNotebookSection,
      activeTagFilter,
      changeNotebook,
      changeProfileModalUser,
      currentMember,
      hideSidebar,
      loadNewNoteEditor,
      mobileView,
      notebookTags,
      setTagFilter,
      toggleSidebar
    } = this.props;
    return (
      <div
        id="notebookNav"
        className={classnames(
          ((isMobile() && mobileView !== "nav") || hideSidebar) && "hidden",
          !isMobile() && "col-2"
        )}
      >
        <div id="navUpperSection">
          <div className="team-branding">
            <div>
              <img
                src={
                  currentMember.team.logo_id
                    ? Variables.CLOUDINARY_SERVING_URL_PREFIX +
                      "/c_thumb,h_30,w_30/" +
                      currentMember.team.logo_id
                    : icon_square
                }
                srcSet={
                  currentMember.team.logo_id &&
                  getBrandIcon(currentMember.team.logo_id, 30)
                }
                className="img-circle user-photo-icon-30"
                alt=""
              />
              {currentMember.team.name}
            </div>
            {!isMobile() && (
              <SidebarToggle
                toggleSidebar={toggleSidebar}
                tooltipText="Hide sidebar"
              />
            )}
          </div>
          <ul id="sidebarNav">
            <li className="new-note">
              <Link
                to={buildNoteURL(currentMember.team.slug, "new")}
                className="btn btn-sm btn-primary btn-block btn-new-note"
                onClick={e => loadNewNoteEditor()}
              >
                <FontAwesomeIcon icon={["fal", "pencil-alt"]} fixedWidth />
                New Note
              </Link>
            </li>
            <li className={activeNotebookSection === "starred" ? "active" : ""}>
              <Link
                to={buildNoteURL(currentMember.team.slug, "starred")}
                onClick={e =>
                  activeNotebookSection === "starred"
                    ? e.preventDefault()
                    : changeNotebook("starred")
                }
              >
                <FontAwesomeIcon
                  icon={[
                    activeNotebookSection === "starred" ? "fas" : "fal",
                    "star"
                  ]}
                  fixedWidth
                />
                Starred
              </Link>
            </li>
            <li className={activeNotebookSection === "member" ? "active" : ""}>
              <Link
                to={buildNoteURL(
                  currentMember.team.slug,
                  currentMember.username
                )}
                onClick={e =>
                  activeNotebookSection === "member"
                    ? e.preventDefault()
                    : changeNotebook("member")
                }
              >
                <FontAwesomeIcon
                  icon={[
                    activeNotebookSection === "member" ? "fas" : "fal",
                    "file-alt"
                  ]}
                  fixedWidth
                />
                Your Notes
              </Link>
            </li>
            <li className={activeNotebookSection === "team" ? "active" : ""}>
              <Link
                to={buildNoteURL(currentMember.team.slug, "team")}
                onClick={e =>
                  activeNotebookSection === "team"
                    ? e.preventDefault()
                    : changeNotebook("team")
                }
              >
                <FontAwesomeIcon
                  icon={[
                    activeNotebookSection === "team" ? "fas" : "fal",
                    "books"
                  ]}
                  fixedWidth
                />
                Team Library
              </Link>
            </li>
            <li id="navTagsMenu">
              <Link to="#" onClick={e => this.toggleTagList(e)}>
                <FontAwesomeIcon
                  className="caret"
                  icon={[
                    "fal",
                    this.state.showTags ? "angle-down" : "angle-right"
                  ]}
                  fixedWidth
                />
                <FontAwesomeIcon icon={["fal", "tags"]} fixedWidth />
                Tags
              </Link>
              {this.state.showTags && (
                <TagList
                  activeTagFilter={activeTagFilter}
                  notebookTags={notebookTags}
                  setTagFilter={setTagFilter}
                />
              )}
            </li>
          </ul>
        </div>
        <div id="navLowerSection">
          {!currentMember.team.slack_integrated && <AddToSlack />}
          <UserMenu
            changeProfileModalUser={changeProfileModalUser}
            currentMember={currentMember}
          />
        </div>
      </div>
    );
  }
}

NotebookNav.propTypes = {
  activeNotebookSection: PropTypes.string,
  activeTagFilter: PropTypes.string,
  changeNotebook: PropTypes.func.isRequired,
  changeProfileModalUser: PropTypes.func.isRequired,
  currentMember: PropTypes.object.isRequired,
  hideSidebar: PropTypes.bool.isRequired,
  loadNewNoteEditor: PropTypes.func.isRequired,
  mobileView: PropTypes.string,
  notebookTags: PropTypes.array.isRequired,
  setTagFilter: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired
};

NotebookNav.defaultProps = {
  activeNotebookSection: "",
  activeTagFilter: "",
  mobileView: ""
};

export default NotebookNav;

import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import includes from "lodash/includes";
import isMobile from "../utils/mobile_check";
import { Link } from "react-router-dom";
import NotebookSearch from "./notebook_search.js";
import NotePreview from "./sidebar_note_preview";

class NotebookList extends Component {
  constructor(props) {
    super(props);
    this.listMobileHeadline = this.listMobileHeadline.bind(this);
    this.getFilteredListCount = this.getFilteredListCount.bind(this);
    this.emptyNotebookMsg = this.emptyNotebookMsg.bind(this);
  }

  listMobileHeadline(activeNotebookSection) {
    switch (activeNotebookSection) {
      case "starred":
        return "Starred Notes";
      case "member":
        return "Your Notes";
      case "team":
        return "Team Library";
      case "notifications":
        return "Notifications";
      default:
        return "Notes";
    }
  }

  getFilteredListCount(notes, filteredNotes, searchQuery) {
    let count = 0;
    notes.map(note => {
      return !filteredNotes || includes(filteredNotes, note.slug)
        ? count++
        : null;
    });
    return searchQuery
      ? count === 1
        ? `1 match for “${searchQuery}”`
        : `${count} matches for “${searchQuery}”`
      : count === 1
        ? `1 note`
        : `${count} notes`;
  }

  emptyNotebookMsg(activeNotebookSection) {
    switch (activeNotebookSection) {
      case "starred":
        return "You haven’t starred any notes yet.";
      case "member":
        return "No notes yet.";
      case "team":
        return "Your team hasn’t shared any notes yet.";
      case "notifications":
        return "No notifications right now.";
      default:
        return "No notes yet.";
    }
  }

  render() {
    const {
      activeNoteSlug,
      activeNotebookSection,
      activeTagFilter,
      activeTeamSlug,
      changeMobileView,
      changeNotebook,
      changeSearchQuery,
      currentMember,
      filteredNotes,
      hideSidebar,
      isNotebookBuilt,
      mobileView,
      notes,
      removeSearchQuery,
      searchQuery,
      setTagFilter,
      toggleBookmark
    } = this.props;

    return (
      <div
        id="notebookList"
        className={classnames(
          ((isMobile() && mobileView !== "list") || hideSidebar) && "hidden",
          !isMobile() && !hideSidebar && "col-3 d-flex flex-column"
        )}
      >
        {isMobile() && (
          <div id="mobileNavHeader" onClick={e => changeMobileView("nav")}>
            <div id="mobileNavBackBtn">
              <FontAwesomeIcon icon={["fal", "chevron-left"]} fixedWidth />
            </div>
            <h4>{this.listMobileHeadline(this.props.activeNotebookSection)}</h4>
          </div>
        )}
        <NotebookSearch
          changeSearchQuery={changeSearchQuery}
          removeSearchQuery={removeSearchQuery}
          searchQuery={searchQuery}
        />
        {activeTagFilter && (
          <div className="tag-filter-msg">
            <span>
              <span className="filter-tag-label">
                <FontAwesomeIcon icon={["fal", "tag"]} />
                {activeTagFilter.name}
              </span>{" "}
              in{" "}
              <div className="dropdown">
                <span
                  className="dropdown-toggle"
                  role="button"
                  id="notebookFilterLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.listMobileHeadline(this.props.activeNotebookSection)}
                </span>

                <span
                  className="dropdown-menu"
                  aria-labelledby="notebookFilterLink"
                >
                  <Link
                    to="#"
                    className="dropdown-item"
                    onClick={e => changeNotebook("starred")}
                  >
                    <FontAwesomeIcon icon={["fal", "star"]} fixedWidth />{" "}
                    Starred Notes
                  </Link>
                  <Link
                    to="#"
                    className="dropdown-item"
                    onClick={e => changeNotebook("member")}
                  >
                    <FontAwesomeIcon icon={["fal", "file-alt"]} fixedWidth />{" "}
                    Your Notes
                  </Link>
                  <Link
                    to="#"
                    className="dropdown-item"
                    onClick={e => changeNotebook("team")}
                  >
                    <FontAwesomeIcon icon={["fal", "books"]} fixedWidth /> Team
                    Library
                  </Link>
                </span>
              </div>
            </span>
            <FontAwesomeIcon
              className="clear-tag-filter"
              onClick={event => setTagFilter()}
              icon={["fal", "times-circle"]}
              fixedWidth
            />
          </div>
        )}
        <div id="sidebarEntries">
          {notes.map(function(note) {
            return !filteredNotes || includes(filteredNotes, note.slug) ? (
              <NotePreview
                activeTeamSlug={activeTeamSlug}
                currentMember={currentMember}
                activeNotebookSection={activeNotebookSection}
                isActive={activeNoteSlug === note.slug ? true : false}
                key={`sidebarList${note.id}`}
                note={note}
                toggleBookmark={toggleBookmark}
              />
            ) : null;
          })}
          {isNotebookBuilt &&
            (notes.length > 0 ? (
              <div id="noteCount">
                {this.getFilteredListCount(notes, filteredNotes, searchQuery)}
              </div>
            ) : (
              <div id="emptyNotebookMsg">
                {this.emptyNotebookMsg(this.props.activeNotebookSection)}
              </div>
            ))}
        </div>
      </div>
    );
  }
}

NotebookList.propTypes = {
  activeNotebookSection: PropTypes.string.isRequired,
  activeNoteSlug: PropTypes.string,
  activeTagFilter: PropTypes.object,
  activeTeamSlug: PropTypes.string.isRequired,
  changeMobileView: PropTypes.func.isRequired,
  changeNotebook: PropTypes.func.isRequired,
  changeSearchQuery: PropTypes.func.isRequired,
  currentMember: PropTypes.object.isRequired,
  filteredNotes: PropTypes.array,
  hideSidebar: PropTypes.bool.isRequired,
  isNotebookBuilt: PropTypes.bool.isRequired,
  mobileView: PropTypes.string,
  notes: PropTypes.array.isRequired,
  removeSearchQuery: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  setTagFilter: PropTypes.func.isRequired,
  toggleBookmark: PropTypes.func.isRequired
};

NotebookList.defaultProps = {
  activeNoteSlug: "",
  activeTagFilter: {},
  filteredNotes: [],
  mobileView: "",
  searchQuery: ""
};

export default NotebookList;

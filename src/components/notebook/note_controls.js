import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { downloadHTML } from "../editor/export_formats";
import readingStats from "../utils/reading_stats";
import isMobile from "../utils/mobile_check";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class NoteControls extends PureComponent {
  render() {
    const {
      activeNote,
      activeNotebookSection,
      changeMobileView,
      currentMember,
      editorPlainText,
      handlePublishClick,
      isNoteEditable,
      toggleBookmark
    } = this.props;
    return (
      <ul className="note-controls" data-test="component-note-controls">
        {/* Mobile back button*/}
        {isMobile() && (
          <li
            id="mobileNavBackBtn"
            onClick={e =>
              changeMobileView(
                "list",
                activeNotebookSection ? activeNotebookSection : "member"
              )
            }
          >
            <FontAwesomeIcon icon={["fal", "chevron-left"]} fixedWidth />
          </li>
        )}
        {/* Comment count */}
        {activeNote.status === "PUBLISHED" && (
          <li data-test="comment-count" id="commentCount">
            <span className="counter">{activeNote.comment_count}</span>
            <FontAwesomeIcon
              icon={["fal", "comment"]}
              title="Comments"
              data-tip="Comments"
            />
          </li>
        )}

        {/* Reaction count */}
        {activeNote.status === "PUBLISHED" && (
          <li data-test="reaction-count" id="reactionCount">
            <span className="counter">{activeNote.reaction_count}</span>
            <FontAwesomeIcon
              icon={["fal", "smile"]}
              title="Reactions"
              data-tip="Reactions"
            />
          </li>
        )}
        <li id="readStats">
          <FontAwesomeIcon
            icon={["fal", "tachometer-alt"]}
            title="Reactions"
            data-multiline="true"
            data-tip={readingStats(activeNote.title, editorPlainText)}
          />
        </li>
        {/* Toggle bookmark */}
        <li id="bookmarkToggle" className={!activeNote.slug ? "inactive" : ""}>
          <FontAwesomeIcon
            icon={[`${activeNote.bookmarked ? "fas" : "fal"}`, "star"]}
            onClick={e => {
              activeNote.slug && toggleBookmark(activeNote);
            }}
            title="Star this note"
            data-tip="Star this note"
          />
        </li>

        {/* Publish button */}
        {isNoteEditable && (
          <li id="publishToggle">
            {activeNote.status === "PUBLISHED" ? (
              <button
                className="btn btn-xs published share-action-button published"
                title="This note is viewable by your team"
                data-tip="This note is viewable by your team"
              >
                <FontAwesomeIcon icon={["fal", "books"]} /> Shared
              </button>
            ) : (
              <button
                className="btn btn-xs btn-default share-action-button"
                onClick={e => {
                  activeNote.slug && handlePublishClick();
                  this.publishButton.blur();
                }}
                ref={publishButton => {
                  this.publishButton = publishButton;
                }}
                title="Make this note viewable by your team"
                data-tip="Make this note viewable by your team"
              >
                <FontAwesomeIcon icon={["fal", "books"]} /> Share
              </button>
            )}
          </li>
        )}
        {/* Download note */}
        {!isMobile() && (
          <li>
            <FontAwesomeIcon
              icon={["fal", "download"]}
              fixedWidth
              title="Download this note (HTML)"
              data-tip="Download this note (HTML)"
              onClick={e => downloadHTML(activeNote, currentMember.team.slug)}
            />
          </li>
        )}

        {/* Delete button */}
        {activeNote.member.username === currentMember.username && (
          <li
            id="deleteButton"
            className={!activeNote.slug ? "inactive" : "delete"}
            data-test="delete-button"
          >
            {!activeNote.slug ? (
              <FontAwesomeIcon
                icon={["fal", "trash-alt"]}
                title="Delete this note"
                data-tip="Delete this note"
              />
            ) : (
              <FontAwesomeIcon
                data-target="#deleteModal"
                data-toggle="modal"
                icon={["fal", "trash-alt"]}
                title="Delete this note"
                data-tip="Delete this note"
              />
            )}
          </li>
        )}
      </ul>
    );
  }
}

NoteControls.propTypes = {
  activeNote: PropTypes.object.isRequired,
  activeNotebookSection: PropTypes.string,
  changeMobileView: PropTypes.func.isRequired,
  currentMember: PropTypes.object.isRequired,
  editorPlainText: PropTypes.string,
  handlePublishClick: PropTypes.func.isRequired,
  isNoteEditable: PropTypes.bool.isRequired,
  toggleBookmark: PropTypes.func.isRequired
};

NoteControls.defaultProps = {
  editorPlainText: ""
};

export default NoteControls;

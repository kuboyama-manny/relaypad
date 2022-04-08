import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import isMobile from "../utils/mobile_check";
import textSnippet from "../utils/text_snippet";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import relativeDate from "../utils/relativeDate";
import Avatar from "../avatar";
import displayName from "../utils/display_name";

let snippetLength = 900;
isMobile() && (snippetLength = 100);

const NotePreview = ({
  activeNotebookSection,
  activeTeamSlug,
  currentMember,
  isActive,
  note,
  toggleBookmark
}) => (
  <div className={classnames("note-preview", isActive && "active-note")}>
    <Link to={note.detail_uri} onClick={e => isActive && e.preventDefault()}>
      <div className="content-container">
        <div className="metadata-container">
          {activeNotebookSection !== "member" && (
            <Avatar
              publicId={note.member.avatar_photo_id}
              firstName={note.member.first_name}
              lastName={note.member.last_name}
              userName={note.member.username}
              sizingCSS="30"
            />
          )}
          <FontAwesomeIcon
            icon={[note.bookmarked ? "fas" : "fal", "star"]}
            fixedWidth
            className="starred-status"
            onClick={e => {
              note.slug && isActive && toggleBookmark(note);
            }}
          />
          {note.status === "PUBLISHED" &&
            activeNotebookSection !== "team" && (
              <FontAwesomeIcon
                icon={["fal", "books"]}
                fixedWidth
                className="library-status"
              />
            )}
        </div>
        <div className="content">
          {activeNotebookSection !== "member" && (
            <div className="byline">
              <span className="note-date">
                <time
                  dateTime={
                    activeNotebookSection === "team"
                      ? note.published_at
                      : note.updated_at
                  }
                  title={
                    activeNotebookSection === "team"
                      ? "Shared " + moment(note.published_at).format("llll")
                      : "Updated " + moment(note.updated_at).format("llll")
                  }
                >
                  {relativeDate(
                    activeNotebookSection === "team"
                      ? note.published_at
                      : note.updated_at
                  )}
                </time>
              </span>
              <span className="author">{displayName(note.member)}</span>
            </div>
          )}
          <h3>{note.title}</h3>
          <div
            className="post-snippet"
            dangerouslySetInnerHTML={{
              __html: textSnippet(note.content, snippetLength)
            }}
          />
          {note.tags.length > 0 && (
            <ul className="tags">
              {note.tags.map(tag => (
                <li className="tag" key={tag.id}>
                  <span>{tag.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Link>
  </div>
);

NotePreview.propTypes = {
  activeNotebookSection: PropTypes.string.isRequired,
  activeTeamSlug: PropTypes.string.isRequired,
  currentMember: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  note: PropTypes.object.isRequired,
  toggleBookmark: PropTypes.func.isRequired
};

NotePreview.defaultProps = {
  isActive: false
};

export default NotePreview;

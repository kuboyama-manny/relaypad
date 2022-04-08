import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Avatar from "../avatar";
import Reactions from "../reactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import displayName from "../utils/display_name";

const Comment = ({
  changeProfileModalUser,
  comment,
  currentMember,
  handleDelete,
  toggleCommentReaction
}) => {
  return (
    <div className="comment">
      <div className="comment-metadata">
        <Avatar
          publicId={comment.member.avatar_photo_id}
          firstName={comment.member.first_name}
          lastName={comment.member.last_name}
          userName={comment.member.username}
          sizingCSS="30"
        />
        <p className="author-byline">
          <Link
            to={comment.member.profile_uri}
            onClick={event => changeProfileModalUser(comment.member.username)}
            data-toggle="modal"
            data-target="#profileModal"
            className="username"
          >
            {displayName(comment.member)}
          </Link>
          <span className="comment-date">
            {moment(comment.created_at).format("MMMM D, YYYY")}
          </span>
        </p>
        {currentMember.id === comment.member.id ? (
          <span className="deleteComment">
            <FontAwesomeIcon
              className="comment-action"
              icon={["fal", "trash-alt"]}
              onClick={handleDelete(comment.id)}
            />
          </span>
        ) : (
          ""
        )}
      </div>
      <p
        className="comment-text"
        dangerouslySetInnerHTML={{
          __html: comment.content.replace(/(?:\r\n|\r|\n)/g, "<br />")
        }}
      />
      <Reactions content={comment} toggleReaction={toggleCommentReaction} />
    </div>
  );
};
Comment.propTypes = {
  changeProfileModalUser: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  currentMember: PropTypes.object.isRequired,
  handleDelete: PropTypes.func,
  toggleCommentReaction: PropTypes.func.isRequired
};

export default Comment;

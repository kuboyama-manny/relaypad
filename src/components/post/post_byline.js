import PropTypes from "prop-types";
import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Avatar from "../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import displayName from "../utils/display_name";

const PostByline = ({
  activeNotebookSection,
  changeProfileModalUser,
  editorStatus,
  post
}) => (
  <div className="user_passport">
    <Link
      to="#"
      onClick={event => changeProfileModalUser(post.member.username)}
      data-toggle="modal"
      data-target="#profileModal"
    >
      <Avatar
        publicId={post.member.avatar_photo_id}
        firstName={post.member.first_name}
        lastName={post.member.last_name}
        userName={post.member.username}
      />
    </Link>
    <div className="author-byline">
      <Link
        to="#"
        onClick={event => changeProfileModalUser(post.member.username)}
        data-toggle="modal"
        data-target="#profileModal"
        className="username"
      >
        {displayName(post.member)}
      </Link>
      {post.member.role && <span>{post.member.role}</span>}
      <span>
        {activeNotebookSection === "team"
          ? "Shared on " + moment(post.published_at).format("LL")
          : moment(post.updated_at).format("LL")}
        {editorStatus === "Pending changes" && (
          <FontAwesomeIcon
            icon={["fal", "cloud-upload"]}
            fixedWidth
            title={editorStatus}
            className="pending-changes"
          />
        )}
      </span>
    </div>
  </div>
);

PostByline.propTypes = {
  activeNotebookSection: PropTypes.string.isRequired,
  changeProfileModalUser: PropTypes.func.isRequired,
  editorStatus: PropTypes.string,
  post: PropTypes.object.isRequired
};

PostByline.defaultProps = {
  editStatus: ""
};

export default PostByline;

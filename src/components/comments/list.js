import PropTypes from "prop-types";
import React, { Component } from "react";
import Comment from "./comment";
import CommentForm from "./form";
import LoadingSpinner from "../utils/loading_spinner";
import sortBy from "lodash/sortBy";

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.handleDraftCommentChange = e => {
      this.props.changeDraftComment(e.target.value);
    };
    this.handleSubmit = comment => e => {
      e.preventDefault();
      this.props.submitComment(this.props.postSlug, comment);
    };
    this.handleDelete = comment_id => e => {
      e.preventDefault();
      this.props.deleteComment(this.props.postSlug, comment_id);
    };
  }

  render() {
    const {
      changeProfileModalUser,
      commentCount,
      comments,
      currentMember,
      draftComment,
      isLoading,
      toggleCommentReaction
    } = this.props;

    return (
      <div className="comments-container" id="comments">
        <h3>Discussion</h3>
        {!isLoading
          ? sortBy(comments, "created_at").map(
              comment =>
                comment && (
                  <Comment
                    changeProfileModalUser={changeProfileModalUser}
                    comment={comment}
                    currentMember={currentMember}
                    handleDelete={this.handleDelete}
                    toggleCommentReaction={toggleCommentReaction}
                    key={comment.id}
                  />
                )
            )
          : commentCount > 0 && <LoadingSpinner />}
        <CommentForm
          draftComment={draftComment}
          handleDraftCommentChange={this.handleDraftCommentChange}
          submitComment={this.handleSubmit}
        />
      </div>
    );
  }
}

CommentList.propTypes = {
  changeDraftComment: PropTypes.func.isRequired,
  changeProfileModalUser: PropTypes.func.isRequired,
  commentCount: PropTypes.number,
  comments: PropTypes.array.isRequired,
  currentMember: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  draftComment: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  postSlug: PropTypes.string.isRequired,
  submitComment: PropTypes.func.isRequired,
  toggleCommentReaction: PropTypes.func.isRequired
};
CommentList.defaultProps = {
  commentCount: 0
};

export default CommentList;

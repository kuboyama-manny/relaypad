import PropTypes from "prop-types";
import React from "react";

function CommentForm(props) {
  return (
    <form>
      <div className="form-group">
        <textarea
          className="form-control"
          value={props.draftComment}
          placeholder="Leave a comment"
          onChange={props.handleDraftCommentChange}
          rows="5"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={props.draftComment ? "" : "disabled"}
        onClick={props.submitComment(props.draftComment)}
      >
        Comment
      </button>
    </form>
  );
}

CommentForm.propTypes = {
  draftComment: PropTypes.string,
  handleDraftCommentChange: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired
};

export default CommentForm;

import keyMirror from "keymirror";
import forEach from "lodash/forEach";

import api_agent from "../api_agent";

export const ActionTypes = keyMirror({
  POST_LOAD_COMMENTS: null,
  POST_COMMENT_DRAFT_CHANGE: null,
  POST_COMMENT_SUBMIT: null,
  POST_COMMENT_DELETE: null,
  REACT_TO_POST: null,
  REACT_TO_COMMENT: null
});

const _createCommentDraftChangeAction = content => ({
  type: ActionTypes.POST_COMMENT_DRAFT_CHANGE,
  content
});

const _createCommentSubmitAction = (post_slug, content) => ({
  type: ActionTypes.POST_COMMENT_SUBMIT,
  slug: post_slug,
  payload: api_agent.Post.create_comment(post_slug, content)
});

const _createCommentDeleteAction = (post_slug, comment_id) => ({
  type: ActionTypes.POST_COMMENT_DELETE,
  id: comment_id,
  slug: post_slug,
  payload: api_agent.Comment.delete_comment(comment_id)
});

const _createTogglePostReactionAction = (
  post,
  reactionType,
  isCurrentMemberReaction
) => ({
  type: ActionTypes.REACT_TO_POST,
  slug: post.slug,
  reaction_type: reactionType,
  payload: isCurrentMemberReaction
    ? api_agent.Post.delete_reaction(post.slug, reactionType)
    : api_agent.Post.create_reaction(post.slug, reactionType)
});

const _createToggleCommentReactionAction = (
  comment,
  reactionType,
  isCurrentMemberReaction
) => ({
  type: ActionTypes.REACT_TO_COMMENT,
  id: comment.id,
  reaction_type: reactionType,
  payload: isCurrentMemberReaction
    ? api_agent.Comment.delete_reaction(comment.id, reactionType)
    : api_agent.Comment.create_reaction(comment.id, reactionType)
});

const _isCurrentMemberReaction = (content, reactionType) => {
  let currentMemberReaction = false;
  forEach(content.reactions, function(reaction) {
    if (reactionType === reaction.type) {
      currentMemberReaction = reaction.current_member_reaction;
    }
  });
  return currentMemberReaction;
};

export const changeDraftComment = content => dispatch => {
  dispatch(_createCommentDraftChangeAction(content));
};

export const submitComment = (post_slug, comment) => dispatch => {
  dispatch(_createCommentSubmitAction(post_slug, comment));
};

export const deleteComment = (post_slug, comment_id) => dispatch => {
  dispatch(_createCommentDeleteAction(post_slug, comment_id));
};

export const togglePostReaction = (post, reactionType) => dispatch => {
  dispatch(
    _createTogglePostReactionAction(
      post,
      reactionType,
      _isCurrentMemberReaction(post, reactionType)
    )
  );
};

export const toggleCommentReaction = (comment, reactionType) => dispatch => {
  dispatch(
    _createToggleCommentReactionAction(
      comment,
      reactionType,
      _isCurrentMemberReaction(comment, reactionType)
    )
  );
};

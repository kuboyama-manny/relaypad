import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import classnames from "classnames";
import {
  addTag,
  autoSaveNote,
  changeDraftComment,
  changeMobileView,
  changeSelectedTagSuggestion,
  deleteComment,
  deleteNote,
  handleContentChange,
  handleTagInputChange,
  handleTitleChange,
  loadComments,
  publishNote,
  removeTag,
  submitComment,
  toggleSidebar,
  toggleTagInput,
  unloadNoteEditor
} from "../actions/notebook_actions";
import { getComments } from "../reducers/notebook_reducer";
import {
  togglePostReaction,
  toggleCommentReaction
} from "../actions/post_actions";
import NotebookNote from "../components/notebook/notebook_note";
import { toggleBookmark } from "../actions/common_actions";
import isMobile from "../components/utils/mobile_check";

class NoteContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.activeNote.comment_count &&
      nextProps.notebookContent.commentIds.length !==
        nextProps.activeNote.comment_count &&
      !nextProps.notebookStatus.isCommentsLoading
    ) {
      // load comments if needed
      this.props.loadComments(nextProps.activeNote.slug, 0);
    }
  }

  render() {
    const {
      activeNote,
      activeNoteComments,
      addTag,
      autoSaveNote,
      changeDraftComment,
      changeMobileView,
      changeProfileModalUser,
      changeSelectedTagSuggestion,
      currentMember,
      deleteComment,
      deleteNote,
      draftComment,
      handleContentChange,
      handleTagInputChange,
      handleTitleChange,
      notebookContent,
      notebookStatus,
      publishNote,
      removeTag,
      setTagFilter,
      submitComment,
      teamTags,
      toggleBookmark,
      toggleCommentReaction,
      togglePostReaction,
      toggleSidebar,
      toggleTagInput,
      unloadNoteEditor
    } = this.props;
    return (
      <div
        id="notebookContent"
        className={classnames(
          !isMobile() && !notebookStatus.hideSidebar && "col-7",
          !isMobile() && notebookStatus.hideSidebar && "hidden-sidebars",
          isMobile() && notebookStatus.mobileView !== "content" && "hidden"
        )}
      >
        <Helmet>
          <title>{activeNote.title && activeNote.title + " • RelayPad"}</title>
        </Helmet>
        <NotebookNote
          activeNote={activeNote}
          activeNoteComments={activeNoteComments}
          addTag={addTag}
          autoSaveNote={autoSaveNote}
          changeDraftComment={changeDraftComment}
          changeMobileView={changeMobileView}
          changeProfileModalUser={changeProfileModalUser}
          changeSelectedTagSuggestion={changeSelectedTagSuggestion}
          currentMember={currentMember}
          deleteComment={deleteComment}
          deleteNote={deleteNote}
          draftComment={draftComment}
          handleContentChange={handleContentChange}
          handleTagInputChange={handleTagInputChange}
          handleTitleChange={handleTitleChange}
          notebookContent={notebookContent}
          notebookStatus={notebookStatus}
          publishNote={publishNote}
          removeTag={removeTag}
          setTagFilter={setTagFilter}
          submitComment={submitComment}
          teamTags={teamTags}
          toggleBookmark={toggleBookmark}
          toggleCommentReaction={toggleCommentReaction}
          togglePostReaction={togglePostReaction}
          toggleSidebar={toggleSidebar}
          toggleTagInput={toggleTagInput}
          unloadNoteEditor={unloadNoteEditor}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addTag: (tagName, teamTags, note_slug) =>
    dispatch(addTag(tagName, teamTags, note_slug)),
  autoSaveNote: activeNote => dispatch(autoSaveNote(activeNote)),
  changeDraftComment: content => dispatch(changeDraftComment(content)),
  changeMobileView: (view, notebook) =>
    dispatch(changeMobileView(view, notebook)),
  changeSelectedTagSuggestion: (keyDirection, suggestedTags, selectedTagSlug) =>
    dispatch(
      changeSelectedTagSuggestion(keyDirection, suggestedTags, selectedTagSlug)
    ),
  deleteComment: (note_slug, comment_id) =>
    dispatch(deleteComment(note_slug, comment_id)),
  deleteNote: note => dispatch(deleteNote(note)),
  handleContentChange: () => dispatch(handleContentChange()),
  handleTagInputChange: (value, teamTags, noteTags) =>
    dispatch(handleTagInputChange(value, teamTags, noteTags)),
  handleTitleChange: (note_slug, title) =>
    dispatch(handleTitleChange(note_slug, title)),
  loadComments: note_slug => dispatch(loadComments(note_slug)),
  publishNote: note => dispatch(publishNote(note)),
  removeTag: (tag, note_slug) => dispatch(removeTag(tag, note_slug)),
  submitComment: (note_slug, comment) =>
    dispatch(submitComment(note_slug, comment)),
  toggleBookmark: activeNote => dispatch(toggleBookmark(activeNote)),
  toggleCommentReaction: (note_slug, reactionType) =>
    dispatch(toggleCommentReaction(note_slug, reactionType)),
  togglePostReaction: (note_slug, reactionType) =>
    dispatch(togglePostReaction(note_slug, reactionType)),
  toggleTagInput: () => dispatch(toggleTagInput()),
  toggleSidebar: () => dispatch(toggleSidebar()),
  unloadNoteEditor: () => dispatch(unloadNoteEditor())
});

const mapStateToProps = state => ({
  // NOTE: activeNote.member and activeNote.tags need to be populated from entities.
  activeNote: {
    ...state.entities.posts[state.notebook.status.activeNoteSlug],
    member:
      state.notebook.status.activeNoteSlug &&
      state.entities.members[
        state.entities.posts[state.notebook.status.activeNoteSlug].member
      ],
    tags:
      state.entities.posts[state.notebook.status.activeNoteSlug] &&
      state.entities.posts[state.notebook.status.activeNoteSlug].tags.map(
        tag => state.entities.tags[`${tag}`]
      )
  },
  activeNoteComments: getComments(state),
  draftComment: state.notebook.content.draftComment
});

NoteContainer.propTypes = {
  activeNote: PropTypes.object,
  addTag: PropTypes.func.isRequired,
  autoSaveNote: PropTypes.func.isRequired,
  changeDraftComment: PropTypes.func.isRequired,
  changeMobileView: PropTypes.func.isRequired,
  changeProfileModalUser: PropTypes.func.isRequired,
  changeSelectedTagSuggestion: PropTypes.func.isRequired,
  currentMember: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  draftComment: PropTypes.string.isRequired,
  handleContentChange: PropTypes.func.isRequired,
  handleTagInputChange: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  loadComments: PropTypes.func.isRequired,
  notebookContent: PropTypes.object.isRequired,
  notebookStatus: PropTypes.object.isRequired,
  publishNote: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  setTagFilter: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
  teamTags: PropTypes.array.isRequired,
  toggleBookmark: PropTypes.func.isRequired,
  toggleCommentReaction: PropTypes.func.isRequired,
  togglePostReaction: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleTagInput: PropTypes.func.isRequired,
  unloadNoteEditor: PropTypes.func.isRequired
};

NoteContainer.defaultProps = {
  activeNote: {
    bookmarked: false,
    comment_count: null,
    commentIds: [],
    content: "",
    created_at: null,
    detail_uri: null,
    edit_uri: null,
    member: null,
    published_at: null,
    reaction_count: null,
    reactions: {},
    slug: null,
    status: "",
    tags: [],
    title: null,
    updated_at: Date.now()
  },
  activeNoteAuthor: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteContainer);

import keyMirror from "keymirror";
import api_agent from "../api_agent";
import * as schema from "../middleware/schema";

export const ActionTypes = keyMirror({
  NOTE_COMMENT_DELETE: null,
  NOTE_COMMENT_DRAFT_CHANGE: null,
  NOTE_COMMENT_SUBMIT: null,
  NOTE_COMMENTS_LOAD: null,
  NOTE_EDITOR_CHANGE_NOTE: null,
  NOTE_EDITOR_CONTENT_CHANGE: null,
  NOTE_EDITOR_CREATE_NEW: null,
  NOTE_EDITOR_DELETE: null,
  NOTE_EDITOR_LOAD_NEW: null,
  NOTE_EDITOR_PUBLISH: null,
  NOTE_EDITOR_SAVE_NOTE: null,
  NOTE_EDITOR_SKIP_SAVE: null,
  NOTE_EDITOR_TITLE_CHANGE: null,
  NOTE_EDITOR_UNLOAD: null,
  NOTE_TAG_ADD_EXISTING: null,
  NOTE_TAG_ADD_NEW: null,
  NOTE_TAG_CHANGE_SELECTED_SUGGESTION: null,
  NOTE_TAG_INPUT_CHANGE: null,
  NOTE_TAG_REMOVAL: null,
  NOTE_TAG_TOGGLE_INPUT: null,
  NOTEBOOK_BUILD_STARRED: null,
  NOTEBOOK_CHANGE: null,
  NOTEBOOK_CHANGE_MOBILE_VIEW: null,
  NOTEBOOK_INITIALIZE: null,
  NOTEBOOK_LOAD_MEMBER_NOTES: null,
  NOTEBOOK_LOAD_TEAM_NOTES: null,
  NOTEBOOK_SEARCH_CHANGE_QUERY: null,
  NOTEBOOK_SEARCH_REMOVE_QUERY: null,
  NOTEBOOK_SET_TAG_FILTER: null,
  NOTEBOOK_TOGGLE_SIDEBAR: null,
  NOTEBOOK_UNLOAD: null,
  PROFILE_MODAL_USER_CHANGE: null
});
let page_size = 50;

const _createContentChangeAction = () => ({
  type: ActionTypes.NOTE_EDITOR_CONTENT_CHANGE
});

const _createCreateNoteAction = note => ({
  type: ActionTypes.NOTE_EDITOR_CREATE_NEW,
  payload: api_agent.Post.create(note)
});

const _createChangeNoteAction = newNoteSlug => ({
  type: ActionTypes.NOTE_EDITOR_CHANGE_NOTE,
  noteSlug: newNoteSlug
});

const _createBuildStarredNotebook = notes => ({
  type: ActionTypes.NOTEBOOK_BUILD_STARRED,
  notes: notes
});

const _createChangeNotebookAction = newNotebook => ({
  type: ActionTypes.NOTEBOOK_CHANGE,
  notebook: newNotebook
});

const _createMobileViewChangeAction = (view, notebook = "member") => ({
  type: ActionTypes.NOTEBOOK_CHANGE_MOBILE_VIEW,
  notebook: notebook,
  view: view
});

const _createSearchQueryChangeAction = query => ({
  type: ActionTypes.NOTEBOOK_SEARCH_CHANGE_QUERY,
  query: query
});

const _createSearchQueryRemoveAction = () => ({
  type: ActionTypes.NOTEBOOK_SEARCH_REMOVE_QUERY
});

const _createChangeSelectedTagSuggestionAction = tagSlug => ({
  type: ActionTypes.NOTE_TAG_CHANGE_SELECTED_SUGGESTION,
  tagSlug
});

const _createDeleteNoteAction = note => ({
  type: ActionTypes.NOTE_EDITOR_DELETE,
  payload: api_agent.Post.update(note)
});

const _createInitializeNotebookAction = newNotebookSection => ({
  type: ActionTypes.NOTEBOOK_INITIALIZE,
  notebook: newNotebookSection
});

const _createLoadMemberNotesAction = offset => ({
  type: ActionTypes.NOTEBOOK_LOAD_MEMBER_NOTES,
  payload: api_agent.Notes.list(offset, page_size),
  offset,
  schema: schema.arrayOfPosts
});

const _createLoadTeamPublishedNotesAction = offset => ({
  type: ActionTypes.NOTEBOOK_LOAD_TEAM_NOTES,
  payload: api_agent.Feed.latest(offset, page_size),
  offset,
  schema: schema.arrayOfPosts
});

const _createNewNoteEditorAction = () => ({
  type: ActionTypes.NOTE_EDITOR_LOAD_NEW
});

const _createNoteCommentsLoadAction = (note_slug, offset) => ({
  type: ActionTypes.NOTE_COMMENTS_LOAD,
  payload: api_agent.Post.get_comments(note_slug, offset, page_size),
  schema: schema.arrayOfComments
});

const _createPublishNoteAction = note => ({
  type: ActionTypes.NOTE_EDITOR_PUBLISH,
  payload: api_agent.Post.update(note)
});

const _createSaveNoteAction = note => ({
  type: ActionTypes.NOTE_EDITOR_SAVE_NOTE,
  payload: api_agent.Post.save(note)
});

const _createSetTagFilter = tag_slug => ({
  type: ActionTypes.NOTEBOOK_SET_TAG_FILTER,
  tag_slug: tag_slug
});

const _createSkipThisSaveAction = () => ({
  type: ActionTypes.NOTE_EDITOR_SKIP_SAVE
});

const _createTagAddExistingAction = (tag, note_slug) => ({
  type: ActionTypes.NOTE_TAG_ADD_EXISTING,
  tag: tag,
  note_slug: note_slug
});

const _createTagAddNewAction = (tagName, note_slug) => ({
  type: ActionTypes.NOTE_TAG_ADD_NEW,
  payload: api_agent.Tags.create(tagName),
  note_slug: note_slug
});

const _createTagInputChangeAction = (value, availableTags, noteTags) => ({
  type: ActionTypes.NOTE_TAG_INPUT_CHANGE,
  availableTags,
  noteTags,
  value
});

const _createTagRemovalAction = (tag, note_slug) => ({
  type: ActionTypes.NOTE_TAG_REMOVAL,
  tag: tag,
  note_slug: note_slug
});

const _createTagToggleInputAction = () => ({
  type: ActionTypes.NOTE_TAG_TOGGLE_INPUT
});

const _createTitleChangeAction = (note_slug, title) => ({
  type: ActionTypes.NOTE_EDITOR_TITLE_CHANGE,
  note_slug: note_slug,
  title: title
});

const _createToggleSidebarAction = () => ({
  type: ActionTypes.NOTEBOOK_TOGGLE_SIDEBAR
});

const _createUnloadNotebookAction = () => ({
  type: ActionTypes.NOTEBOOK_UNLOAD
});

const _createUnloadNoteEditorAction = () => ({
  type: ActionTypes.NOTE_EDITOR_UNLOAD
});

const _createCommentDraftChangeAction = content => ({
  type: ActionTypes.NOTE_COMMENT_DRAFT_CHANGE,
  content
});

const _createCommentSubmitAction = (note_slug, content) => ({
  type: ActionTypes.NOTE_COMMENT_SUBMIT,
  slug: note_slug,
  payload: api_agent.Post.create_comment(note_slug, content)
});

const _createCommentDeleteAction = (note_slug, comment_id) => ({
  type: ActionTypes.NOTE_COMMENT_DELETE,
  id: comment_id,
  slug: note_slug,
  payload: api_agent.Comment.delete_comment(comment_id)
});

const _createChangeProfileModalUserAction = username => ({
  type: ActionTypes.PROFILE_MODAL_USER_CHANGE,
  username: username
});

export const addTag = (tagName, teamTags, note_slug) => dispatch => {
  let index = teamTags.findIndex(
    x => x.name.toLowerCase() === tagName.toLowerCase()
  );
  if (index !== -1) {
    // User entered existing tag, just add to post.
    dispatch(_createTagAddExistingAction(teamTags[index], note_slug));
  } else {
    // User asked to create new tag, dispatch async action to create tag.
    dispatch(_createTagAddNewAction(tagName, note_slug));
  }
};

export const autoSaveNote = note => dispatch => {
  if (note && (note.title && note.content !== "<p></p>")) {
    // Notes need content and titles before anything is saved. Empty notes return "<p></p>" for content right now.
    note.slug
      ? dispatch(_createSaveNoteAction(note))
      : dispatch(_createCreateNoteAction(note));
  } else {
    dispatch(_createSkipThisSaveAction());
  }
};

export const changeNote = newNoteSlug => dispatch => {
  // Make sure the note column scrolls back up to the top of the screen when a new note loads. Not 100% sure this is the appropriate place for it, but it works…
  document.getElementById("notebookContent").scrollTo(0, 0);
  dispatch(_createChangeNoteAction(newNoteSlug));
};

export const buildStarredNotebook = notes => dispatch => {
  dispatch(_createBuildStarredNotebook(notes));
};

export const changeNotebook = newNotebook => dispatch => {
  // Make sure the list column scrolls back up to the top of the screen when a new notebook loads.
  document.getElementById("sidebarEntries").scrollTo(0, 0);
  dispatch(_createChangeNotebookAction(newNotebook));
};

export const changeSelectedTagSuggestion = (
  keyDirection,
  suggestedTags,
  selectedTagSlug
) => dispatch => {
  const UP = 38;
  const DOWN = 40;

  let index = suggestedTags.findIndex(tag => tag.slug === selectedTagSlug);
  if (
    (keyDirection === UP && index === -1) ||
    (keyDirection === UP && index === 0)
  ) {
    selectedTagSlug = suggestedTags[suggestedTags.length - 1].slug;
  } else if (keyDirection === UP) {
    selectedTagSlug = suggestedTags[index - 1].slug;
  } else if (keyDirection === DOWN && index === suggestedTags.length - 1) {
    selectedTagSlug = suggestedTags[0].slug;
  } else if (keyDirection === DOWN && index < suggestedTags.length - 1) {
    selectedTagSlug = suggestedTags[index + 1].slug;
  }
  dispatch(_createChangeSelectedTagSuggestionAction(selectedTagSlug));
};

export const deleteNote = note => dispatch => {
  note.status = "DELETED";
  dispatch(_createDeleteNoteAction(note));
};

export const handleContentChange = () => dispatch => {
  // Doesn't accept any content, here to set changePending status.
  dispatch(_createContentChangeAction());
};

export const handleTagInputChange = (
  value,
  availableTags,
  noteTags
) => dispatch => {
  dispatch(_createTagInputChangeAction(value, availableTags, noteTags));
};

export const toggleSidebar = () => dispatch => {
  dispatch(_createToggleSidebarAction());
};

export const toggleTagInput = () => dispatch => {
  dispatch(_createTagToggleInputAction());
};

export const handleTitleChange = (note_slug, title) => dispatch => {
  dispatch(_createTitleChangeAction(note_slug, title));
};

export const initializeNotebook = newNotebookSection => dispatch => {
  dispatch(_createInitializeNotebookAction(newNotebookSection));
};

export const loadNewNoteEditor = () => dispatch => {
  dispatch(_createNewNoteEditorAction());
};

export const loadComments = (noteSlug, offset) => dispatch => {
  dispatch(_createNoteCommentsLoadAction(noteSlug, offset));
};

export const loadMemberPrivateNotes = offset => dispatch => {
  dispatch(_createLoadMemberNotesAction(offset));
};
export const loadTeamPublishedNotes = offset => dispatch => {
  dispatch(_createLoadTeamPublishedNotesAction(offset));
};

export const publishNote = note => dispatch => {
  note.status = "PUBLISHED";
  dispatch(_createPublishNoteAction(note));
};

export const unloadNotebook = () => dispatch => {
  dispatch(_createUnloadNotebookAction());
};

export const unloadNoteEditor = () => dispatch => {
  dispatch(_createUnloadNoteEditorAction());
};

export const changeDraftComment = content => dispatch => {
  dispatch(_createCommentDraftChangeAction(content));
};

export const changeSearchQuery = query => dispatch => {
  dispatch(_createSearchQueryChangeAction(query));
};

export const changeMobileView = (view, notebook) => dispatch => {
  dispatch(_createMobileViewChangeAction(view, notebook));
};

export const removeSearchQuery = () => dispatch => {
  dispatch(_createSearchQueryRemoveAction());
};

export const removeTag = (tag, note_slug) => dispatch => {
  dispatch(_createTagRemovalAction(tag, note_slug));
};

export const setTagFilter = tag_slug => dispatch => {
  dispatch(_createSetTagFilter(tag_slug));
};

export const submitComment = (note_slug, comment) => dispatch => {
  dispatch(_createCommentSubmitAction(note_slug, comment));
};

export const deleteComment = (note_slug, comment_id) => dispatch => {
  dispatch(_createCommentDeleteAction(note_slug, comment_id));
};

export const changeProfileModalUser = username => dispatch => {
  dispatch(_createChangeProfileModalUserAction(username));
};

import { combineReducers } from "redux";
import { denormalize } from "normalizr";
import * as schema from "../middleware/schema";
import { ActionTypes } from "../actions/common_actions";
import { ActionTypes as NotebookActionTypes } from "../actions/notebook_actions";
import union from "lodash/union";

const defaultNotebookStatusState = {
  activeNotebookSection: "",
  activeNoteSlug: "",
  hideSidebar: false,
  isCommentsLoading: false,
  isEnteringTag: false,
  isMemberNotebookLoading: false,
  isNotebookBuilt: false, // all notebooks (member, team, starred) are loaded
  isNotebookLoading: false,
  isNoteChangePending: false,
  isNoteLoaded: false,
  isTeamNotebookLoading: false,
  memberNotebookSize: null,
  mobileView: "",
  persistenceAlert: null,
  profileModalUsername: null,
  showPublishConfirmation: false,
  teamNotebookSize: null
};

const status = (state = defaultNotebookStatusState, action) => {
  switch (action.type) {
    case ActionTypes.ASYNC_START:
      if (action.subtype === NotebookActionTypes.NOTEBOOK_LOAD_MEMBER_NOTES) {
        return {
          ...state,
          isMemberNotebookLoading: true
        };
      } else if (
        action.subtype === NotebookActionTypes.NOTEBOOK_LOAD_TEAM_NOTES
      ) {
        return {
          ...state,
          isTeamNotebookLoading: true
        };
      } else if (action.subtype === NotebookActionTypes.NOTE_COMMENTS_LOAD) {
        return { ...state, isCommentsLoading: true };
      } else if (action.subtype === NotebookActionTypes.NOTE_EDITOR_SAVE_NOTE) {
        return {
          ...state,
          persistenceAlert: "Saving…"
        };
      } else {
        return state;
      }
    case ActionTypes.TOGGLE_BOOKMARK:
      return action.payload && state.activeNotebookSection === "starred"
        ? {
            // remove activeNoteSlug if you unstar a note while in the starred notebook
            ...state,
            activeNoteSlug: ""
          }
        : {
            ...state
          };
    case NotebookActionTypes.NOTEBOOK_TOGGLE_SIDEBAR:
      return {
        ...state,
        hideSidebar: !state.hideSidebar
      };
    case NotebookActionTypes.NOTEBOOK_INITIALIZE:
      return {
        ...state,
        activeNotebookSection: action.notebook,
        activeNoteSlug: "",
        isNotebookBuilt: false,
        isNoteLoaded: false,
        persistenceAlert: null
      };
    case NotebookActionTypes.NOTEBOOK_BUILD_STARRED:
      return {
        ...state,
        isNotebookBuilt: true
      };
    case NotebookActionTypes.NOTEBOOK_CHANGE:
      return {
        ...state,
        activeNotebookSection: action.notebook,
        activeNoteSlug: "",
        isNoteLoaded: false,
        mobileView: "list",
        persistenceAlert: null
      };
    case NotebookActionTypes.NOTEBOOK_LOAD_MEMBER_NOTES:
      return {
        ...state,
        isMemberNotebookLoading: false,
        memberNotebookSize: action.payload.result.count
      };
    case NotebookActionTypes.NOTEBOOK_LOAD_TEAM_NOTES:
      return {
        ...state,
        isTeamNotebookLoading: false,
        teamNotebookSize: action.payload.result.count
      };
    case NotebookActionTypes.NOTEBOOK_SET_TAG_FILTER:
      return {
        ...state,
        mobileView: "list"
      };
    case NotebookActionTypes.NOTEBOOK_CHANGE_MOBILE_VIEW:
      return {
        ...state,
        activeNoteSlug: "",
        activeNotebookSection: action.notebook,
        mobileView: action.view
      };
    case NotebookActionTypes.NOTEBOOK_UNLOAD:
      return defaultNotebookStatusState;
    case NotebookActionTypes.NOTE_EDITOR_CHANGE_NOTE:
      return {
        ...state,
        activeNoteSlug: action.noteSlug ? action.noteSlug : "",
        isNoteLoaded: true,
        isTagsLoaded: false,
        mobileView: "content",
        persistenceAlert: null,
        showPublishConfirmation: false
      };
    case NotebookActionTypes.NOTE_COMMENTS_LOAD:
      return {
        ...state,
        isCommentsLoading: false
      };
    case NotebookActionTypes.NOTE_TAG_ADD_EXISTING:
    case NotebookActionTypes.NOTE_TAG_ADD_NEW:
    case NotebookActionTypes.NOTE_TAG_REMOVAL:
      return {
        ...state,
        isNoteChangePending: true,
        persistenceAlert: "Pending changes"
      };
    case NotebookActionTypes.NOTE_TAG_TOGGLE_INPUT:
      return {
        ...state,
        isEnteringTag: !state.isEnteringTag
      };
    case NotebookActionTypes.NOTE_EDITOR_LOAD_NEW:
      return {
        ...state,
        activeNotebookSection: "member",
        activeNoteSlug: "",
        isNoteLoaded: true,
        persistenceAlert: "New note"
      };
    case NotebookActionTypes.NOTE_EDITOR_TITLE_CHANGE:
    case NotebookActionTypes.NOTE_EDITOR_CONTENT_CHANGE:
      return {
        ...state,
        isNoteChangePending: true,
        persistenceAlert: "Pending changes"
      };
    case NotebookActionTypes.NOTE_EDITOR_SAVE_NOTE:
      return {
        ...state,
        isNoteChangePending: false,
        persistenceAlert: "Draft saved"
      };
    case NotebookActionTypes.NOTE_EDITOR_CREATE_NEW:
      return {
        ...state,
        activeNoteSlug: action.payload.slug,
        isNoteChangePending: false,
        memberNotebookSize: state.memberNotebookSize + 1,
        persistenceAlert: "New note saved"
      };
    case NotebookActionTypes.NOTE_EDITOR_DELETE:
      return {
        ...state,
        activeNoteSlug: "",
        isNoteChangePending: false,
        isNoteLoaded: false,
        memberNotebookSize: state.memberNotebookSize - 1,
        persistenceAlert: "Note deleted"
      };
    case NotebookActionTypes.NOTE_EDITOR_PUBLISH:
      return {
        ...state,
        persistenceAlert: "Note published",
        teamNotebookSize: state.teamNotebookSize + 1,
        showPublishConfirmation: true
      };
    case NotebookActionTypes.NOTE_EDITOR_SKIP_SAVE:
      return {
        ...state,
        isNoteChangePending: false
      };
    case NotebookActionTypes.PROFILE_MODAL_USER_CHANGE:
      return {
        ...state,
        profileModalUsername: action.username
      };
    default:
      return state;
  }
};

const defaultNotebookContentState = {
  commentIds: [],
  draftComment: "",
  memberNotes: [], // notes belonging to the current user (array of slugs)
  searchQuery: "",
  starredNotes: [], // notes starred by the current user (array of slugs)
  tagFilter: "",
  tags: [],
  tagForm: {
    selectedTagSlug: "",
    suggestedTags: [],
    tagInput: ""
  },
  teamNotes: [] // all the published notes in the team (array of slugs)
};

const content = (state = defaultNotebookContentState, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_BOOKMARK:
      return action.payload
        ? {
            ...state,
            starredNotes: [action.slug, ...state.starredNotes]
          }
        : {
            ...state,
            starredNotes: state.starredNotes.filter(
              noteSlug => noteSlug !== action.slug
            )
          };
    case NotebookActionTypes.NOTEBOOK_BUILD_STARRED:
      return {
        ...state,
        starredNotes: action.notes
      };
    case NotebookActionTypes.NOTEBOOK_CHANGE:
      return {
        ...state,
        commentIds: [],
        draftComment: "",
        searchQuery: "",
        tags: [],
        tagForm: {
          selectedTagSlug: "",
          suggestedTags: [],
          tagInput: ""
        }
      };
    case NotebookActionTypes.NOTEBOOK_LOAD_MEMBER_NOTES:
      return {
        ...state,
        memberNotes: [...state.memberNotes, ...action.payload.result.results]
      };
    case NotebookActionTypes.NOTEBOOK_LOAD_TEAM_NOTES:
      return {
        ...state,
        teamNotes: [...state.teamNotes, ...action.payload.result.results]
      };
    case NotebookActionTypes.NOTEBOOK_SET_TAG_FILTER:
      return {
        ...state,
        tagFilter: action.tag_slug
      };
    case NotebookActionTypes.NOTE_EDITOR_LOAD_NEW:
    case NotebookActionTypes.NOTE_EDITOR_CHANGE_NOTE:
      return {
        ...state,
        tags: [],
        commentIds: [],
        draftComment: ""
      };
    case NotebookActionTypes.NOTE_EDITOR_CREATE_NEW:
      return {
        ...state,
        memberNotes: [action.payload.slug, ...state.memberNotes]
      };
    case NotebookActionTypes.NOTE_EDITOR_PUBLISH:
      return {
        ...state,
        teamNotes: [action.payload.slug, ...state.teamNotes]
      };
    case NotebookActionTypes.NOTE_EDITOR_DELETE:
      return {
        ...state,
        draftComment: "",
        tagForm: {
          selectedTagSlug: "",
          suggestedTags: [],
          tagInput: ""
        },
        memberNotes: state.memberNotes.filter(
          noteSlug => noteSlug !== action.payload.slug
        ),
        starredNotes: state.starredNotes.filter(
          noteSlug => noteSlug !== action.payload.slug
        ),
        teamNotes: state.teamNotes.filter(
          noteSlug => noteSlug !== action.payload.slug
        )
      };
    case NotebookActionTypes.NOTE_COMMENT_DRAFT_CHANGE:
      return {
        ...state,
        draftComment: action.content
      };
    case NotebookActionTypes.NOTE_COMMENT_SUBMIT:
    case NotebookActionTypes.NOTE_COMMENT_DELETE:
      return {
        ...state,
        draftComment: ""
      };
    case NotebookActionTypes.NOTE_COMMENTS_LOAD:
      return {
        ...state,
        commentIds: action.payload.result ? action.payload.result.results : []
      };
    case NotebookActionTypes.NOTEBOOK_SEARCH_CHANGE_QUERY:
      return {
        ...state,
        searchQuery: action.query
      };
    case NotebookActionTypes.NOTEBOOK_SEARCH_REMOVE_QUERY:
      return {
        ...state,
        searchQuery: ""
      };
    case NotebookActionTypes.NOTE_TAG_TOGGLE_INPUT:
      return {
        ...state,
        tagForm: {
          selectedTagSlug: "",
          suggestedTags: [],
          tagInput: ""
        }
      };
    case NotebookActionTypes.NOTE_TAG_INPUT_CHANGE:
      return {
        ...state,
        tagForm: {
          ...state.tagForm,
          tagInput: action.value,
          suggestedTags: action.availableTags.filter(
            tag =>
              tag.name.toLowerCase().startsWith(action.value.toLowerCase()) &&
              action.noteTags.findIndex(
                noteTag => noteTag.slug === tag.slug
              ) === -1
          )
        }
      };
    case NotebookActionTypes.NOTE_TAG_CHANGE_SELECTED_SUGGESTION:
      return {
        ...state,
        tagForm: {
          ...state.tagForm,
          selectedTagSlug: action.tagSlug
        }
      };
    case NotebookActionTypes.NOTE_TAG_ADD_EXISTING:
    case NotebookActionTypes.NOTE_TAG_ADD_NEW:
      return {
        ...state,
        tags: [
          ...state.tags,
          action.payload ? action.payload : action.tag.name
        ],
        tagForm: {
          ...state.tagForm,
          tagInput: "",
          selectedTagSlug: "",
          suggestedTags: []
        }
      };
    case NotebookActionTypes.NOTE_TAG_REMOVAL:
      let index = state.tags.findIndex(x => x === action.tag.slug);
      return {
        ...state,
        tags: [...state.tags.slice(0, index), ...state.tags.slice(index + 1)]
      };
    case NotebookActionTypes.NOTEBOOK_UNLOAD:
      return defaultNotebookContentState;
    default:
      return state;
  }
};

const notebook = combineReducers({
  status,
  content
});

export default notebook;

export const getNotebookStatus = state => {
  return state.notebook.status;
};

export const getFilteredNotes = state => {
  // Looks for a tag filter and search terms in title & content of active notebook
  if (state.notebook.content.searchQuery || state.notebook.content.tagFilter) {
    let results = [];
    Object.values(state.entities.posts).forEach(function(note) {
      // assume notes will meet criteria
      let addToResults = true;
      // check tag filter for matches
      if (
        state.notebook.content.tagFilter &&
        note.tags.findIndex(tag => tag === state.notebook.content.tagFilter) ===
          -1
      ) {
        addToResults = false;
      }
      // check for search query for matches
      if (
        note.title
          .toLowerCase()
          .indexOf(state.notebook.content.searchQuery.toLowerCase()) === -1 &&
        note.content
          .toLowerCase()
          .indexOf(state.notebook.content.searchQuery.toLowerCase()) === -1
      ) {
        addToResults = false;
      }
      addToResults && results.push(note.slug);
    });
    return results ? results : null;
  } else {
    return null;
  }
};

export const getNotes = state => {
  return denormalize(
    union(state.notebook.content.teamNotes, state.notebook.content.memberNotes),
    schema.arrayOfPosts,
    state.entities
  );
};

export const getComments = state => {
  return denormalize(
    state.notebook.content.commentIds,
    schema.arrayOfComments,
    state.entities
  );
};

export const getProfileModalMember = state => {
  return denormalize(
    state.notebook.status.profileModalUsername,
    schema.member,
    state.entities
  );
};

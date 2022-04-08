import keyMirror from "keymirror";
import api_agent from "../api_agent";
import * as schema from "../middleware/schema";

export const ActionTypes = keyMirror({
  MEMBER_LOAD: null,
  MEMBER_UNLOAD: null,
  MEMBER_LOAD_FEED: null,
  MEMBER_TOGGLE_EDITING: null,
  MEMBER_SAVE_PROFILE: null,
  MEMBER_UPDATE_FIELD: null
});

const _createMemberLoadAction = username => ({
  type: ActionTypes.MEMBER_LOAD,
  payload: api_agent.Member.detail(username),
  schema: schema.member
});

const _createMemberFeedLoadAction = (username, offset) => ({
  type: ActionTypes.MEMBER_LOAD_FEED,
  payload: api_agent.Feed.byAuthor(username, offset),
  offset,
  schema: schema.arrayOfPosts
});

const _createMemberUnloadAction = () => ({
  type: ActionTypes.MEMBER_UNLOAD
});

const _createToggleEditingAction = member => ({
  type: ActionTypes.MEMBER_TOGGLE_EDITING,
  member
});

const _createSaveProfileAction = member => ({
  type: ActionTypes.MEMBER_SAVE_PROFILE,
  payload: api_agent.Member.update(member)
});

const _createUpdateFieldAction = (key, value) => ({
  type: ActionTypes.MEMBER_UPDATE_FIELD,
  key,
  value
});

export const loadMemberProfile = username =>
  dispatch => {
    dispatch(_createMemberLoadAction(username));
  };

export const loadMemberFeed = (username, offset) =>
  dispatch => {
    dispatch(_createMemberFeedLoadAction(username, offset));
  };

export const unloadProfile = () =>
  dispatch => {
    dispatch(_createMemberUnloadAction());
  };

export const toggleEditing = member =>
  dispatch => {
    dispatch(_createToggleEditingAction(member));
  };

export const saveProfile = member =>
  dispatch => {
    dispatch(_createSaveProfileAction(member));
  };

export const fieldChange = (key, value) =>
  dispatch => {
    dispatch(_createUpdateFieldAction(key, value));
  };

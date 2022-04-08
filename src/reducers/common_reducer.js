import { denormalize } from "normalizr";
import * as schema from "../middleware/schema";
import { ActionTypes } from "../actions/common_actions";
import { ActionTypes as GatewayActionTypes } from "../actions/gateway_actions";
import { ActionTypes as ProfileActionTypes } from "../actions/profile_actions";
import { ActionTypes as PostActionTypes } from "../actions/post_actions";
import { ActionTypes as TagActionTypes } from "../actions/tag_actions";
import { ActionTypes as SettingsActionTypes } from "../actions/settings_actions";
import flattenDeep from "lodash/flattenDeep";
import uniq from "lodash/uniq";

const defaultState = {
  appLoaded: false,
  appFailure: false, // Used to indicate catastrophic failure (i.e. API down)
  currentMember: null,
  teamTagSlugs: [],
  isLoading: false
};

const common = (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.ASYNC_START:
      switch (action.subtype) {
        case ProfileActionTypes.MEMBER_LOAD_FEED:
        case TagActionTypes.TAG_LOAD_FEED:
        case PostActionTypes.POST_LOAD:
        case ActionTypes.ADD_SLACK_INTEGRATION:
        case SettingsActionTypes.SETTINGS_UPDATE:
          return { ...state, isLoading: true };
        default:
          return state;
      }
    case ActionTypes.ASYNC_END:
      if (action.error) {
        if (action.status === null) {
          // Normally indicates that API unreachable.
          // TODO: determine if certain use cases should be handled more gracefully,
          // e.g. polling of notifications failing once.
          return { ...state, appFailure: true };
        } else {
          return state;
        }
      } else {
        switch (action.subtype) {
          case ProfileActionTypes.MEMBER_LOAD_FEED:
          case TagActionTypes.TAG_LOAD_FEED:
          case PostActionTypes.POST_LOAD:
          case ActionTypes.ADD_SLACK_INTEGRATION:
          case SettingsActionTypes.SETTINGS_UPDATE:
            return { ...state, isLoading: false };
          default:
            return state;
        }
      }
    case ActionTypes.APP_LOAD:
      return {
        ...state,
        appLoaded: true,
        currentMember: action.payload ? action.payload.result : null
      };
    case ActionTypes.REDIRECT:
      return {
        ...state,
        redirectTo: null
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        currentMember: null
      };
    case GatewayActionTypes.TEAM_REDIRECT:
      return {
        ...state,
        redirectTo: "/" + action.team.slug + "/notes/"
      };
    case ActionTypes.LOAD_TEAM_TAGS:
      return {
        ...state,
        teamTagSlugs: action.payload.result
      };
    case ProfileActionTypes.MEMBER_LOAD_FEED:
    case TagActionTypes.TAG_LOAD_FEED:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          count: action.payload.result.count,
          offset: action.offset ? action.offset : 0
        }
      };
    case TagActionTypes.TAG_LOAD_INFO:
    case PostActionTypes.POST_LOAD:
    case ProfileActionTypes.MEMBER_LOAD:
      return {
        ...state,
        redirectTo: action.status === 404 ? "/not-found" : null
      };
    default:
      return state;
  }
};

export default common;

export const getCurrentMember = state => {
  return denormalize(state.common.currentMember, schema.member, state.entities);
};

export const getTeamTags = state => {
  return denormalize(
    state.common.teamTagSlugs,
    schema.arrayOfTags,
    state.entities
  );
};

export const getNotebookTags = state => {
  let notebookTags = [];
  for (var note in state.entities.posts) {
    notebookTags.push(state.entities.posts[note].tags);
  }
  return denormalize(
    uniq(flattenDeep(notebookTags)),
    schema.arrayOfTags,
    state.entities
  );
};

export const getLoadingStatus = state => {
  return state.common.isLoading;
};

export const getPagination = state => {
  return state.common.pagination;
};

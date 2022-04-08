import { denormalize } from "normalizr";
import * as schema from "../middleware/schema";
import { ActionTypes as TagActionTypes } from "../actions/tag_actions";

const defaultState = {
  tagSlug: "",
  postSlugs: []
};

const tag = (state = defaultState, action) => {
  switch (action.type) {
    case TagActionTypes.TAG_LOAD_INFO:
      return {
        ...state,
        tagSlug: action.payload.result
      };
    case TagActionTypes.TAG_LOAD_FEED:
      return {
        ...state,
        postSlugs: action.payload.result.results
      };
    case TagActionTypes.TAG_DASHBOARD_UNLOAD:
      return defaultState;
    default:
      return state;
  }
};

export default tag;

export const getTag = state => {
  return denormalize(state.tag.tagSlug, schema.tag, state.entities);
};

export const getPosts = state => {
  return denormalize(state.tag.postSlugs, schema.arrayOfPosts, state.entities);
};

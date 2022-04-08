import keyMirror from "keymirror";
import api_agent from "../api_agent";
import * as middleware_schema from "../middleware/schema";

export const ActionTypes = keyMirror({
  TAG_LOAD_INFO: null,
  TAG_LOAD_FEED: null,
  TAG_DASHBOARD_UNLOAD: null,
  TAG_TOGGLE_SUBSCRIPTION: null
});

const _createTagLoadInfoAction = tag_slug => ({
  type: ActionTypes.TAG_LOAD_INFO,
  payload: api_agent.Tags.detail(tag_slug),
  schema: middleware_schema.tag
});

const _createTagLoadFeedAction = (tag_slug, offset) => ({
  type: ActionTypes.TAG_LOAD_FEED,
  payload: api_agent.Feed.byTag(tag_slug, offset),
  offset,
  schema: middleware_schema.arrayOfPosts
});

const _createTagDashboardUnloadAction = () => ({
  type: ActionTypes.TAG_DASHBOARD_UNLOAD
});

const _createToggleSubscriptionAction = tag => ({
  type: ActionTypes.TAG_TOGGLE_SUBSCRIPTION,
  slug: tag.slug,
  payload: tag.subscribed
    ? api_agent.Tags.delete_subscription(tag.slug)
    : api_agent.Tags.subscribe(tag.slug)
});

export const loadTagInfo = tag_slug => dispatch => {
  dispatch(_createTagLoadInfoAction(tag_slug));
};

export const loadTagFeed = (tag_slug, offset) => dispatch => {
  dispatch(_createTagLoadFeedAction(tag_slug, offset));
};

export const unloadTagInfo = () => dispatch => {
  dispatch(_createTagDashboardUnloadAction());
};

export const toggleSubscription = tag => dispatch => {
  dispatch(_createToggleSubscriptionAction(tag));
};

import keyMirror from "keymirror";
import api_agent from "../api_agent";
import AuthService from "../auth_service";
import * as schema from "../middleware/schema";

export const ActionTypes = keyMirror({
  APP_LOAD: null,
  REDIRECT: null,
  LOGIN: null,
  LOGOUT: null,
  ASYNC_START: null,
  ASYNC_END: null,
  TOGGLE_BOOKMARK: null,
  LOAD_TEAM_TAGS: null,
  COMPLETE_TEAM_ONBOARDING: null,
  COMPLETE_MEMBER_ONBOARDING: null,
  ADD_SLACK_INTEGRATION: null
});

const _createAppLoadAction = token => ({
  type: ActionTypes.APP_LOAD,
  payload: token ? api_agent.Member.current() : null,
  schema: schema.member
});

const _createLoginAction = jwt => ({
  type: ActionTypes.LOGIN,
  payload: api_agent.Auth.auth(jwt)
});

const _createLogoutAction = () => ({
  type: ActionTypes.LOGOUT
});

const _createToggleBookmarkAction = post => ({
  type: ActionTypes.TOGGLE_BOOKMARK,
  slug: post.slug,
  payload: post.bookmarked
    ? api_agent.Post.remove_bookmark(post.slug)
    : api_agent.Post.bookmark(post.slug)
});

const _createLoadTeamTagsAction = () => ({
  type: ActionTypes.LOAD_TEAM_TAGS,
  payload: api_agent.Tags.list(),
  schema: schema.arrayOfTags
});

const _createCompleteMemberOnboardingAction = member => ({
  type: ActionTypes.COMPLETE_MEMBER_ONBOARDING,
  payload: api_agent.Member.update(member)
});

const _createCompleteTeamOnboardingAction = team => ({
  type: ActionTypes.COMPLETE_TEAM_ONBOARDING,
  payload: api_agent.Team.update(team)
});

const _createAddSlackIntegrationAction = team => ({
  type: ActionTypes.ADD_SLACK_INTEGRATION,
  payload: api_agent.Team.add_slack_integration(team)
});

export const loadApplication = () => dispatch => {
  const token = AuthService.getToken();
  if (token) {
    api_agent.setToken(token);
  }
  dispatch(_createAppLoadAction(token));
};

export const login = jwt => dispatch => {
  dispatch(_createLoginAction(jwt));
};

export const logout = () => dispatch => {
  api_agent.setToken(null);
  AuthService.removeToken();
  dispatch(_createLogoutAction());
};

export const toggleBookmark = post => dispatch => {
  dispatch(_createToggleBookmarkAction(post));
};

export const loadTeamTags = () => dispatch => {
  dispatch(_createLoadTeamTagsAction());
};

// NOTE: This isn't currently used in the notebook
export const completeMemberOnboarding = member => dispatch => {
  member.onboarded = true;
  dispatch(_createCompleteMemberOnboardingAction(member));
};

export const completeTeamOnboarding = team => dispatch => {
  team.onboarded = true;
  dispatch(_createCompleteTeamOnboardingAction(team));
};

export const addSlackIntegration = team => dispatch => {
  dispatch(_createAddSlackIntegrationAction(team));
};

export const redirect = () => ({
  type: ActionTypes.REDIRECT
});

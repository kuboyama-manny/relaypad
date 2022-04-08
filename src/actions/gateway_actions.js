import keyMirror from "keymirror";

export const ActionTypes = keyMirror({
  TEAM_REDIRECT: null
});

const _createTeamRedirectAction = team => ({
  type: ActionTypes.TEAM_REDIRECT,
  team
});

export const redirectToDashboard = team =>
  dispatch => {
    dispatch(_createTeamRedirectAction(team));
  };

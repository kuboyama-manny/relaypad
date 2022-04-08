import { ActionTypes } from "../actions/settings_actions";

const defaultState = {
  digest_email: false,
  digest_slack: false
};

const settings = (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.SETTINGS_LOAD:
    case ActionTypes.SETTINGS_UPDATE:
      return action.error ? null : action.payload;
    default:
      return state;
  }
};

export default settings;

export const getSettings = state => {
  return state.settings;
};

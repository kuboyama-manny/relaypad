import keyMirror from "keymirror";

import api_agent from "../api_agent";

export const ActionTypes = keyMirror({
  SETTINGS_LOAD: null,
  SETTINGS_UPDATE: null
});

const _createSettingsLoadAction = () => ({
  type: ActionTypes.SETTINGS_LOAD,
  payload: api_agent.Member.get_settings()
});

const _createSettingUpdateAction = (setting, value) => ({
  type: ActionTypes.SETTINGS_UPDATE,
  payload: api_agent.Member.update_setting(setting, value)
});

export const loadSettings = () =>
  dispatch => {
    dispatch(_createSettingsLoadAction());
  };

export const updateSetting = (setting, value) =>
  dispatch => {
    dispatch(_createSettingUpdateAction(setting, value));
  };

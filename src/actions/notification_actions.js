import keyMirror from "keymirror";
import api_agent from "../api_agent";

export const ActionTypes = keyMirror({
  NOTIFICATION_LOAD: null,
  NOTIFICATION_MARK_AS_SEEN: null
});

const _createNotificationLoadAction = () => ({
  type: ActionTypes.NOTIFICATION_LOAD,
  payload: api_agent.Member.notifications()
});

const _createNotificationMarkAsSeenAction = () => ({
  type: ActionTypes.NOTIFICATION_MARK_AS_SEEN,
  payload: api_agent.Member.mark_notifications_as_seen()
});

export const loadNotifications = () =>
  dispatch => {
    dispatch(_createNotificationLoadAction());
  };

export const loadAndMarkNotificationsAsSeen = () =>
  dispatch => {
    dispatch(_createNotificationMarkAsSeenAction());
  };

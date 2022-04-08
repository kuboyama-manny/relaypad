import {
  ActionTypes as NotificationActionTypes
} from "../actions/notification_actions";
import { ActionTypes } from "../actions/common_actions";

const defaultState = {
  list: [],
  unseenCount: 0,
  isLoading: false
};

const notifications = (state = defaultState, action) => {
  switch (action.type) {
    case ActionTypes.ASYNC_START:
      switch (action.subtype) {
        case NotificationActionTypes.NOTIFICATION_LOAD:
          return { ...state, isLoading: true };
        default:
          return { ...state };
      }
    case ActionTypes.ASYNC_END:
      switch (action.subtype) {
        case NotificationActionTypes.NOTIFICATION_LOAD:
          return { ...state, isLoading: false };
        default:
          return { ...state };
      }
    case NotificationActionTypes.NOTIFICATION_LOAD:
      return {
        ...state,
        unseenCount: action.payload.unseen_count,
        list: action.payload.notifications
      };
    case NotificationActionTypes.NOTIFICATION_MARK_AS_SEEN:
      // getStream.io returns zero for unseenCount on subsequent requests
      // we therefore set manually to zero here.
      return {
        ...state,
        unseenCount: 0,
        list: action.payload.notifications
      };
    default:
      return state;
  }
};

export const getNotifications = state => {
  return state.notifications;
};

export default notifications;

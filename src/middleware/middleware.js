import { normalize } from "normalizr";
import AuthService from "../auth_service";
import Analytics from "../analytics";
import { ActionTypes } from "../actions/common_actions";
import {
  ActionTypes as NotificationActionTypes
} from "../actions/notification_actions";

/**
  * Collection of actions that client can gracefully handle failures for.
  */
const FAULT_TOLERENT_ASYNC_ACTIONS = [
  NotificationActionTypes.NOTIFICATION_LOAD,
  NotificationActionTypes.NOTIFICATION_MARK_AS_SEEN
];

const ga = new Analytics();

/**
  * Redux highly recommends that state shape be normalized, meaning that we avoid
  * duplication of entities (e.g. posts) in multiple places. This simpifies updating of
  * entities if/when they change (e.g. the bookmark status of a post).
  * More details here: http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html
  * This method normalizes the response data returned from API.
  */
const _normalizeResponse = (action, response) => {
  if (action.schema) {
    // Normalize response data using provided schema for more efficient referencing in redux store.
    action.payload = response.results
      ? normalize(response, { results: action.schema })
      : normalize(response, action.schema);
  } else {
    action.payload = response;
  }
  return action;
};

/**
  * Standard redux middleware, intercepts all dispatched actions and can opt to take further
  * action. In this case, the handling of asynchronous API requests.
  */
export const apiMiddleware = store =>
  next =>
    action => {
      if (!action.payload || !action.payload.then) {
        // Don't care about this action since its payload is not setup to require an api call.
        return next(action);
      } else {
        store.dispatch({
          type: ActionTypes.ASYNC_START,
          subtype: action.type,
          id: action.id
        });

        action.payload.then(
          res => {
            store.dispatch({
              type: ActionTypes.ASYNC_END,
              subtype: action.type,
              result: res
            });
            store.dispatch(_normalizeResponse(action, res));
          },
          error => {
            if (FAULT_TOLERENT_ASYNC_ACTIONS.indexOf(action.type) !== -1) {
              // Failure of this action doesn't completely break client, bail as if
              // it never happened. (e.g. polling for notifications sporadically failed)
              return;
            }
            action.error = true;
            action.status = error.response ? error.response.status : null; // Error is sometimes empty (if API unreachable)
            action.payload = error.response ? error.response.body : null; // Error is sometimes empty (if API unreachable)

            if (action.status === 403) {
              // Remove auth JWT and redirect in case of 403.
              AuthService.removeToken();
              if (action.payload.detail === "Beta access restricted") {
                // TODO: remove for public launch.
                window.location.replace("https://relaypad.com");
              } else if (action.payload.detail === "Inactive team member") {
                window.location.replace("https://relaypad.com");
              } else {
                window.location.replace("/");
              }
            }

            store.dispatch({
              type: "ASYNC_END",
              error: action.error,
              status: action.status,
              payload: action.payload
            });
            store.dispatch(action);
          }
        );
        return; // Since middleware handled this action, and dispatched new actions, the original action can end here.
      }
    };

/**
  * Standard redux middleware, intercepts all dispatched actions and can opt to take further
  * action. In this case, triggering of analytics events.
  */
export const analyticsMiddleware = store =>
  next =>
    action => {
      if (action.type === "@@router/LOCATION_CHANGE") {
        ga.logPageView(action.payload.pathname);
      }

      return next(action);
    };

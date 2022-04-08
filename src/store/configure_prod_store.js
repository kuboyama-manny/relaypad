import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";

import rootReducer from "../reducers/root_reducer";
import { apiMiddleware, analyticsMiddleware } from "../middleware/middleware";

const configureStore = (history, preloadedState) =>
  createStore(
    connectRouter(history)(rootReducer),
    preloadedState,
    applyMiddleware(
      thunk,
      routerMiddleware(history),
      apiMiddleware,
      analyticsMiddleware
    )
  );

export default configureStore;

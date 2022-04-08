import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";

import rootReducer from "../reducers/root_reducer";
import DevTools from "../containers/utils/dev_tools";
import { apiMiddleware, analyticsMiddleware } from "../middleware/middleware";

const configureStore = (history, preloadedState) => {
  const store = createStore(
    connectRouter(history)(rootReducer),
    preloadedState,
    compose(
      applyMiddleware(
        thunk,
        routerMiddleware(history),
        apiMiddleware,
        analyticsMiddleware,
        createLogger()
      ),
      DevTools.instrument()
    )
  );

  return store;
};

export default configureStore;

import "babel-polyfill"; // See http://redux.js.org/docs/advanced/AsyncActions.html#note-on-fetch
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory as createHistory } from "history";
import Raven from "raven-js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { auth } from "./auth0/utils";
import AppContainer from "./containers/app_container";
import configureStore from "./store/configure_store";

// Sentry logging
if (process.env.NODE_ENV === "production") {
  Raven.config(
    "https://e377a531173845bba1f31d347bc94066@sentry.io/1232580"
  ).install();
}

const history = createHistory();
const store = configureStore(history);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AppContainer auth={auth} history={history} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

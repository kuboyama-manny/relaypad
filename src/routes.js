import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  requireAuth,
  parseSignInCallbackHash,
  parseAddToSlackCallbackHash
} from "./auth0/utils";

import RouteContainer from "./auth0/container";

import SigninContainer from "./containers/signin_container";
import SigninRoadBlockContainer from "./containers/signin_roadblock_container";
import SlackContainer from "./containers/slack_container";
import SignoutContainer from "./containers/signout_container";
import NotFound from "./containers/404";
import Gateway from "./containers/gateway_container";
import SettingsContainer from "./containers/settings_container";
import NotificationsContainer from "./containers/notifications_container";
import NotebookContainer from "./containers/notebook_container";
import Supportguidebook from "./containers/support_guidebook";
import LoadingSpinner from "./components/utils/loading_spinner";

class Routing extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={requireAuth}
              component={Gateway}
            />
          )}
        />
        <Route exact path="/signin" component={SigninContainer} />
        <Route
          path="/signin/callback"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={parseSignInCallbackHash}
              component={LoadingSpinner}
            />
          )}
        />
        <Route
          path="/signin/welcome-to-relaypad"
          component={SigninRoadBlockContainer}
        />
        <Route
          path="/add-to-slack/callback"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={parseAddToSlackCallbackHash}
              component={LoadingSpinner}
            />
          )}
        />
        <Route
          path="/signout"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={requireAuth}
              component={SignoutContainer}
            />
          )}
        />
        <Route
          path="/settings"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={requireAuth}
              component={SettingsContainer}
            />
          )}
        />
        <Route
          path="/support/guidebook"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={requireAuth}
              component={Supportguidebook}
            />
          )}
        />
        <Route
          path="/notifications"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={requireAuth}
              component={NotificationsContainer}
            />
          )}
        />
        <Route
          path="/:team/notes/@:username/:note_slug"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={requireAuth}
              component={NotebookContainer}
            />
          )}
        />
        <Route
          path="/:team/notes/@:username"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={requireAuth}
              component={NotebookContainer}
            />
          )}
        />
        <Route
          path="/:team/notes/:notebook_section"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={requireAuth}
              component={NotebookContainer}
            />
          )}
        />
        <Route
          path="/:team/notes"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={requireAuth}
              component={NotebookContainer}
            />
          )}
        />
        <Route
          path="/slack-connector"
          render={props => (
            <RouteContainer
              {...props}
              onEnter={requireAuth}
              component={SlackContainer}
            />
          )}
        />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default Routing;

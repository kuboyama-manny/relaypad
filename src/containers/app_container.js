/* eslint no-restricted-globals: ["off", "history"] */
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import Routing from "../routes";
import { loadApplication, logout, redirect } from "../actions/common_actions";
import {
  loadAndMarkNotificationsAsSeen,
  loadNotifications
} from "../actions/notification_actions";
import { getCurrentMember, getLoadingStatus } from "../reducers/common_reducer";
import { getNotebookStatus } from "../reducers/notebook_reducer";
import { getNotifications } from "../reducers/notifications_reducer";
import AppFail from "../components/app_fail";

// CSS
import "../index.css"; // Let webpack know that react app relies on this CSS.

// FontAwesome SVG icons
import "../components/fontawesome.js";

/**
 * Wrapper component container for all routes, responsible for:
 * - Initial loading of essential state data on app load.
 * - Monitoring for redirect requests and redirecting appropriately.
 */

class AppContainer extends PureComponent {
  componentWillMount() {
    this.props.loadApplication();
  }

  componentWillReceiveProps(nextProps) {
    // Redirect user and dispatch action to clean up redirectTo state.
    if (nextProps.redirectTo) {
      this.props.history.push(nextProps.redirectTo);
      history.pushState({}, "", nextProps.redirectTo);
      this.props.redirect();
    }
  }

  render() {
    if (this.props.appLoaded) {
      if (this.props.appFailure) {
        return <AppFail />;
      } else {
        return (
          <div id="appWrapper">
            <Helmet>
              <title>RelayPad</title>
            </Helmet>
            <div id="appContent">
              <Routing />
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  }
}

AppContainer.propTypes = {
  auth: PropTypes.object,
  appLoaded: PropTypes.bool,
  children: PropTypes.element,
  currentMember: PropTypes.object,
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadAndMarkNotificationsAsSeen: PropTypes.func.isRequired,
  loadApplication: PropTypes.func.isRequired,
  loadNotifications: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  notebookStatus: PropTypes.object.isRequired,
  notifications: PropTypes.object.isRequired,
  redirect: PropTypes.func.isRequired,
  redirectTo: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  loadApplication: () => dispatch(loadApplication()),
  loadNotifications: () => dispatch(loadNotifications()),
  loadAndMarkNotificationsAsSeen: () =>
    dispatch(loadAndMarkNotificationsAsSeen()),
  redirect: () => dispatch(redirect())
});

const mapStateToProps = state => ({
  appFailure: state.common.appFailure,
  appLoaded: state.common.appLoaded,
  currentMember: getCurrentMember(state),
  isLoading: getLoadingStatus(state),
  notebookStatus: getNotebookStatus(state),
  notifications: getNotifications(state),
  redirectTo: state.common.redirectTo
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppContainer)
);

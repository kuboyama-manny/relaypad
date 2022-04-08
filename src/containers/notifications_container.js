import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import {
  loadNotifications,
  loadAndMarkNotificationsAsSeen
} from "../actions/notification_actions";
import { getNotifications } from "../reducers/notifications_reducer";

import NotificationFeed from "../components/notification_feed";

class NotificationsContainer extends Component {
  componentWillMount() {
    this.props.loadAndMarkNotificationsAsSeen();
  }

  render() {
    return (
      <div className="container">
        <Helmet>
          <title>Notifications • RelayPad</title>
        </Helmet>
        <div className="feed-container row">
          <div className="col-md-6 col-md-offset-3">
            <h3 id="feedTitle">Your Notifications</h3>
            <NotificationFeed
              notifications={this.props.notifications}
              source="container"
            />
          </div>
        </div>
      </div>
    );
  }
}

NotificationsContainer.propTypes = {
  notifications: PropTypes.object.isRequired,
  loadNotifications: PropTypes.func.isRequired,
  loadAndMarkNotificationsAsSeen: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  notifications: getNotifications(state)
});

const mapDispatchToProps = dispatch => ({
  loadNotifications: () => dispatch(loadNotifications()),
  loadAndMarkNotificationsAsSeen: () =>
    dispatch(loadAndMarkNotificationsAsSeen())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  NotificationsContainer
);

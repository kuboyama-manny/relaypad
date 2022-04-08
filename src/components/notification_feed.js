import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "./utils/loading_spinner";
import Notification from "./notification.js";

const NotificationFeed = ({ notifications, source }) => {
  let feed_id,
    feed_classes,
    feed_items = null;
  switch (source) {
    case "container":
      feed_id = "notificationsFeed";
      feed_items = notifications.list.slice();
      break;
    case "header":
      feed_classes = "dropdown-menu dropdown-menu-right";
      feed_items =
        notifications.list.length > 5
          ? notifications.list.slice().splice(0, 5)
          : notifications.list;
      break;
    default:
      feed_items = notifications.list;
      break;
  }

  if (notifications.isLoading) {
    return (
      <ul id={feed_id} className={feed_classes}>
        <li>
          <LoadingSpinner />
        </li>
      </ul>
    );
  } else if (!notifications.isLoading && feed_items.length === 0) {
    return (
      <ul id={feed_id} className={feed_classes}>
        <li id="noNotifs">No notifications right now</li>
      </ul>
    );
  } else {
    return (
      <ul id={feed_id} className={feed_classes}>
        {feed_items.map(notification => (
          <Notification notification={notification} key={notification.id} />
        ))}
        {source === "header" && (
          <li id="olderNotifs">
            <Link to="/notifications">See older notifications</Link>
          </li>
        )}
      </ul>
    );
  }
};

NotificationFeed.propTypes = {
  notifications: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired
};

export default NotificationFeed;

import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import moment from "moment";
import Avatar, { getAvatarUrl } from "./avatar";
import emoji_applause from "../img/emoji/applause.svg";
import emoji_cool from "../img/emoji/cool.svg";
import emoji_fire from "../img/emoji/fire.svg";
import emoji_heart from "../img/emoji/heart.svg";
import emoji_rocket from "../img/emoji/rocket.svg";
import emoji_sad from "../img/emoji/sad.svg";
import emoji_smile from "../img/emoji/smile.svg";
import emoji_tada from "../img/emoji/tada.svg";
import emoji_thinking from "../img/emoji/thinking.svg";
import emoji_thumbsup from "../img/emoji/thumbsup.svg";

export default function Notification(props) {
  const { notification } = props;
  let unseenIcon = !notification.is_seen ? "fa-circle" : "fa-circle-o";
  let activity = notification.activities[0];
  let actor = activity.actor;
  let notification_icon,
    notification_message,
    notification_target_uri,
    notification_target_name,
    iconClipping = null;

  const displayName =
    actor.first_name || actor.last_name
      ? [actor.first_name, actor.last_name].join(" ")
      : "@" + actor.username;

  switch (activity.verb) {
    case "react":
      switch (notification.activities[0].object.type) {
        case "THUMBS_UP":
          notification_icon = emoji_thumbsup;
          break;
        case "COOL":
          notification_icon = emoji_cool;
          break;
        case "APPLAUSE":
          notification_icon = emoji_applause;
          break;
        case "FIRE":
          notification_icon = emoji_fire;
          break;
        case "HEART":
          notification_icon = emoji_heart;
          break;
        case "ROCKET":
          notification_icon = emoji_rocket;
          break;
        case "SAD":
          notification_icon = emoji_sad;
          break;
        case "SMILE":
          notification_icon = emoji_smile;
          break;
        case "TADA":
          notification_icon = emoji_tada;
          break;
        case "THINKING":
          notification_icon = emoji_thinking;
          break;
        default:
          notification_icon = emoji_fire;
      }
      notification_message =
        displayName +
        " reacted to" +
        (activity.object.post !== null ? "" : " your comment on");
      notification_target_uri =
        activity.object.post !== null
          ? activity.object.post.detail_uri
          : activity.object.comment.post.detail_uri;
      notification_target_name =
        activity.object.post !== null
          ? activity.object.post.title
          : activity.object.comment.post.title;
      break;
    case "publish":
      notification_icon = actor.avatar_photo_id
        ? getAvatarUrl(actor.avatar_photo_id, 30)
        : "default-avatar";
      if (activity.object.tag !== undefined) {
        notification_message =
          displayName + " published to " + activity.object.tag.name;
        notification_target_uri = activity.object.post.detail_uri;
        notification_target_name = activity.object.post.title;
      }
      iconClipping = "img-circle";
      break;
    case "comment":
      notification_icon = actor.avatar_photo_id
        ? getAvatarUrl(actor.avatar_photo_id, 30)
        : "default-avatar";
      notification_message = displayName + " commented on";
      notification_target_uri = activity.object.post.detail_uri;
      notification_target_name = activity.object.post.title;
      iconClipping = "img-circle";
      break;
    default:
      notification_icon = "default-avatar";
      iconClipping = "img-circle";
      break;
  }

  return (
    <li>
      <Link to={notification_target_uri} className="notif_list_item">
        {notification_icon !== "default-avatar" ? (
          <img
            srcSet={notification_icon}
            alt=""
            className={classnames("user-photo-icon-30", iconClipping)}
          />
        ) : (
          <Avatar
            firstName={actor.first_name}
            lastName={actor.last_name}
            userName={actor.username}
            sizingCSS="30"
          />
        )}
        <span className="notif_info">
          <span className="notif_author">{notification_message}</span>
          <span className="notif_post">{notification_target_name}</span>
          <span className="notif_date">
            {moment(notification.created_at + "Z").fromNow()}
          </span>
        </span>
        <i
          className={classnames("seen_icon fa fa-fw", unseenIcon)}
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired
};

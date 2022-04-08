import PropTypes from "prop-types";
import React from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Acceptable types are 'success', 'info', 'warning', 'danger'
// https://getbootstrap.com/components/#alerts

// 'title' does not accept HTML, but 'content' does (useful for links)

const Alert = ({ type, title, content, dismissable, id }) => (
  <div
    id={id ? id : null}
    className={classnames("alert alert-" + type, {
      "alert-dismissible": dismissable
    })}
    role="alert"
  >
    {dismissable && (
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <FontAwesomeIcon aria-hidden="true" icon={["fal", "times"]} />
      </button>
    )}
    <span>
      {title && <h4>{title}</h4>}
      {content && <p dangerouslySetInnerHTML={{ __html: content }} />}
    </span>
  </div>
);

Alert.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  dismissable: PropTypes.bool,
  id: PropTypes.string
};

Alert.defaultProps = {
  type: "success",
  dismissable: true,
  id: null,
  title: null,
  content: null
};

export default Alert;

import PropTypes from "prop-types";
import React from "react";

const ContactDisplay = (
  { field, icon, displayName, url, value, onChange, isEditing, error }
) => {
  if (isEditing === true) {
    return (
      <label>
        <i className={"fa fa-fw fa-" + icon} aria-hidden="true" />
        <span id={"editContact-" + icon}>
          <input
            type="text"
            placeholder={displayName}
            name={field}
            value={value || ""}
            onChange={onChange}
          />
          {error && <span className="help-block">{error}</span>}
        </span>
      </label>
    );
  } else if (value !== "" && value !== null) {
    if (url) {
      return (
        <a href={url} name={field} title={displayName}>
          <i className={"fa fa-fw fa-" + icon} aria-hidden="true" /> {value}
        </a>
      );
    } else {
      return (
        <span>
          <i className={"fa fa-fw fa-" + icon} aria-hidden="true" /> {value}
        </span>
      );
    }
  } else {
    return <span />;
  }
};

ContactDisplay.propTypes = {
  field: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  url: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  error: PropTypes.array
};

ContactDisplay.defaultProps = {
  value: "",
  isEditing: false
};

export default ContactDisplay;

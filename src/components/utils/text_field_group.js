import PropTypes from "prop-types";
import React from "react";
import classnames from "classnames";

const TextFieldGroup = (
  { field, value, placeholder, label, type, onChange, error }
) => (
  <div className={classnames("form-group", { "has-error": error })}>
    <label className="control-label" htmlFor={field}>{label}</label>
    <input
      name={field}
      value={value}
      type={type}
      onChange={onChange}
      className="form-control"
      placeholder={placeholder}
    />
    {error && <span className="help-block">{error}</span>}
  </div>
);

TextFieldGroup.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.array
};

TextFieldGroup.defaultProps = {
  type: "text"
};

export default TextFieldGroup;

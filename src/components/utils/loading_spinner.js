import PropTypes from "prop-types";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoadingSpinner(props) {
  return (
    <div id="loader">
      <FontAwesomeIcon icon={["fal", "spinner"]} pulse size="3x" />
      <h4>{props.message ? props.message : "Loading…"}</h4>
    </div>
  );
}
LoadingSpinner.propTypes = {
  message: PropTypes.string
};

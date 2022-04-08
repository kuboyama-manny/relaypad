import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AddToSlack(props) {
  return (
    <div id="onboardingSidebarSlackPrompt">
      <p>
        Did you know Slack can show previews of RelayPad notes in channels or
        conversations?
        <Link to="/slack-connector">
          <FontAwesomeIcon icon={["fab", "slack-hash"]} /> Add to Slack
        </Link>
      </p>
    </div>
  );
}

export default AddToSlack;

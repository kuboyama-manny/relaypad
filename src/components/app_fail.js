/* eslint-disable */

import React from "react";
import logo_blue from "../img/logos/logo_full.svg";

const AppFail = () => (
  <div id="appFail">
    <img src={logo_blue} className="center-block" height="45" alt="RelayPad" />
    <h2 className="text-center">Something went awry</h2>
    <p className="text-center content">
      Things should be back to normal soon.{" "}
      <a href="javascript:window.location.href=window.location.href">
        Please try again.
      </a>
    </p>
  </div>
);

export default AppFail;

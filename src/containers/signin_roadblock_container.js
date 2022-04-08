import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo_full from "../img/logos/logo_full.svg";
import hero_people from "../img/hero-people.svg";

class SigninRoadBlockContainer extends Component {
  render() {
    return (
      <div id="slackRoadblock" className="static-page">
        <Helmet>
          <title>Welcome to RelayPad</title>
        </Helmet>
        <div className="content">
          <img
            src={logo_full}
            alt="RelayPad logo"
            height="30"
            className="logo"
          />
          <h1>Welcome to RelayPad</h1>
          <p>Please confirm your team membership by signing in with Slack.</p>
          <p>
            Don’t worry, this will not post anything to your team’s Slack
            channels.
          </p>
          <Link to="/signin" className="btn btn-success btn-lg">
            <FontAwesomeIcon
              icon={["fab", "slack-hash"]}
              fixedWidth
              title="Toggle sidebar"
              data-tip="Toggle sidebar"
            />
            Sign in with Slack
          </Link>
          <p className="learn-more">
            <Link to="https://relaypad.com">Learn more about RelayPad</Link>
          </p>
          <img src={hero_people} alt="" height="250" className="hero-image" />
        </div>
      </div>
    );
  }
}

export default SigninRoadBlockContainer;

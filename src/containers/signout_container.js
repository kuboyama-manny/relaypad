import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Variables from "../variables";
import AuthService from "../auth_service";
import { logout } from "../actions/common_actions";

import logo_blue from "../img/logos/logo_full.svg";

const auth = new AuthService(Variables.AUTH0_CLIENT_ID, Variables.AUTH0_DOMAIN);

class SignoutContainer extends Component {
  componentWillMount() {
    this.props.logout();
  }

  render() {
    return (
      <div id="signOut">
        <Link to="/">
          <img src={logo_blue} alt="RelayPad logo" height="45" />
        </Link>
        <h2>You’ve been logged out</h2>
        <p>Sign back in to access your team’s RelayPad.</p>
        <img
          id="slackBtn"
          alt="Sign in with Slack"
          height="40"
          width="172"
          onClick={() => auth.slackLogin()}
          src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
          srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
        />
      </div>
    );
  }
}

SignoutContainer.propTypes = {
  logout: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  null,
  mapDispatchToProps
)(SignoutContainer);

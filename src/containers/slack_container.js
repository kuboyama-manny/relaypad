import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import qs from "qs";

import { addSlackIntegration } from "../actions/common_actions";
import { getCurrentMember, getLoadingStatus } from "../reducers/common_reducer";
import AuthService from "../auth_service";
import Alert from "../components/utils/alert";
import LoadingSpinner from "../components/utils/loading_spinner";
import relaypadSlack from "../img/icons/slack-relaypad.svg";

const authService = new AuthService();

class SlackContainer extends Component {
  constructor(props) {
    super(props);
    this.renderCallToAction = this.renderCallToAction.bind(this);
  }
  componentWillMount() {
    if (
      qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
        .installing === "true" &&
      !this.props.currentMember.team.slack_integrated
    ) {
      this.props.addSlackIntegration(this.props.currentMember.team);
    }
  }

  renderCallToAction() {
    if (this.props.currentMember.team.slack_integrated) {
      return (
        <div id="cta">
          <Link to="/" className="btn btn-primary">
            Return to RelayPad
          </Link>
        </div>
      );
    } else {
      return (
        <div id="cta">
          <Link
            to="#"
            className="btn btn-success"
            onClick={() => authService.addToSlack()}
          >
            <i className="fa fa-slack" aria-hidden="true" />
            Add RelayPad to Slack
          </Link>
          <Link
            to="#"
            className="btn btn-outline-secondary"
            onClick={() => window.history.back()}
          >
            Not now
          </Link>
        </div>
      );
    }
  }
  render() {
    return (
      <div id="slackConnectorBenefits" className="container">
        <Helmet>
          <title>Add the RelayPad app to Slack • RelayPad</title>
        </Helmet>
        <div className="content">
          {qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
            .installing !== "true" &&
            this.props.currentMember.team.slack_integrated &&
            !this.props.isLoading && (
              <Alert
                type="success"
                title="Successfully added RelayPad to Slack"
                content="Your Slack connection is configured and ready to use."
              />
            )}
          {this.props.isLoading ? (
            <LoadingSpinner message="Configuring Slack" />
          ) : (
            <div id="SlackConnectorBody">
              <div id="imgContainer">
                <img src={relaypadSlack} alt="" height="200" />
              </div>
              <div>
                <h3>
                  {this.props.currentMember.team.slack_integrated
                    ? "RelayPad added to Slack"
                    : "Add the RelayPad app to Slack"}
                </h3>
                <p>
                  RelayPad notes are viewable only by people in your Slack team.
                  We need to add RelayPad to your Slack app for it to be able to
                  generate rich previews of links shared inside Slack.
                </p>
                <p>
                  Don’t worry, this will not post anything to your team’s Slack
                  channels.
                </p>
                {this.renderCallToAction()}
              </div>
              <div />
            </div>
          )}
        </div>
      </div>
    );
  }
}

SlackContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

const mapDispatchToProps = dispatch => ({
  addSlackIntegration: userId => dispatch(addSlackIntegration(userId))
});

const mapStateToProps = state => ({
  currentMember: getCurrentMember(state),
  isLoading: getLoadingStatus(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SlackContainer);

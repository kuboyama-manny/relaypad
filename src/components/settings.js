import PropTypes from "prop-types";
import React, { Component } from "react";

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.handleBriefingChange = this.handleBriefingChange.bind(this);
  }
  handleBriefingChange = e => {
    this.props.updateSetting(
      e.target.name,
      !this.props.settings[e.target.name]
    );
  };

  render() {
    return (
      <div className="settings-panel">
        <h3 id="feedTitle">{this.props.activeTab} Settings</h3>
        {this.props.activeTab === "Account" && (
          <div id="accountSettings">
            <div className="form-group">
              <h4>
                <label for="userEmail">Email address</label>
              </h4>
              <input
                type="email"
                className="form-control"
                id="userEmail"
                name="userEmail"
              />
              <button type="submit" className="btn btn-default">
                Update
              </button>
            </div>
          </div>
        )}
        {this.props.activeTab === "Notification" && (
          <div id="notificationSettings">
            <p>Choose how you receive notifications.</p>
            <div className="form-group">
              <h4>Daily Briefing</h4>
              <p>
                A summary of new entries from across{" "}
                {this.props.currentMember.team.name}. Delivered weekday
                mornings.
              </p>
              <div className="checkbox">
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    name="digest_email"
                    checked={this.props.settings.digest_email && "checked"}
                    onChange={event => this.handleBriefingChange(event)}
                  />{" "}
                  Email
                </label>
                <label className="checkbox-inline disabled">
                  <input
                    type="checkbox"
                    name="digest_slack"
                    disabled="disabled"
                    // checked={this.props.settings.digest_slack && "checked"}
                    // onChange={event => this.handleBriefingChange(event)}
                  />{" "}
                  Slack message <small>(coming soon)</small>
                </label>
              </div>
            </div>
            {/* <div className="form-group">
              <h4>Comments on Your Posts</h4>
              <p>
                Recieve a notification when someone comments on a post you publish.
              </p>
              <div className="checkbox">
                <label className="checkbox-inline">
                  <input type="checkbox" /> Email
                </label>
                <label className="checkbox-inline">
                  <input type="checkbox" />
                  {" "}
                  Slack message
                  {" "}
                  <small>(coming soon)</small>
                </label>
              </div>
            </div> */}
          </div>
        )}
        {this.props.activeTab === "Team" && (
          <div id="teamSettings">Team settings go here</div>
        )}
        {this.props.activeTab === "Billing" && (
          <div id="billingSettings">Billing settings go here</div>
        )}
      </div>
    );
  }
}

Settings.propTypes = {
  currentMember: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  updateSetting: PropTypes.func.isRequired,
  activeTab: PropTypes.string
};

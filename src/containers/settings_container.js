import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { getCurrentMember, getLoadingStatus } from "../reducers/common_reducer";
import { getSettings } from "../reducers/settings_reducer";
import { loadSettings, updateSetting } from "../actions/settings_actions";
import { Helmet } from "react-helmet";
import Settings from "../components/settings";

class SettingsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSettingsTab: "Notification" // default tab
    };
    this.settingsMenuItem = this.settingsMenuItem.bind(this);
    this.toggleSettingsTab = this.toggleSettingsTab.bind(this);
  }

  componentWillMount() {
    this.props.loadSettings();
  }

  settingsMenuItem = (title, displayName, icon) => {
    return (
      <li
        className={classnames("list-group-item", {
          active: this.state.activeSettingsTab === title
        })}
        onClick={this.toggleSettingsTab(title)}
      >
        <i className={classnames("fa fa-fw", icon)} aria-hidden="true" />
        {displayName}
      </li>
    );
  };

  toggleSettingsTab = newTab => () => {
    this.setState({ activeSettingsTab: newTab });
  };

  render() {
    return (
      <div className="container">
        <Helmet>
          <title>Settings • RelayPad</title>
        </Helmet>
        <div className="feed-container row">
          <div id="settingsSidebarLeft" className="col-md-3 sidebar">
            <div className="panel panel-default">
              <div className="panel-heading">Settings</div>
              <ul className="list-group">
                {/* {this.settingsMenuItem(
                  "Account",
                  "Your Account",
                  "fa-user-circle-o"
                )} */}
                {this.settingsMenuItem(
                  "Notification",
                  "Notifications & Emails",
                  "fa-bell-o"
                )}
                {/* {this.settingsMenuItem("Team", "Team Settings", "fa-books")}
                {this.settingsMenuItem("Billing", "Billing", "fa-credit-card")} */}
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <Settings
              activeTab={this.state.activeSettingsTab}
              settings={this.props.settings}
              currentMember={this.props.currentMember}
              updateSetting={this.props.updateSetting}
            />
          </div>
        </div>
      </div>
    );
  }
}

SettingsContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  currentMember: PropTypes.object.isRequired,
  isLoading: PropTypes.bool
};

const mapDispatchToProps = dispatch => ({
  loadSettings: () => dispatch(loadSettings()),
  updateSetting: (setting, value) => dispatch(updateSetting(setting, value))
});

const mapStateToProps = state => ({
  settings: getSettings(state),
  currentMember: getCurrentMember(state),
  isLoading: getLoadingStatus(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer);

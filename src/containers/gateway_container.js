import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { redirectToDashboard } from "../actions/gateway_actions";
import { getCurrentMember } from "../reducers/common_reducer";
import LoadingSpinner from "../components/utils/loading_spinner";

class GatewayContainer extends Component {
  componentWillMount() {
    this.props.redirectToDashboard(this.props.currentTeam);
  }

  render() {
    return <LoadingSpinner />;
  }
}

GatewayContainer.propTypes = {
  currentTeam: PropTypes.object.isRequired,
  redirectToDashboard: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  redirectToDashboard: team => dispatch(redirectToDashboard(team))
});

const mapStateToProps = state => ({
  currentTeam: getCurrentMember(state).team
});

export default connect(mapStateToProps, mapDispatchToProps)(GatewayContainer);

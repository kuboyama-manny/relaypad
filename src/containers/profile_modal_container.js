import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ProfileModal from "../components/profile/profile_modal";
import { getProfileModalMember } from "../reducers/notebook_reducer";

class ProfileModalContainer extends Component {
  render() {
    return (
      <ProfileModal
        changeProfileModalUser={this.props.changeProfileModalUser}
        member={this.props.member}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({
  member: getProfileModalMember(state)
});

ProfileModalContainer.propTypes = {
  changeProfileModalUser: PropTypes.func.isRequired,
  member: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileModalContainer);

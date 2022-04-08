import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Avatar from "../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "../utils/loading_spinner";
import displayName from "../utils/display_name";

class ProfileModal extends PureComponent {
  render() {
    const { member } = this.props;
    return (
      <div
        className="modal fade"
        id="profileModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalProfileUser"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              {member ? (
                <div id="profileModalCard">
                  <Avatar
                    publicId={member.avatar_photo_id}
                    firstName={member.first_name}
                    lastName={member.last_name}
                    userName={member.username}
                    sizingCSS="200"
                  />
                  <div className="profile-info">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={event => this.props.changeProfileModalUser()}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <div className="profile-user-bio">
                      <h5 id="modalProfileUser">{displayName(member)}</h5>
                      {member.role && (
                        <div className="profile-role">{member.role}</div>
                      )}
                      {member.location && (
                        <div className="profile-location">
                          {member.location}
                        </div>
                      )}
                    </div>

                    <div className="profile-contact-info">
                      {member.username && (
                        <div className="profile-contact-row">
                          <FontAwesomeIcon
                            icon={["fab", "slack-hash"]}
                            fixedWidth
                          />
                          {"@" + member.username}
                        </div>
                      )}
                      {member.email && (
                        <div className="profile-contact-row">
                          <a href={"mailto:" + member.email}>
                            <FontAwesomeIcon
                              icon={["far", "envelope"]}
                              fixedWidth
                            />
                            {member.email}
                          </a>
                        </div>
                      )}
                      {member.phone && (
                        <div className="profile-contact-row">
                          <a href={"tel:" + member.phone} target="_blank">
                            <FontAwesomeIcon
                              icon={["far", "phone"]}
                              fixedWidth
                            />
                            {member.phone}
                          </a>
                        </div>
                      )}
                      {member.skype_handle && (
                        <div className="profile-contact-row">
                          <a
                            href={"skype:" + member.skype_handle + "?call"}
                            target="_blank"
                          >
                            <FontAwesomeIcon
                              icon={["fab", "skype"]}
                              fixedWidth
                            />
                            {member.skype_handle}
                          </a>
                        </div>
                      )}
                      {member.personal_website && (
                        <div className="profile-contact-row">
                          <a href={member.personal_website} target="_blank">
                            <FontAwesomeIcon
                              icon={["far", "globe"]}
                              fixedWidth
                            />
                            {member.personal_website}
                          </a>
                        </div>
                      )}
                      {member.github_handle && (
                        <div className="profile-contact-row">
                          <a
                            href={"https://github.com/" + member.github_handle}
                            target="_blank"
                          >
                            <FontAwesomeIcon
                              icon={["fab", "github"]}
                              fixedWidth
                            />
                            {member.github_handle}
                          </a>
                        </div>
                      )}
                      {member.dribbble_handle && (
                        <div className="profile-contact-row">
                          <a
                            href={
                              "https://dribbble.com/" + member.dribbble_handle
                            }
                            target="_blank"
                          >
                            <FontAwesomeIcon
                              icon={["fab", "dribbble"]}
                              fixedWidth
                            />
                            {member.dribbble_handle}
                          </a>
                        </div>
                      )}
                      {member.linkedin_handle && (
                        <div className="profile-contact-row">
                          <a
                            href={
                              "https://linkedin.com/in/" +
                              member.linkedin_handle
                            }
                            target="_blank"
                          >
                            <FontAwesomeIcon
                              icon={["fab", "linkedin"]}
                              fixedWidth
                            />
                            {member.linkedin_handle}
                          </a>
                        </div>
                      )}
                      {member.medium_handle && (
                        <div className="profile-contact-row">
                          <a
                            href={"https://medium.com/@" + member.medium_handle}
                            target="_blank"
                          >
                            <FontAwesomeIcon
                              icon={["fab", "medium-m"]}
                              fixedWidth
                            />
                            {member.medium_handle}
                          </a>
                        </div>
                      )}
                      {member.instagram_handle && (
                        <div className="profile-contact-row">
                          <a
                            href={
                              "https://instagram.com/" + member.instagram_handle
                            }
                            target="_blank"
                          >
                            <FontAwesomeIcon
                              icon={["fab", "instagram"]}
                              fixedWidth
                            />
                            {member.instagram_handle}
                          </a>
                        </div>
                      )}
                      {member.twitter_handle && (
                        <div className="profile-contact-row">
                          <a
                            href={
                              "https://twitter.com/" + member.twitter_handle
                            }
                            target="_blank"
                          >
                            <FontAwesomeIcon
                              icon={["fab", "twitter"]}
                              fixedWidth
                            />
                            {member.twitter_handle}
                          </a>
                        </div>
                      )}
                      {member.facebook_handle && (
                        <div className="profile-contact-row">
                          <a
                            href={
                              "https://www.facebook.com/" +
                              member.facebook_handle
                            }
                            target="_blank"
                          >
                            <FontAwesomeIcon
                              icon={["fab", "facebook-f"]}
                              fixedWidth
                            />
                            {member.facebook_handle}
                          </a>
                        </div>
                      )}
                      {member.snapchat_handle && (
                        <div className="profile-contact-row">
                          <a
                            href={
                              "https://snapchat.com/add/" +
                              member.snapchat_handle
                            }
                            target="_blank"
                          >
                            <FontAwesomeIcon
                              icon={["fab", "snapchat-ghost"]}
                              fixedWidth
                            />
                            {member.snapchat_handle}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileModal.propTypes = {
  changeProfileModalUser: PropTypes.func.isRequired,
  member: PropTypes.object
};

export default ProfileModal;

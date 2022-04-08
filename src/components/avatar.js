import PropTypes from "prop-types";
import React from "react";
import classnames from "classnames";
import Variables from "../variables";

export const getAvatarUrl = (publicId, sizingCSS) => {
  return `${
    Variables.CLOUDINARY_SERVING_URL_PREFIX
  }/c_thumb,g_faces,h_${sizingCSS},w_${sizingCSS}/${publicId} 1x, ${
    Variables.CLOUDINARY_SERVING_URL_PREFIX
  }/c_thumb,g_faces,h_${sizingCSS * 2},w_${sizingCSS * 2}/${publicId} 2x, ${
    Variables.CLOUDINARY_SERVING_URL_PREFIX
  }/c_thumb,g_faces,h_${sizingCSS * 3},w_${sizingCSS * 3}/${publicId} 3x, ${
    Variables.CLOUDINARY_SERVING_URL_PREFIX
  }/c_thumb,g_faces,h_${sizingCSS * 4},w_${sizingCSS * 4}/${publicId} 4x`;
};

const Avatar = ({
  publicId,
  firstName = "",
  lastName = "",
  userName = "",
  sizingCSS = "50"
}) => {
  if (publicId) {
    return (
      <img
        srcSet={getAvatarUrl(publicId, sizingCSS)}
        alt={firstName + " " + lastName}
        className={classnames("img-circle", "user-photo-icon-" + sizingCSS)}
      />
    );
  } else {
    let displayInitials =
      firstName[0] || lastName[0]
        ? [firstName[0], lastName[0]].join("")
        : userName[0];
    return (
      <div
        className={classnames(
          "default-avatar",
          "img-circle",
          "user-photo-icon-" + sizingCSS
        )}
      >
        {displayInitials}
      </div>
    );
  }
};

export default Avatar;

Avatar.propTypes = {
  publicId: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  userName: PropTypes.string,
  sizingCSS: PropTypes.string
};

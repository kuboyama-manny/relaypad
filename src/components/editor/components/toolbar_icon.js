import PropTypes from "prop-types";
import React from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ToolbarIcon(props) {
  switch (props.type) {
    case "SPACER":
    case "SPACER2":
    case "SPACER3":
      return (
        <li
          className="toolbar-spacer"
          onMouseDown={e => {
            e.preventDefault();
          }}
        />
      );
    case "LINK":
      if (props.activeClassName) {
        return (
          <li
            className={classnames("toolbar-icon", props.activeClassName)}
            onMouseDown={e => {
              e.preventDefault();
              props.removeLink();
            }}
          >
            {props.label ? (
              props.label
            ) : (
              <FontAwesomeIcon icon={props.icon} title={props.title} />
            )}
          </li>
        );
      } else {
        return (
          <li
            className={classnames("toolbar-icon", props.activeClassName)}
            onMouseDown={e => {
              e.preventDefault();
              props.toggleLinkField();
            }}
          >
            {props.label ? (
              props.label
            ) : (
              <FontAwesomeIcon icon={props.icon} title={props.title} />
            )}
          </li>
        );
      }
    case "IMAGE":
      return (
        <li
          className={classnames("toolbar-icon", props.activeClassName)}
          onMouseDown={e => {
            e.preventDefault();
            props.showFileSelectionDialog();
          }}
        >
          {props.label ? (
            props.label
          ) : (
            <FontAwesomeIcon icon={props.icon} title={props.title} />
          )}
        </li>
      );
    default:
      return (
        <li
          className={classnames("toolbar-icon", props.activeClassName)}
          onMouseDown={e => {
            e.preventDefault();
            props.type === "INLINE"
              ? props.onToggleInline(props.style)
              : props.onToggleBlock(props.style);
          }}
        >
          {props.label ? (
            props.label
          ) : (
            <FontAwesomeIcon icon={props.icon} title={props.title} />
          )}
        </li>
      );
  }
}

ToolbarIcon.propTypes = {
  activeClassName: PropTypes.string,
  icon: PropTypes.array,
  label: PropTypes.string,
  onToggleBlock: PropTypes.func,
  onToggleInline: PropTypes.func,
  removeLink: PropTypes.func,
  showFileSelectionDialog: PropTypes.func,
  style: PropTypes.string.isRequired,
  title: PropTypes.string,
  toggleLinkField: PropTypes.func,
  type: PropTypes.string.isRequired
};

ToolbarIcon.defaultProps = {
  icon: null,
  label: null,
  title: ""
};

export default ToolbarIcon;

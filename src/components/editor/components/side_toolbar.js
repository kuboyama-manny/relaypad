import PropTypes from "prop-types";
import React, { Component } from "react";
import ToolbarIcon from "./toolbar_icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SIDEBAR_TOOLBAR_OPTIONS = [
  {
    type: "BLOCK",
    icon: ["fas", "h1"],
    title: "Header 1",
    style: "header-one"
  },
  {
    type: "BLOCK",
    icon: ["fas", "h2"],
    title: "Header 2",
    style: "header-two"
  },
  { type: "SPACER", style: "SPACER", label: "" },
  {
    type: "BLOCK",
    icon: ["fas", "list-ul"],
    title: "Unordered List",
    style: "unordered-list-item"
  },
  {
    type: "BLOCK",
    icon: ["fas", "list-ol"],
    title: "Ordered List",
    style: "ordered-list-item"
  },
  { type: "SPACER", style: "SPACER2", label: "" },
  { type: "IMAGE", icon: ["fas", "image"], title: "Image", style: "image" },
  { type: "SPACER", style: "SPACER3", label: "" },
  {
    type: "BLOCK",
    icon: ["fas", "quote-left"],
    title: "Blockquote",
    style: "blockquote"
  },
  {
    type: "BLOCK",
    icon: ["fas", "code"],
    title: "Code Block",
    style: "code-block"
  }
];

const SideToolbarOptionsMenu = ({
  editorState,
  onToggleBlock,
  showFileSelectionDialog
}) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="toolbar side">
      <ul className="toolbar-icons">
        {SIDEBAR_TOOLBAR_OPTIONS.map(item => (
          <ToolbarIcon
            key={item.style || item.icon}
            activeClassName={item.style === blockType ? "active" : null}
            label={item.label}
            icon={item.icon}
            type={item.type}
            onToggleBlock={onToggleBlock}
            showFileSelectionDialog={showFileSelectionDialog}
            style={item.style}
          />
        ))}
      </ul>
    </div>
  );
};

class SideToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false
    };
    this.toggleSideToolbar = this.toggleSideToolbar.bind(this);
  }

  toggleSideToolbar = e => {
    this.setState((prevState, props) => {
      return { isExpanded: !prevState.isExpanded };
    });
    e.preventDefault();
  };

  render() {
    return (
      <div
        id="sideToolbar"
        className="side-toolbar"
        onMouseDown={e => this.toggleSideToolbar(e)}
        onMouseUp={e => e.preventDefault()}
        style={this.props.style}
      >
        <FontAwesomeIcon icon={["fas", "plus-circle"]} id="plusButton" />
        {this.state.isExpanded ? (
          <SideToolbarOptionsMenu
            editorState={this.props.editorState}
            onToggleBlock={this.props.onToggleBlock}
            showFileSelectionDialog={this.props.showFileSelectionDialog}
          />
        ) : null}
      </div>
    );
  }
}

SideToolbar.propTypes = {
  editorState: PropTypes.object.isRequired,
  style: PropTypes.object,
  onToggleBlock: PropTypes.func,
  showFileSelectionDialog: PropTypes.func
};

SideToolbar.defaultProps = {
  style: { top: 0 }
};

export default SideToolbar;

import PropTypes from "prop-types";
import React from "react";
import ToolbarIcon from "./toolbar_icon";
import AddLinkToolbar from "./add_link_toolbar";

const MOBILE_TOOLBAR_OPTIONS = [
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
  { type: "INLINE", icon: ["fas", "bold"], title: "Bold", style: "BOLD" },
  { type: "INLINE", icon: ["fas", "italic"], title: "Italic", style: "ITALIC" },
  {
    type: "INLINE",
    icon: ["fas", "strikethrough"],
    title: "Strikethrough",
    style: "STRIKETHROUGH"
  },
  {
    type: "INLINE",
    icon: ["fas", "code"],
    title: "Inline Code",
    style: "CODE"
  },
  { type: "LINK", icon: ["fas", "link"], title: "Link", style: "LINK" },
  { type: "SPACER", style: "SPACER2", label: "" },
  {
    type: "BLOCK",
    icon: ["fas", "quote-left"],
    title: "Blockquote",
    style: "blockquote"
  },
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
  }
];

const _getSelectionEntityType = (contentState, selection) => {
  if (!selection.isCollapsed()) {
    const contentBlock = contentState.getBlockForKey(selection.getAnchorKey());
    const anchorEntityKey = contentBlock.getEntityAt(
      selection.getAnchorOffset()
    );
    return anchorEntityKey
      ? contentState.getEntity(anchorEntityKey).getType()
      : null;
  } else {
    return null;
  }
};

const _isOptionActive = (
  optionStyle,
  optionType,
  currentInlineStyle,
  currentBlockStyle,
  currentEntityType
) => {
  switch (optionType) {
    case "BLOCK":
      return optionStyle === currentBlockStyle;
    case "LINK":
      return optionStyle === currentEntityType;
    case "INLINE":
      return currentInlineStyle.has(optionStyle);
    default:
      return false;
  }
};

function MobileToolbar(props) {
  // Gather current selection styling information.
  const currentInlineStyle = props.editorState.getCurrentInlineStyle();
  const currentBlockStyle = props.editorState
    .getCurrentContent()
    .getBlockForKey(props.editorState.getSelection().getStartKey())
    .getType();
  const currentEntityType = _getSelectionEntityType(
    props.editorState.getCurrentContent(),
    props.editorState.getSelection()
  );

  if (props.linkFieldStatus) {
    return (
      <AddLinkToolbar
        position={{ top: 0 }}
        addLink={props.addLink}
        toggleLinkField={props.toggleLinkField}
        selection={props.editorState.getSelection()}
      />
    );
  } else {
    return (
      <div className="toolbar mobile" id="mobileToolbar">
        <ul className="toolbar-icons">
          {MOBILE_TOOLBAR_OPTIONS.map(item => (
            <ToolbarIcon
              key={item.style || item.icon}
              type={item.type}
              activeClassName={
                _isOptionActive(
                  item.style,
                  item.type,
                  currentInlineStyle,
                  currentBlockStyle,
                  currentEntityType
                )
                  ? "active"
                  : null
              }
              label={item.label}
              icon={item.icon}
              onToggleInline={props.onToggleInline}
              onToggleBlock={props.onToggleBlock}
              toggleLinkField={props.toggleLinkField}
              removeLink={props.removeLink}
              style={item.style}
            />
          ))}
        </ul>
      </div>
    );
  }
}

MobileToolbar.propTypes = {
  editorState: PropTypes.object.isRequired,
  linkFieldStatus: PropTypes.bool.isRequired,
  onToggleInline: PropTypes.func,
  onToggleBlock: PropTypes.func,
  addLink: PropTypes.func,
  removeLink: PropTypes.func,
  toggleLinkField: PropTypes.func,
  showFileSelectionDialog: PropTypes.func
};

MobileToolbar.defaultProps = {};

export default MobileToolbar;

import PropTypes from "prop-types";
import React, { Component } from "react";
import { convertToRaw } from "draft-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class EditorDevTools extends Component {
  constructor(props) {
    super(props);
    this.logEditorState = this.logEditorState.bind(this);
  }

  logEditorState = () => {
    const content = this.props.editorState.getCurrentContent();
    console.log("editorState: ", convertToRaw(content));
  };

  render() {
    return (
      <button
        className="btn btn-xs btn-default"
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          lineHeight: "1",
          padding: "3px 6px"
        }}
        onClick={this.logEditorState}
      >
        <FontAwesomeIcon
          icon={["fas", "terminal"]}
          title="Log Editor State"
          style={{ height: "10px", width: "auto", verticalAlign: "unset" }}
        />
      </button>
    );
  }
}

EditorDevTools.propTypes = {
  editorState: PropTypes.object.isRequired
};

export default EditorDevTools;

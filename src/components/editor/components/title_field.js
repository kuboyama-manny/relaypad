import PropTypes from "prop-types";
import React, { Component } from "react";

class TitleField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workingTitle: this.props.title ? this.props.title : ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyAction = this.handleKeyAction.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.title !== nextProps.title) {
      this.setState({
        workingTitle: nextProps.title ? nextProps.title : ""
      });
    }
  }

  handleChange = event => {
    this.setState({
      workingTitle: event.target.value
    });
    this.props.handleEdit(event.target.value);
  };

  handleKeyAction(event) {
    const keyCodes = {
      ENTER: 13,
      TAB: 9,
      COMMA: 188,
      BACKSPACE: 8,
      UP_ARROW: 38,
      DOWN_ARROW: 40,
      ESCAPE: 27
    };

    // Return or Tab should change focus to editor
    if (event.keyCode === keyCodes.ENTER || event.keyCode === keyCodes.TAB) {
      event.preventDefault();
      document.getElementsByClassName("public-DraftEditor-content")[0].focus();
    }
  }

  // NOTE: resizing text field inspired by https://www.impressivewebs.com/textarea-auto-resize/

  render() {
    return (
      <div>
        <textarea
          className="title-h1"
          id="noteTitleInput"
          maxLength={200}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyAction}
          placeholder="Title"
          style={{
            height:
              document.getElementById("hiddenTitle") &&
              document.getElementById("hiddenTitle").getBoundingClientRect()
                .height > 0
                ? document.getElementById("hiddenTitle").getBoundingClientRect()
                    .height + "px"
                : "1.2em"
          }}
          value={this.state.workingTitle}
        />
        <div
          id="hiddenTitle"
          className="hidden-div"
          style={{
            width: document.getElementById("noteTitleInput")
              ? document
                  .getElementById("noteTitleInput")
                  .getBoundingClientRect().width + "px"
              : "100%"
          }}
        >
          {this.state.workingTitle}
        </div>
      </div>
    );
  }
}

TitleField.propTypes = {
  title: PropTypes.string,
  handleEdit: PropTypes.func.isRequired
};

export default TitleField;

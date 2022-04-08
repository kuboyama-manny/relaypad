import PropTypes from "prop-types";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AddLinkToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlFieldValue: ""
    };
    this.addLink = this.addLink.bind(this);
    this.onAddURLFieldChange = this.onAddURLFieldChange.bind(this);
  }

  componentDidMount() {
    this.refs.linkField.focus();
  }

  onAddURLFieldChange = event => {
    this.setState({ urlFieldValue: event.target.value });
  };

  addLink = event => {
    event.preventDefault();
    this.props.addLink(this.state.urlFieldValue, this.props.selection);
    this.setState({
      urlFieldValue: "",
      addLinkField: { show: false },
      inlineToolbar: { show: false }
    });
  };

  render() {
    return (
      <div
        className="toolbar inline"
        id="inlineToolbar"
        style={this.props.position}
      >
        <div className="toolbar-link-field">
          <input
            onChange={this.onAddURLFieldChange}
            type="text"
            placeholder="Add a link…"
            value={this.state.urlFieldValue}
            ref="linkField"
            id="linkField"
            onKeyPress={e => {
              e.key === "Enter" && this.addLink(e);
            }}
          />
          <FontAwesomeIcon
            icon={["far", "times"]}
            onMouseDown={e => {
              e.preventDefault();
              this.props.toggleLinkField();
            }}
          />
        </div>
      </div>
    );
  }
}

AddLinkToolbar.propTypes = {
  selection: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
  addLink: PropTypes.func.isRequired,
  toggleLinkField: PropTypes.func.isRequired
};

export default AddLinkToolbar;

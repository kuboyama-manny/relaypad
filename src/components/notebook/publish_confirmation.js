import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";

class PublishConfirmation extends PureComponent {
  constructor(props) {
    super(props);
    this.copyClipboard = this.copyClipboard.bind(this);
    this.state = {
      btnMsg: "Copy Link"
    };
  }
  copyClipboard = content => {
    console.log("🔔 content", content);
    content.select();
    document.execCommand("copy");
    this.setState({
      btnMsg: "Copied"
    });
  };
  render() {
    return (
      <div id="publishConfirmation">
        <div className="alert alert-light alert-dismissible">
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">
              <FontAwesomeIcon icon={["fal", "times"]} fixedWidth />
            </span>
          </button>
          <div>
            <h4>
              <FontAwesomeIcon icon={["fal", "books"]} fixedWidth /> Your note
              has been published
            </h4>
            <p>Anyone on your team can view the note using this link:</p>
            <p className="input-container">
              <span
                className={classnames(
                  "btn btn-sm",
                  this.state.btnMsg === "Copied" ? "btn-success" : "btn-primary"
                )}
                onClick={() => {
                  this.copyClipboard(this.refs.shareMessage);
                }}
              >
                <FontAwesomeIcon icon={["fas", "link"]} fixedWidth />{" "}
                {this.state.btnMsg}
              </span>
              <textarea
                id="shareMessage"
                ref="shareMessage"
                readOnly="readonly"
                defaultValue={this.props.noteURL}
              />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default PublishConfirmation;

PublishConfirmation.propTypes = {
  noteURL: PropTypes.string.isRequired
};

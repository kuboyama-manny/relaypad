import React, { Component } from "react";
import request from "superagent";
import Variables from "../../../variables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Media extends Component {
  constructor(props) {
    super(props);

    // Get necessary entity information from provided contentBlock.
    const entity = props.contentState.getEntity(props.block.getEntityAt(0));

    this.state = {
      upload_pending:
        entity.getData()["upload_pending"] !== undefined
          ? entity.getData()["upload_pending"]
          : false,
      failure: false,
      src: entity.getData()["src"],
      file: entity.getData()["file"],
      team_slug: entity.getData()["team_slug"],
      post_slug: entity.getData()["post_slug"]
    };
    this.renderImageMessage = this.renderImageMessage.bind(this);
  }

  componentWillMount() {
    if (this.state.upload_pending) {
      // This image was just added and needs uploading to Cloudinary.
      let upload = request
        .post(Variables.CLOUDINARY_UPLOAD_URL)
        .field("upload_preset", Variables.CLOUDINARY_UPLOAD_PRESET)
        .field("file", this.state.file)
        .field("folder", this.state.team_slug)
        .field("context", `post_slug=${this.state.post_slug}`);

      upload.end((err, response) => {
        if (err) {
          this.setState({
            upload_pending: false,
            failure: true
          });
        } else if (response.body.public_id !== "") {
          // Image uploaded, update image draft entity with cloudinary url.
          const cloudinary_url = `${Variables.CLOUDINARY_SERVING_URL_PREFIX}/${
            response.body.public_id
          }`;

          this.props.contentState.replaceEntityData(
            this.props.block.getEntityAt(0),
            {
              upload_pending: false,
              public_id: response.body.public_id,
              src: cloudinary_url,
              delete_token: response.body.delete_token
            }
          );

          this.setState({
            upload_pending: false,
            src: cloudinary_url,
            file: null,
            team_slug: null,
            post_slug: null
          });

          // Callback that content changed (in case auto save should occur)
          this.props.blockProps.uploadCompleted();
        }
      });
    }
  }

  renderImageMessage = () => {
    if (this.state.upload_pending) {
      return (
        <div className="image-message">
          <span>
            <FontAwesomeIcon icon={["far", "spinner"]} fixedWidth pulse />{" "}
            Uploading image
          </span>
        </div>
      );
    } else if (this.state.failure) {
      return (
        <div className="image-message">
          <span>
            <FontAwesomeIcon icon={["far", "exclamation-circle"]} fixedWidth />{" "}
            Image upload failed
          </span>
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <div className="img-container">
        <img
          src={this.state.src}
          style={
            this.state.upload_pending || this.state.failure
              ? { opacity: 0.5 }
              : null
          }
          alt=""
          className="img-fluid center-block"
        />
        <div
          className="image-delete-button"
          onClick={() =>
            this.props.blockProps.remove(this.props.block.getKey())
          }
        >
          <FontAwesomeIcon icon={["fas", "trash-alt"]} fixedWidth />
        </div>
        {this.renderImageMessage()}
      </div>
    );
  }
}

export default Media;

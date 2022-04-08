import PropTypes from "prop-types";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DeleteDialog(props) {
  return (
    <div
      className="modal fade"
      id="deleteModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="deleteModalLabel"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Note</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <FontAwesomeIcon aria-hidden="true" icon={["fal", "times"]} />
            </button>
          </div>
          <div className="modal-body">
            <p>Reminder: Deleted notes are gone forever.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
              onClick={props.handleDeleteClick}
            >
              {" "}
              <FontAwesomeIcon icon={["fas", "trash-alt"]} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DeleteDialog.propTypes = {
  handleDeleteClick: PropTypes.func.isRequired
};

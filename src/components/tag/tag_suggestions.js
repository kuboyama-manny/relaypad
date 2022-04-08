import PropTypes from "prop-types";
import React, { Component } from "react";
import Pluralize from "pluralize";
import classnames from "classnames";

export default class TagSuggestions extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.renderTagSuggestions = this.renderTagSuggestions.bind(this);
  }

  handleClick = (tag, teamTags, event) => {
    this.props.addTag(tag.name, teamTags, this.props.note_slug);
    event.preventDefault();
  };

  renderTagSuggestions = () => {
    if (
      this.props.tagForm.tagInput !== "" &&
      this.props.tagForm.suggestedTags.length !== 0
    ) {
      let noSlackTags = this.props.tagForm.suggestedTags.every(
        tag => !tag.linked_to_slack_channel
      );
      return (
        <ul id="tagSuggestions" style={{ left: this.props.positionLeft }}>
          {this.props.tagForm.suggestedTags.map(tag => (
            <li
              key={tag.slug}
              className={
                tag.slug === this.props.tagForm.selectedTagSlug
                  ? "selected"
                  : ""
              }
              onClick={event =>
                this.handleClick(tag, this.props.teamTags, event)
              }
              data-toggle="tooltip"
              data-placement="right"
              data-delay="{&quot;show&quot;:550, &quot;hide&quot;:0}"
              title={
                tag.published_post_count +
                " " +
                Pluralize("Post", tag.published_post_count) +
                ", " +
                tag.subscriber_count +
                " " +
                Pluralize("Subscriber", tag.subscriber_count)
              }
            >
              {tag.linked_to_slack_channel && (
                <i className="fa fa-slack" aria-hidden="true" />
              )}
              <span className={classnames({ slack_tag: !noSlackTags })}>
                {tag.name}
              </span>
            </li>
          ))}
        </ul>
      );
    } else {
      return null;
    }
  };

  render() {
    return this.renderTagSuggestions();
  }
}

TagSuggestions.propTypes = {
  addTag: PropTypes.func.isRequired,
  note_slug: PropTypes.string,
  positionLeft: PropTypes.number,
  tagForm: PropTypes.object.isRequired,
  teamTags: PropTypes.array
};

TagSuggestions.defaultProps = {
  note_slug: "",
  positionLeft: 0,
  teamTags: []
};

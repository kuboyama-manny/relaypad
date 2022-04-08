import PropTypes from "prop-types";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TagSuggestions from "./tag/tag_suggestions";

class TagList extends Component {
  constructor(props) {
    super(props);
    this.handleCharacter = this.handleCharacter.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleKeyAction = this.handleKeyAction.bind(this);
    this.renderTagList = this.renderTagList.bind(this);
  }

  componentDidUpdate() {
    if (this.props.editorStatus.isEnteringTag) {
      this.addTagLink.focus();
    }
  }

  handleCharacter = event => {
    let inputtedTagName = event.currentTarget.value.replace(",", "");
    this.props.handleTagInputChange(
      inputtedTagName,
      this.props.teamTags,
      this.props.tags
    );
  };

  handleClickOutside() {
    this.props.editorStatus.isEnteringTag && this.props.toggleTagInput();
  }

  handleKeyAction = event => {
    const keyCodes = {
      ENTER: 13,
      TAB: 9,
      COMMA: 188,
      BACKSPACE: 8,
      UP_ARROW: 38,
      DOWN_ARROW: 40,
      ESCAPE: 27
    };

    const inputtedTagName = event.currentTarget.value.replace(",", "").trim();
    switch (event.keyCode) {
      case keyCodes.UP_ARROW:
      case keyCodes.DOWN_ARROW:
        // Change suggested tag selection up or down
        this.props.changeSelectedTagSuggestion(
          event.keyCode,
          this.props.tagForm.suggestedTags,
          this.props.tagForm.selectedTagSlug
        );
        event.preventDefault();
        break;

      case keyCodes.BACKSPACE:
        // User hit backspace with no input, possibly to remove last tag in form
        if (
          !this.props.editorStatus.isEnteringTag &&
          this.props.tags.length > 0
        ) {
          this.props.removeTag(
            this.props.tags[this.props.tags.length - 1],
            this.props.note_slug
          );
          event.preventDefault();
        } else if (
          this.props.editorStatus.isEnteringTag &&
          this.props.tagForm.tagInput === ""
        ) {
          this.props.toggleTagInput();
          event.preventDefault();
        }
        break;

      case keyCodes.COMMA:
      case keyCodes.ENTER:
      case keyCodes.TAB:
        // On ",", "tab", or "↵", trigger tag submission if not empty
        if (this.props.tagForm.selectedTagSlug !== "") {
          // User adds a suggested tag
          let tagToAddIndex = this.props.teamTags.findIndex(
            tag => tag.slug === this.props.tagForm.selectedTagSlug
          );
          this.props.addTag(
            this.props.teamTags[tagToAddIndex].name,
            this.props.teamTags,
            this.props.note_slug && this.props.note_slug
          );
        } else if (
          inputtedTagName &&
          this.props.tags.findIndex(
            postTag =>
              postTag.name.toLowerCase() === inputtedTagName.toLowerCase()
          ) === -1
        ) {
          // User entered a new tag name that isn't a duplicate
          this.props.addTag(
            inputtedTagName,
            this.props.teamTags,
            this.props.note_slug && this.props.note_slug
          );
        } else {
          // User hits input key but no characters entered (empty tag)
          this.props.toggleTagInput();
          event.target.blur();
        }
        event.preventDefault();
        break;

      case keyCodes.ESCAPE:
        // On "esc", toggle tag input and blur input element
        this.props.toggleTagInput();
        event.preventDefault();
        event.target.blur();
        break;

      default:
        break;
    }
  };

  renderTagList = () => {
    let leftPos = 0;
    if (this.props.isEditable) {
      if (this.addTagLink) {
        leftPos =
          document.getElementById("newTags").getBoundingClientRect().left -
          document.getElementById("editor").getBoundingClientRect().left;
      }
      return (
        <div
          id="tagContainer"
          ref={ref => {
            this.tagContainer = ref;
          }}
        >
          <ul className="tags addTags clearfix">
            {/* List existing tags and support removal */}
            {this.props.tags &&
              this.props.tags.map(tag => (
                <li
                  key={tag.id}
                  className="label label-default"
                  onClick={event =>
                    this.props.activeTagFilter !== tag.slug &&
                    this.props.setTagFilter(tag.slug)
                  }
                >
                  {tag.name}
                  <FontAwesomeIcon
                    icon={["far", "times"]}
                    title="Remove tag"
                    onClick={e => {
                      this.props.removeTag(tag, this.props.note_slug);
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    }}
                  />
                </li>
              ))}
            {/* Handle entry of a new tag */}
            {this.props.editorStatus.isEnteringTag ? (
              <li id="newTags" className="label label-default">
                <input
                  ref={ref => {
                    this.addTagLink = ref;
                  }}
                  value={this.props.tagForm.tagInput}
                  onKeyDown={this.handleKeyAction}
                  onChange={this.handleCharacter}
                />
              </li>
            ) : (
              <li
                id="newTags"
                className="linky"
                onClick={() => this.props.toggleTagInput()}
              >
                Add a tag…
              </li>
            )}
          </ul>
          {this.props.editorStatus.isEnteringTag && (
            <TagSuggestions
              tagForm={this.props.tagForm}
              teamTags={this.props.teamTags}
              positionLeft={leftPos}
              addTag={this.props.addTag}
              note_slug={this.props.note_slug}
            />
          )}
        </div>
      );
    } else {
      return (
        <ul className="tags">
          {this.props.tags &&
            this.props.tags.map(
              tag =>
                (tag.published_post_count > 0 ||
                  this.props.tagSource !== "sidebar") && (
                  <li
                    key={tag.id}
                    className="label label-default"
                    onClick={event =>
                      this.props.activeTagFilter !== tag.slug &&
                      this.props.setTagFilter(tag.slug)
                    }
                  >
                    {tag.name}
                    {this.props.showCount && (
                      <span className="tag-count">
                        {tag.published_post_count}
                      </span>
                    )}
                  </li>
                )
            )}
        </ul>
      );
    }
  };

  render() {
    return this.renderTagList();
  }
}

TagList.propTypes = {
  activeTagFilter: PropTypes.string,
  addTag: PropTypes.func,
  changeSelectedTagSuggestion: PropTypes.func,
  editorStatus: PropTypes.object,
  NotebookStatus: PropTypes.object,
  handleTagInputChange: PropTypes.func,
  isEditable: PropTypes.bool,
  isSidebarHidden: PropTypes.bool,
  note_slug: PropTypes.string,
  removeTag: PropTypes.func,
  setTagFilter: PropTypes.func.isRequired,
  showCount: PropTypes.bool,
  tagForm: PropTypes.object,
  tags: PropTypes.array,
  tagSource: PropTypes.string,
  teamTags: PropTypes.array,
  toggleTagInput: PropTypes.func
};

TagList.defaultProps = {
  activeTagFilter: "",
  editorStatus: { isEnteringTag: false },
  isEditable: false,
  isSidebarHidden: false,
  note_slug: "",
  showCount: false,
  tags: [],
  tagSource: "sidebar"
};

export default TagList;

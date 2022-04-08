import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import orderBy from "lodash/orderBy";

class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTags: false
    };
    this.toggleTagVisibility = this.toggleTagVisibility.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.activeTagFilter && nextProps.activeTagFilter) {
      this.setState({
        showTags: true
      });
    }
  }

  toggleTagVisibility = event => {
    this.setState((prevState, props) => {
      return { showTags: !prevState.showTags };
    });
  };

  render() {
    const { activeTagFilter, notebookTags, setTagFilter } = this.props;
    return (
      <ul id="navTagsList">
        {/* Sort tags alphabetically */}
        {orderBy(notebookTags, [tag => tag.name.toLowerCase()], ["asc"]).map(
          tag => (
            <li key={tag.id}>
              <span
                className={activeTagFilter === tag.slug ? "active" : ""}
                onClick={event =>
                  activeTagFilter !== tag.slug && setTagFilter(tag.slug)
                }
              >
                <FontAwesomeIcon
                  icon={[activeTagFilter === tag.slug ? "fas" : "fal", "tag"]}
                  fixedWidth
                />
                {tag.name}
              </span>
            </li>
          )
        )}
      </ul>
    );
  }
}

TagList.propTypes = {
  activeTagFilter: PropTypes.string,
  notebookTags: PropTypes.array,
  setTagFilter: PropTypes.func.isRequired
};

TagList.defaultProps = {
  activeTagFilter: "",
  notebookTags: []
};

export default TagList;

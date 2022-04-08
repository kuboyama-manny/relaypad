import PropTypes from "prop-types";
import React, { Component } from "react";
import forEach from "lodash/forEach";
import uniqueId from "lodash/uniqueId";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import smile from "../img/emoji/smile.svg";
import applause from "../img/emoji/applause.svg";
import thumbsup from "../img/emoji/thumbsup.svg";
import cool from "../img/emoji/cool.svg";
import heart from "../img/emoji/heart.svg";
import thinking from "../img/emoji/thinking.svg";
import sad from "../img/emoji/sad.svg";
import fire from "../img/emoji/fire.svg";
import rocket from "../img/emoji/rocket.svg";
import tada from "../img/emoji/tada.svg";
import ReactTooltip from "react-tooltip";

const reactionOptions = {
  SMILE: {
    title: "Smile",
    img: smile
  },
  THUMBS_UP: {
    title: "Like",
    img: thumbsup
  },
  COOL: {
    title: "Cool",
    img: cool
  },
  APPLAUSE: {
    title: "Applause",
    img: applause
  },
  HEART: {
    title: "Heart",
    img: heart
  },
  THINKING: {
    title: "Thinking",
    img: thinking
  },
  SAD: {
    title: "Sad",
    img: sad
  },
  FIRE: {
    title: "Fire",
    img: fire
  },
  ROCKET: {
    title: "Rocket",
    img: rocket
  },
  TADA: {
    title: "Tada",
    img: tada
  }
};

class Reactions extends Component {
  constructor(props) {
    super(props);
    this.handleReactionClick = this.handleReactionClick.bind(this);
    this.renderExistingReactions = this.renderExistingReactions.bind(this);
    this.renderReactionOptions = this.renderReactionOptions.bind(this);
  }

  handleReactionClick = reactionType => {
    this.props.toggleReaction(this.props.content, reactionType);
  };

  renderExistingReactions = existingReactions => {
    return (
      existingReactions &&
      existingReactions.map(reaction => (
        <li
          key={`existing-${reaction.type}`}
          className={classnames(
            "reaction",
            reactionOptions[reaction.type].css,
            {
              yours: reaction.current_member_reaction
            }
          )}
          onClick={() => this.handleReactionClick(reaction.type)}
          data-for="reactionNameHover"
          data-tip={
            (reaction.current_member_reaction === true ? "You<br />" : "") +
            reaction.names.join("<br />")
          }
        >
          <img src={reactionOptions[reaction.type].img} alt={reaction.title} />
          {reaction.count}
        </li>
      ))
    );
  };

  renderReactionOptions = () => {
    let reactionOptionsArray = [];
    forEach(reactionOptions, function(reactionOption, type) {
      reactionOption.type = type;
      reactionOptionsArray.push(reactionOption);
    });

    return (
      <ul tabIndex="0" className={"reaction-options"}>
        {reactionOptionsArray.map(reaction => (
          <li key={`new-${reaction.type}`}>
            <img
              src={reaction.img}
              alt={reaction.title}
              onClick={() => {
                this.handleReactionClick(reaction.type);
                ReactTooltip.hide();
              }}
            />
          </li>
        ))}
      </ul>
    );
  };

  render() {
    var reactionContentId = uniqueId("reactionContent-");
    return (
      <div className="reactions-container">
        <ul className="reactions">
          {this.renderExistingReactions(this.props.content.reactions)}
          <li
            className="reaction-add plus"
            data-tip
            data-for={reactionContentId}
          >
            <span className="add-reaction-icon">
              <FontAwesomeIcon icon={["fal", "smile"]} />
              <FontAwesomeIcon icon={["fal", "plus"]} className="plus" />
            </span>
            <ReactTooltip
              id={reactionContentId}
              ref={reactionContentId}
              effect="solid"
              delayHide={500}
              scrollHide={true}
              isCapture={true}
              type="light"
              className="add-reaction-popover"
            >
              {this.renderReactionOptions()}
            </ReactTooltip>
          </li>
        </ul>
        <ReactTooltip
          id="reactionNameHover"
          effect="solid"
          multiline={true}
          scrollHide={true}
        />
      </div>
    );
  }
}

Reactions.propTypes = {
  content: PropTypes.object.isRequired,
  toggleReaction: PropTypes.func.isRequired
};

export default Reactions;

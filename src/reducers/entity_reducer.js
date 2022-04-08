import { combineReducers } from "redux";
import { ActionTypes } from "../actions/common_actions";
import { ActionTypes as PostActionTypes } from "../actions/post_actions";
import { ActionTypes as TagActionTypes } from "../actions/tag_actions";
import { ActionTypes as ProfileActionTypes } from "../actions/profile_actions";
import { ActionTypes as NotebookActionTypes } from "../actions/notebook_actions";
import merge from "lodash/merge";
import omit from "lodash/omit";

const members = (state = {}, action) => {
  switch (action.type) {
    case ProfileActionTypes.MEMBER_SAVE_PROFILE:
    case ActionTypes.COMPLETE_MEMBER_ONBOARDING:
      return {
        ...state,
        [action.payload.username]: action.error
          ? state[action.payload.username]
          : action.payload
      };
    case PostActionTypes.POST_UNLOAD:
      return {
        ...state,
        [action.member.username]: {
          ...state[action.member.username],
          recentlyPublishedSlug: null
        }
      };
    default:
      // If action payload meets criteria, update entities currently in state.
      if (action.payload && action.payload.entities) {
        return merge({}, state, action.payload.entities.members);
      }
  }
  return state;
};

const teams = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.COMPLETE_TEAM_ONBOARDING:
    case ActionTypes.ADD_SLACK_INTEGRATION:
      return {
        ...state,
        [action.payload.slug]: action.error
          ? state[action.payload.slug]
          : action.payload
      };
    default:
      // If action payload meets criteria, update entities currently in state.
      if (action.payload && action.payload.entities) {
        return merge({}, state, action.payload.entities.teams);
      }
  }
  return state;
};

const posts = (state = {}, action) => {
  switch (action.type) {
    case NotebookActionTypes.NOTE_EDITOR_TITLE_CHANGE:
      return action.note_slug
        ? {
            ...state,
            [action.note_slug]: {
              ...state[action.note_slug],
              title: action.title
            }
          }
        : state;
    case NotebookActionTypes.NOTE_EDITOR_SAVE_NOTE:
    case NotebookActionTypes.NOTE_EDITOR_CREATE_NEW:
      // Member & Tags get returned as full objects but entities expects slugs
      action.payload.tags = action.payload.tags.map(tag => tag.slug);
      action.payload.member = action.payload.member.username;
      return {
        ...state,
        [action.payload.slug]: action.payload
      };
    case NotebookActionTypes.NOTE_EDITOR_DELETE:
      return omit(state, action.payload.slug);
    case ActionTypes.TOGGLE_BOOKMARK:
      return {
        ...state,
        [action.slug]: {
          ...state[action.slug],
          bookmarked: !state[action.slug].bookmarked
        }
      };
    case NotebookActionTypes.NOTE_EDITOR_PUBLISH:
      return {
        ...state,
        [action.payload.slug]: {
          ...state[action.payload.slug],
          published_at: action.payload.published_at,
          status: action.payload.status
        }
      };
    case NotebookActionTypes.NOTE_COMMENT_SUBMIT:
    case PostActionTypes.POST_COMMENT_SUBMIT:
      return {
        ...state,
        [action.slug]: {
          ...state[action.slug],
          comment_count: state[action.slug].comment_count + 1
        }
      };
    case NotebookActionTypes.NOTE_COMMENT_DELETE:
    case PostActionTypes.POST_COMMENT_DELETE:
      return {
        ...state,
        [action.slug]: {
          ...state[action.slug],
          comment_count: state[action.slug].comment_count - 1
        }
      };
    case NotebookActionTypes.NOTE_TAG_ADD_EXISTING:
      return {
        ...state,
        [action.note_slug]: {
          ...state[action.note_slug],
          tags: [...state[action.note_slug].tags, action.tag.slug]
        }
      };
    case NotebookActionTypes.NOTE_TAG_ADD_NEW:
      return {
        ...state,
        [action.note_slug]: {
          ...state[action.note_slug],
          tags: [...state[action.note_slug].tags, action.payload.slug]
        }
      };
    case NotebookActionTypes.NOTE_TAG_REMOVAL:
      let tagIndex = state[action.note_slug].tags.findIndex(
        x => x === action.tag.slug
      );
      return {
        ...state,
        [action.note_slug]: {
          ...state[action.note_slug],
          tags: [
            ...state[action.note_slug].tags.slice(0, tagIndex),
            ...state[action.note_slug].tags.slice(tagIndex + 1)
          ]
        }
      };
    case PostActionTypes.REACT_TO_POST:
      let reactionIndex = state[action.slug].reactions.findIndex(
        x => x.type === action.reaction_type
      );
      if (reactionIndex === -1) {
        // Add new reaction
        return {
          ...state,
          [action.slug]: {
            ...state[action.slug],
            reactions: [
              ...state[action.slug].reactions,
              {
                count: 1,
                current_member_reaction: true,
                names: [],
                type: action.reaction_type
              }
            ]
          }
        };
      } else {
        let existingReactionSummary =
          state[action.slug].reactions[reactionIndex];
        if (existingReactionSummary.count === 1 && !action.payload) {
          // Remove reaction
          return {
            ...state,
            [action.slug]: {
              ...state[action.slug],
              reactions: [
                ...state[action.slug].reactions.slice(0, reactionIndex),
                ...state[action.slug].reactions.slice(reactionIndex + 1)
              ]
            }
          };
        } else {
          // Alter reaction meta data
          return {
            ...state,
            [action.slug]: {
              ...state[action.slug],
              reactions: [
                ...state[action.slug].reactions.slice(0, reactionIndex),
                {
                  count: action.payload
                    ? existingReactionSummary.count + 1
                    : existingReactionSummary.count - 1,
                  current_member_reaction: action.payload ? true : false,
                  names: state[action.slug].reactions[reactionIndex].names,
                  type: action.reaction_type
                },
                ...state[action.slug].reactions.slice(reactionIndex + 1)
              ]
            }
          };
        }
      }
    default:
      // If action payload meets criteria, update entities currently in state.
      if (action.payload && action.payload.entities) {
        return merge({}, state, action.payload.entities.posts);
      }
  }

  return state;
};

const tags = (state = {}, action) => {
  switch (action.type) {
    case TagActionTypes.TAG_TOGGLE_SUBSCRIPTION:
      return {
        ...state,
        [action.slug]: {
          ...state[action.slug],
          subscribed: !state[action.slug].subscribed,
          subscriber_count: state[action.slug].subscribed
            ? state[action.slug].subscriber_count - 1
            : state[action.slug].subscriber_count + 1
        }
      };
    case NotebookActionTypes.NOTE_TAG_ADD_NEW:
      // NOTE: I'm not sure the way I'm assigning an ID is good, but it keeps the app from crashing. 🙈
      return {
        ...state,
        [action.payload.slug]: {
          ...state[action.payload.slug],
          feed_uri: "/relaypad/tag/" + action.payload.slug,
          id: Object.keys(state).length + 1,
          linked_to_slack_channel: false,
          name: action.payload.name,
          published_post_count: 0,
          slug: action.payload.slug,
          subscribed: false,
          subscriber_count: 0
        }
      };
    default:
      // If action payload meets criteria, update entities currently in state.
      if (action.payload && action.payload.entities) {
        return merge({}, state, action.payload.entities.tags);
      }
  }
  return state;
};

const comments = (state = {}, action) => {
  switch (action.type) {
    case NotebookActionTypes.NOTE_COMMENT_SUBMIT:
    case PostActionTypes.POST_COMMENT_SUBMIT:
      return {
        ...state,
        [action.payload.id]: action.error ? null : action.payload
      };
    case NotebookActionTypes.NOTE_COMMENT_DELETE:
    case PostActionTypes.POST_COMMENT_DELETE:
      return omit(state, action.id);
    case PostActionTypes.REACT_TO_COMMENT:
      let index = state[action.id].reactions.findIndex(
        x => x.type === action.reaction_type
      );
      if (index === -1) {
        // Add new reaction.
        return {
          ...state,
          [action.id]: {
            ...state[action.id],
            reactions: [
              ...state[action.id].reactions,
              {
                count: 1,
                current_member_reaction: true,
                names: [],
                type: action.reaction_type
              }
            ]
          }
        };
      } else {
        let existingReactionSummary = state[action.id].reactions[index];
        if (existingReactionSummary.count === 1 && !action.payload) {
          // Remove reaction.
          return {
            ...state,
            [action.id]: {
              ...state[action.id],
              reactions: [
                ...state[action.id].reactions.slice(0, index),
                ...state[action.id].reactions.slice(index + 1)
              ]
            }
          };
        } else {
          // Alter reaction meta data.
          return {
            ...state,
            [action.id]: {
              ...state[action.id],
              reactions: [
                ...state[action.id].reactions.slice(0, index),
                {
                  count: action.payload
                    ? existingReactionSummary.count + 1
                    : existingReactionSummary.count - 1,
                  current_member_reaction: action.payload ? true : false,
                  names: state[action.id].reactions[index].names,
                  type: action.reaction_type
                },
                ...state[action.id].reactions.slice(index + 1)
              ]
            }
          };
        }
      }
    default:
      // If action payload meets criteria, update entities currently in state.
      if (action.payload && action.payload.entities) {
        return merge({}, state, action.payload.entities.comments);
      }
  }
  return state;
};

const entities = combineReducers({
  members,
  teams,
  posts,
  tags,
  comments
});

export default entities;

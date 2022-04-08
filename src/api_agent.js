import superagentPromise from "superagent-promise";
import _superagent from "superagent";
import Variables from "./variables";

const superagent = superagentPromise(_superagent, global.Promise);
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set("Authorization", "Bearer " + token);
  }
};

const requests = {
  get: url =>
    superagent
      .get(`${Variables.API_ROOT}${url}`)
      .use(tokenPlugin)
      .then(responseBody),
  delete: url =>
    superagent
      .del(`${Variables.API_ROOT}${url}`)
      .use(tokenPlugin)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${Variables.API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${Variables.API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  patch: (url, body) =>
    superagent
      .patch(`${Variables.API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody)
};

const Member = {
  current: () => requests.get("/members/current/"),
  notifications: () => requests.get(`/notifications/`),
  mark_notifications_as_seen: () => requests.put(`/notifications/`),
  detail: username => requests.get(`/members/${username}/`),
  update: member => requests.patch(`/members/${member.username}/`, { member }),
  get_settings: () => requests.get(`/preferences/notifications/`),
  update_setting: (setting, value) => {
    let parameters = {};
    parameters[setting] = value; // Way to have parameter name be variable.
    return requests.post(`/preferences/notifications/`, parameters);
  }
};

const Feed = {
  latest: (offset, page_size = Variables.PAGE_SIZE) =>
    requests.get(`/posts/?limit=${page_size}&offset=${offset}`),
  byAuthor: (username, offset) =>
    requests.get(
      `/posts/?limit=${Variables.PAGE_SIZE}&offset=${offset}&author=${username}`
    ),
  byTag: (tag_slug, offset) =>
    requests.get(
      `/posts/?limit=${Variables.PAGE_SIZE}&offset=${offset}&tag=${tag_slug}`
    )
};

const Notes = {
  list: (offset, page_size = Variables.PAGE_SIZE) =>
    requests.get(`/notes/?limit=${page_size}&offset=${offset}`)
};

const Team = {
  all: () => requests.get("/teams/"),
  update: team => requests.put(`/teams/${team.slug}/`, { team }),
  add_slack_integration: team =>
    requests.post(`/teams/${team.slug}/slack_integration/`)
};

const Tags = {
  list: () => requests.get("/tags/"),
  detail: tag_slug => requests.get(`/tags/${tag_slug}/`),
  create: tag_name => requests.post("/tags/", { name: tag_name }),
  subscribe: tag_slug => requests.post(`/tags/${tag_slug}/subscribe/`),
  delete_subscription: tag_slug =>
    requests.delete(`/tags/${tag_slug}/subscribe/`)
};

const Post = {
  detail: post_slug => requests.get(`/posts/${post_slug}/`),
  create: post =>
    requests.post("/posts/", {
      title: post.title,
      content: post.content,
      tags: post.tags
    }),
  save: post =>
    requests.put(`/posts/${post.slug}/`, {
      title: post.title,
      content: post.content,
      tags: post.tags
    }),
  update: post => requests.put(`/posts/${post.slug}/`, { post }),
  bookmark: post_slug => requests.post(`/posts/${post_slug}/bookmark/`),
  remove_bookmark: post_slug =>
    requests.delete(`/posts/${post_slug}/bookmark/`),
  get_comments: (post_slug, offset = 0, page_size = Variables.PAGE_SIZE) =>
    requests.get(
      `/posts/${post_slug}/comments/?limit=${page_size}&offset=${offset}`
    ),
  create_comment: (post_slug, content) =>
    requests.post(`/posts/${post_slug}/comments/`, { content }),
  create_reaction: (post_slug, type) =>
    requests.post(`/posts/${post_slug}/react/`, { type }),
  delete_reaction: (post_slug, type) =>
    requests.put(`/posts/${post_slug}/react/`, { type })
};

const Comment = {
  delete_comment: comment_id => requests.delete(`/comments/${comment_id}/`),
  create_reaction: (comment_id, type) =>
    requests.post(`/comments/${comment_id}/react/`, { type }),
  delete_reaction: (comment_id, type) =>
    requests.put(`/comments/${comment_id}/react/`, { type })
};

const Drafts = {
  list: offset =>
    requests.get(`/drafts/?limit=${Variables.PAGE_SIZE}&offset=${offset}`)
};

const Bookmarks = {
  list: (offset, page_size = Variables.PAGE_SIZE) =>
    requests.get(`/bookmarks/?limit=${page_size}&offset=${offset}`)
};

const Search = {
  query: (query, offset, page_size = Variables.PAGE_SIZE) =>
    requests.get(`/search/?limit=${page_size}&offset=${offset}&q=${query}/`)
};

export default {
  Bookmarks,
  Comment,
  Drafts,
  Feed,
  Member,
  Notes,
  Post,
  Search,
  Tags,
  Team,
  setToken: _token => {
    token = _token;
  }
};

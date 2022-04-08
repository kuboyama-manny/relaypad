import PropTypes from "prop-types";
import React from "react";
import TagList from "../tag_list";
import isMobile from "../utils/mobile_check";
import PostByline from "./post_byline";
import { Link } from "react-router-dom";

function PostPreview(props) {
  const { post } = props;

  let snippetLength = 200;
  !isMobile() && (snippetLength = 100);

  let postSnippet = post.content.replace(/(<([^>]+)>)/gi, "");
  postSnippet = postSnippet
    .replace(/(\.+|:|!|\?)("*|'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2||")
    .split("||")[0];

  // Truncate string at screen-size specific length
  if (postSnippet.length > snippetLength) {
    postSnippet = postSnippet.substring(0, snippetLength);
    postSnippet = postSnippet.substr(0, postSnippet.lastIndexOf(" "));
  }

  return (
    <div className="feed-post">
      {post.status !== "DRAFT" && (
        <div className="post-metadata">
          <PostByline post={post} />
        </div>
      )}
      <h3>
        {post.status === "PUBLISHED" ? (
          <Link to={post.detail_uri}>{post.title}</Link>
        ) : (
          <Link to={post.edit_uri}>{post.title}</Link>
        )}
      </h3>
      {!isMobile() ? (
        <p className="post-snippet">
          <span dangerouslySetInnerHTML={{ __html: postSnippet }} />{" "}
          <Link to={post.detail_uri} className="feed-readmore">
            Read more…
          </Link>
        </p>
      ) : (
        <p className="post-snippet">
          <Link to={post.detail_uri}>
            <span dangerouslySetInnerHTML={{ __html: postSnippet }} />{" "}
            <span className="feed-readmore">Read more…</span>
          </Link>
        </p>
      )}
      <TagList tags={post.tags} />
    </div>
  );
}

PostPreview.propTypes = {
  post: PropTypes.object.isRequired
};

export default PostPreview;

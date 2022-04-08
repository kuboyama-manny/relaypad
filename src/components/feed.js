import PropTypes from "prop-types";
import React from "react";
import PostPreview from "./post/post_preview";
import LoadingSpinner from "./utils/loading_spinner";
import Pagination from "./utils/pagination";

const Feed = ({ posts, isLoading, toggleBookmark, pagination, changePage }) => {
  if (!isLoading && posts.length > 0) {
    return (
      <div className="feed">
        <div>
          {posts.map(post => (
            <PostPreview
              post={post}
              toggleBookmark={toggleBookmark}
              key={post.id}
            />
          ))}
        </div>
        {pagination &&
          <Pagination pagination={pagination} changePage={changePage} />}
      </div>
    );
  } else if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return null;
  }
};

Feed.propTypes = {
  posts: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  toggleBookmark: PropTypes.func,
  pagination: PropTypes.object,
  changePage: PropTypes.func
};

export default Feed;

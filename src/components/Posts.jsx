import PropTypes from "prop-types";
import { useLayoutEffect, useMemo } from "react";
import { Alert } from "react-bootstrap";
import { v4 } from "uuid";
import usePostsContext from "../hooks/usePostsContext";
import { getPosts } from "../services/postService";
import PostToolbar from "./PostToolbar";
import PostCardNew from "./PostCardNew";
import PostCard from "./PostCard";
import * as css from "../styles/Posts.module.css";

const propTypes = {
  isSelf: PropTypes.bool.isRequired,
  ownerId: PropTypes.string.isRequired
};

export default function Posts({ isSelf, ownerId }) {
  const {
    setWorkerPaused,
    setIsSelf,
    setOwnerId,
    posts,
    setPosts,
    showAddPost,
    setShowAddPost,
    addPostDisabled,
    searchDisabled,
    onClickAdd,
    onCloseNew,
  } = usePostsContext();

  // on mount
  useLayoutEffect(() => {
    setIsSelf(isSelf);
    setOwnerId(ownerId);
    getPosts(ownerId).then((_posts) => setPosts(_posts));
  }, []);

  const postCards = useMemo(() => (
    posts.map(({ _id }) => (
      <PostCard
        key={v4()}
        ownerId={ownerId}
        isSelf={isSelf}
        posts={posts}
        setPosts={setPosts}
        postId={_id}
      />
    ))
  ), [posts]);

  return (
    <div className={css.Posts}>
      <PostToolbar
        ownerId={ownerId}
        posts={posts}
        setPosts={setPosts}
        onClickAdd={onClickAdd}
        addPostDisabled={addPostDisabled}
        searchDisabled={searchDisabled}
        setWorkerPaused={setWorkerPaused}
      />
      <Alert className={css.Alert} variant="" show={showAddPost} onClose={onCloseNew} dismissible>
        <PostCardNew
          ownerId={ownerId}
          posts={posts}
          setPosts={setPosts}
          setShow={setShowAddPost}
        />
      </Alert>
      {posts.length ? (
        <div className={css.PostCards}>
          {postCards}
        </div>
      ) : <p>There are no posts yet.</p>}
    </div>
  );
}

Posts.propTypes = propTypes;

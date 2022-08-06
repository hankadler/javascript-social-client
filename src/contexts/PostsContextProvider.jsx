import PropTypes from "prop-types";
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import { getPosts } from "../services/postService";

export const PostsContext = createContext(null);

const propTypes = {
  children: PropTypes.node.isRequired
};

export default function PostsContextProvider({ children }) {
  const worker = useRef(0);
  const [workerPaused, setWorkerPaused] = useState(false);
  const [ownerId, setOwnerId] = useState("");
  const [isSelf, setIsSelf] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [addPostDisabled, setAddPostDisabled] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(true);

  // work handler
  const refreshPosts = () => {
    getPosts(ownerId).then((_posts) => {
      if (!_.isEqual(_.pick(_posts, "_id"), _.pick(posts, "_id"))) setPosts(_posts);
    });
  };

  // on change showAddPost
  useEffect(() => setAddPostDisabled(showAddPost), [showAddPost]);

  // on change posts
  useEffect(() => {
    if (ownerId) {
      setSearchDisabled(posts.length === 0);
      clearInterval(worker.current);
      if (!workerPaused) worker.current = setInterval(refreshPosts, 3000);
    }
  }, [posts]);

  // on unmount
  useEffect(() => () => clearInterval(worker.current), []);

  const onClickAdd = useCallback(async () => setShowAddPost(true), []);

  const onCloseNew = useCallback(async () => setShowAddPost(false), []);

  const value = useMemo(() => ({
    worker,
    workerPaused,
    setWorkerPaused,
    ownerId,
    setOwnerId,
    isSelf,
    setIsSelf,
    posts,
    setPosts,
    showAddPost,
    setShowAddPost,
    addPostDisabled,
    setAddPostDisabled,
    searchDisabled,
    setSearchDisabled,
    onClickAdd,
    onCloseNew,
  }), [
    worker,
    workerPaused,
    ownerId,
    isSelf,
    posts,
    showAddPost,
    addPostDisabled,
    searchDisabled
  ]);

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

PostsContextProvider.propTypes = propTypes;

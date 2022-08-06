import { useEffect, useState } from "react";
import _ from "lodash";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import useAppContext from "../hooks/useAppContext";
import { getUser } from "../services/userService";
import { getPosts } from "../services/postService";
import PostCard from "./PostCard";
import * as css from "../styles/Latest.module.css";

export default function Latest() {
  const navigate = useNavigate();
  const { selfId } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshInterval, setRefreshInterval] = useState(0);
  const [latest, setLatest] = useState([]);

  const getLatest = async () => {
    const { watchlist } = await getUser(selfId, "select=watchlist");
    const _latest = [];
    await Promise.all(
      watchlist.map((userId) => getPosts(userId)
        .then((_posts) => {
          if (_posts.length) {
            _latest.push({ ownerId: userId, postId: _posts[0]._id });
            setPosts([...posts, _posts[0]]);
          }
        }))
    );
    if (!_.isEqual(_latest, latest)) setLatest(_latest);
  };

  // on mount: fetch latest post from each user in watchlist
  useEffect(() => {
    getLatest().catch((error) => console.log(error));
    setRefreshInterval(setInterval(() => getLatest(), 60000)); // refresh every min
    setMounted(true);
  }, []);

  // clear interval on unmount
  useEffect(() => () => clearInterval(refreshInterval), []);

  const link = (
    <Button className="link-primary p-1 pb-2" variant="link" onClick={() => navigate("/people")}>
      People
    </Button>
  );

  return mounted ? (
    <div className={css.Latest}>
      {latest.length ? latest.map((post, index) => (
        <PostCard
          key={v4()}
          ownerId={latest[index].ownerId}
          isSelf={false}
          posts={posts}
          setPosts={setPosts}
          postId={latest[index].postId}
        />
      )) : (
        <p>
          Go to {link} and click on the eye icon to add person to
          watchlist and see latest post here.
        </p>
      )}
    </div>
  ) : null;
}

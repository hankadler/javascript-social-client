import PropTypes from "prop-types";
import { useState, memo, useCallback } from "react";
import { Button, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { v4 } from "uuid";
import { getPosts } from "../services/postService";
import Search from "./Search";
import * as css from "../styles/PostToolbar.module.css";
import addIcon from "../assets/add.png";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  posts: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  setPosts: PropTypes.func.isRequired,
  onClickAdd: PropTypes.func.isRequired,
  addPostDisabled: PropTypes.bool.isRequired,
  searchDisabled: PropTypes.bool.isRequired,
  setWorkerPaused: PropTypes.func.isRequired
};

function PostToolbar({
  ownerId, posts, setPosts, onClickAdd, addPostDisabled, searchDisabled, setWorkerPaused
}) {
  const [searchValue, setSearchValue] = useState("");

  const onSearch = useCallback(async () => {
    setWorkerPaused(true);
    setPosts(
      posts.filter(({ content }) => content.text.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [searchValue]);

  const onClear = useCallback(async () => {
    setPosts(await getPosts(ownerId));
    setWorkerPaused(false);
  }, []);

  return (
    <div className={css.PostToolbar}>
      <OverlayTrigger placement="bottom" overlay={<Tooltip id={v4()}>Add Post</Tooltip>}>
        <Button className="icon" variant="" onClick={onClickAdd} disabled={addPostDisabled}>
          <Image src={addIcon} width={32} height={32} />
        </Button>
      </OverlayTrigger>
      <Search
        value={searchValue}
        setValue={setSearchValue}
        onSearch={onSearch}
        onClear={onClear}
        disabled={searchDisabled}
      />
    </div>
  );
}

PostToolbar.propTypes = propTypes;

export default memo(PostToolbar);

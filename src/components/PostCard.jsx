import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Form, Image } from "react-bootstrap";
import config from "../config";
import useAppContext from "../hooks/useAppContext";
import usePostsContext from "../hooks/usePostsContext";
import useContent from "../hooks/useContent";
import { getUser } from "../services/userService";
import { getComments } from "../services/commentService";
import { deletePost, getPost, patchPost } from "../services/postService";
import EmbeddedMediaViewer from "./EmbeddedMediaViewer";
import ReactionToolbar from "./ReactionToolbar";
import Comments from "./Comments";
import CommentCardNew from "./CommentCardNew";
import * as css from "../styles/PostCard.module.css";
import moreIcon from "../assets/more.png";

const propTypes = {
  isSelf: PropTypes.bool.isRequired,
  ownerId: PropTypes.string.isRequired,
  posts: PropTypes.instanceOf(Array).isRequired,
  setPosts: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired
};

function PostCard({ isSelf, ownerId, posts, setPosts, postId }) {
  const navigate = useNavigate();
  const { selfId, setModalChild, showModal, setShowModal } = useAppContext();
  const { setWorkerPaused } = usePostsContext(); // todo: is this needed?
  const {
    textRef,
    showMore,
    text,
    setText,
    textDisabled,
    setTextDisabled,
    setModifiedAt,
    ago,
    onClickMore,
    onToggleMore,
    onChangeText
  } = useContent();
  const [owner, setOwner] = useState(null);
  const [author, setAuthor] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const fetchOwner = async (userId) => {
    const _owner = await getUser(userId, "select=_id,name,image");
    setOwner(_owner);
    return _owner;
  };

  const fetchPost = async () => {
    const _post = await getPost(ownerId, postId);
    if (_post) {
      setAuthor(await getUser(_post.content.authorId, "select=_id,name,image"));
      setPost(_post);
    }
    return _post;
  };

  const fetchComments = async () => {
    const _comments = await getComments(ownerId, { postId });
    setComments(_comments);
    return _comments;
  };

  // on change posts
  useEffect(() => {
    fetchOwner(ownerId).then(() => {
      fetchPost().then((_post) => {
        if (_post) {
          setText(_post.content.text);
          setModifiedAt(_post.content.modifiedAt);
        }
      });
    });
  }, [posts]);

  // on change post
  useEffect(() => {
    if (post) fetchComments().catch();
  }, [post]);

  // on change showModal
  useEffect(() => setWorkerPaused(showModal), [showModal]); // todo: is this needed?

  const onBlurText = async () => {
    await patchPost(ownerId, postId, { text });
    setModifiedAt(Date.now());
    setTextDisabled(true);
  };

  const onClickEdit = async () => setTextDisabled(false);

  const onDelete = async () => {
    await deletePost(ownerId, postId);
    setPosts(posts.filter(({ _id }) => _id !== postId));
  };

  const onClickAvatar = async () => {
    navigate(selfId === ownerId ? "/home/about" : `/people/${ownerId}/about`);
  };

  const modalMediaViewer = post ? (
    <EmbeddedMediaViewer sources={post.content.media.map(({ src }) => src)} />
  ) : null;

  const onClickImage = async () => {
    setModalChild(modalMediaViewer);
    setShowModal(true);
  };

  return owner && author && post && comments ? (
    <div className={css.PostCard}>
      <header>
        <Image src={author.image} width={50} roundedCircle onClick={onClickAvatar} />
        <p>{author.name}</p>
        {isSelf ? (
          <Dropdown show={showMore} onToggle={onToggleMore}>
            <Button className="icon" variant="" onClick={onClickMore}>
              <Image src={moreIcon} width={16} height={16} />
            </Button>
            <Dropdown.Menu align="end">
              {selfId === ownerId ? (
                <Dropdown.Item onClick={onClickEdit}>Edit</Dropdown.Item>
              ) : null}
              <Dropdown.Item onClick={onDelete}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : null}
      </header>

      <main>
        <section className={css.TextContainer}>
          {textDisabled ? (
            <pre>{text}</pre>
          ) : (
            <Form.Control
              ref={textRef}
              as="textarea"
              rows={Math.round(text.length / 130) || 1}
              value={text}
              onChange={onChangeText}
              onBlur={onBlurText}
              maxLength={config.charLimit.post}
              disabled={textDisabled}
            />
          )}
          {textDisabled || (
            <p className="label">{text.length} / {config.charLimit.post}</p>
          )}
        </section>

        <section
          className={comments.length && post.content.media.length
            ? css.TwoColContainer
            : css.OneColContainer}
        >
          {post.content.media.length ? (
            <aside className={css.OneColContainer}>
              <EmbeddedMediaViewer
                sources={post.content.media.map(({ src }) => src)}
                onClickImage={onClickImage} // todo: refactor inside
              />
            </aside>
          ) : null}

          {comments.length ? (
            <aside className={css.CommentsContainer}>
              <header className={css.CommentsHeader}>
                <h6>Comments</h6>
                <p className={css.badge}>{comments.length}</p>
              </header>
              <main className={css.CommentsBody}>
                <Comments
                  ownerId={ownerId}
                  comments={comments}
                  setComments={setComments}
                  postId={postId}
                />
              </main>
            </aside>
          ) : null}
        </section>
      </main>

      <footer>
        <ReactionToolbar
          ownerId={ownerId}
          postId={postId}
          authorId={author._id}
          commentNode={(
            <div className={css.ModalCommentCardNew}>
              <CommentCardNew
                ownerId={ownerId}
                comments={comments}
                setComments={setComments}
                postId={postId}
              />
            </div>
          )}
          isModal
        />
        <p className="label">{ago}</p>
      </footer>
    </div>
  ) : null;
}

PostCard.propTypes = propTypes;

export default memo(PostCard);

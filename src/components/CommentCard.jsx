import PropTypes from "prop-types";
import { useEffect, useState, memo } from "react";
import { Button, Dropdown, Image, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import config from "../config";
import useAppContext from "../hooks/useAppContext";
import useContent from "../hooks/useContent";
import { getUser } from "../services/userService";
import { deleteComment, getComment, patchComment } from "../services/commentService";
import EmbeddedMediaViewer from "./EmbeddedMediaViewer";
import ReactionToolbar from "./ReactionToolbar";
import * as css from "../styles/CommentCard.module.css";
import moreIcon from "../assets/more.png";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  comments: PropTypes.instanceOf(Array).isRequired,
  setComments: PropTypes.func.isRequired,
  fileId: PropTypes.string,
  postId: PropTypes.string,
  commentId: PropTypes.string.isRequired
};

const defaultProps = {
  fileId: "",
  postId: "",
};

function CommentCard({ ownerId, comments, setComments, fileId, postId, commentId }) {
  const navigate = useNavigate();
  const { selfId, setModalChild, setShowModal } = useAppContext();
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
    onClickEdit,
    onChangeText
  } = useContent();
  const [author, setAuthor] = useState(null);
  const [comment, setComment] = useState(null);

  const fetchAuthor = async (userId) => {
    const _author = await getUser(userId, "select=_id,name,image");
    setAuthor(_author);
    return _author;
  };

  const fetchComment = async () => {
    const _comment = await getComment(ownerId, { fileId, postId, commentId });
    setComment(_comment);
    return _comment;
  };

  // on change comments
  useEffect(() => {
    fetchComment().then((_comment) => {
      if (_comment) {
        setText(_comment.message.text);
        setModifiedAt(_comment.message.modifiedAt);
        fetchAuthor(_comment.message.authorId).catch((error) => console.log(error));
      }
    });
  }, [comments]);

  const onClickAvatar = async () => {
    navigate(selfId === ownerId ? "/home/about" : `/people/${ownerId}/about`);
  };

  const onBlurText = async () => {
    await patchComment(ownerId, { fileId, postId, commentId }, { text });
    setModifiedAt(Date.now());
    setTextDisabled(true);
  };

  const onDelete = async () => {
    await deleteComment(ownerId, { fileId, postId, commentId });
    setComments(comments.filter(({ _id }) => _id !== commentId));
  };

  const modalMediaViewer = comment ? (
    <EmbeddedMediaViewer sources={comment.message.media.map(({ src }) => src)} />
  ) : null;

  const onClickImage = async () => {
    setModalChild(modalMediaViewer);
    setShowModal(true);
  };

  return author && comment ? (
    <div className={css.CommentCard}>
      <header>
        <Image src={author.image} width={50} roundedCircle onClick={onClickAvatar} />
        <h6>{author.name}</h6>
        <Dropdown show={showMore} onToggle={onToggleMore}>
          <Button className="icon" variant="" onClick={onClickMore}>
            <Image src={moreIcon} width={16} height={16} />
          </Button>
          <Dropdown.Menu className={css.DropdownMenu}>
            {selfId === author._id ? (
              <Dropdown.Item onClick={onClickEdit}>Edit</Dropdown.Item>
            ) : null}
            <Dropdown.Item onClick={onDelete}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </header>
      <main>
        {comment.message.media.length ? (
          <EmbeddedMediaViewer
            sources={comment.message.media.map(({ src }) => src)}
            onClickImage={onClickImage}
          />
        ) : null}
        {textDisabled ? (
          <pre>{text}</pre>
        ) : (
          <Form.Control
            ref={textRef}
            as="textarea"
            rows={Math.round(text.length / 32) + 1}
            value={text}
            onChange={onChangeText}
            onBlur={onBlurText}
            maxLength={config.charLimit.comment}
            disabled={textDisabled}
          />
        )}
        {textDisabled || <p className="label">{text.length} / {config.charLimit.comment}</p>}
      </main>
      <footer>
        <ReactionToolbar
          ownerId={ownerId}
          fileId={fileId}
          postId={postId}
          commentId={commentId}
          authorId={author._id}
        />
        <p className="label">{ago}</p>
      </footer>
    </div>
  ) : null;
}

CommentCard.propTypes = propTypes;
CommentCard.defaultProps = defaultProps;

export default memo(CommentCard);

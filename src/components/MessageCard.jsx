import PropTypes from "prop-types";
import { useEffect, useRef, useState, memo } from "react";
import { Image, Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAppContext from "../hooks/useAppContext";
import toAgo from "../utils/toAgo";
import { getUser } from "../services/userService";
import { deleteMessage } from "../services/messageService";
import EmbeddedMediaViewer from "./EmbeddedMediaViewer";
import * as css from "../styles/MessageCard.module.css";
import moreIcon from "../assets/more.png";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  conversationId: PropTypes.string.isRequired,
  messages: PropTypes.instanceOf(Array).isRequired,
  setMessages: PropTypes.func.isRequired,
  message: PropTypes.instanceOf(Object).isRequired
};

function MessageCard({ ownerId, conversationId, messages, setMessages, message }) {
  const { _id: messageId, authorId, modifiedAt, media, text } = message;

  const navigate = useNavigate();
  const isMounted = useRef(false);
  const { setModalChild, setShowModal } = useAppContext();
  const [author, setAuthor] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const refresher = useRef(0);
  const [ago, setAgo] = useState("");

  // on mount
  useEffect(() => {
    // set author & refresher
    getUser(authorId, "select=_id,image,name")
      .then((_author) => {
        setAuthor(_author);
        refresher.current = setInterval(() => setAgo(toAgo(modifiedAt)), 1000);
        isMounted.current = true;
      });
  }, []);

  // on unmount
  useEffect(() => () => clearInterval(refresher.current), []); // unset refresher

  const onClickAvatar = async () => {
    navigate(ownerId === authorId ? "/home/about" : `/people/${authorId}/about`);
  };

  const onClickMore = async () => setShowMore(true);

  const onToggleMore = async (nextShow) => setShowMore(nextShow);

  const onDelete = async () => {
    await deleteMessage(ownerId, conversationId, messageId);
    setMessages(messages.filter(({ _id }) => _id !== messageId));
  };

  let classNames;
  if (isMounted.current) {
    classNames = (
      ownerId === authorId
        ? `${css.MessageCard} ${css.yours}`
        : `${css.MessageCard} ${css.theirs}`
    );
  } else {
    classNames = "";
  }

  const modalMediaViewer = (
    <div className={css.ModalMediaViewer}>
      <EmbeddedMediaViewer sources={media.map(({ src }) => src)} />
    </div>
  );

  const onClickImage = async () => {
    setModalChild(modalMediaViewer);
    setShowModal(true);
  };

  return isMounted.current ? (
    <div className={classNames}>
      <header>
        <Image
          src={author.image}
          width={50}
          roundedCircle
          onClick={onClickAvatar}
          style={{ cursor: "pointer" }}
        />
        <h6>{author.name}</h6>

        <Dropdown className={css.MoreDropdownToggle} show={showMore} onToggle={onToggleMore}>
          <Button className="icon" variant="" onClick={onClickMore}>
            <Image src={moreIcon} width={16} height={16} />
          </Button>
          <Dropdown.Menu align="end">
            <Dropdown.Item onClick={onDelete}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </header>

      <main>
        <section className={css.MediaContainer}>
          {media.length ? (
            <EmbeddedMediaViewer
              sources={media.map(({ src }) => src)}
              onClickImage={onClickImage}
            />
          ) : null}
        </section>
        <section className={css.TextContainer}>
          <pre>{text}</pre>
        </section>
      </main>

      <footer className={css.label}>
        {ago}
      </footer>
    </div>
  ) : null;
}

MessageCard.propTypes = propTypes;

export default memo(MessageCard);

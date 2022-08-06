import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import { v4 } from "uuid";
import { Alert } from "react-bootstrap";
import { getMessages } from "../services/messageService";
import { patchConversation } from "../services/conversationService";
import MessageToolbar from "./MessageToolbar";
import MessageCardNew from "./MessageCardNew";
import MessageCard from "./MessageCard";
import * as css from "../styles/Messages.module.css";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  conversationId: PropTypes.string.isRequired
};

export default function Messages({ ownerId, conversationId }) {
  const isMounted = useRef(false);
  const refresher = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addDisabled, setAddDisabled] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(true);
  const pageEndRef = useRef(null);

  const scrollToEnd = () => {
    if (pageEndRef.current) pageEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const refreshMessages = () => {
    getMessages(ownerId, conversationId).then((_messages) => {
      if (!_.isEqual(_messages, messages)) setMessages(_messages);
    });
  };

  const restartRefresher = () => {
    clearInterval(refresher.current);
    if (!isPaused) refresher.current = setInterval(refreshMessages, 3000);
  };

  // on mount
  useEffect(() => {
    refreshMessages();
    restartRefresher();
    isMounted.current = true;
  }, []);

  // on unmount
  useEffect(() => () => {
    patchConversation(ownerId, conversationId, { hasNew: false })
      .then(() => clearInterval(refresher.current)); // unset refresher
  }, []);

  // on showAdd change
  useEffect(() => setAddDisabled(showAdd), [showAdd]);

  // on messages change
  useEffect(() => {
    setSearchDisabled(messages.length === 0);
    scrollToEnd();
    restartRefresher();
  }, [messages]);

  const onClickAdd = useCallback(async () => {
    setShowAdd(true);
    setSearchDisabled(true);
  }, []);

  const onCloseAdd = useCallback(async () => {
    setSearchDisabled(messages.length === 0);
    setShowAdd(false);
  }, [messages]);

  const cards = useMemo(() => (
    messages.length
      ? messages.map((message) => (
        <MessageCard
          key={v4()}
          ownerId={ownerId}
          conversationId={conversationId}
          message={message}
          messages={messages}
          setMessages={setMessages}
        />
      )) : null), [messages]);

  return isMounted.current ? (
    <div className={css.Messages}>
      <MessageToolbar
        ownerId={ownerId}
        conversationId={conversationId}
        messages={messages}
        setMessages={setMessages}
        onClickAdd={onClickAdd}
        addDisabled={addDisabled}
        searchDisabled={searchDisabled}
        setIsPaused={setIsPaused}
      />
      <Alert className={css.Alert} variant="" show={showAdd} onClose={onCloseAdd} dismissible>
        <MessageCardNew
          conversationId={conversationId}
          messages={messages}
          setMessages={setMessages}
          setShow={setShowAdd}
        />
      </Alert>
      {cards}
      {messages ? <div ref={pageEndRef} /> : null}
    </div>
  ) : null;
}

Messages.propTypes = propTypes;

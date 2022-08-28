import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { v4 } from "uuid";
import { Alert, Button } from "react-bootstrap";
import useAppContext from "../hooks/useAppContext";
import useConversationsContext from "../hooks/useConversationsContext";
import { deleteConversations, getConversations } from "../services/conversationService";
import stopAllWorkers from "../utils/stopAllWorkers";
import ConversationToolbar from "./ConversationToolbar";
import ConversationCardNew from "./ConversationCardNew";
import ConversationCard from "./ConversationCard";
import * as css from "../styles/Conversations.module.css";

export default function Conversations() {
  const isMounted = useRef(false);
  const { selfId } = useAppContext();
  const {
    conversations,
    setConversations,
    showDelete,
    setShowDelete,
    selection,
    setSelection,
    refreshConversations
  } = useConversationsContext();
  const refresher = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addDisabled, setAddDisabled] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(true);
  const [areAllUnchecked, setAreAllUnchecked] = useState(true);
  const [memoRefresh, setMemoRefresh] = useState(false);

  // on mount
  useEffect(() => {
    stopAllWorkers().then(() => {
      getConversations(selfId)
        .then((_conversations) => {
          setConversations(_conversations);
          setMemoRefresh(true);
          isMounted.current = true;
        });
    });
  }, []);

  // on change conversations
  useEffect(() => {
    if (isMounted.current) {
      clearInterval(refresher.current);
      if (!isPaused) refresher.current = setInterval(refreshConversations, 3000);
    }
  }, [conversations]);

  useEffect(() => {
    if (isMounted.current) setAddDisabled(showAdd || showDelete);
  }, [showAdd, showDelete]);

  useEffect(() => {
    if (isMounted.current) setDeleteDisabled(showAdd || showDelete || conversations.length === 0);
  }, [conversations, showAdd, showDelete]);

  useEffect(() => {
    if (isMounted.current) setSearchDisabled(conversations.length === 0);
  }, [conversations]);

  useEffect(() => {
    if (isMounted.current) setAreAllUnchecked(selection.length === 0);
  }, [selection]);

  // fix cards staying checked after closing delete alert
  useEffect(() => {
    if (isMounted.current) {
      if (!showDelete) setMemoRefresh(!memoRefresh);
    }
  }, [areAllUnchecked]);

  // on unmount
  useEffect(() => async () => {
    setShowAdd(false);
    setShowDelete(false);
    await stopAllWorkers();
  }, []);

  const onClickAdd = useCallback(async () => {
    setShowAdd(true);
    setSearchDisabled(true);
  }, []);

  const onCloseAdd = useCallback(async () => {
    setShowAdd(false);
    setSearchDisabled(conversations.length === 0);
  }, [conversations]);

  const onClickDelete = useCallback(async () => {
    setIsPaused(true);
    setShowDelete(true); // proxy for toggleable/checkeable
    setSearchDisabled(true);
  }, []);

  const onCloseDelete = useCallback(async () => {
    setSelection([]);
    setSearchDisabled(conversations.length === 0);
    setShowDelete(false);
    setIsPaused(false);
  }, [conversations]);

  const onDelete = useCallback(async () => {
    await deleteConversations(selfId, selection);
    setConversations(conversations.filter(({ _id }) => !selection.includes(_id)));
    await onCloseDelete();
  }, [selfId, conversations, selection]);

  const cards = useMemo(() => (
    conversations.length
      ? conversations.map(({ _id, participantIds, messages, hasNew }) => (
        <ConversationCard
          key={v4()}
          personId={selfId}
          conversationId={_id}
          participantIds={participantIds}
          messages={messages}
          hasNew={hasNew}
          showDelete={showDelete}
        />
      ))
      : <p>You have no messages.</p>
  ), [conversations, memoRefresh]);

  return isMounted.current ? (
    <div className={css.Conversations}>
      <ConversationToolbar
        personId={selfId}
        conversations={conversations}
        setConversations={setConversations}
        onClickAdd={onClickAdd}
        addDisabled={addDisabled}
        onClickDelete={onClickDelete}
        deleteDisabled={deleteDisabled}
        searchDisabled={searchDisabled}
        setIsPaused={setIsPaused}
      />
      <Alert className={css.Alert} variant="" show={showAdd} onClose={onCloseAdd} dismissible>
        <ConversationCardNew
          conversations={conversations}
          setConversations={setConversations}
          setShow={setShowAdd}
        />
      </Alert>
      <Alert className={css.Alert} variant="" show={showDelete} onClose={onCloseDelete} dismissible>
        <p id="del">Select conversations:</p>
        <div className={css.AlertButtonContainer}>
          <Button disabled={areAllUnchecked} onClick={onDelete}>Apply</Button>
          <Button onClick={onCloseDelete}>Cancel</Button>
        </div>
      </Alert>
      {cards}
    </div>
  ) : null;
}

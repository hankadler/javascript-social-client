import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";
import _ from "lodash";
import useApp from "../hooks/useAppContext";
import { getConversations } from "../services/conversationService";

export const ConversationsContext = createContext(null);

const propTypes = {
  children: PropTypes.node.isRequired
};

export default function ConversationsContextProvider({ children }) {
  const { selfId } = useApp();
  const [conversations, setConversations] = useState([]);
  const [showDelete, setShowDelete] = useState(false); // here to avoid unnecessary re-render
  const [selection, setSelection] = useState([]);

  const refreshConversations = useCallback(() => {
    if (conversations.length) {
      getConversations(selfId).then((_conversations) => {
        if (!_.isEqual(_conversations, conversations)) setConversations(_conversations);
      });
    }
  }, [conversations]);

  const value = useMemo(() => ({
    conversations,
    setConversations,
    showDelete,
    setShowDelete,
    selection,
    setSelection,
    refreshConversations
  }), [conversations, showDelete, selection, refreshConversations]);

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

ConversationsContextProvider.propTypes = propTypes;

import PropTypes from "prop-types";
import { createContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-bootstrap";
import { getOtherIds, getUser } from "../services/userService";

export const AppContext = createContext(null);

const propTypes = {
  children: PropTypes.node.isRequired
};

export default function AppContextProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [selfId, setSelfId] = useState(localStorage.getItem("selfId") || "");
  const [self, setSelf] = useState(null);
  const [otherIds, setOtherIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalChild, setModalChild] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertChild, setAlertChild] = useState(null);
  const [alert, setAlert] = useState(null);
  const [conversations, setConversations] = useState([]);

  const fetchUsers = async () => {
    if (selfId) {
      setSelf(await getUser(selfId, "select=_id,name,image,about,watchlist"));
      setOtherIds(await getOtherIds(selfId));
    } else {
      setSelfId("");
      setOtherIds([]);
    }
  };

  const onCloseAlert = async () => setShowAlert(false);

  // on mount
  useEffect(() => {
    fetchUsers().then(() => setMounted(true));
  }, []);

  // on change selfId: set self & otherIds
  useEffect(() => {
    fetchUsers().then(() => {
      if (selfId) {
        localStorage.setItem("selfId", selfId);
      } else {
        localStorage.removeItem("selfId");
      }
    });
  }, [selfId]);

  // clear modal child & alert on close
  useEffect(() => {
    if (!showModal) {
      setModalChild(null);
      setShowAlert(false);
    }
  }, [showModal]);

  // clear alert child on close
  useEffect(() => {
    if (!showAlert) setAlertChild(null);
  }, [showAlert]);

  useEffect(() => setAlert(
    <Alert className="m-0 p-0" variant="" show={showAlert} onClose={onCloseAlert} dismissible>
      {alertChild}
    </Alert>
  ), [alertChild]);

  const isSelf = (userId) => selfId === userId;

  const reset = () => {
    setSelfId("");
    setOtherIds([]);
    setShowModal(false);
    setModalChild(null);
    setShowAlert(false);
    setAlertChild(null);
    setConversations([]);
  };

  const value = useMemo(() => (
    {
      mounted,
      setMounted,
      selfId,
      setSelfId,
      self,
      setSelf,
      otherIds,
      setOtherIds,
      showModal,
      setShowModal,
      modalChild,
      setModalChild,
      showAlert,
      setShowAlert,
      alertChild,
      setAlertChild,
      alert,
      setAlert,
      conversations,
      setConversations,
      isSelf,
      reset
    }
  ), [
    mounted,
    selfId,
    self,
    otherIds,
    showModal,
    modalChild,
    showAlert,
    alertChild,
    alert,
    conversations
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = propTypes;

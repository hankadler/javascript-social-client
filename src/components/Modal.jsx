import { useEffect, useState } from "react";
import useAppContext from "../hooks/useAppContext";
import * as css from "../styles/Modal.module.css";

const parentIds = ["app", "modal-background"];

export default function Modal() {
  const { showModal, setShowModal, modalChild, setModalChild } = useAppContext();
  const [style, setStyle] = useState({ display: "none" });

  useEffect(() => setStyle(
    showModal ? { display: "block" } : { display: "none" }
  ), [showModal]);

  // close modal on outside click
  const onClick = (event) => {
    if (parentIds.includes(event.target.parentElement.id)) {
      setShowModal(false);
      setModalChild(null);
    }
  };

  return (
    <div id="modal-background" className={css.Modal} style={style} onClick={onClick} role="none">
      <div className={css.Container}>
        {modalChild}
      </div>
    </div>
  );
}

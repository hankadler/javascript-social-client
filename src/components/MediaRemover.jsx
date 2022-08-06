import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import useMediaContext from "../hooks/useMediaContext";
import * as css from "../styles/MediaRemover.module.css";

export default function MediaRemover() {
  const { alert, setAlert, selection, setSelection, deleteMedia } = useMediaContext();
  const [applyDisabled, setApplyDisabled] = useState(true);

  // clear selection on alert open & close
  useEffect(() => setSelection([]), [alert.shown]);

  // disable apply if no files are selected
  useEffect(() => setApplyDisabled(selection.length === 0), [selection]);

  const onClose = async () => setAlert({ ...alert, shown: false });

  const onApply = async () => {
    await onClose();
    await deleteMedia();
  };

  return (
    <>
      <p>Select files:</p>
      <div className={css.AlertButtonContainer}>
        <Button disabled={applyDisabled} onClick={onApply}>Apply</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </>
  );
}

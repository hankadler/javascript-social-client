import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { ToggleButton, Image } from "react-bootstrap";
import useAppContext from "../hooks/useAppContext";
import useMediaContext from "../hooks/useMediaContext";
import { getUser } from "../services/userService";
import MediaViewer from "./MediaViewer";
import * as css from "../styles/MediaCard.module.css";
import stubImage from "../assets/stub.png";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  file: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default function MediaCard({ ownerId, file }) {
  const { setModalChild, setShowModal } = useAppContext();
  const { alert, media, setSelection } = useMediaContext();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const _checkedStr = sessionStorage.getItem(`${file._id}-checked`); // to persist checked
    if (_checkedStr) setChecked(_checkedStr === "true");
  }, []);

  const onChange = async () => {
    setChecked(!checked);
    sessionStorage.setItem(`${file._id}-checked`, (!checked).toString());
    setSelection(
      media.filter(({ _id }) => document.getElementById(_id).checked).map(({ _id }) => _id)
    );
  };

  const onClick = async () => {
    const initialIndex = media.map(({ _id }) => _id).indexOf(file._id);
    const owner = await getUser(ownerId, "select=_id,name,image");
    setModalChild(<MediaViewer owner={owner} initialIndex={initialIndex} />);
    setShowModal(true);
  };

  const child = <Image className={css.Thumbnail} src={file.src || stubImage} />;

  return (
    alert.shown
      ? (
        <ToggleButton
          id={file._id}
          className={checked ? `shadow-none ${css.checked}` : `shadow-none ${css.unchecked}`}
          variant=""
          type="checkbox"
          value="0"
          checked={checked}
          onChange={onChange}
        >
          {child}
        </ToggleButton>
      ) : (
        <button id={file._id} className={`icon ${css.unchecked}`} type="button" onClick={onClick}>
          {child}
        </button>
      )
  );
}

MediaCard.propTypes = propTypes;

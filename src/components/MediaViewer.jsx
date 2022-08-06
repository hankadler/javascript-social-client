import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import useMediaContext from "../hooks/useMediaContext";
import MediaView from "./MediaView";
import * as css from "../styles/MediaViewer.module.css";
import prevIcon from "../assets/prev.png";
import nextIcon from "../assets/next.png";

const propTypes = {
  owner: PropTypes.instanceOf(Object).isRequired,
  initialIndex: PropTypes.number.isRequired
};

export default function MediaViewer({ owner, initialIndex }) {
  const { media } = useMediaContext();
  const [file, setFile] = useState(media[initialIndex]);
  const [index, setIndex] = useState(initialIndex);

  const onPrev = useCallback(() => setIndex(index ? index - 1 : media.length - 1), [index]);

  const onNext = useCallback(() => setIndex(index + 1 < media.length ? index + 1 : 0), [index]);

  useEffect(() => setFile(media[index]), [index]);

  useEffect(() => {
    const onKeyPress = (event) => {
      if (event.key === "ArrowLeft") onPrev();
      else if (event.key === "ArrowRight") onNext();
    };

    document.addEventListener("keydown", onKeyPress);

    return () => document.removeEventListener("keydown", onKeyPress);
  }, [onPrev, onNext]);

  return file ? (
    <div className={css.MediaViewer}>
      <Button className="icon" onClick={onPrev} variant="">
        <Image src={prevIcon} width={32} height={32} />
      </Button>
      <MediaView owner={owner} file={file} setFile={setFile} />
      <Button className="icon" onClick={onNext} variant="">
        <Image src={nextIcon} width={32} height={32} />
      </Button>
    </div>
  ) : null;
}

MediaViewer.propTypes = propTypes;

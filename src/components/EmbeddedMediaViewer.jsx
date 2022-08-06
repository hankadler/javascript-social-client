import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import * as css from "../styles/EmbeddedMediaViewer.module.css";
import prevIcon from "../assets/prev.png";
import nextIcon from "../assets/next.png";
import useAppContext from "../hooks/useAppContext";

const propTypes = {
  sources: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClickImage: PropTypes.func
};

const defaultProps = {
  onClickImage: null
};

export default function EmbeddedMediaViewer({ sources, onClickImage}) {
  const { showModal } = useAppContext();
  const [index, setIndex] = useState(0);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [navBtnHidden] = useState(sources.length <= 1);

  useEffect(() => {
    setPrevDisabled(index === 0);
    setNextDisabled(index + 1 === sources.length);
  }, [index]);

  const onPrev = useCallback(() => {
    setIndex(index ? index - 1 : index);
  }, [index]);

  const onNext = useCallback(() => {
    setIndex(index + 1 < sources.length ? index + 1 : index);
  }, [index]);

  useEffect(() => {
    const onKeyPress = showModal ? (event) => {
      if (event.key === "ArrowLeft") onPrev();
      else if (event.key === "ArrowRight") onNext();
    } : null;

    document.addEventListener("keydown", onKeyPress);

    return () => document.removeEventListener("keydown", onKeyPress);
  }, [onPrev, onNext]);

  return (
    <div className={css.EmbeddedMediaViewer}>
      <aside className={css.PrevContainer}>
        <Button
          className="icon"
          variant=""
          onClick={onPrev}
          disabled={prevDisabled}
          hidden={navBtnHidden}
        >
          <Image src={prevIcon} width={32} height={32} />
        </Button>
      </aside>

      <main>
        <Image src={sources[index]} fluid onClick={onClickImage} />
      </main>

      <aside className={css.NextContainer}>
        <Button
          className="icon"
          variant=""
          onClick={onNext}
          disabled={nextDisabled}
          hidden={navBtnHidden}
        >
          <Image src={nextIcon} width={32} height={32} />
        </Button>
      </aside>
    </div>
  );
}

EmbeddedMediaViewer.propTypes = propTypes;
EmbeddedMediaViewer.defaultProps = defaultProps;

import PropTypes from "prop-types";
import { useEffect, useMemo, useRef } from "react";
import { v4 } from "uuid";
import { Container, Row, Col } from "react-bootstrap";
import useMediaContext from "../hooks/useMediaContext";
import MediaToolbar from "./MediaToolbar";
import MediaAlert from "./MediaAlert";
import MediaCard from "./MediaCard";
import * as css from "../styles/Media.module.css";

const propTypes = {
  isSelf: PropTypes.bool.isRequired,
  ownerId: PropTypes.string.isRequired
};

export default function Media({ isSelf, ownerId }) {
  const mounted = useRef(false);
  const { alert, media, activeTag, setMedia, refreshMedia, refreshTags } = useMediaContext();

  // on mount
  useEffect(() => {
    refreshMedia(ownerId);
    mounted.current = true;
  }, []);

  // refresh tags on media change
  useEffect(() => {
    if (mounted.current) refreshTags();
  }, [media]);

  // clear sessionStorage on alert close
  useEffect(() => {
    if (mounted.current) {
      if (!alert.shown) sessionStorage.clear();
    }
  }, [alert]);

  // on unmount
  useEffect(() => async () => setMedia([]), []);

  const mediaGrid = useMemo(() => (
    <Container className={css.MediaGrid}>
      <Row>
        {media.map(({ _id, src, tag }) => (
          <Col key={v4()} sm="auto" hidden={activeTag && (tag !== activeTag)}>
            <MediaCard ownerId={ownerId} file={{ _id, src }} key={v4()} />
          </Col>
        ))}
      </Row>
    </Container>
  ), [media, activeTag]);

  return (
    <Container className={css.Media}>
      <MediaToolbar isSelf={isSelf} />
      <MediaAlert />
      {mediaGrid}
    </Container>
  );
}

Media.propTypes = propTypes;

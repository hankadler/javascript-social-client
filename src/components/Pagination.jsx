import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { Button, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { v4 } from "uuid";
import * as css from "../styles/Pagination.module.css";
import firstIcon from "../assets/first.png";
import prevIcon from "../assets/prev.png";
import nextIcon from "../assets/next.png";
import lastIcon from "../assets/last.png";

const propTypes = {
  items: PropTypes.instanceOf(Array).isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default function Pagination({ items, itemsPerPage, setPage }) {
  const isMounted = useRef(false);
  const pages = _.chunk(items, itemsPerPage);
  const pageCount = pages.length;

  const [pageIndex, setPageIndex] = useState(0);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(true);

  // on mount
  useEffect(() => {
    isMounted.current = true;
  }, []);

  // on mounted
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPrevDisabled(pageIndex < 1);
    setNextDisabled(pageIndex + 1 === pageCount);
  });

  // on change items
  useEffect(() => {
    if (isMounted.current) setPageIndex(0);
  }, [items]);

  // on change pageIndex
  useEffect(() => {
    setPage(pages[pageIndex]);
  }, [pageIndex]);

  const onClickFirst = async () => setPageIndex(0);
  const onClickPrev = async () => setPageIndex(pageIndex - 1);
  const onClickNext = async () => setPageIndex(pageIndex + 1);
  const onClickLast = async () => setPageIndex(pageCount - 1);

  return (
    <div className={css.Pagination}>
      <OverlayTrigger placement="bottom" overlay={<Tooltip id={v4()}>First</Tooltip>}>
        <Button className="icon" variant="" disabled={prevDisabled} onClick={onClickFirst}>
          <Image src={firstIcon} width={32} height={32} />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={<Tooltip id={v4()}>Previous</Tooltip>}>
        <Button className="icon" variant="" disabled={prevDisabled} onClick={onClickPrev}>
          <Image src={prevIcon} width={32} height={32} />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={<Tooltip id={v4()}>Next</Tooltip>}>
        <Button className="icon" variant="" disabled={nextDisabled} onClick={onClickNext}>
          <Image src={nextIcon} width={32} height={32} />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={<Tooltip id={v4()}>Last</Tooltip>}>
        <Button className="icon" variant="" disabled={nextDisabled} onClick={onClickLast}>
          <Image src={lastIcon} width={32} height={32} />
        </Button>
      </OverlayTrigger>
    </div>
  );
}

Pagination.propTypes = propTypes;

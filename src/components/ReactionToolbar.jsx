import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Dropdown, Button, Image } from "react-bootstrap";
import useAppContext from "../hooks/useAppContext";
import { getVotes, postVote } from "../services/voteService";
import VoteStatus from "./VoteStatus";
import * as css from "../styles/ReactionToolbar.module.css";
import voteUpIcon from "../assets/like.png";
import statusIcon from "../assets/status-green.png";
import voteDownIcon from "../assets/dislike.png";
import commentIcon from "../assets/comment.png";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  fileId: PropTypes.string,
  postId: PropTypes.string,
  commentId: PropTypes.string,
  authorId: PropTypes.string,
  commentNode: PropTypes.node,
  isModal: PropTypes.bool,
};

const defaultProps = {
  fileId: "",
  postId: "",
  commentId: "",
  authorId: "",
  commentNode: null,
  isModal: false
};

function ReactionToolbar({ ownerId, fileId, postId, commentId, authorId, commentNode, isModal }) {
  const userId = authorId || ownerId;

  const {
    selfId,
    setModalChild,
    showModal,
    setShowModal,
    setAlertChild,
    showAlert,
    setShowAlert
  } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [votes, setVotes] = useState([]);
  const [upCount, setUpCount] = useState(0);
  const [downCount, setDownCount] = useState(0);
  const [showWhyUp, setShowWhyUp] = useState(false);
  const [showWhyDown, setShowWhyDown] = useState(false);
  const [voteDisabled, setVoteDisabled] = useState(true);

  const resetVoteCount = (_votes) => {
    setUpCount(_votes.filter(({ up }) => up).length);
    setDownCount(_votes.filter(({ up }) => !up).length);
  };

  // on mount
  useEffect(() => {
    getVotes(ownerId, { fileId, postId, commentId })
      .then((_votes) => {
        setVotes(_votes);
        const voterIds = _votes.map(({ voterId }) => voterId);
        setVoteDisabled(userId === selfId || voterIds.includes(selfId));
        setMounted(true);
      });
  }, []);

  // on votes change
  useEffect(() => {
    resetVoteCount(votes);
    const voterIds = votes.map(({ voterId }) => voterId);
    setVoteDisabled(userId === selfId || voterIds.includes(selfId));
  }, [votes]);

  const onClickVoteUp = async () => setShowWhyUp(true);
  const onToggleVoteUp = async (nextShow) => setShowWhyUp(nextShow);
  const onVoteUp = async (eventKey) => {
    const vote = { voterId: selfId, up: true, why: eventKey };
    await postVote(ownerId, { fileId, postId, commentId }, vote);
    setVotes([...votes, vote]);
  };

  const onClickVoteDown = async () => setShowWhyDown(true);
  const onToggleVoteDown = async (nextShow) => setShowWhyDown(nextShow);
  const onVoteDown = async (eventKey) => {
    const vote = { voterId: selfId, up: false, why: eventKey };
    await postVote(ownerId, { fileId, postId, commentId }, vote);
    setVotes([...votes, vote]);
  };

  const onClickAddComment = async () => {
    if (isModal) {
      setModalChild(commentNode);
      setShowModal(true);
    } else {
      setAlertChild(commentNode);
      setShowAlert(true);
    }
  };

  const voteOverlay = (
    <Tooltip className={css.Tooltip} id="vote-tooltip">
      <VoteStatus votes={votes} />
    </Tooltip>
  );

  const likeOverlay = <Tooltip id="like-tooltip">Like</Tooltip>;
  const dislikeOverlay = <Tooltip id="dislike-tooltip">Dislike</Tooltip>;
  const commentOverlay = <Tooltip id="comment-tooltip">Comment</Tooltip>;

  const classNames = commentId ? `${css.ReactionToolbar} ${css.mini}` : css.ReactionToolbar;

  return mounted ? (
    <div className={classNames}>
      <div className={css.VoteContainer}>
        <p className={css.UpVoteCount}>{upCount}</p>
        <OverlayTrigger placement="bottom" overlay={likeOverlay} show={voteDisabled ? !voteDisabled : null}>
          <Dropdown show={showWhyUp} onToggle={onToggleVoteUp} onSelect={onVoteUp}>
            <Button
              className="icon m-0 p-0"
              variant=""
              onClick={onClickVoteUp}
              disabled={voteDisabled}
            >
              <Image src={voteUpIcon} width={32} height={32} />
            </Button>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Good">Good</Dropdown.Item>
              <Dropdown.Item eventKey="True">True</Dropdown.Item>
              <Dropdown.Item eventKey="Right">Right</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </OverlayTrigger>

        {votes.length ? (
          <OverlayTrigger placement="left" overlay={voteOverlay}>
            <div>
              <Image src={statusIcon} width={32} height={32} />
            </div>
          </OverlayTrigger>
        ) : null}

        <p className={css.DownVoteCount}>{downCount}</p>
        <OverlayTrigger placement="bottom" overlay={dislikeOverlay} show={voteDisabled ? !voteDisabled : null}>
          <Dropdown show={showWhyDown} onToggle={onToggleVoteDown} onSelect={onVoteDown}>
            <Button
              className="icon m-0 p-0"
              variant=""
              onClick={onClickVoteDown}
              disabled={voteDisabled}
            >
              <Image src={voteDownIcon} width={32} height={32} />
            </Button>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Bad">Bad</Dropdown.Item>
              <Dropdown.Item eventKey="False">False</Dropdown.Item>
              <Dropdown.Item eventKey="Wrong">Wrong</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </OverlayTrigger>
      </div>

      {!commentId ? (
        <OverlayTrigger placement="bottom" overlay={commentOverlay}>
          <Button
            className="icon"
            variant=""
            onClick={onClickAddComment}
            disabled={isModal ? showModal : showAlert}
          >
            <Image src={commentIcon} width={32} height={32} />
          </Button>
        </OverlayTrigger>
      ) : null}
    </div>
  ) : null;
}

ReactionToolbar.propTypes = propTypes;
ReactionToolbar.defaultProps = defaultProps;

export default memo(ReactionToolbar);

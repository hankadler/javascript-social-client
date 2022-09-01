import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button, Dropdown, Form, Image } from "react-bootstrap";
import config from "../config";
import useAppContext from "../hooks/useAppContext";
import useMediaContext from "../hooks/useMediaContext";
import useContent from "../hooks/useContent";
import { getComments } from "../services/commentService";
import { patchFile } from "../services/mediaService";
import Comments from "./Comments";
import CommentCardNew from "./CommentCardNew";
import ReactionToolbar from "./ReactionToolbar";
import * as css from "../styles/MediaView.module.css";
import moreIcon from "../assets/more.png";

const propTypes = {
  owner: PropTypes.instanceOf(Object).isRequired,
  file: PropTypes.instanceOf(Object).isRequired,
  setFile: PropTypes.func.isRequired
};

export default function MediaView({ owner, file, setFile }) {
  const { isSelf, showAlert, setAlertChild, alert } = useAppContext();
  const { refreshMedia } = useMediaContext();
  const {
    textRef,
    showMore,
    text,
    setText,
    textDisabled,
    setTextDisabled,
    onClickMore,
    onToggleMore,
    onClickEdit,
    onChangeText
  } = useContent();
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const _comments = await getComments(owner._id, { fileId: file._id });
    setComments(_comments);
    return _comments;
  };

  // on change file
  useEffect(() => {
    fetchComments().then((_comments) => {
      setText(file.caption);
      setComments(_comments);
    });
  }, [file]);

  // on change comments
  useEffect(() => setAlertChild(
    <section className={css.AlertContainer}>
      <CommentCardNew
        ownerId={owner._id}
        comments={comments}
        setComments={setComments}
        fileId={file._id}
      />
    </section>
  ), [comments]);

  const onBlurCaption = async () => {
    const { tag } = file;
    await patchFile(owner._id, file._id, { caption: text, tag });
    refreshMedia(owner._id);
    setTextDisabled(true);
  };

  return comments ? (
    <div className={css.MediaView}>
      <main className={css.MediaContainer}>
        <Image src={file.src} fluid />
      </main>

      <aside>
        <h6><strong>Caption</strong></h6>
        <section className={css.CaptionContainer}>
          <header className={css.CaptionHeader}>
            <Image src={owner.image} width={50} roundedCircle />
            <h6>{owner.name}</h6>
            {isSelf(owner._id)
              ? (
                <Dropdown show={showMore} onToggle={onToggleMore}>
                  <Button className="icon" variant="" onClick={onClickMore}>
                    <Image src={moreIcon} width={16} height={16} />
                  </Button>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item onClick={onClickEdit}>Edit</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : null}
          </header>

          <main className={css.CaptionBody}>
            {textDisabled ? (
              <pre>{text}</pre>
            ) : (
              <Form.Control
                ref={textRef}
                as="textarea"
                rows={Math.round(text.length / 130) || 1}
                value={text}
                onChange={onChangeText}
                onBlur={onBlurCaption}
                maxLength={config.charLimit.caption}
                disabled={textDisabled}
              />
            )}
          </main>

          {textDisabled || (
            <footer className={css.CaptionFooter}>
              <p className={css.label}>{file.caption.length} / {config.charLimit.caption}</p>
            </footer>
          )}
        </section>

        <section>
          {comments.length ? (
            <header className={css.CommentsHeader}>
              <h6>Comments</h6>
              <p className={css.badge}>{comments.length}</p>
            </header>
          ) : null}
          <main className={css.CommentsBody}>
            <Comments
              ownerId={owner._id}
              comments={comments}
              setComments={setComments}
              fileId={file._id}
            />
            {showAlert ? alert : null}
          </main>
        </section>
      </aside>

      <footer>
        <ReactionToolbar
          ownerId={owner._id}
          fileId={file._id}
          commentNode={(
            <CommentCardNew
              ownerId={owner._id}
              comments={comments}
              setComments={setComments}
              fileId={file._id}
              file={file}
              setFile={setFile}
            />
          )}
        />
      </footer>
    </div>
  ) : null;
}

MediaView.propTypes = propTypes;

import PropTypes from "prop-types";
import { Button, Form, Image } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import config from "../config";
import useAppContext from "../hooks/useAppContext";
import useContent from "../hooks/useContent";
import { postComment } from "../services/commentService";
import MediaUploadBox from "./MediaUploadBox";
import EmbeddedMediaViewer from "./EmbeddedMediaViewer";
import * as css from "../styles/CommentCardNew.module.css";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  comments: PropTypes.instanceOf(Array).isRequired,
  setComments: PropTypes.func.isRequired,
  fileId: PropTypes.string,
  postId: PropTypes.string,
  file: PropTypes.instanceOf(Object),
  setFile: PropTypes.func
};

const defaultProps = {
  fileId: "",
  postId: "",
  file: null,
  setFile: undefined
};

export default function CommentCardNew({
  ownerId, comments, setComments, fileId, postId, file, setFile
}) {
  const { selfId, self, setShowModal, setShowAlert } = useAppContext();
  const { textRef, sources, text, onChangeFiles, onChangeText } = useContent();

  const onSubmit = async () => {
    const _sources = sources.join("&");
    const comment = (
      await postComment(ownerId, { fileId, postId }, { authorId: selfId, sources: _sources, text })
    );
    const _comments = [...comments, comment];
    setComments(_comments);
    if (file) setFile({ ...file, comments: _comments });
    if (postId) {
      setShowModal(false);
    } else {
      setShowAlert(false);
    }
  };

  return (
    <div className={css.CommentCardNew}>
      <header>
        <Image src={self.image} width={50} roundedCircle />
        <p>{self.name}</p>
      </header>

      <main>
        <section className={css.MediaContainer}>
          {sources.length
            ? <EmbeddedMediaViewer sources={sources} />
            : (
              <FileUploader
                handleChange={onChangeFiles}
                name="files"
                multiple
                maxSize={16}
                types={config.fileTypes}
              >
                <MediaUploadBox types={config.fileTypes} />
              </FileUploader>
            )}
        </section>
        <section className={css.TextContainer}>
          <Form.Control
            ref={textRef}
            as="textarea"
            autoFocus
            rows={5}
            value={text}
            onChange={onChangeText}
            maxLength={config.charLimit.comment}
          />
          <p className={css.label}>{text.length} / {config.charLimit.comment}</p>
        </section>
      </main>

      <footer>
        <Button variant="secondary" onClick={onSubmit} disabled={text.length === 0}>Submit</Button>
      </footer>
    </div>
  );
}

CommentCardNew.propTypes = propTypes;
CommentCardNew.defaultProps = defaultProps;

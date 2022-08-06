import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { Button, Form, Image } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import config from "../config";
import useAppContext from "../hooks/useAppContext";
import useContent from "../hooks/useContent";
import { postPost } from "../services/postService";
import MediaUploadBox from "./MediaUploadBox";
import EmbeddedMediaViewer from "./EmbeddedMediaViewer";
import * as css from "../styles/PostCardNew.module.css";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  posts: PropTypes.instanceOf(Array).isRequired,
  setPosts: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired
};

export default function PostCardNew({ ownerId, posts, setPosts, setShow }) {
  const isMounted = useRef(false);
  const { self } = useAppContext();
  const { sources, text, onChangeFiles, onChangeText } = useContent();

  // on mount
  useEffect(() => {
    isMounted.current = true;
  }, []);

  const onSubmit = async () => {
    const _sources = sources.join("&");
    const post = await postPost(ownerId, { authorId: self._id, sources: _sources, text });
    setPosts([post, ...posts]);
    setShow(false);
  };

  return isMounted.current ? (
    <div className={css.PostCardNew}>
      <header>
        <Image src={self.image} width={50} roundedCircle />
        <p className={css.Name}>{self.name}</p>
      </header>

      <main>
        <div className={css.MediaContainer}>
          {sources.length ? <EmbeddedMediaViewer sources={sources} /> : (
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
        </div>
        <div>
          <Form.Control
            as="textarea"
            rows={5}
            value={text}
            onChange={onChangeText}
            maxLength={config.charLimit.post}
          />
          <p className={css.label}>{text.length} / {config.charLimit.post}</p>
        </div>
      </main>

      <footer>
        <Button variant="secondary" onClick={onSubmit} disabled={text.length === 0}>Submit</Button>
      </footer>
    </div>
  ) : null;
}

PostCardNew.propTypes = propTypes;

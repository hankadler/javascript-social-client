import PropTypes from "prop-types";
import { Button, Form, Image } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import config from "../config";
import useAppContext from "../hooks/useAppContext";
import useContent from "../hooks/useContent";
import { postMessage } from "../services/messageService";
import MediaUploadBox from "./MediaUploadBox";
import EmbeddedMediaViewer from "./EmbeddedMediaViewer";
import * as css from "../styles/MessageCardNew.module.css";

const propTypes = {
  conversationId: PropTypes.string.isRequired,
  messages: PropTypes.instanceOf(Array).isRequired,
  setMessages: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired
};

export default function MessageCardNew({ conversationId, messages, setMessages, setShow }) {
  const { self } = useAppContext();
  const { sources, text, onChangeFiles, onChangeText } = useContent();

  const onSubmit = async () => {
    const _sources = sources.join("&");
    const _message = await postMessage(self._id, conversationId, { sources: _sources, text });
    setMessages([...messages, _message]);
    setShow(false);
  };

  return (
    <div className={css.MessageCardNew}>
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
            maxLength={config.charLimit.message}
            placeholder="Message"
          />
          <p className="label">{text.length} / {config.charLimit.message}</p>
        </div>
      </main>

      <footer>
        <Button variant="secondary" onClick={onSubmit} disabled={text.length === 0}>Submit</Button>
      </footer>
    </div>
  );
}

MessageCardNew.propTypes = propTypes;

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button, Form, Image, Dropdown } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import { v4 } from "uuid";
import config from "../config";
import useAppContext from "../hooks/useAppContext";
import useContent from "../hooks/useContent";
import { getOthers } from "../services/userService";
import { postConversation } from "../services/conversationService";
import MediaUploadBox from "./MediaUploadBox";
import EmbeddedMediaViewer from "./EmbeddedMediaViewer";
import * as css from "../styles/ConversationCardNew.module.css";

const propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  setConversations: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired
};

export default function ConversationCardNew({ conversations, setConversations, setShow }) {
  const { selfId } = useAppContext();
  const [others, setOthers] = useState([]);
  const [to, setTo] = useState("");
  const [toList, setToList] = useState([]);
  const [showToMenu, setShowToMenu] = useState(false);
  const { sources, text, onChangeFiles, onChangeText } = useContent();

  // on mount: set others, set focus to text via setTextDisabled effect
  useEffect(() => {
    getOthers(selfId, "select=_id,name,image").then((_others) => setOthers(_others));
  }, []);

  // on change toList: clear to
  useEffect(() => setTo(""), [toList]);

  const onChangeTo = async (event) => {
    setTo(event.target.value);
    setShowToMenu(event.target.value !== "");
  };

  const onToggleTo = async (nextShow) => setShowToMenu(nextShow);

  const onSelectTo = async (eventKey) => {
    const user = others.filter(({ _id }) => _id === eventKey)[0];
    setToList(toList.includes(user) ? toList : [...toList, user]);
    setOthers(others.filter(({ _id }) => _id !== eventKey));
    setShowToMenu(false);
  };

  const onSubmit = async () => {
    const _sources = sources.join("&");
    const _to = toList.map(({ _id }) => _id).join(",");
    await postConversation(selfId, { to: _to, sources: _sources, text })
      .then((conversation) => setConversations([conversation, ...conversations]));
    setShow(false);
  };

  const toMenuItems = (
    others.filter(({ name }) => name.toLowerCase().includes(to.toLowerCase())).map((other) => (
      <Dropdown.Item className={css.ToMenuItem} key={v4()} eventKey={other._id}>
        <Image src={other.image} width={32} height={32} />
        {other.name}
      </Dropdown.Item>
    ))
  );

  const toTags = (toList.map((user) => (
    <div className={css.TagItem} key={v4()}>
      <Image src={user.image} width={32} height={32} />
      <p>{user.name}</p>
      <Button
        variant="danger"
        onClick={() => {
          setToList(toList.filter(({ _id }) => _id !== user._id));
          setOthers(others.includes(user) ? others : [...others, user]);
        }}
      >
        &times;
      </Button>
    </div>
  )));

  return (
    <div className={css.ConversationCardNew}>
      <header className={css.ToContainer}>
        <Dropdown show={showToMenu} onSelect={onSelectTo} onToggle={onToggleTo}>
          <Form.Control autoFocus onChange={onChangeTo} value={to} placeholder="To" />
          {toMenuItems.length ? (
            <Dropdown.Menu>
              {toMenuItems}
            </Dropdown.Menu>
          ) : null}
        </Dropdown>
        <div className={css.TagContainer}>
          {toTags}
        </div>
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
        <Button
          variant="secondary"
          onClick={onSubmit}
          disabled={toList.length === 0 || text.length === 0}
        >
          Submit
        </Button>
      </footer>
    </div>
  );
}

ConversationCardNew.propTypes = propTypes;

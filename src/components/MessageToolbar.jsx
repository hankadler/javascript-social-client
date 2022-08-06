import PropTypes from "prop-types";
import { useState, memo, useCallback } from "react";
import { Button, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { v4 } from "uuid";
import { getMessages } from "../services/messageService";
import Search from "./Search";
import * as css from "../styles/MessageToolbar.module.css";
import addIcon from "../assets/add.png";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  conversationId: PropTypes.string.isRequired,
  messages: PropTypes.instanceOf(Array).isRequired,
  setMessages: PropTypes.func.isRequired,
  onClickAdd: PropTypes.func.isRequired,
  addDisabled: PropTypes.bool.isRequired,
  searchDisabled: PropTypes.bool.isRequired,
  setIsPaused: PropTypes.func.isRequired
};

function MessageToolbar({
  ownerId,
  conversationId,
  messages,
  setMessages,
  onClickAdd,
  addDisabled,
  searchDisabled,
  setIsPaused
}) {
  const [searchValue, setSearchValue] = useState("");

  const onSearch = useCallback(async () => {
    setIsPaused(true);
    setMessages(
      messages.filter(({ text }) => text.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [searchValue]);

  const onClear = useCallback(async () => {
    setIsPaused(false);
    setMessages(await getMessages(ownerId, conversationId));
  }, []);

  const addOverlay = <Tooltip id={v4()}>Add Message</Tooltip>;

  return (
    <div className={css.MessageToolbar}>
      <OverlayTrigger placement="bottom" overlay={addOverlay}>
        <Button className="icon" variant="" onClick={onClickAdd} disabled={addDisabled}>
          <Image src={addIcon} width={32} height={32} />
        </Button>
      </OverlayTrigger>
      <Search
        value={searchValue}
        setValue={setSearchValue}
        onSearch={onSearch}
        onClear={onClear}
        disabled={searchDisabled}
      />
    </div>
  );
}

MessageToolbar.propTypes = propTypes;

export default memo(MessageToolbar);

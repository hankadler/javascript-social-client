import PropTypes from "prop-types";
import { useState, memo } from "react";
import { Button, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { v4 } from "uuid";
import { getConversations } from "../services/conversationService";
import Search from "./Search";
import * as css from "../styles/ConversationToolbar.module.css";
import addIcon from "../assets/add.png";
import deleteIcon from "../assets/delete.png";

const propTypes = {
  personId: PropTypes.string.isRequired,
  conversations: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  setConversations: PropTypes.func.isRequired,
  onClickAdd: PropTypes.func.isRequired,
  addDisabled: PropTypes.bool.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  deleteDisabled: PropTypes.bool.isRequired,
  searchDisabled: PropTypes.bool.isRequired,
  setIsPaused: PropTypes.func.isRequired
};

function ConversationToolbar({
  personId,
  conversations,
  setConversations,
  onClickAdd,
  addDisabled,
  onClickDelete,
  deleteDisabled,
  searchDisabled,
  setIsPaused
}) {
  const [searchValue, setSearchValue] = useState("");

  const onSearch = async () => {
    setIsPaused(true);
    setConversations(conversations.filter(({ messages }) => (
      messages.filter(({ text }) => text.toLowerCase().includes(searchValue.toLowerCase())).length
    )));
  };

  const onClear = async () => {
    setConversations(await getConversations(personId));
    setIsPaused(false);
  };

  const addOverlay = <Tooltip id={v4()}>Add Conversation</Tooltip>;
  const deleteOverlay = <Tooltip id={v4()}>Delete Conversation(s)</Tooltip>;

  return (
    <div className={css.ConversationToolbar}>
      <OverlayTrigger placement="bottom" overlay={addOverlay}>
        <Button className="icon" variant="" onClick={onClickAdd} disabled={addDisabled}>
          <Image src={addIcon} width={32} height={32} />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="bottom" overlay={deleteOverlay}>
        <Button className="icon" variant="" onClick={onClickDelete} disabled={deleteDisabled}>
          <Image src={deleteIcon} width={32} height={32} />
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

ConversationToolbar.propTypes = propTypes;

export default memo(ConversationToolbar);

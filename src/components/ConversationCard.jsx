import PropTypes from "prop-types";
import { useEffect, useRef, useState, memo } from "react";
import { v4 } from "uuid";
import { Image, ToggleButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useConversationsContext from "../hooks/useConversationsContext";
import useContent from "../hooks/useContent";
import { getUser } from "../services/userService";
import * as css from "../styles/ConversationCard.module.css";

const propTypes = {
  personId: PropTypes.string.isRequired,
  conversationId: PropTypes.string.isRequired,
  participantIds: PropTypes.instanceOf(Array).isRequired,
  messages: PropTypes.instanceOf(Array).isRequired,
  hasNew: PropTypes.bool.isRequired
};

function ConversationCard({
  personId, conversationId, participantIds, messages, hasNew
}) {
  const latestMessage = messages.slice(-1)[0];

  const navigate = useNavigate();
  const { selection, setSelection, showDelete } = useConversationsContext();
  const { setModifiedAt, ago } = useContent();
  const isMounted = useRef(false);
  const checkedRef = useRef(false);
  const [others, setOthers] = useState([]);
  const [checked, setChecked] = useState(false);
  const [latestMessageAuthor, setLatestMessageAuthor] = useState("");

  // on mount
  useEffect(() => {
    Promise.all(participantIds.map((id) => getUser(id, "select=_id,image,name")))
      .then((participants) => {
        setOthers(participants.filter(({ _id }) => _id !== personId));
        setChecked(checkedRef.current);
        setModifiedAt(latestMessage.modifiedAt);
        getUser(latestMessage.authorId, "select=name")
          .then(({ name }) => setLatestMessageAuthor(name));
        isMounted.current = true;
      });
  }, []);

  const onCheck = async () => {
    checkedRef.current = !checkedRef.current;
    setChecked(checkedRef.current);
    if (checkedRef.current) setSelection([...selection, conversationId]);
    else setSelection(selection.filter(({ _id }) => _id !== conversationId));
  };

  const onClick = async () => {
    navigate(conversationId);
  };

  const participantsPreview = (
    `${others.slice(0, 4).map(({ name }) => name).join(", ")} ${others.length > 4 ? "..." : ""}`
  );

  const messagePreview = (
    `${latestMessage.text.slice(0, 400)} ${latestMessage.text.length > 400 ? "..." : ""}`
  );

  const { src: mediaPreview } = latestMessage.media[0] || "";

  const messageCount = (
    `${messages.length} ${messages.length > 1 ? "Messages" : "Message"}`
  );

  return isMounted.current ? (
    <ToggleButton
      className={checked ? `shadow-none ${css.on}` : `shadow-none ${css.off}`}
      variant=""
      type="checkbox"
      value="0"
      checked={checked}
      onClick={showDelete ? onCheck : onClick}
    >
      <div className={css.ConversationCard}>
        <aside className={css.AvatarContainer}>
          {others.slice(0, 4).map(({ image }) => <Image key={v4()} src={image} fluid />)}
        </aside>
        <main>
          <section className={css.ParticipantsContainer}>
            <h5>Participants:</h5>
            <p>{participantsPreview}</p>
          </section>
          <section className={css.MessagePreviewContainer}>
            <p><strong>{latestMessageAuthor}: </strong></p>
            <p className={css.Message}>{messagePreview}</p>
          </section>
          <footer className={css.BottomContainer}>
            <p>{messageCount} <span className={css.New}>{hasNew ? "New!" : ""}</span></p>
            <p className={css.Ago}>{ago}</p>
          </footer>
        </main>
        <aside className={css.MediaContainer}>
          <Image src={mediaPreview} fluid />
        </aside>
      </div>

    </ToggleButton>
  ) : null;
}

ConversationCard.propTypes = propTypes;

export default memo(ConversationCard);

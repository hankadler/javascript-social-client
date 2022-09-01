import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Container, Button, Image, OverlayTrigger, Tooltip, ToggleButton } from "react-bootstrap";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import useAppContext from "../hooks/useAppContext";
import { addToWatchlist, removeFromWatchlist } from "../services/userService";
import stopAllWorkers from "../utils/stopAllWorkers";
import * as css from "../styles/PersonCard.module.css";
import watchIcon from "../assets/watch.png";
import unwatchIcon from "../assets/unwatch.png";

const propTypes = {
  ownerId: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  about: PropTypes.string.isRequired
};

function PersonCard({ ownerId, image, name, about }) {
  const { self } = useAppContext();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [watched, setWatched] = useState(false);

  // on mount
  useEffect(() => {
    setWatched(self.watchlist.includes(ownerId));
    setMounted(true);
  }, []);

  // on change watched: add/remove id from watchlist
  useEffect(() => {
    if (mounted) {
      if (watched) addToWatchlist(self, ownerId).catch((error) => { throw error; });
      else removeFromWatchlist(self, ownerId).catch((error) => { throw error; });
    }
  }, [watched]);

  const onClickImage = async () => {
    await stopAllWorkers();
    navigate(`/people/${ownerId}`);
  };

  const onChangeWatch = async (event) => setWatched(event.currentTarget.checked);

  return mounted ? (
    <Container className={css.PersonCard} value={ownerId}>
      <Button className={css.ImageContainer} onClick={onClickImage} variant="">
        <Image className={css.Image} src={image} roundedCircle fluid />
      </Button>

      <Container className={css.TextContainer}>
        <h3 className="m-2">{name}</h3>
        <pre className="m-2">{about}</pre>
      </Container>

      <Container className={css.WatchContainer}>
        <OverlayTrigger
          key={v4()}
          placement="bottom"
          overlay={<Tooltip id={v4()}>{watched ? "Unwatch" : "Watch"}</Tooltip>}
        >
          <ToggleButton
            id={v4()}
            type="checkbox"
            variant="warning"
            checked={watched}
            value="watched"
            onChange={onChangeWatch}
          >
            {watched
              ? <img src={unwatchIcon} alt="unwatch" width="32" height="32" />
              : <img src={watchIcon} alt="watch" width="32" height="32" />}
          </ToggleButton>
        </OverlayTrigger>
      </Container>
    </Container>
  ) : null;
}

PersonCard.propTypes = propTypes;

export default PersonCard;

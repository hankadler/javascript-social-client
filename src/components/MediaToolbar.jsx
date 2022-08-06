import PropTypes from "prop-types";
import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  Form,
  Image,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { v4 } from "uuid";
import useAppContext from "../hooks/useAppContext";
import useMediaContext from "../hooks/useMediaContext";
import MediaTagger from "./MediaTagger";
import MediaUploader from "./MediaUploader";
import MediaRemover from "./MediaRemover";
import * as css from "../styles/MediaToolbar.module.css";
import filterIcon from "../assets/filter.png";
import tagIcon from "../assets/tag.png";
import uploadIcon from "../assets/upload.png";
import deleteIcon from "../assets/delete.png";

const propTypes = {
  isSelf: PropTypes.bool.isRequired,
};

export default function MediaToolbar({ isSelf }) {
  const { setModalChild, setShowModal } = useAppContext();
  const { alert, setAlert, tags, activeTag, setActiveTag } = useMediaContext();
  const [showFilter, setShowFilter] = useState(false);

  const onClickFilter = async () => setShowFilter(true);

  const onToggleFilter = async (nextShow) => setShowFilter(nextShow);

  const onTag = async () => {
    setAlert({
      shown: !alert.shown,
      heading: "Tag",
      child: <MediaTagger />
    });
  };

  const onUpload = async () => {
    setModalChild(<MediaUploader />);
    setShowModal(true);
  };

  const onDelete = async () => {
    setAlert({
      shown: !alert.shown,
      heading: "Delete",
      child: <MediaRemover />
    });
  };

  return (
    <Container className={css.Toolbar}>
      <Form.Group className={css.TagContainer}>
        <Form.Control className={css.TagOutput} value={activeTag} disabled />
        <OverlayTrigger placement="left" overlay={<Tooltip id={v4()}>Filter</Tooltip>}>
          <Dropdown show={showFilter} onToggle={onToggleFilter}>
            <Button className="icon" variant="" onClick={onClickFilter}>
              <Image src={filterIcon} width="32" height="26" />
            </Button>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="None" onClick={() => setActiveTag("")}>None</Dropdown.Item>
              <Dropdown.Divider />
              {
                tags.map((tag) => (
                  tag
                    ? (
                      <Dropdown.Item
                        className={css.TagItem}
                        key={v4()}
                        eventKey={tag}
                        onClick={() => setActiveTag(tag)}
                      >
                        {tag}
                      </Dropdown.Item>
                    ) : null
                ))
              }
            </Dropdown.Menu>
          </Dropdown>
        </OverlayTrigger>
      </Form.Group>

      {
        isSelf
          ? (
            <ButtonGroup className={css.ToolbarButtonGroup}>
              <OverlayTrigger placement="bottom" overlay={<Tooltip id={v4()}>Tag</Tooltip>}>
                <Button className="icon" variant="" onClick={onTag}>
                  <Image src={tagIcon} width="32" height="32" />
                </Button>
              </OverlayTrigger>

              <OverlayTrigger placement="bottom" overlay={<Tooltip id={v4()}>Upload</Tooltip>}>
                <Button className="icon" variant="" onClick={onUpload}>
                  <Image src={uploadIcon} width="32" height="32" />
                </Button>
              </OverlayTrigger>

              <OverlayTrigger placement="bottom" overlay={<Tooltip id={v4()}>Delete</Tooltip>}>
                <Button className="icon" variant="" onClick={onDelete}>
                  <Image src={deleteIcon} width="32" height="32" />
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
          )
          : null
      }
    </Container>
  );
}

MediaToolbar.propTypes = propTypes;

import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { Container, Form, Row, Col, OverlayTrigger, Tooltip, Alert } from "react-bootstrap";
import { v4 } from "uuid";
import toBase64 from "../utils/toBase64";
import { getUser, patchUser } from "../services/userService";
import * as css from "../styles/About.module.css";
import editIcon from "../assets/edit.png";
import dummyImage from "../assets/stub.png";

const aboutCharLimit = 280;

const propTypes = {
  isSelf: PropTypes.bool.isRequired,
  ownerId: PropTypes.string.isRequired
};

export default function About({ isSelf, ownerId }) {
  const mounted = useRef(false);
  const defaultName = useRef("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [aboutCharCount, setAboutCharCount] = useState(0);

  // on mount
  useEffect(() => {
    getUser(ownerId, "select=name,image,about")
      .then((user) => {
        defaultName.current = user.name;
        setName(user.name);
        setImage(user.image);
        setAbout(user.about);
        mounted.current = true;
      });
  }, []);

  useEffect(() => {
    if (mounted.current && !name) {
      setTimeout(() => setName(defaultName.current), 2000);
    }
  }, [name]);

  useEffect(() => setAboutCharCount(about.length), [about]);

  const onBrowse = async (event) => {
    const file = event.target.files[0];
    const blobBase64 = await toBase64(file);
    setImage(blobBase64);
    await patchUser(ownerId, { image: blobBase64 });
  };

  const browse = async () => document.getElementById("browseImage").click();

  const onChangeName = async (event) => setName(event.target.value || "");

  const onBlurName = async () => {
    if (name) {
      await patchUser(ownerId, { name });
    } else {
      const { name: _name } = await getUser(ownerId, "select=name");
      setName(_name);
    }
  };

  const onChangeAbout = async (event) => setAbout(event.target.value || "");

  const onBlurAbout = async () => {
    await patchUser(ownerId, { about });
  };

  return defaultName.current ? (
    <Container className={css.About}>
      <Form>
        <Row>
          <Col sm="auto">
            <Form.Group className="mb-3">
              <div className={css.imageContainer}>
                <img className={css.image} key={v4()} src={image || dummyImage} alt="profile" />
                {
                  isSelf
                    ? (
                      <>
                        <input
                          id="browseImage"
                          className={css.displayNone}
                          type="file"
                          onChange={onBrowse}
                        />
                        <OverlayTrigger
                          key={v4()}
                          placement="bottom"
                          overlay={<Tooltip id={v4()}>Edit</Tooltip>}
                        >
                          <button className={css.toolButton} type="button" onClick={browse}>
                            <img src={editIcon} alt="" width="24" height="24" />
                          </button>
                        </OverlayTrigger>
                      </>
                    )
                    : null
                }
              </div>
            </Form.Group>
          </Col>
          <Col fluid="sm">
            <Form.Group className="mb-3">
              <Form.Label className="mb-2">Name</Form.Label>
              <Form.Control
                value={name}
                onChange={onChangeName}
                onBlur={onBlurName}
                disabled={!isSelf}
              />
              {!name ? <Alert key={v4()} variant="danger">Name is required!</Alert> : null}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-2">About</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={about}
                onChange={onChangeAbout}
                onBlur={onBlurAbout}
                maxLength={aboutCharLimit}
                disabled={!isSelf}
              />
              {
                isSelf
                  ? <p className="label">{aboutCharCount} / {aboutCharLimit}</p>
                  : null
              }
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Container>
  ) : null;
}

About.propTypes = propTypes;

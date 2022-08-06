import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Container, Image, Form, Button } from "react-bootstrap";
import useMediaContext from "../hooks/useMediaContext";
import toBase64 from "../utils/toBase64";
import * as css from "../styles/MediaUploaderCard.module.css";

const propTypes = {
  blob: PropTypes.instanceOf(File).isRequired,
  fileIndex: PropTypes.number.isRequired
};

export default function MediaUploaderCard({ blob, fileIndex }) {
  const [src, setSrc] = useState("");
  const [tag, setTag] = useState("");
  const [caption, setCaption] = useState("");
  const { uploadFile } = useMediaContext();

  useEffect(() => {
    toBase64(blob).then((base64) => setSrc(base64));
  }, []);

  const onChangeTag = async (event) => setTag(event.target.value);

  const onChangeCaption = async (event) => setCaption(event.target.value);

  const onSubmit = async () => {
    await uploadFile({ src, tag: tag || "", caption: caption || "" });
  };

  return (
    <Container className={css.MediaUploaderCard}>
      <Container className={css.ImageContainer}>
        <Image className={css.Image} src={src} />
      </Container>
      <Container>
        <Form.Group className="mb-2">
          <Form.Label>Tag:</Form.Label>
          <Form.Control value={tag} onChange={onChangeTag} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Caption:</Form.Label>
          <Form.Control
            className={css.CaptionTextarea}
            as="textarea"
            value={caption}
            onChange={onChangeCaption}
          />
        </Form.Group>
        <Button id={`upload-${fileIndex}`} hidden onClick={onSubmit}>Submit</Button>
      </Container>
    </Container>
  );
}

MediaUploaderCard.propTypes = propTypes;

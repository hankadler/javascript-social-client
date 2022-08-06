import PropTypes from "prop-types";
import { Image } from "react-bootstrap";
import * as css from "../styles/MediaUploadBox.module.css";
import addMediaIcon from "../assets/add-media.png";

const propTypes = {
  types: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default function MediaUploadBox({ types }) {
  return (
    <div className={css.MediaUploadBox}>
      <p>Click or drop file(s) here</p>
      <Image src={addMediaIcon} width={64} height={64} />
      <p>{types.map((type) => type.toUpperCase()).join(",")}</p>
    </div>
  );
}

MediaUploadBox.propTypes = propTypes;

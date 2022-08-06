import PropTypes from "prop-types";
import { Container, Image } from "react-bootstrap";
import * as css from "../styles/Notice.module.css";

const propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node
};

const defaultProps = {
  children: null
};

export default function Notice({ image, title, children }) {
  return (
    <Container className={css.Notice}>
      <Container className={css.ImageContainer}>
        <Image src={image} />
      </Container>
      <Container className={css.ChildrenContainer}>
        <h1 className={css.bigFont}>{title}</h1>
        {children}
      </Container>
    </Container>
  );
}

Notice.propTypes = propTypes;
Notice.defaultProps = defaultProps;

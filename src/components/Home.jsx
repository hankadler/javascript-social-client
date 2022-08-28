import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import * as css from "../styles/Home.module.css";
import stopAllWorkers from "../utils/stopAllWorkers";

const propTypes = {
  isSelf: PropTypes.bool.isRequired,
  ownerId: PropTypes.string.isRequired
};

export default function Home({ isSelf, ownerId }) {
  const navigate = useNavigate();
  const baseURL = isSelf ? "/home" : `/people/${ownerId}`;
  const navKey = useRef(
    window.location.pathname
      .split("/")
      .filter((str) => str.length)
      .slice(-1)[0]
  );

  // on mount
  useEffect(() => {
    if (navKey.current === "home") {
      navKey.current = "posts"; // default
    }
  }, []);

  const onSelectNav = async (key) => {
    if (navKey.current !== key) {
      await stopAllWorkers();
      navKey.current = key;
    }
  };

  return (
    <Container className={css.Home}>
      <Row>
        <Col sm="auto">
          <Navbar>
            <Nav className="flex-column" defaultActiveKey={navKey.current} onSelect={onSelectNav}>
              <Nav.Item>
                <Nav.Link
                  className={`${css.NavLink} ${navKey.current === "about" ? "activeNav" : ""}`}
                  onClick={() => navigate(`${baseURL}/about`)}
                  eventKey="about"
                >
                  About
                </Nav.Link>
                <Nav.Link
                  className={`${css.NavLink} ${navKey.current === "media" ? "activeNav" : ""}`}
                  onClick={() => navigate(`${baseURL}/media`)}
                  eventKey="media"
                >
                  Media
                </Nav.Link>
                <Nav.Link
                  className={`${css.NavLink} ${navKey.current === "posts" ? "activeNav" : ""}`}
                  onClick={() => navigate(`${baseURL}/posts`)}
                  eventKey="posts"
                >
                  Posts
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar>
        </Col>
        <Col fluid="sm">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

Home.propTypes = propTypes;

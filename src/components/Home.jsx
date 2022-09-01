import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import stopAllWorkers from "../utils/stopAllWorkers";
import * as css from "../styles/Home.module.css";

const propTypes = {
  isSelf: PropTypes.bool.isRequired,
  ownerId: PropTypes.string.isRequired
};

export default function Home({ isSelf, ownerId }) {
  const navigate = useNavigate();
  const baseURL = isSelf ? "/home" : `/people/${ownerId}`;
  const [navKey, setNavKey] = useState(
    window.location.pathname
      .split("/")
      .filter((str) => str.length)
      .slice(-1)[0]
  );

  // on mount
  useEffect(() => {
    if (navKey === "home") setNavKey("posts"); // default
  }, []);

  const onSelectNav = async (key) => {
    if (navKey !== key) {
      await stopAllWorkers();
      setNavKey(key);
    }
  };

  return (
    <Container className={css.Home}>
      <Row>
        <Col sm="auto">
          <Navbar>
            <Nav className="flex-column" defaultActiveKey={navKey} onSelect={onSelectNav}>
              <Nav.Item>
                <Nav.Link
                  className={`${css.NavLink} ${navKey === "about" ? "activeNav" : ""}`}
                  onClick={() => navigate(`${baseURL}/about`)}
                  eventKey="about"
                >
                  About
                </Nav.Link>
                <Nav.Link
                  className={`${css.NavLink} ${navKey === "media" ? "activeNav" : ""}`}
                  onClick={() => navigate(`${baseURL}/media`)}
                  eventKey="media"
                >
                  Media
                </Nav.Link>
                <Nav.Link
                  className={`${css.NavLink} ${navKey === "posts" ? "activeNav" : ""}`}
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

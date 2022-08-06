import PropTypes from "prop-types";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import * as css from "../styles/Home.module.css";

const propTypes = {
  isSelf: PropTypes.bool.isRequired,
  ownerId: PropTypes.string.isRequired
};

export default function Home({ isSelf, ownerId }) {
  const navigate = useNavigate();
  const baseURL = isSelf ? "/home" : `/people/${ownerId}`;
  const [navKey, setNavKey] = useState(window.location.pathname.split("/").slice(-1)[0]);

  return (
    <Container className={css.Home}>
      <Row>
        <Col sm="auto">
          <Navbar>
            <Nav
              className="flex-column"
              defaultActiveKey={navKey || "about"}
              onSelect={(k) => setNavKey(k)}
            >
              <Nav.Item>
                <Nav.Link
                  className={css.NavLink}
                  onClick={() => navigate(`${baseURL}/about`)}
                  eventKey="about"
                >
                  About
                </Nav.Link>
                <Nav.Link
                  className={css.NavLink}
                  onClick={() => navigate(`${baseURL}/media`)}
                  eventKey="media"
                >
                  Media
                </Nav.Link>
                <Nav.Link
                  className={css.NavLink}
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

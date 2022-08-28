import { useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import useAppContext from "../hooks/useAppContext";
import { signOut } from "../services/authService";
import stopAllWorkers from "../utils/stopAllWorkers";
import * as css from "../styles/Skeleton.module.css";

export default function Skeleton() {
  const { reset } = useAppContext();
  const navigate = useNavigate();
  const navKey = useRef(window.location.pathname.split("/").filter((str) => str.length)[0]);

  const onSignOut = async () => {
    await reset();
    await signOut();
  };

  const onSelectNav = async (key) => {
    if (navKey.current !== key) {
      await stopAllWorkers();
      navKey.current = key;
    }
  };

  return (
    <div className={css.Skeleton}>
      <Navbar className={css.Navbar} variant="">
        <Nav defaultActiveKey={navKey.current || "home"} onSelect={onSelectNav}>
          <Nav.Item>
            <Nav.Link
              className={`${css.NavLink} ${navKey.current === "home" ? "activeNav" : ""}`}
              onClick={() => navigate("/home")}
              eventKey="home"
            >
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`${css.NavLink} ${navKey.current === "people" ? "activeNav" : ""}`}
              onClick={() => navigate("/people")}
              eventKey="people"
            >
              People
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`${css.NavLink} ${navKey.current === "conversations" ? "activeNav" : ""}`}
              onClick={() => navigate("/conversations")}
              eventKey="conversations"
            >
              Conversations
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`${css.NavLink} ${navKey.current === "latest" ? "activeNav" : ""}`}
              onClick={() => navigate("/latest")}
              eventKey="latest"
            >
              Latest
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className={css.NavLink} onClick={onSignOut}>Sign out</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
      <Container className={css.Content}>
        <main>
          <Outlet />
        </main>
      </Container>
    </div>
  );
}

import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import useAppContext from "../hooks/useAppContext";
import { signOut } from "../services/authService";
import * as css from "../styles/Skeleton.module.css";

export default function Skeleton() {
  const { reset } = useAppContext();
  const navigate = useNavigate();
  const [navKey, setNavKey] = useState(window.location.pathname.split("/").slice(-1)[0]);

  const onSignOut = async () => {
    await signOut();
    reset();
    navigate("/");
    window.location.reload(false); // todo: shutdown posts worker gracefully instead of this
  };

  return (
    <div className={css.Skeleton}>
      {/* <Navbar className="justify-content-center" bg="primary" variant="dark"> */}
      <Navbar className={css.Navbar} variant="">
        <Nav defaultActiveKey={navKey || "home"} onSelect={(k) => setNavKey(k)}>
          <Nav.Item>
            <Nav.Link className={css.NavLink} onClick={() => navigate("/home")} eventKey="home">
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className={css.NavLink} onClick={() => navigate("/people")} eventKey="people">
              People
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={css.NavLink}
              onClick={() => navigate("/conversations")}
              eventKey="conversation"
            >
              Conversations
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className={css.NavLink} onClick={() => navigate("/latest")} eventKey="latest">
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

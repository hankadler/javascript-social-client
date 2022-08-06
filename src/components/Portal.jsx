import { useEffect, useState } from "react";
import { Container, Form, Tabs, Tab, Button, Alert, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import Notice from "./Notice";
import useAppContext from "../hooks/useAppContext";
import { signIn, signUp } from "../services/authService";
import * as css from "../styles/Portal.module.css";
import socialImage from "../assets/social.png";

const emailSentNotice = (email) => (
  <Notice image={socialImage} title="Activation">
    <p>An email containing an activation link was sent to {email}</p>
  </Notice>
);

export default function Portal() {
  const { setSelfId } = useAppContext();
  const passwordMinLength = 4;
  const navigate = useNavigate();
  const [tabKey, setTabKey] = useState("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [forgotPasswordDisabled, setForgotPasswordDisabled] = useState(true);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [alert, setAlert] = useState("");
  const [notice, setNotice] = useState(null);

  // disable forgot password on invalid email
  useEffect(() => setForgotPasswordDisabled(!validator.isEmail(email)), [email]);

  // disable submit on invalid passwords
  useEffect(() => {
    setAlert("");
    setSubmitDisabled(password.length < passwordMinLength);
    if (tabKey === "sign-up") {
      setSubmitDisabled(passwordAgain.length < passwordMinLength);
    }
    if (passwordAgain.length >= password.length && passwordAgain !== password) {
      setSubmitDisabled(true);
      setAlert("Passwords don't match!");
    }
  }, [tabKey, password, passwordAgain]);

  const onChangeName = async (event) => {
    setName(event.target.value);
  };

  const onChangeEmail = async (event) => {
    setEmail(event.target.value);
  };

  const onChangePassword = async (event) => {
    setPassword(event.target.value);
  };

  const onChangePasswordAgain = async (event) => {
    setPasswordAgain(event.target.value);
  };

  const onForgotPassword = async () => {
    console.log("TODO: show alert saying that email has been sent");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (tabKey === "sign-up") {
      await signUp(name, email, password, passwordAgain);
      setNotice(emailSentNotice(email));
    } else if (tabKey === "sign-in") {
      setSelfId(await signIn(email, password));
      navigate("/latest");
    }
  };

  const nameFormGroup = (
    <Form.Group className="mb-2" controlId="name">
      <Form.Label className="m-0">Name</Form.Label>
      <Form.Control
        placeholder="Enter your name"
        value={name}
        onChange={onChangeName}
      />
    </Form.Group>
  );

  const emailFormGroup = (
    <Form.Group className="mb-2" controlId="email">
      <Form.Label className="m-0">Email</Form.Label>
      <Form.Control
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={onChangeEmail}
      />
    </Form.Group>
  );

  const passwordFormGroup = (
    <Form.Group className="mb-2" controlId="password">
      <Form.Label className="m-0">Password</Form.Label>
      <Form.Control
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={onChangePassword}
      />
    </Form.Group>
  );

  const forgotPasswordLink = (
    <Button
      className={css.Link}
      variant="link"
      disabled={forgotPasswordDisabled}
      onClick={onForgotPassword}
    >
      Forgot password?
    </Button>
  );

  const passwordAgainFormGroup = (
    <Form.Group className="mb-2" controlId="passwordAgain">
      <Form.Label className="m-0">Password Again</Form.Label>
      <Form.Control
        className="mb-3"
        type="password"
        placeholder="Confirm your password"
        value={passwordAgain}
        onChange={onChangePasswordAgain}
      />
    </Form.Group>
  );

  return notice || (
    <Container className={css.Portal} fluid="md">
      <Container className={css.Banner}>
        <Image src={socialImage} width="320" />
      </Container>
      <Form className={css.Form} onSubmit={onSubmit}>
        <Tabs id="tabs" className="mb-3" activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
          <Tab eventKey="sign-in" title="Sign in">
            {emailFormGroup}
            {passwordFormGroup}
            {forgotPasswordLink}
          </Tab>
          <Tab eventKey="sign-up" title="Sign up">
            {nameFormGroup}
            {emailFormGroup}
            {passwordFormGroup}
            {passwordAgainFormGroup}
            {alert ? <Alert key="password-alert" variant="danger">{alert}</Alert> : null}
          </Tab>
        </Tabs>
        <Button className={css.Submit} variant="primary" type="submit" disabled={submitDisabled}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}

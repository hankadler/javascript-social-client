import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import useApp from "../hooks/useAppContext";
import Notice from "../components/Notice";
import errorImage from "../assets/error.png";

const propTypes = {
  children: PropTypes.node.isRequired
};

export default function ErrorBoundary({ children }) {
  const { reset } = useApp();
  const [error, setError] = useState("");

  const promiseRejectionHandler = (event) => {
    setError(event.reason);
    window.stop();
  };

  const resetError = () => {
    reset();
    setError("");
  };

  useEffect(() => {
    window.addEventListener("unhandledrejection", promiseRejectionHandler);

    return () => {
      window.removeEventListener("unhandledrejection", promiseRejectionHandler);
    };
  }, []);

  return error ? (
    <Notice image={errorImage} title={`${error.code || 400} ${error.name}`}>
      <p>{error.message}</p>
      <Button onClick={resetError}>Back</Button>
    </Notice>
  ) : (
    children
  );
}

ErrorBoundary.propTypes = propTypes;

import { Alert } from "react-bootstrap";
import useMediaContext from "../hooks/useMediaContext";

export default function MediaAlert() {
  const { alert, setAlert } = useMediaContext();

  const onClose = async () => setAlert({ ...alert, shown: false });

  return (
    alert.shown
      ? (
        <Alert className="m-0 mt-3" variant="primary" onClose={onClose} dismissible>
          <Alert.Heading>{alert.heading}</Alert.Heading>
          <hr />
          {alert.child}
        </Alert>
      )
      : null
  );
}

import PropTypes from "prop-types";
import { useState } from "react";
import { v4 } from "uuid";
import { Button, Form, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import clearIcon from "../assets/clear.png";
import searchIcon from "../assets/search.png";

const propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

const defaultProps = {
  disabled: false
};

export default function Search({ value, setValue, onSearch, onClear, disabled }) {
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    onSearch();
  };

  const handleClear = () => {
    setValue("");
    setSearched(false);
    onClear();
  };

  const onChange = (event) => {
    setValue(event.target.value);
    if (!event.target.value && searched) handleClear();
  };

  const onKeyPress = (event) => {
    if (event.key === "Enter") handleSearch();
  };

  const clearAndSearchDisabled = searched ? false : disabled;

  return (
    <div className="d-flex">
      <Form.Control
        type="search"
        placeholder="Search"
        className="me-2"
        aria-label="Search"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={clearAndSearchDisabled}
      />
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id={v4()}>{searched ? "Clear" : "Search"}</Tooltip>}
      >
        <Button
          variant=""
          onClick={searched ? handleClear : handleSearch}
          disabled={clearAndSearchDisabled}
        >
          <Image src={searched ? clearIcon : searchIcon} width="16" height="16" />
        </Button>
      </OverlayTrigger>
    </div>
  );
}

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

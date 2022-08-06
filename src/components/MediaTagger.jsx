import { useEffect, useState } from "react";
import { Button, Form, Dropdown, Alert } from "react-bootstrap";
import { v4 } from "uuid";
import _ from "lodash";
import useAppContext from "../hooks/useAppContext";
import useMediaContext from "../hooks/useMediaContext";
import * as css from "../styles/MediaTagger.module.css";

export default function MediaTagger() {
  const { selfId } = useAppContext();
  const {
    alert, setAlert, tags, setActiveTag, selection, setSelection, refreshMedia, tagMedia
  } = useMediaContext();
  const [stage, setStage] = useState(0);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [chosenTag, setChosenTag] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newTags, setNewTags] = useState([]);
  const [addDisabled, setAddDisabled] = useState(true);

  // clear selection on alert open & close
  useEffect(() => setSelection([]), [alert.shown]);

  // disable next if no files are selected
  useEffect(() => setNextDisabled(selection.length === 0), [selection]);

  // disable add new tag if input is empty
  useEffect(() => setAddDisabled(newTags.length === 0), [newTags]);

  // blur apply button on render
  useEffect(() => {
    if (stage === 1) document.getElementById("apply-tag").blur();
  }, [stage]);

  /* handlers */

  const onClose = async () => {
    setAlert({ ...alert, shown: false });
  };

  const onNext = async () => setStage(1);

  const onApply = async () => {
    await tagMedia(chosenTag);
    await onClose();
    refreshMedia(selfId);
    setActiveTag(chosenTag);
  };

  const onChangeNewTag = async (event) => {
    const _newTag = event.target.value;
    setAddDisabled(!_newTag || tags.includes(_newTag));
    setNewTag(_.startCase(_newTag));
  };

  const onAddNewTag = async () => {
    setNewTags([...newTags, newTag]);
    setNewTag("");
  };

  const onKeyPressNewTag = async (event) => {
    if (event.key === "Enter") document.getElementById("add-new-tag").click();
  };

  /* components */

  const stages = [
    (
      <>
        <p>Select files:</p>
        <div className={css.AlertButtonContainer}>
          <Button id="next" disabled={nextDisabled} onClick={onNext}>Next</Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </>
    ),
    (
      <>
        <Form.Group className={css.AssignTagRow}>
          <Form.Label className={css.AssignTagLabel}>Assign tag:</Form.Label>
          <Form.Control value={chosenTag} disabled />
          <Dropdown>
            <Dropdown.Toggle />
            <Dropdown.Menu>
              <div className={css.dropItem}>
                <Dropdown.Item eventKey="None" onClick={() => setChosenTag("")}>
                  None
                </Dropdown.Item>
              </div>
              <Dropdown.Divider />
              {
                tags.map((tag) => (
                  <div className={css.dropItem} key={v4()}>
                    <Dropdown.Item eventKey={tag} onClick={() => setChosenTag(tag)}>
                      {tag}
                    </Dropdown.Item>
                  </div>
                ))
              }
              <Dropdown.Divider />
              {
                newTags.length > 0
                  ? newTags.map((tag) => (
                    <div className={css.grid1x2} key={v4()}>
                      <Dropdown.Item eventKey={tag} onClick={() => setChosenTag(tag)}>
                        {tag}
                      </Dropdown.Item>
                      <Button
                        variant="danger"
                        onClick={() => setNewTags(newTags.filter((t) => t !== tag))}
                      >
                        &minus;
                      </Button>
                    </div>
                  ))
                  : null
              }
              {newTags.length > 0 ? <Dropdown.Divider /> : null}
              <div className={css.grid1x2}>
                <Form.Control
                  value={newTag}
                  onChange={onChangeNewTag}
                  onKeyPress={onKeyPressNewTag}
                />
                <Button id="add-new-tag" onClick={onAddNewTag} disabled={addDisabled}>+</Button>
              </div>
              {
                addDisabled && newTag
                  ? <Alert className="m-2" variant="danger">Duplicate!</Alert>
                  : null
              }
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        <div className={css.AlertButtonContainer}>
          <Button id="apply-tag" onClick={onApply}>Apply</Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </>
    )
  ];

  return stages[stage];
}

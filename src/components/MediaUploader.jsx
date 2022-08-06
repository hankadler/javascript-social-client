import { useState } from "react";
import { v4 } from "uuid";
import { FileUploader } from "react-drag-drop-files";
import { Button } from "react-bootstrap";
import config from "../config";
import useAppContext from "../hooks/useAppContext";
import MediaUploadBox from "./MediaUploadBox";
import MediaUploaderCard from "./MediaUploaderCard";
import * as css from "../styles/MediaUploader.module.css";

export default function MediaUploader() {
  const { setShowModal, setModalChild } = useAppContext();
  const [blobs, setBlobs] = useState([]);

  const onChange = async (fileList) => setBlobs(Array.from(fileList));

  // const onDrop = async (fileList) => console.log("dropped", fileList);

  // const onSelect = async (fileList) => console.log("selected", fileList);

  const onSubmit = async () => {
    blobs.forEach((blob, index) => document.getElementById(`upload-${index}`).click());
    setShowModal(false);
    setModalChild(null);
  };

  return (
    <div className={css.MediaUploader}>
      <header className={css.Header}>
        <FileUploader
          handleChange={onChange}
          name="files"
          multiple
          maxSize={16}
          types={config.fileTypes}
          // onDrop={onDrop}
          // onSelect={onSelect}
        >
          <MediaUploadBox types={config.fileTypes} />
        </FileUploader>
      </header>
      <main className={css.Main}>
        {
          blobs.map((blob, index) => (
            <MediaUploaderCard
              blob={blob}
              fileIndex={index}
              key={v4()}
            />
          ))
        }
      </main>
      <footer className={css.Footer}>
        <Button onClick={onSubmit} hidden={blobs.length === 0}>Submit</Button>
      </footer>
    </div>
  );
}

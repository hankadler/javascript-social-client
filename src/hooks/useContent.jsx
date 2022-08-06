import { useEffect, useRef, useState } from "react";
import toBase64 from "../utils/toBase64";
import toAgo from "../utils/toAgo";

export default function useContent() {
  const textRef = useRef(null);
  const agoWorker = useRef(0);
  const [showMore, setShowMore] = useState(false);
  const [sources, setSources] = useState([]);
  const [text, setText] = useState("");
  const [textDisabled, setTextDisabled] = useState(true);
  const [modifiedAt, setModifiedAt] = useState(null);
  const [ago, setAgo] = useState("");

  const resetAgoWorker = () => {
    clearInterval(agoWorker.current);
    agoWorker.current = setInterval(() => setAgo(toAgo(modifiedAt)), 1000);
  };

  // on change textDisabled
  useEffect(() => {
    if (!textDisabled && textRef.current) {
      textRef.current.focus();
      textRef.current.selectionStart = 0;
      textRef.current.selectionEnd = textRef.current.value.length;
    }
  }, [textDisabled]);

  // on change modifiedAt
  useEffect(() => {
    if (modifiedAt) setAgo(toAgo(modifiedAt));
  }, [modifiedAt]);

  // on change ago
  useEffect(() => {
    if (ago) resetAgoWorker();
  });

  // on unmount
  useEffect(() => () => clearInterval(agoWorker.current), []);

  const onChangeFiles = async (fileList) => {
    const blobs = Array.from(fileList);
    const _sources = await Promise.all(blobs.map((blob) => toBase64(blob)));
    setSources(_sources);
  };

  const onClickMore = async () => setShowMore(true);

  const onToggleMore = async (nextShow) => setShowMore(nextShow);

  const onClickEdit = async () => setTextDisabled(false);

  const onChangeText = async (event) => setText(event.target.value);

  return {
    textRef,
    agoWorker,
    showMore,
    setShowMore,
    sources,
    setSources,
    text,
    setText,
    textDisabled,
    setTextDisabled,
    modifiedAt,
    setModifiedAt,
    ago,
    setAgo,
    onChangeFiles,
    onClickMore,
    onToggleMore,
    onClickEdit,
    onChangeText
  };
}

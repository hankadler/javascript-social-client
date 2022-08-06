import PropTypes from "prop-types";
import { createContext, useMemo, useState } from "react";
import useApp from "../hooks/useAppContext";
import { getMedia, patchMedia, postFile, deleteMedia as delMedia } from "../services/mediaService";

export const MediaContext = createContext(null);

const propTypes = {
  children: PropTypes.node.isRequired
};

export default function MediaContextProvider({ children }) {
  const { selfId } = useApp();
  const [alert, setAlert] = useState({ shown: false, heading: "", child: null });
  const [media, setMedia] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState("");
  const [selection, setSelection] = useState([]);

  const refreshMedia = (userId) => {
    getMedia(userId).then((_media) => setMedia(_media));
  };

  const refreshTags = () => {
    setTags(Array.from(new Set(media.map(({ tag }) => tag))));
  };

  const uploadFile = async (file) => {
    await postFile(selfId, file);
    refreshMedia(selfId);
  };

  const tagMedia = async (tag) => {
    await patchMedia(selfId, selection, { tag });
  };

  const deleteMedia = async () => {
    await delMedia(selfId, selection);
    refreshMedia(selfId);
  };

  const value = useMemo(() => ({
    alert,
    setAlert,
    media,
    setMedia,
    tags,
    setTags,
    activeTag,
    setActiveTag,
    selection,
    setSelection,
    refreshMedia,
    refreshTags,
    uploadFile,
    tagMedia,
    deleteMedia
  }), [alert, media, tags, activeTag, selection, refreshMedia]);

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
}

MediaContextProvider.propTypes = propTypes;

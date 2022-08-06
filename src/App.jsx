import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { v4 } from "uuid";
import useAppContext from "./hooks/useAppContext";
import useConversations from "./hooks/useConversationsContext";
import { isAuth } from "./services/authService";
import Portal from "./components/Portal";
import Skeleton from "./components/Skeleton";
import Home from "./components/Home";
import About from "./components/About";
import Media from "./components/Media";
import Posts from "./components/Posts";
import People from "./components/People";
import Conversations from "./components/Conversations";
import Messages from "./components/Messages";
import Latest from "./components/Latest";
import Modal from "./components/Modal";

export default function App() {
  const { mounted, selfId, otherIds } = useAppContext();
  const { conversations } = useConversations();

  return mounted ? (
    <BrowserRouter id="app">
      <Routes>
        {!isAuth(selfId)
          ? (
            <>
              <Route path="/" element={<Portal />} />
              <Route path="/*" element={<Navigate to="/" replace />} />
            </>
          )
          : (
            <Route path="/" element={<Skeleton />}>
              <Route index element={<Navigate to="/home" replace />} />

              <Route path="home" element={<Home isSelf ownerId={selfId} />}>
                <Route index element={<Navigate to="posts" replace />} />
                <Route path="about" element={<About isSelf ownerId={selfId} />} />
                <Route path="media" element={<Media isSelf ownerId={selfId} />} />
                <Route path="posts" element={<Posts isSelf ownerId={selfId} />} />
              </Route>

              <Route path="/people" element={<People selfId={selfId} />} />

              <Route path={`/people/${selfId}`} element={<Navigate to="/home" />} />

              {otherIds.map((otherId) => (
                <Route
                  key={v4()}
                  path={`/people/${otherId}`}
                  element={<Home isSelf={false} ownerId={otherId} />}
                >
                  <Route index element={<Navigate to="posts" replace />} />
                  <Route path="about" element={<About isSelf={false} ownerId={otherId} />} />
                  <Route path="media" element={<Media isSelf={false} ownerId={otherId} />} />
                  <Route path="posts" element={<Posts isSelf={false} ownerId={otherId} />} />
                </Route>
              ))}

              <Route path="/latest" element={<Latest />} />

              <Route path="/conversations" element={<Conversations />} />

              {conversations.map(({ _id }) => (
                <Route
                  key={v4()}
                  path={`conversations/${_id}`}
                  element={<Messages ownerId={selfId} conversationId={_id} />}
                />
              ))}

              <Route path="*" element={<Navigate to={-1} replace />} />
            </Route>
          )}
      </Routes>

      <Modal />
    </BrowserRouter>
  ) : null;
}

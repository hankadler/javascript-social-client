import { createRoot } from "react-dom/client";
import ErrorBoundary from "./errors/ErrorBoundary";
import AppContextProvider from "./contexts/AppContextProvider";
import PostsContextProvider from "./contexts/PostsContextProvider";
import ConversationsContextProvider from "./contexts/ConversationsContextProvider";
import MediaContextProvider from "./contexts/MediaContextProvider";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <AppContextProvider>
    <PostsContextProvider>
      <ConversationsContextProvider>
        <MediaContextProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </MediaContextProvider>
      </ConversationsContextProvider>
    </PostsContextProvider>
  </AppContextProvider>
);

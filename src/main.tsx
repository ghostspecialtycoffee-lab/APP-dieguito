import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";
import { LocalDataProvider } from "./context/LocalDataContext";
import { isCloudMode } from "./lib/utils";
import "./index.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

const appTree = (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    {isCloudMode ? (
      <App />
    ) : (
      <LocalDataProvider>
        <App />
      </LocalDataProvider>
    )}
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isCloudMode && convex ? (
      <ConvexProvider client={convex}>{appTree}</ConvexProvider>
    ) : (
      appTree
    )}
  </StrictMode>,
);

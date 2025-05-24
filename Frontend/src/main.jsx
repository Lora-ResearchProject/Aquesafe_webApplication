import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PollingProvider } from "./contexts/PollingContext";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PollingProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PollingProvider>
  </StrictMode>
);

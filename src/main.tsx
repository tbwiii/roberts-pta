import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.__ptaInstallEvent = e;
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

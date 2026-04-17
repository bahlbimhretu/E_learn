import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { registerSW } from "virtual:pwa-register";

// Register service worker (PWA)
registerSW({
  onNeedRefresh() {
    console.log("New version available. Refresh to update.");
  },
  onOfflineReady() {
    console.log("App is ready for offline use.");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
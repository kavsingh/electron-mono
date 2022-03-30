import { createRoot } from "react-dom/client";

import App from "./app";

const appRoot = document.getElementById("app-root");

if (!appRoot) throw new Error("app-root not found");

createRoot(appRoot).render(<App />);

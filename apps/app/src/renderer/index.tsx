import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./app";

const appRoot = document.getElementById("app-root");

if (!appRoot) throw new Error("#app-root not found");

const root = createRoot(appRoot);

root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);

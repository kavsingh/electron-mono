import { render } from "solid-js/web";

import "./index.css";
import { App } from "./app";

const appRoot = document.getElementById("app-root");

if (!appRoot) throw new Error("#app-root not found");

const dispose = render(() => <App />, appRoot);

if (import.meta.hot) import.meta.hot.dispose(dispose);

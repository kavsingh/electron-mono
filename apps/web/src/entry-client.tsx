// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const mountEl = document.getElementById("app");

if (!mountEl) throw new Error("Mount element #app not found");

mount(() => <StartClient />, mountEl);

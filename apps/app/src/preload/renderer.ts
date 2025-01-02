import { exposeTypedIpc } from "electron-typed-ipc/preload";

process.once("loaded", exposeTypedIpc);

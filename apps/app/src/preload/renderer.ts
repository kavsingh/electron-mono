import { exposeTypedIpc } from "@kavsingh/electron-typed-ipc/preload";

process.once("loaded", exposeTypedIpc);

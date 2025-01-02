import { exposeTIPC } from "electron-typed-ipc/preload";

process.once("loaded", exposeTIPC);

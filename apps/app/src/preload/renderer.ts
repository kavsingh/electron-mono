import { exposeTIPC } from "tipc/preload";

process.once("loaded", exposeTIPC);

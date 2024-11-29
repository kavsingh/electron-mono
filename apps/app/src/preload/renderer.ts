import { exposeElectronTRPC } from "electron-trpc/main";
import { exposeTIPC } from "tipc/preload";

process.once("loaded", () => {
	exposeElectronTRPC();
	exposeTIPC();
});

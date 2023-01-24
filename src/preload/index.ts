// @ts-expect-error fucking ESM interop with package exports. switching to type:module + node 16 resolution breaks 100 other things. ignore for now
import { exposeElectronTRPC } from "electron-trpc/main";

process.once("loaded", () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	exposeElectronTRPC();
});

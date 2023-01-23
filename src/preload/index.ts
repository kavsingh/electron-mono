// @ts-expect-error fucking ESM interop with package exports, fixing for one breaks 1000 other things, igonre this shit for now. fuck ESM i swear to god.
import { exposeElectronTRPC } from "electron-trpc/main";

process.once("loaded", () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	exposeElectronTRPC();
});

import { defineConfig } from "@solidjs/start/config";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

export default defineConfig({
	vite: {
		plugins: [
			// @ts-expect-error upstream types
			tsconfigPathsPlugin(),
		],
	},
});

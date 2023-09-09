import { defineConfig } from "vite";

import { nodeConfig } from "./electron.vite.config";

export default defineConfig({
	...nodeConfig,
	test: {
		include: [
			"src/{main,common,preload}/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
		],
		environment: "node",
		setupFiles: ["./vitest.node.setup.ts"],
		clearMocks: true,
	},
});

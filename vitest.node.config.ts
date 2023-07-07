import { mergeConfig } from "vite";

import { nodeConfig } from "./electron.vite.config";

import type { UserConfig } from "vite";

// TODO: switch back to vitest defineConfig when upstream types resolved
export default mergeConfig(nodeConfig, {
	test: {
		include: [
			"src/{main,common,preload}/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
		],
		environment: "node",
		setupFiles: ["./vitest.node.setup.ts"],
		clearMocks: true,
	},
} satisfies UserConfig);

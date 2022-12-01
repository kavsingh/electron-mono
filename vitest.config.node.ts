import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

import { nodeConfig } from "./electron.vite.config.mjs";

export default mergeConfig(
	nodeConfig,
	defineConfig({
		test: {
			include: [
				"src/{main,common,bridge,preload}/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
			],
			environment: "node",
			setupFiles: ["./vitest.setup.node.ts"],
		},
	}),
);

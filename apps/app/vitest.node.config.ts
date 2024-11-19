import { defineConfig, defineProject, mergeConfig } from "vitest/config";

import { nodeConfig } from "./electron.vite.config";

export default defineConfig(
	mergeConfig(
		nodeConfig,
		defineProject({
			test: {
				name: "node",
				include: ["src/{main,common,preload}/**/*.{test,spec}.?(m|c)[jt]s?(x)"],
				environment: "node",
				setupFiles: ["./vitest.node.setup.ts"],
				clearMocks: true,
			},
		}),
	),
);

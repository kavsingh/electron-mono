import { defineProject, defineWorkspace, mergeConfig } from "vitest/config";

import { nodeConfig, rendererConfig } from "./electron.vite.config.ts";

export default defineWorkspace([
	mergeConfig(
		nodeConfig,
		defineProject({
			test: {
				name: "node",
				environment: "node",
				include: ["src/{main,common,preload}/**/*.{test,spec}.?(m|c)[tj]s?(x)"],
				setupFiles: ["./src/vitest.node.setup.ts"],
			},
		}),
	),
	mergeConfig(
		await rendererConfig({ mode: "production", command: "build" }),
		defineProject({
			test: {
				name: "renderer",
				environment: "jsdom",
				include: ["src/renderer/**/*.{test,spec}.?(m|c)[tj]s?(x)"],
				setupFiles: ["./src/vitest.renderer.setup.ts"],
			},
		}),
	),
]);

import { defineProject, defineWorkspace, mergeConfig } from "vitest/config";

import { nodeConfig, rendererConfig } from "./electron.vite.config";

export default defineWorkspace([
	mergeConfig(
		nodeConfig,
		defineProject({
			test: {
				name: "node",
				environment: "node",
				include: ["src/{main,common,preload}/**/*.{test,spec}.?(m|c)[tj]s?(x)"],
				setupFiles: ["./vitest.node.setup.ts"],
			},
		}),
	),
	mergeConfig(
		rendererConfig,
		defineProject({
			resolve: { conditions: ["development", "browser"] },
			test: {
				name: "renderer",
				environment: "jsdom",
				include: ["src/renderer/**/*.{test,spec}.?(m|c)[tj]s?(x)"],
				setupFiles: ["./vitest.renderer.setup.ts"],
				server: { deps: { inline: [/solid-js/] } },
			},
		}),
	),
]);

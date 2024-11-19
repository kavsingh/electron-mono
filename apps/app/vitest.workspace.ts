import { defineProject, defineWorkspace, mergeConfig } from "vitest/config";

import { nodeConfig, rendererConfig } from "./electron.vite.config";

export default defineWorkspace([
	mergeConfig(
		nodeConfig,
		defineProject({
			test: {
				name: "node",
				environment: "node",
				include: ["src/{main,common,preload}/**/*.{test,spec}.?(m|c)[jt]s?(x)"],
				setupFiles: ["./vitest.node.setup.ts"],
			},
		}),
	),
	mergeConfig(
		rendererConfig,
		defineProject({
			// https://dev.to/mbarzeev/testing-a-solidjs-component-using-vitest-2h35
			test: {
				name: "renderer",
				environment: "jsdom",
				include: ["src/renderer/**/*.{test,spec}.?(m|c)[jt]s?(x)"],
				setupFiles: ["./vitest.renderer.setup.ts"],
				testTransformMode: { web: ["/.[jt]sx?$/"] },
				server: { deps: { inline: [/solid-js/, /@solidjs/] } },
			},
		}),
	),
]);

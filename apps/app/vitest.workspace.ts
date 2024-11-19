import { defineProject, defineWorkspace, mergeConfig } from "vitest/config";

import { nodeConfig, rendererConfig } from "./electron.vite.config";

export default defineWorkspace([
	mergeConfig(
		nodeConfig,
		defineProject({
			test: {
				name: "node",
				clearMocks: true,
				include: ["src/{main,common,preload}/**/*.{test,spec}.?(m|c)[jt]s?(x)"],
				environment: "node",
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
				clearMocks: true,
				include: ["src/renderer/**/*.{test,spec}.?(m|c)[jt]s?(x)"],
				environment: "jsdom",
				setupFiles: ["./vitest.renderer.setup.ts"],
				testTransformMode: { web: ["/.[jt]sx?$/"] },
				server: { deps: { inline: [/solid-js/, /@solidjs/] } },
			},
		}),
	),
]);

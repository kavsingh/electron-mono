import { defineConfig, defineProject, mergeConfig } from "vitest/config";

import { mainConfig, rendererConfig } from "./electron.vite.config.ts";

export default defineConfig({
	test: {
		clearMocks: true,
		coverage: {
			include: [
				"src",
				"!**/__generated__",
				"!**/__mocks__",
				"!**/__{test,spec}*__",
				"!**/{test,spec}.*",
				"!**/types.*",
			],
			reporter: "lcov",
		},
		projects: [
			mergeConfig(
				await mainConfig({ mode: "test", command: "build" }),
				defineProject({
					test: {
						name: "node",
						environment: "node",
						include: [
							"src/{main,common,preload}/**/*.{test,spec}.?(m|c)[tj]s?(x)",
						],
						setupFiles: ["./src/vitest.node.setup.ts"],
					},
				}),
			),
			mergeConfig(
				await rendererConfig({ mode: "test", command: "build" }),
				defineProject({
					resolve: { conditions: ["development", "browser"] },
					test: {
						name: "renderer",
						environment: "jsdom",
						include: ["src/renderer/**/*.{test,spec}.?(m|c)[tj]s?(x)"],
						setupFiles: ["./src/vitest.renderer.setup.ts"],
						server: { deps: { inline: [/solid-js/] } },
					},
				}),
			),
		],
	},
});

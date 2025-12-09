import { defineConfig, defineProject, mergeConfig } from "vitest/config";

import defineBaseConfig from "./electron.vite.config.ts";

export default defineConfig((configEnv) => {
	const baseConfig = defineBaseConfig(configEnv);

	return {
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
					baseConfig.main as Record<string, unknown>,
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
					baseConfig.renderer as Record<string, unknown>,
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
	};
});

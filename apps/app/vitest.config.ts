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
				reportsDirectory: "./reports/coverage",
			},
			projects: [
				mergeConfig(
					// oxlint-disable-next-line typescript/no-unsafe-type-assertion
					baseConfig.main as Record<string, unknown>,
					defineProject({
						test: {
							name: "main",
							environment: "node",
							include: [
								"src/{main,common,preload}/**/*.{test,spec}.?(m|c)[tj]s?(x)",
							],
							setupFiles: ["./src/vitest.node.setup.ts"],
						},
					}),
				),
				mergeConfig(
					// oxlint-disable-next-line typescript/no-unsafe-type-assertion
					baseConfig.renderer as Record<string, unknown>,
					defineProject({
						resolve: { conditions: ["development", "browser"] },
						test: {
							name: "renderer",
							environment: "jsdom",
							include: ["src/renderer/**/*.{test,spec}.?(m|c)[tj]s?(x)"],
							setupFiles: ["./src/vitest.renderer.setup.ts"],
						},
					}),
				),
			],
		},
	};
});

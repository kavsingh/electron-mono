import { defineConfig, mergeConfig } from "vitest/config";

import { rendererConfig } from "./electron.vite.config";

import type { ViteUserConfig } from "vitest/config";

export default defineConfig(
	mergeConfig(rendererConfig, {
		test: {
			include: ["src/renderer/**/*.{test,spec}.?(m|c)[jt]s?(x)"],
			environment: "jsdom",
			setupFiles: ["./vitest.renderer.setup.ts"],
			clearMocks: true,
			coverage: {
				include: [
					"src/renderer",
					"!**/__generated__",
					"!**/__mocks__",
					"!**/__test*__",
					"!**/*.{test,spec}.*",
				],
				reportsDirectory: "./coverage/renderer",
			},
		},
	} satisfies ViteUserConfig),
);

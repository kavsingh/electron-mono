import { defineConfig, mergeConfig } from "vitest/config";

import { rendererConfig } from "./electron.vite.config";

import type { ViteUserConfig } from "vitest/config";

export default defineConfig(
	mergeConfig(rendererConfig, {
		// https://dev.to/mbarzeev/testing-a-solidjs-component-using-vitest-2h35
		test: {
			include: [
				"src/renderer/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
			],
			environment: "jsdom",
			setupFiles: ["./vitest.renderer.setup.ts"],
			clearMocks: true,
			testTransformMode: { web: ["/.[jt]sx?$/"] },
			server: { deps: { inline: [/solidjs/, /@solidjs/] } },
			coverage: {
				include: [
					"src/renderer",
					"!**/__generated__",
					"!**/__mocks__",
					"!**/__test*__",
					"!**/*.test.*",
				],
				reportsDirectory: "./coverage/renderer",
			},
		},
	} satisfies ViteUserConfig),
);

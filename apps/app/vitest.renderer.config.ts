import { defineConfig, defineProject, mergeConfig } from "vitest/config";

import { rendererConfig } from "./electron.vite.config";

export default defineConfig(
	mergeConfig(
		rendererConfig,
		defineProject({
			// https://dev.to/mbarzeev/testing-a-solidjs-component-using-vitest-2h35
			test: {
				name: "renderer",
				include: ["src/renderer/**/*.{test,spec}.?(m|c)[jt]s?(x)"],
				environment: "jsdom",
				setupFiles: ["./vitest.renderer.setup.ts"],
				clearMocks: true,
				testTransformMode: { web: ["/.[jt]sx?$/"] },
				server: { deps: { inline: [/solid-js/, /@solidjs/] } },
			},
		}),
	),
);

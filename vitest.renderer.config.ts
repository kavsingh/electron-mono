import { defineConfig, mergeConfig } from "vitest/config";

import { rendererConfig } from "./electron.vite.config";

import type { UserWorkspaceConfig } from "vitest";

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
		},
	} satisfies UserWorkspaceConfig),
);

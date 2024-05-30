import { defineConfig, mergeConfig } from "vitest/config";

import { rendererConfig } from "./electron.vite.config";

import type { UserWorkspaceConfig } from "vitest";

export default defineConfig(
	mergeConfig(rendererConfig, {
		test: {
			include: [
				"src/renderer/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
			],
			environment: "jsdom",
			setupFiles: ["./vitest.renderer.setup.ts"],
			clearMocks: true,
		},
	} satisfies UserWorkspaceConfig),
);

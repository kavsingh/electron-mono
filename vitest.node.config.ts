import { defineConfig, mergeConfig } from "vitest/config";

import { nodeConfig } from "./electron.vite.config";

import type { UserWorkspaceConfig } from "vitest";

export default defineConfig(
	mergeConfig(nodeConfig, {
		test: {
			include: [
				"src/{main,common,preload}/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
			],
			environment: "node",
			setupFiles: ["./vitest.node.setup.ts"],
			clearMocks: true,
		},
	} satisfies UserWorkspaceConfig),
);

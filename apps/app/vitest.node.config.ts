import { defineConfig, mergeConfig } from "vitest/config";

import { nodeConfig } from "./electron.vite.config";

import type { ViteUserConfig } from "vitest/config";

export default defineConfig(
	mergeConfig(nodeConfig, {
		test: {
			include: [
				"src/{main,common,preload}/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
			],
			environment: "node",
			setupFiles: ["./vitest.node.setup.ts"],
			clearMocks: true,
			coverage: {
				include: [
					"src/common",
					"src/main",
					"src/preload",
					"!**/__generated__",
					"!**/__mocks__",
					"!**/__test*__",
					"!**/*.test.*",
				],
				reportsDirectory: "./coverage/node",
			},
		},
	} satisfies ViteUserConfig),
);

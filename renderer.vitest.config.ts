import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

import { rendererConfig } from "./electron.vite.config";

export default mergeConfig(
	rendererConfig,
	defineConfig({
		test: {
			include: [
				"src/renderer/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
			],
			environment: "jsdom",
			setupFiles: ["./renderer.vitest.setup.ts"],
		},
	}),
);

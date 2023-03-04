import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

import { rendererConfig } from "./electron.vite.config";

export default mergeConfig(
	rendererConfig,
	defineConfig({
		// https://dev.to/mbarzeev/testing-a-solidjs-component-using-vitest-2h35
		test: {
			include: [
				"src/renderer/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
			],
			environment: "jsdom",
			setupFiles: ["./vitest.renderer.setup.ts"],
			deps: {
				inline: [/solid-js/, /@solidjs\/router/, /solid-testing-library/],
			},
		},
		resolve: { conditions: ["development", "browser"] },
	})
);

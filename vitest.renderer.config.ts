import { mergeConfig } from "vite";

import { rendererConfig } from "./electron.vite.config";

import type { UserConfig } from "vite";

// TODO: switch back to vitest defineConfig when upstream types resolved
export default mergeConfig(rendererConfig, {
	// https://dev.to/mbarzeev/testing-a-solidjs-component-using-vitest-2h35
	test: {
		include: ["src/renderer/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
		environment: "jsdom",
		setupFiles: ["./vitest.renderer.setup.ts"],
		clearMocks: true,
		deps: {
			inline: [/solid-js/, /@solidjs\/router/, /solid-testing-library/],
		},
	},
	resolve: { conditions: ["development", "browser"] },
} satisfies UserConfig);

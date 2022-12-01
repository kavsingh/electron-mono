import reactPlugin from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

import { alias } from "./vite.config.common";

export default defineConfig({
	main: {
		resolve: { alias },
		plugins: [externalizeDepsPlugin()],
	},
	preload: {
		resolve: { alias },
		plugins: [externalizeDepsPlugin()],
		test: {
			include: ["src/preload/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
			environment: "node",
			setupFiles: ["./vitest.setup.preload.ts"],
		},
	},
	renderer: {
		resolve: { alias },
		plugins: [reactPlugin()],
		test: {
			include: ["src/renderer/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
			environment: "jsdom",
			setupFiles: ["./vitest.setup.renderer.ts"],
		},
	},
});

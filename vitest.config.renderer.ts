import reactPlugin from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

import { alias } from "./vite.config.common";

export default defineConfig({
	resolve: { alias },
	plugins: [reactPlugin()],
	test: {
		include: ["src/renderer/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
		environment: "jsdom",
		setupFiles: ["./vitest.setup.renderer.ts"],
	},
});

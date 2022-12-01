import { defineConfig } from "vitest/config";

import { alias } from "./vite.config.common";

export default defineConfig({
	resolve: { alias },
	test: {
		include: [
			"src/{main,common,bridge,preload}/**/*.{test,spec}.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
		],
		environment: "node",
		setupFiles: ["./vitest.setup.node.ts"],
	},
});

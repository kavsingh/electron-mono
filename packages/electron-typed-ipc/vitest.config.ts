import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			include: ["src/**"],
			exclude: [
				"**/__generated__/**",
				"**/*.test-d.ts",
				"**/*.test.ts",
				"**/types.ts",
			],
			reporter: "lcov",
		},
	},
});

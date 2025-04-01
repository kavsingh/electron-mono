import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		coverage: {
			include: ["src/**"],
			exclude: [
				"**/__generated__/**",
				"**/*.test-d.ts",
				"**/*.test.ts",
				"**/types.ts",
			],
			provider: "v8",
			reporter: "lcov",
		},
	},
});

import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		setupFiles: ["./vitest.setup.ts"],
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

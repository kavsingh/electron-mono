import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		coverage: {
			include: [
				"src",
				"!**/__generated__",
				"!**/__mocks__",
				"!**/__{test,spec}*__",
				"!**/{test,spec}.*",
				"!**/types.*",
			],
			reporter: "lcov",
		},
	},
});

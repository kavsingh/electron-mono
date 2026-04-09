import { defineConfig } from "oxfmt";

export default defineConfig({
	ignorePatterns: [
		"**/.nx/**",
		"**/dist/**",
		"**/out/**",
		"**/gen/**",
		"**/dist-*/**",
		"**/reports/**",
		"**/target/**",
		"**/*.gen.*",
		"**/__generated__/**",
		"!**/__generated__/mocks/**",
		"**/*.lock",
	],
	printWidth: 80,
	useTabs: true,
	sortImports: {
		order: "asc",
		groups: [
			["builtin"],
			["external"],
			["subpath", "internal"],
			["parent"],
			["sibling", "index"],
			["type"],
		],
	},
	overrides: [
		{ files: ["*.{json,jsonc}"], options: { trailingComma: "none" } },
	],
});

const { testFilePatterns } = require("./lib");

module.exports = {
	env: { es2022: true, node: true, browser: false },
	plugins: ["filenames"],
	extends: ["eslint:recommended", "plugin:prettier/recommended"],
	rules: {
		"curly": ["warn", "multi-line", "consistent"],
		"no-console": "off",
		"no-throw-literal": "error",
		"filenames/match-regex": ["error", "^[a-z-.0-9]+$", true],
		"filenames/match-exported": ["error", "kebab"],
		"prettier/prettier": "warn",
	},
	reportUnusedDisableDirectives: true,
	overrides: [
		{
			files: ["*.ts?(x)"],
			parser: "@typescript-eslint/parser",
			parserOptions: { project: "./tsconfig.json" },
			plugins: ["deprecation"],
			extends: [
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"plugin:@typescript-eslint/strict",
			],
			rules: {
				"camelcase": "off",
				"no-shadow": "off",
				"no-throw-literal": "off",
				"no-unused-vars": "off",
				"@typescript-eslint/consistent-type-imports": ["error"],
				"@typescript-eslint/member-ordering": ["warn"],
				"@typescript-eslint/no-shadow": [
					"error",
					{
						ignoreTypeValueShadow: false,
						ignoreFunctionTypeParameterNameValueShadow: true,
					},
				],
				"@typescript-eslint/no-throw-literal": "error",
				"@typescript-eslint/no-unused-vars": [
					"error",
					{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
				],
				"deprecation/deprecation": "warn",
			},
		},
		{
			files: ["./*"],
			rules: {
				"filenames/match-exported": "off",
			},
		},
		{
			files: ["src/**/*"],
			rules: {
				"no-console": "error",
				"no-restricted-properties": [
					"error",
					{
						object: "window",
						property: "bridge",
						message: "Use default export from ~/renderer/bridge",
					},
				],
			},
		},
		{
			files: ["src/renderer/**/*"],
			env: { node: false, browser: true },
			extends: ["plugin:solid/typescript"],
		},
		{
			files: testFilePatterns(),
			env: { node: true },
			rules: {
				"no-console": "off",
				"filenames/match-exported": ["error", "kebab", "\\.test$"],
			},
		},
		{
			files: testFilePatterns({ extensions: "ts?(x)" }),
			rules: {
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-non-null-assertion": "off",
				"@typescript-eslint/no-unsafe-assignment": "off",
				"@typescript-eslint/no-unsafe-call": "off",
				"@typescript-eslint/no-unsafe-member-access": "off",
				"@typescript-eslint/no-unsafe-return": "off",
				"@typescript-eslint/unbound-method": "off",
			},
		},
		{
			files: testFilePatterns({
				root: "./src/renderer",
				extensions: "[jt]s?(x)",
			}),
			extends: ["plugin:testing-library/dom", "plugin:jest-dom/recommended"],
		},
		{
			files: testFilePatterns({ root: "./e2e" }),
			extends: ["plugin:playwright/playwright-test"],
		},
	],
};

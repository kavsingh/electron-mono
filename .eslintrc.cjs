/** @type {import("./.eslint.helpers.cjs")} */
const { testFileSuffixes, testFilePatterns } = require("./.eslint.helpers.cjs");

/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
	reportUnusedDisableDirectives: true,
	env: { es2022: true, node: true, browser: false },
	parser: "@typescript-eslint/parser",
	parserOptions: { project: "./tsconfig.json" },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/strict-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:import-x/recommended",
		"plugin:import-x/typescript",
		"plugin:prettier/recommended",
	],
	plugins: ["filenames", "deprecation"],
	rules: {
		"curly": ["warn", "multi-line", "consistent"],
		"no-console": "off",
		"camelcase": "off",
		"no-restricted-syntax": [
			"warn",
			{ selector: "TSEnumDeclaration", message: "Avoid using enums" },
		],
		"no-unreachable": "error",

		"@typescript-eslint/consistent-type-definitions": ["warn", "type"],
		"@typescript-eslint/consistent-type-imports": "error",
		"@typescript-eslint/member-ordering": ["warn"],

		"no-shadow": "off",
		"@typescript-eslint/no-shadow": [
			"error",
			{
				ignoreTypeValueShadow: false,
				ignoreFunctionTypeParameterNameValueShadow: true,
			},
		],

		"no-throw-literal": "off",
		"@typescript-eslint/no-throw-literal": "error",

		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
		],

		"import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
		"import-x/no-cycle": "error",
		"import-x/no-self-import": "error",
		"import-x/no-unused-modules": "error",
		"import-x/no-useless-path-segments": "error",
		"import-x/order": [
			"warn",
			{
				"groups": [
					"builtin",
					"external",
					"internal",
					"parent",
					["sibling", "index"],
					"type",
				],
				"pathGroupsExcludedImportTypes": ["type"],
				"alphabetize": { order: "asc" },
				"newlines-between": "always",
			},
		],
		"deprecation/deprecation": "warn",
		"filenames/match-regex": ["error", "^[a-z-.0-9]+$", true],
		"filenames/match-exported": ["error", "kebab"],
		"prettier/prettier": "warn",
	},
	overrides: [
		{
			files: ["./*"],
			rules: {
				"filenames/match-exported": "off",
			},
		},
		{
			files: ["*.?(c)js"],
			extends: ["plugin:@typescript-eslint/disable-type-checked"],
			rules: {
				"deprecation/deprecation": "off",
			},
		},
		{
			files: ["*.c[jt]s"],
			rules: {
				"@typescript-eslint/no-var-requires": "off",
			},
		},
		{
			files: testFilePatterns(),
			env: { node: true },
			rules: {
				"no-console": "off",
				"filenames/match-exported": [
					"error",
					"kebab",
					`\\.(${testFileSuffixes.join("|")})$`,
				],
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-non-null-assertion": "off",
				"@typescript-eslint/no-unsafe-argument": "off",
				"@typescript-eslint/no-unsafe-assignment": "off",
				"@typescript-eslint/no-unsafe-call": "off",
				"@typescript-eslint/no-unsafe-member-access": "off",
				"@typescript-eslint/no-unsafe-return": "off",
				"@typescript-eslint/unbound-method": "off",
			},
		},
	],
};

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
		"plugin:import/recommended",
		"plugin:import/typescript",
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
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{ prefer: "type-imports", fixStyle: "separate-type-imports" },
		],
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

		"import/no-cycle": "error",
		"import/no-self-import": "error",
		"import/no-unused-modules": "error",
		"import/no-useless-path-segments": "error",
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
			files: ["./src/**/*"],
			rules: {
				"no-console": "error",
			},
		},
		{
			files: ["src/renderer/**/*"],
			env: { node: false, browser: true },
			extends: ["plugin:solid/typescript"],
		},
		{
			files: ["./src/renderer/**/*.tsx"],
			settings: {
				tailwindcss: { callees: ["twMerge", "twJoin", "classList"] },
			},
			extends: ["plugin:tailwindcss/recommended"],
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

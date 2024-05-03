/** @type {import("node:path")} */
const path = require("node:path");

/** @type {import("typescript")} */
const ts = require("typescript");

const testFileSuffixes = ["test", "spec", "mock"];

/**
 * @typedef {object} PatternsConfig
 * @property {string} [root]
 * @property {string} [extensions]
 *
 * @param {PatternsConfig} [config]
 */
function testFilePatterns(config) {
	const root = config?.root ?? "";
	const extensions = config?.extensions ?? "*";

	return [
		`*.{${testFileSuffixes.join(",")}}`,
		"__{test,tests,mocks,fixtures}__/**/*",
		"__{test,mock,fixture}-*__/**/*",
	].map((pattern) => path.join(root, `**/${pattern}.${extensions}`));
}

/**
 * @typedef {import("eslint").Linter.RuleLevel} RuleLevel
 * @param {string} tsconfigPath
 * @param {(config: Record<string, unknown>) => Record<string, unknown>} customizer
 *
 * @returns {[RuleLevel, Record<string, unknown>]}
 **/
function importOrderConfig(tsconfigPath, customizer = (config) => config) {
	const { dir, base } = path.parse(
		path.isAbsolute(tsconfigPath)
			? tsconfigPath
			: path.resolve(__dirname, tsconfigPath),
	);

	const tsconfigFile = ts.findConfigFile(dir, ts.sys.fileExists, base);

	const config = tsconfigFile
		? ts.readConfigFile(tsconfigFile, ts.sys.readFile)
		: undefined;

	const aliases = Object.keys(config?.config?.compilerOptions?.paths ?? {});

	return [
		"warn",
		customizer({
			"alphabetize": { order: "asc" },
			"groups": [
				"builtin",
				"external",
				"internal",
				"parent",
				["sibling", "index"],
				"type",
			],
			"pathGroups": aliases.map((pattern) => ({ pattern, group: "internal" })),
			"pathGroupsExcludedImportTypes": ["type"],
			"newlines-between": "always",
		}),
	];
}

module.exports = { testFileSuffixes, testFilePatterns, importOrderConfig };

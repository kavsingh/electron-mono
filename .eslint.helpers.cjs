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
 * @param {string} tsconfigName
 * @param {(config: Record<string, unknown>) => Record<string, unknown>} customizer
 *
 * @returns {[RuleLevel, Record<string, unknown>]}
 **/
function importOrderConfig(
	tsconfigName,
	customizer = (config) => config,
) {
	const tsconfigFile = ts.findConfigFile(
		__dirname,
		ts.sys.fileExists,
		tsconfigName,
	);

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

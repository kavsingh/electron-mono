/** @type {import("node:path")} */
const path = require("node:path");

/** @type {import("typescript")} */
const ts = require("typescript");

/**
 * @param {string} dirname
 * @returns {Record<string, any> | undefined}
 * */
function readTsConfig(dirname) {
	const tsconfigFile = ts.findConfigFile(
		dirname,
		ts.sys.fileExists,
		"tsconfig.json",
	);

	return tsconfigFile
		? ts.readConfigFile(tsconfigFile, ts.sys.readFile).config
		: undefined;
}

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

module.exports = { readTsConfig, testFileSuffixes, testFilePatterns };

module.exports = {
	root: true,
	extends: [
		require.resolve("./config/eslint/base.cjs"),
		require.resolve("./config/eslint/import.cjs"),
	],
};

module.exports = {
	root: true,
	extends: [
		require.resolve("./config/eslint/base"),
		require.resolve("./config/eslint/import"),
	],
};

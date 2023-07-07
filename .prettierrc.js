/** @type {import('prettier').Config} */
module.exports = {
	quoteProps: "consistent",
	useTabs: true,
	// TODO: This is default for prettier 3, remove once prettier updated
	trailingComma: "all",
	plugins: [require("prettier-plugin-tailwindcss")],
};

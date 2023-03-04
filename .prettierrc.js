/** @type {import('prettier').Config} */
module.exports = {
	quoteProps: "consistent",
	trailingComma: "all",
	useTabs: true,
	plugins: [require("prettier-plugin-tailwindcss")],
};

/** @type {import('prettier').Config} */
module.exports = {
	quoteProps: "consistent",
	useTabs: true,
	/* @ts-expect-error untyped libs */
	plugins: [require("prettier-plugin-tailwindcss")],
};

import baseConfig from "../../prettier.config.js";

/** @type {import("prettier").Config} */
export default {
	...baseConfig,
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindFunctions: ["tj", "tm", "tv"],
};

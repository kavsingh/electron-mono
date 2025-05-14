import baseConfig from "../../prettier.config.js";

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
	...baseConfig,
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindStylesheet: "./src/renderer/index.css",
	tailwindFunctions: ["tj", "tm", "tv"],
};

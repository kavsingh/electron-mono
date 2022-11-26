const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

/** @typedef {import("webpack").Configuration} Configuration */

/** @type {NonNullable<Configuration["module"]>["rules"]} */
const rules = [
	{
		test: /\.tsx?$/,
		exclude: /(node_modules|\.webpack)/,
		use: { loader: "swc-loader" },
	},
];

/** @type {Configuration["plugins"]} */
const plugins = [
	new ForkTsCheckerWebpackPlugin({
		typescript: {
			mode: "write-references",
			configOverwrite: { include: ["./src"] },
		},
	}),
];

/** @type {NonNullable<Configuration["resolve"]>["extensions"]} */
const extensions = [".ts", ".js"];

module.exports = { rules, plugins, extensions };

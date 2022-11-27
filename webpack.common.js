const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { DefinePlugin } = require("webpack");

/** @typedef {import("webpack").Configuration} Configuration */

/** @type {NonNullable<Configuration["module"]>["rules"]} */
const rules = [
	{
		test: /\.tsx?$/,
		exclude: /(node_modules|\.webpack)/,
		use: { loader: "swc-loader" },
	},
];

/** @type {(mode: string) => Configuration["plugins"]} */
const plugins = (mode) => [
	new DefinePlugin({
		MODE: JSON.stringify(mode || "production"),
	}),
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

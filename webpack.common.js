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

/** @type {Configuration["plugins"]} */
const plugins = [
	new DefinePlugin({
		IS_DEVELOPMENT: process.env["NODE_ENV"] === "development",
		IS_PRODUCTION: process.env["NODE_ENV"] === "production",
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

const { rules, plugins, extensions } = require("./webpack.common");

/** @type {import("webpack").Configuration} */
const rendererConfig = {
	// using "electron-renderer" causes webpack dev-server error when
	// using context isolation
	target: "web",
	module: { rules },
	resolve: { extensions: [...extensions, ".tsx", ".jsx"] },
	plugins,
};

module.exports = rendererConfig;

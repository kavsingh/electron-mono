const { rules, plugins, extensions } = require("./webpack.common");

module.exports = {
  target: "electron-renderer",
  module: { rules },
  resolve: { extensions: [...extensions, ".tsx", ".jsx"] },
  plugins,
};

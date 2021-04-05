const { rules, extensions, plugins } = require("./webpack.common");

module.exports = {
  target: "electron-main",
  node: { __dirname: false },
  entry: "./src/main/index.ts",
  module: { rules },
  resolve: { extensions: [...extensions, ".json"] },
  plugins,
};

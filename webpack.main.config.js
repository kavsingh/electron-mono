const { rules, extensions } = require("./webpack.common");

module.exports = {
  entry: "./src/main/index.ts",
  module: { rules },
  resolve: { extensions: [...extensions, ".json"] },
};

const { rules, plugins, extensions } = require("./webpack.common");

module.exports = {
  plugins,
  module: { rules },
  resolve: { extensions: [...extensions, ".tsx", ".jsx"] },
};

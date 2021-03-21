const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const rules = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: "node-loader",
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@marshallofsound/webpack-asset-relocator-loader",
      options: { outputAssetBase: "native_modules" },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: { loader: "babel-loader" },
  },
];

const plugins = [
  new ForkTsCheckerWebpackPlugin({
    typescript: { configOverwrite: { include: ["./src"] } },
  }),
];

const extensions = [".ts", ".js"];

module.exports = { rules, plugins, extensions };

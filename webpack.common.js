const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const rules = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules\/.+\.node$/,
    use: "node-loader",
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@vercel/webpack-asset-relocator-loader",
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
    typescript: {
      mode: "write-references",
      configOverwrite: { include: ["./src"] },
    },
  }),
];

const extensions = [".ts", ".js"];

module.exports = { rules, plugins, extensions };

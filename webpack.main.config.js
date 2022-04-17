const { rules, extensions, plugins } = require("./webpack.common");

module.exports = {
  target: "electron-main",
  node: { __dirname: false },
  entry: "./src/main/index.ts",
  module: {
    rules: [
      ...rules,
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
    ],
  },
  resolve: { extensions: [...extensions, ".json"] },
  plugins,
};

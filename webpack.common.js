const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const rules = [
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

const { devDependencies } = require("./package.json");

module.exports = ({ env }) => ({
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        shippedProposals: true,
        corejs: 3,
        modules: env(["test", "cli"]) ? "commonjs" : false,
        targets: `electron ${devDependencies.electron}`,
      },
    ],
    [
      "@babel/preset-react",
      { runtime: "automatic", importSource: "@emotion/react" },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "babel-plugin-module-resolver",
      {
        alias: { "@app": "./src" },
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    ],
    "@babel/plugin-proposal-class-properties",
    "@emotion/babel-plugin",
    ["@babel/plugin-transform-runtime", { regenerator: true }],
  ],
});

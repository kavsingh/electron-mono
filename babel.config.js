// const { devDependencies } = require("./package.json");

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        shippedProposals: true,
        corejs: 3,
        // kiv updates to preset env
        // targets: `electron ${devDependencies.electron}`,
        targets: "electron 18.0.4",
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
        alias: { "~": "./src" },
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    ],
    "@babel/plugin-proposal-class-properties",
    "@emotion/babel-plugin",
    ["@babel/plugin-transform-runtime", { regenerator: true }],
  ],
};

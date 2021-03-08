module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        shippedProposals: true,
        corejs: 3,
        modules: "commonjs",
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
        alias: { "@": "./src" },
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    ],
    "@emotion/babel-plugin",
    ["@babel/plugin-transform-runtime", { regenerator: true }],
  ],
};

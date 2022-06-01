const { restrictFrom } = require("./lib");

const nodeOnlyImports = {
  paths: ["electron", "usb-detection", ...require("module").builtinModules],
  patterns: [],
};

const browserOnlyImports = {
  paths: ["react"],
  patterns: ["react-*", "@emotion*"],
};

module.exports = {
  settings: { "import/resolver": "babel-module" },
  extends: ["plugin:import/recommended", "plugin:import/typescript"],
  rules: {
    // everything outside renderer should not be loading browser packages
    "no-restricted-imports": ["error", browserOnlyImports],
    "import/no-cycle": "error",
    "import/no-self-import": "error",
    "import/no-unused-modules": "error",
    "import/no-useless-path-segments": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        // needed for all cases since electron must be installed as a dev dependency
        // TODO: is there a way around this so we can set this to false in src/?
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    "import/order": [
      "warn",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
          "type",
        ],
        "pathGroups": [{ pattern: "~/**", group: "internal" }],
        "pathGroupsExcludedImportTypes": ["type"],
        "alphabetize": { order: "asc" },
        "newlines-between": "always",
      },
    ],
    // enforce context isolation
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          // [target] cannot import [from]
          { target: "./src/main", from: "./src/renderer" },
          { target: "./src/main", from: "./src/preload.ts" },
          { target: "./src/renderer", from: "./src/main" },
          { target: "./src/renderer", from: "./src/bridge" },
          { target: "./src/renderer", from: "./src/preload.ts" },
          { target: "./src/common", from: "./src/main" },
          { target: "./src/common", from: "./src/bridge" },
          { target: "./src/common", from: "./src/renderer" },
          { target: "./src/common", from: "./src/preload.ts" },
          { target: "./src/bridge", from: "./src/main" },
          { target: "./src/bridge", from: "./src/renderer" },
          { target: "./src/bridge", from: "./src/preload.ts" },
          { target: "./src/preload.ts", from: "./src/main" },
          { target: "./src/preload.ts", from: "./src/renderer" },
        ],
      },
    ],
  },
  overrides: [
    ...restrictFrom("", browserOnlyImports),

    ...restrictFrom("src/common", {
      paths: [...nodeOnlyImports.paths, ...browserOnlyImports.paths],
      patterns: [...nodeOnlyImports.patterns, ...browserOnlyImports.patterns],
    }),

    ...restrictFrom("src/bridge", {
      paths: [...nodeOnlyImports.paths, ...browserOnlyImports.paths].filter(
        (path) => !/^electron/.test(path)
      ),
      patterns: [...nodeOnlyImports.patterns, ...browserOnlyImports.patterns],
    }),

    ...restrictFrom("src/main", browserOnlyImports),

    ...restrictFrom("src/renderer", nodeOnlyImports),

    ...restrictFrom("src/preload.ts", {
      paths: [...nodeOnlyImports.paths, ...browserOnlyImports.paths].filter(
        (path) => !/^electron/.test(path)
      ),
      patterns: [...nodeOnlyImports.patterns, ...browserOnlyImports.patterns],
    }),
  ],
};

const { testFilePatterns } = require("./lib");

const allowTypes = (restrictedImportsOptions) => {
  const nextOptions = { ...restrictedImportsOptions };

  if (Array.isArray(nextOptions.paths)) {
    nextOptions.paths = nextOptions.paths.map((pathRule) =>
      typeof pathRule === "string"
        ? { name: pathRule, allowTypeImports: true }
        : { ...pathRule, allowTypeImports: true }
    );
  }

  if (Array.isArray(nextOptions.patterns)) {
    nextOptions.patterns = nextOptions.patterns.every(
      (item) => typeof item === "string"
    )
      ? [{ groups: nextOptions.patterns, allowTypeImports: true }]
      : nextOptions.patterns.map((pattern) =>
          typeof pattern === "string"
            ? { groups: [pattern], allowTypeImports: true }
            : { ...pattern, allowTypeImports: true }
        );
  }

  return nextOptions;
};

const nodeOnlyImports = {
  paths: ["electron", "node-hid", ...require("module").builtinModules],
  patterns: [],
};

const browserOnlyImports = {
  paths: ["react"],
  patterns: ["react-*", "@emotion*"],
};

// files in common should import from neither node nor browser specific libs
// to be usable by both main and renderer
const commonRestrictedImports = {
  paths: [...nodeOnlyImports.paths, ...browserOnlyImports.paths],
  patterns: [...nodeOnlyImports.patterns, ...browserOnlyImports.patterns],
};

const prodDependencies = {
  // TODO: figure out how to allow electron. providing ["electron"] does not
  // work
  devDependencies: true,
  optionalDependencies: false,
  peerDependencies: false,
};

const devDependencies = {
  devDependencies: true,
  optionalDependencies: false,
  peerDependencies: false,
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
    "import/no-extraneous-dependencies": ["error", devDependencies],
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
    {
      files: ["*.js"],
      rules: {
        "no-restricted-imports": ["error", browserOnlyImports],
      },
    },
    {
      files: ["*.ts?(x)"],
      rules: {
        "no-restricted-imports": "off",
        "@typescript-eslint/no-restricted-imports": [
          "error",
          allowTypes(browserOnlyImports),
        ],
      },
    },
    {
      files: ["src/**/*"],
      rules: {
        "import/no-extraneous-dependencies": ["error", prodDependencies],
      },
    },
    {
      files: ["src/common/**/*"],
      rules: {
        "no-restricted-imports": ["error", commonRestrictedImports],
      },
    },
    {
      files: ["src/common/**/*.ts?(x)"],
      rules: {
        "no-restricted-imports": "off",
        "@typescript-eslint/no-restricted-imports": [
          "error",
          allowTypes(commonRestrictedImports),
        ],
      },
    },
    {
      files: ["src/renderer/**/*"],
      rules: {
        // disallow node packages in renderer, rely on contextBridge instead
        "no-restricted-imports": ["error", nodeOnlyImports],
      },
    },
    {
      files: ["src/renderer/**/*.ts?(x)"],
      rules: {
        "no-restricted-imports": "off",
        "@typescript-eslint/no-restricted-imports": [
          "error",
          allowTypes(nodeOnlyImports),
        ],
      },
    },
    {
      files: testFilePatterns(),
      env: { node: true },
      rules: {
        "import/no-extraneous-dependencies": ["error", devDependencies],
      },
    },
  ],
};

const nodeOnlyImports = {
  paths: ["electron", "node-hid", ...require("module").builtinModules],
  patterns: [],
};

const browserOnlyImports = {
  paths: ["react"],
  patterns: ["react-*", "@emotion*"],
};

const srcDependencies = {
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

const testFilePatterns = (extensions = "*") =>
  ["**/*.test", "**/*.mock", "**/__test__/**/*", "**/__mocks__/**/*"].map(
    (pattern) => `${pattern}.${extensions}`
  );

module.exports = {
  root: true,
  env: { es6: true, node: true, browser: false },
  settings: { "import/resolver": "babel-module" },
  plugins: ["filenames"],
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  rules: {
    "curly": ["warn", "multi-line", "consistent"],
    "no-console": "off",
    "no-throw-literal": "error",
    // everything outside renderer is assumed to be running in node
    "no-restricted-imports": ["error", browserOnlyImports],
    "filenames/match-regex": ["error", "^[a-z-.0-9]+$", true],
    "filenames/match-exported": ["error", "kebab"],
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
        "newlines-between": "always",
      },
    ],
    // enforce context isolation
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
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
    "prettier/prettier": "warn",
  },
  overrides: [
    {
      files: ["*.js"],
      parser: "@babel/eslint-parser",
    },
    {
      files: ["*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      parserOptions: { project: "./tsconfig.json" },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "camelcase": "off",
        "no-shadow": "off",
        "no-throw-literal": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/consistent-type-imports": ["error"],
        "@typescript-eslint/member-ordering": ["warn"],
        "@typescript-eslint/no-shadow": [
          "error",
          {
            ignoreTypeValueShadow: false,
            ignoreFunctionTypeParameterNameValueShadow: true,
          },
        ],
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
      },
    },
    {
      files: ["./*"],
      rules: {
        "filenames/match-exported": "off",
      },
    },
    {
      files: ["src/**/*"],
      rules: {
        "no-console": "error",
        "import/no-extraneous-dependencies": ["error", srcDependencies],
      },
    },
    {
      files: ["src/common/**/*"],
      rules: {
        // all files in common must be usable by both main and renderer
        "no-restricted-imports": [
          "error",
          {
            paths: [...nodeOnlyImports.paths, ...browserOnlyImports.paths],
            patterns: [
              ...nodeOnlyImports.patterns,
              ...browserOnlyImports.patterns,
            ],
          },
        ],
      },
    },
    {
      files: ["src/renderer/**/*"],
      env: { node: false, browser: true },
      settings: { react: { version: "detect" } },
      plugins: ["@emotion"],
      extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
      rules: {
        // disallow node packages in renderer, rely on contextBridge instead
        "no-restricted-imports": ["error", nodeOnlyImports],
        "import/no-extraneous-dependencies": ["error", srcDependencies],
        "react/jsx-filename-extension": [
          "error",
          { extensions: [".tsx", ".jsx"] },
        ],
        "react/jsx-uses-react": "off",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "@emotion/no-vanilla": "error",
        "@emotion/syntax-preference": ["error", "string"],
      },
    },
    {
      files: testFilePatterns(),
      env: { "node": true, "jest/globals": true },
      extends: [
        "plugin:jest/recommended",
        "plugin:jest/style",
        "plugin:jest-dom/recommended",
      ],
      rules: {
        "no-console": "off",
        "filenames/match-exported": ["error", "kebab", "\\.test$"],
        "import/no-extraneous-dependencies": ["error", devDependencies],
      },
    },
    {
      files: testFilePatterns("[jt]s?(x)"),
      extends: ["plugin:testing-library/react"],
    },
    {
      files: testFilePatterns("ts?(x)"),
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/unbound-method": "off",
      },
    },
  ],
};

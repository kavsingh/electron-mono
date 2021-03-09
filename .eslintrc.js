const nodeOnlyImports = {
  patterns: ["electron", "node-hid", ...require("module").builtinModules],
};

const webOnlyImports = {
  patterns: ["react", "react-*", "@emotion*"],
};

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: { es6: true, node: true, browser: false },
  settings: {
    "react": { version: "detect" },
    "import/resolver": "babel-module",
    "import/internal-regex": "^@app/",
  },
  plugins: ["filenames"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "camelcase": "off",
    "curly": ["warn", "multi-line", "consistent"],
    "no-console": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/consistent-type-imports": ["error"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "filenames/match-regex": ["error", "^[a-z-.]+$", true],
    "filenames/match-exported": ["error", "kebab"],
    // everything outside renderer is assumed to be running in node
    "no-restricted-imports": ["error", webOnlyImports],
    "import/no-cycle": "error",
    "import/no-self-import": "error",
    "import/no-unused-modules": "error",
    "import/no-useless-path-segments": "error",
    "import/order": [
      "warn",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
        ],
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
      files: ["*.config.*", "webpack.*", ".eslintrc*"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "filenames/match-exported": "off",
      },
    },
    {
      files: ["src/common/**/*"],
      rules: {
        // all files in common must be usable by both main and renderer
        "no-restricted-imports": [
          "error",
          {
            patterns: [...nodeOnlyImports.patterns, ...webOnlyImports.patterns],
          },
        ],
      },
    },
    {
      files: ["src/renderer/**/*"],
      plugins: ["@emotion"],
      extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
      env: { node: false, browser: true },
      rules: {
        // disallow node packages in renderer, rely on contextBridge instead
        "no-restricted-imports": ["error", nodeOnlyImports],
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
      files: ["**/*.test.*"],
      env: { "node": true, "jest/globals": true },
      plugins: ["jest"],
      extends: ["plugin:jest/recommended", "plugin:jest/style"],
      rules: {
        "no-console": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
      },
    },
  ],
};

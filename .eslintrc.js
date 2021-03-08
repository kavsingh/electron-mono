module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: { es6: true, node: true, browser: false },
  settings: {
    react: { version: "detect" },
    "import/resolver": "babel-module",
  },
  plugins: ["filenames", "@emotion"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    camelcase: "off",
    curly: ["warn", "multi-line", "consistent"],
    "no-console": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "filenames/match-regex": ["error", "^[a-z-.]+$", true],
    "filenames/match-exported": ["error", "kebab"],
    "import/no-cycle": "error",
    "import/no-self-import": "error",
    "import/no-unused-modules": "error",
    "import/no-useless-path-segments": "error",
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
        ],
        pathGroups: [{ pattern: "@/**", group: "internal" }],
        "newlines-between": "always",
      },
    ],
    "react/jsx-filename-extension": ["error", { extensions: [".tsx", ".jsx"] }],
    "react/jsx-uses-react": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@emotion/syntax-preference": ["error", "string"],
    "prettier/prettier": "warn",
  },
  overrides: [
    {
      files: ["*.config.*", "webpack.*"],
      rules: {
        "filenames/match-exported": "off",
      },
    },
    {
      files: ["src/**/*"],
      rules: {
        "@typescript-eslint/no-var-requires": "error",
      },
    },
    {
      files: ["src/renderer.ts", "src/renderer/**/*"],
      env: { node: false, browser: true },
    },
  ],
};

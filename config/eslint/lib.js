const path = require("path");

const testFilePatterns = ({ root = "", extensions = "*" } = {}) =>
  [
    "*.{test,mock}",
    "{test,mock}-helpers*",
    "__{mock,mocks,test,tests,fixtures}__/**/*",
  ].map((pattern) => path.join(root, `**/${pattern}.${extensions}`));

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

const restrictFrom = (rootPath, config) => {
  const isTsFile = /\.ts[x]?$/.test(rootPath);
  const isJsFile = /\.js[x]?$/.test(rootPath);
  const isFile = isJsFile || isTsFile;

  return [
    isJsFile || !isFile
      ? {
          files: isFile ? [rootPath] : [path.join(rootPath, "**/*.js?(x)")],
          rules: { "no-restricted-imports": ["error", config] },
        }
      : undefined,
    isTsFile || !isFile
      ? {
          files: isFile ? [rootPath] : [path.join(rootPath, "**/*.ts?(x)")],
          rules: {
            "no-restricted-imports": "off",
            "@typescript-eslint/no-restricted-imports": [
              "error",
              allowTypes(config),
            ],
          },
        }
      : undefined,
  ].filter(Boolean);
};

module.exports = { testFilePatterns, restrictFrom };

const testFilePatterns = ({ root = "", extensions = "*" } = {}) =>
  [
    "*.{test,mock}",
    "{test,mock}-helpers*",
    "__{mock,mocks,test,tests,fixtures}__/**/*",
  ].map((pattern) => `${root ? `${root}/` : ""}**/${pattern}.${extensions}`);

module.exports = { testFilePatterns };

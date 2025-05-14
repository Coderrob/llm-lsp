const babelConfig = require("./babel.config");

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  testLocationInResults: false,
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  transform: { "^.+.tsx?$": ["ts-jest", { babelConfig: "babel.config.js" }] },
};

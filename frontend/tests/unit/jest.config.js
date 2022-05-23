const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions }         = require("../../tsconfig");
//-----------------------------------------------------------------------------
module.exports = {
    rootDir        : "../../",
    displayName    : "unit tests",
    testEnvironment: "node",
    preset         : "ts-jest",
    // The preset above is actually a shortcut for this:
    //moduleFileExtensions: ["js", "ts", "json"],
    //transform           : {
    //    "^.+\\.ts?$": "ts-jest"
    //},
    testMatch: [
        "**/tests/unit/**/*.ts"
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>"
    }),
    // helper (above) is used to automate this
    //moduleNameMapper: {
    //    "^@/(.*)$"   : "<rootDir>/src/ts/$1",
    //    "^@svc/(.*)$": "<rootDir>/src/ts/services/$1"
    //},
    globals: {
        __RUN_FROM_TEST__: true,
        __VERSION__      : "42",
        __BASE_URL__     : "http://localhost/"
    }
};

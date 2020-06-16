const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions }         = require("../../tsconfig");
//-----------------------------------------------------------------------------
module.exports = {
    rootDir             : "../../",
    name                : "vue",
    displayName         : "vue component tests",
    moduleFileExtensions: ["js", "ts", "json", "vue"],
    transform           : {
        "^.+\\.vue$": "vue-jest",
        "^.+\\.ts?$": "ts-jest"
    },
    testMatch: [
        "**/tests/vue/**/*.ts"
    ],
    modulePathIgnorePatterns: [
        "store/vuex-test-utils.ts"
    ],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>" }),
        "\\.(css|less)$": "<rootDir>/tests/vue/__mocks__/styleMock.js"
    },
    // helper (above) is used to automate this
    //moduleNameMapper: {
    //    "^@/(.*)$"   : "<rootDir>/src/ts/$1",
    //    "^@svc/(.*)$": "<rootDir>/src/ts/services/$1"
    //},
    globals: {
        __RUN_FROM_TEST__: true,
        __DEBUG__        : false,
        __VERSION__      : "42",
        __BASE_URL__     : "http://localhost/"
    }
};

const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions }         = require("../../tsconfig");
//-----------------------------------------------------------------------------
module.exports = {
    rootDir             : "../../",
    name                : "vue",
    displayName         : "vue component tests",
    testEnvironment     : "jsdom",
    moduleFileExtensions: ["js", "ts", "json", "vue"],
    transform           : {
        "^.+\\.vue$": "@vue/vue3-jest",
        "^.+\\.ts?$": "ts-jest"
    },
    testMatch: [
        "**/tests/vue/**/*.ts"
    ],
    modulePathIgnorePatterns: [
        "coreui-test-helper.ts"
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
        __VERSION__      : "42",
        __BASE_URL__     : "http://localhost/"
    }
};

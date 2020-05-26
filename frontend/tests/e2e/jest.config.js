module.exports = {
    name                : "e2e",
    displayName         : "e2e tests",
    preset              : "jest-puppeteer",
    moduleFileExtensions: ["js", "ts", "json"],
    transform           : {
        "^.+\\.ts?$": "ts-jest"
    },
    testMatch: [
        "**/*.ts"
    ],
    modulePathIgnorePatterns: [
        "helper.ts"
    ],
    testTimeout: 3145
};

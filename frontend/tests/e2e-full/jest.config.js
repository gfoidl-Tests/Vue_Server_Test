const testTimeout = process.env.SERVER_TEST
    ? 10000
    : 3145;

const config = {
    displayName         : "e2e-full tests",
    preset              : "jest-puppeteer",
    moduleFileExtensions: ["js", "ts", "json"],
    transform           : {
        "^.+\\.ts?$": "ts-jest"
    },
    testMatch: [
        "**/*.ts"
    ],
    modulePathIgnorePatterns: [
        "test-helper.ts"
    ],
    testTimeout
};

module.exports = config;

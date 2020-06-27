const testTimeout = process.env.SERVER_TEST
    ? 10000
    : 3145;

const config = {
    name                : "e2e-full",
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
        "helper.ts"
    ],
    testTimeout
};

module.exports = config;

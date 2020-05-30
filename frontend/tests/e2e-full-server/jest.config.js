module.exports = {
    name                : "e2e-full-server",
    displayName         : "e2e-full-server tests",
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

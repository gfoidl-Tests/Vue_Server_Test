module.exports = {
    name                : "e2e-full-iis",
    displayName         : "e2e-full-iis tests",
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

module.exports = {
    projects: [
        // wildcards are supported like
        // "<rootDir>/tests/*"
        // but I want to exclude e2e here
        "<rootDir>/tests/unit",
        "<rootDir>/tests/vue"
    ],
    moduleFileExtensions: ["ts", "js", "json", "node"],
    coverageReporters   : ["text", "cobertura", "html"]     // https://github.com/istanbuljs/istanbuljs/tree/master/packages/istanbul-reports/lib
};

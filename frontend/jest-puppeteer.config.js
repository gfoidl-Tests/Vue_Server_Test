module.exports = {
    // https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
    launch: {
        devtools: false,
        headless: process.env.HEADLESS !== "false",
        slowMo  : process.env.SLOWMO,
        dumpio  : process.env.DUMPIO
    },
    // User Incognito to avoid sharing the browser context between tests
    // https://github.com/smooth-code/jest-puppeteer/blob/master/packages/jest-environment-puppeteer/README.md#jest-puppeteerconfigjs
    browserContext: "incognito",
    server        : {
        command : "yarn serve dist --no-clipboard --listen 8080",
        port    : 8080,
        protocol: "http"
    }
};

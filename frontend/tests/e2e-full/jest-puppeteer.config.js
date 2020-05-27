const path = require("path");
//-----------------------------------------------------------------------------
if (!process.env.WEB_APP_DIR) {
    console.error("\n\n### environment variable WEB_APP_DIR must be set ###\n\n");
    process.exit(1);
}

const webAppDir     = process.env.WEB_APP_DIR;
const webApp        = path.resolve(webAppDir, "Server.dll");
const serverCommand = `dotnet ${webApp}`;

const config = {
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
        command : serverCommand,
        port    : 5000,
        protocol: "http",
        debug   : true
    }
};

console.info("\nconfig.server", config.server);

module.exports = config;

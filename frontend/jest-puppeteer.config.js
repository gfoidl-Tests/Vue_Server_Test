// `serve` (yarn start-server) is just for static serving, so SignalR won't work.
// With the environment-variable LOCAL_DEV one can opt-into serving via Kestrel, so
// SignalR works.
const serverCommand = process.env.LOCAL_DEV
    ? "yarn dotnet-serve"
    : "yarn start-server";

const config = {
    // https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
    launch: {
        devtools       : false,
        headless       : process.env.HEADLESS !== "false",
        slowMo         : process.env.SLOWMO,
        dumpio         : process.env.DUMPIO,
        defaultViewport: {
            width : 800,
            height: 600
        }
    },
    // User Incognito to avoid sharing the browser context between tests
    // https://github.com/smooth-code/jest-puppeteer/blob/master/packages/jest-environment-puppeteer/README.md#jest-puppeteerconfigjs
    browserContext: "incognito",
    server        : {
        command : serverCommand,
        port    : 8080,
        protocol: "http",
        debug   : false
    }
};

module.exports = config;

module.exports = {
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
        //command : "yarn start-server",    // SignalR won't work here, as it's just static serving
        command : "yarn dotnet-serve",
        port    : 8080,
        protocol: "http",
        debug   : false
    }
};

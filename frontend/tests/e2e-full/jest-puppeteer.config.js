const path       = require("path");
const baseConfig = require("../../jest-puppeteer.config");
//-----------------------------------------------------------------------------
if (!process.env.WEB_APP_DIR) {
    console.error("\n\n### environment variable WEB_APP_DIR must be set ###\n\n");
    process.exit(1);
}

const webAppDir     = process.env.WEB_APP_DIR;
const webApp        = path.resolve(webAppDir, "Server.dll");
const serverCommand = `dotnet ${webApp}`;

const config = {
    ...baseConfig,
    server: {
        command : serverCommand,
        port    : 5000,
        protocol: "http",
        debug   : true
    }
};

console.log("\njest-puppeteer.config", config);

module.exports = config;

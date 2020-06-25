const baseConfig = require("../../jest-puppeteer.config");
//-----------------------------------------------------------------------------
const config = {
    ...baseConfig,
    launch: {
        ...baseConfig.launch,
        ignoreHTTPSErrors: true
    }
};
delete config.server;

//console.log("\njest-puppeteer.config", config);

module.exports = config;

export const conditionalTest = process.env.SERVER_TEST
    ? test
    : test.skip;
//-----------------------------------------------------------------------------
export const baseUrl = process.env.SERVER_TEST
    ? process.env.HTTPS_BASE_URL || "https://localhost:5001"
    : "http://localhost:5000";
//-----------------------------------------------------------------------------
export const screenshotDir = process.env.SERVER_TEST
    ? "screenshots-e2e-full-server"
    : "screenshots-e2e-full";

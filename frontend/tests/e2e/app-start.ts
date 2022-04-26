import PuppeteerHelper from "../puppeteer-helper";
//-----------------------------------------------------------------------------
describe("App start", () => {
    const baseUrl = "http://localhost:8080";
    //-------------------------------------------------------------------------
    beforeAll(async () => {
        await page.goto(baseUrl);
    });
    //-------------------------------------------------------------------------
    test("page title is 'Vue Server Test'", async () => {
        await expect(page.title()).resolves.toMatch("Vue Server Test");
    });
    //-------------------------------------------------------------------------
    test("screenshot -> matches snapshot", async () => {
        const name       = "app-start";
        const outputDir  = "screenshots-e2e";
        const screenshot = await PuppeteerHelper.takeScreenshot(`${name}.png`, outputDir);
        PuppeteerHelper.compareScreenshotToSnapshot(screenshot, name, outputDir);
    });
    //-------------------------------------------------------------------------
    test("check if Vue started by checking #sendButton", async () => {
        await expect(page).toMatchElement("#sendButton");
    });
});

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
    test("takes screenshot so it can be stored as artifact", async () => {
        await PuppeteerHelper.takeScreenshot("normal.png", "screenshots-e2e");
    });
    //-------------------------------------------------------------------------
    test("check if Vue started by checking #sendButton", async () => {
        await expect(page).toMatchElement("#sendButton");
    });
});

import PuppeteerHelper from "../puppeteer-helper";
//-----------------------------------------------------------------------------
describe("App", () => {
    const baseUrl = "http://localhost:5000";
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
        const outputDir  = "screenshots-e2e-full";
        const screenshot = await PuppeteerHelper.takeScreenshot(`${name}.png`, outputDir);
        PuppeteerHelper.compareScreenshotToSnapshot(screenshot, name, outputDir);
    });
    //-------------------------------------------------------------------------
    test("check if Vue started by checking #sendButton", async () => {
        await expect(page).toMatchElement("#sendButton");
    });
    //-------------------------------------------------------------------------
    test.skip("http to https redirection", async () => {
        await page.goto("http://localhost:5000");

        expect(page.url()).toBe("https://locahost:5001");
    });
    //-------------------------------------------------------------------------
    test("request to backend -> ok", async () => {
        // jest-puppeteer
        await expect(page).toFill("#nameInput", "himen");
        await expect(page).toClick("#sendButton");

        const expectedRequestUrl = `${baseUrl}/api/greeting/hello?name=himen`;
        await page.waitForResponse(response => response.url() === expectedRequestUrl);

        const messageSpan = await expect(page).toMatchElement("#messageSpan", { visible: true });
        const message     = await page.evaluate(el => el.innerHTML, messageSpan);

        expect(message).toMatch(/himen/);
    });
    //-------------------------------------------------------------------------
    test("unhandled error -> sent to server", async () => {
        await expect(page).toClick("#errorButton");

        const expectedErrorUrl = `${baseUrl}/api/error/client`;
        await page.waitForResponse(response => response.url() === expectedErrorUrl && /post/i.test(response.request().method()));
    });
});

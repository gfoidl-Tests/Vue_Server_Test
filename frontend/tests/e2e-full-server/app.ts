import PuppeteerHelper from "../puppeteer-helper";
//-----------------------------------------------------------------------------
beforeAll(() => {
    require("leaked-handles");
});
//-----------------------------------------------------------------------------
describe("App", () => {
    const baseUrl = process.env.HTTPS_BASE_URL || "https://localhost:5001";
    //-------------------------------------------------------------------------
    beforeAll(async () => {
        await page.goto(baseUrl);
    });
    //-------------------------------------------------------------------------
    test("http to https redirection", async () => {
        const url = process.env.HTTP_BASE_URL || "http://localhost:5000";

        await page.goto(url);

        expect(page.url()).toBe(`${baseUrl}/`);
    });
    //-------------------------------------------------------------------------
    test("takes screenshot so it can be stored as artifact", async () => {
        await PuppeteerHelper.takeScreenshot("normal.png", "screenshots-e2e-full-server");
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

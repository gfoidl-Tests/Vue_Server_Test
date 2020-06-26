import { conditionalTest, baseUrl, screenshotDir } from "./test-helper";
import PuppeteerHelper                             from "../puppeteer-helper";
//-----------------------------------------------------------------------------
describe("App", () => {
    beforeEach(async () => {
        await page.goto(baseUrl);
    });
    //-------------------------------------------------------------------------
    conditionalTest("http to https redirection", async () => {
        const url = process.env.HTTP_BASE_URL || "http://localhost:5000";

        await page.goto(url);

        expect(page.url()).toBe(`${baseUrl}/`);
    });
    //-------------------------------------------------------------------------
    test("page title is 'Vue Server Test'", async () => {
        await expect(page.title()).resolves.toMatch("Vue Server Test");
    });
    //-------------------------------------------------------------------------
    test("check if Vue started by checking #sendButton", async () => {
        await expect(page).toMatchElement("#sendButton");
    });
    //-------------------------------------------------------------------------
    test("screenshot -> matches snapshot", async () => {
        const name       = "app-start";
        const screenshot = await PuppeteerHelper.takeScreenshot(`${name}.png`, screenshotDir);
        PuppeteerHelper.compareScreenshotToSnapshot(screenshot, name, screenshotDir);
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

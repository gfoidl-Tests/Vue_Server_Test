import { Overrides }   from "puppeteer";
import PuppeteerHelper from "../puppeteer-helper";
//-----------------------------------------------------------------------------
describe("SignalR", () => {
    const baseUrl = "http://localhost:8080";
    //-------------------------------------------------------------------------
    beforeAll(async () => {
        await page.goto(baseUrl);
    });
    //-------------------------------------------------------------------------
    test("hello-notify on server --> history updated", async () => {
        const newPage = await browser.newPage();

        // POST can't be sent in a direct way, so do a GET, but override it to
        // actually be a POST
        await newPage.setRequestInterception(true);
        newPage.on("request", request => {
            const overrides = {
                method: "POST"
            } as Overrides;

            request.continue(overrides);
        });

        await newPage.goto(baseUrl + "/api/greeting/hello-notify?name=batman");
        await newPage.close();

        const historyItems = await expect(page).toMatchElement("[data-test='history']");

        const name      = "hello-notify";
        const outputDir = "screenshots-e2e";
        await PuppeteerHelper.takeScreenshot(`${name}.png`, outputDir);
    });
});

import { baseUrl, screenshotDir }   from "./test-helper";
import { ContinueRequestOverrides } from "puppeteer";
import PuppeteerHelper              from "../puppeteer-helper";
//-----------------------------------------------------------------------------
describe("SignalR", () => {
    beforeEach(async () => {
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
            } as ContinueRequestOverrides;

            request.continue(overrides);
        });

        await newPage.goto(baseUrl + "/api/greeting/hello-notify?name=batman");
        await newPage.close();

        await expect(page).toMatchElement("[data-test='history']");

        const res = await page.evaluate(() => {
            const item = document.querySelectorAll("[data-test='history']").item(0) as HTMLElement;
            return item.innerText.trim();
        });

        expect(res).toBe("Hello 'batman' from SignalR");

        const name = "hello-notify";
        await PuppeteerHelper.takeScreenshot(`${name}.png`, screenshotDir);
    });
    //-------------------------------------------------------------------------
    test("redo history with SignalR --> history updated", async () => {
        await expect(page).toFill("#nameInput", "himen");
        await expect(page).toClick("#sendButton");
        await expect(page).toMatchElement("#messageSpan", { visible: true });

        await expect(page).toClick("#redoSignalRButton_0");
        await expect(page).toMatchElement("#redoSignalRButton_1", { visible: true });

        const res = await page.evaluate(() => {
            const item = document.querySelectorAll("[data-test='history']").item(1) as HTMLElement;
            return item.innerText.trim();
        });

        expect(res).toBe("Hello 'himen' (SignalR)");

        const name = "redo-history";
        await PuppeteerHelper.takeScreenshot(`${name}.png`, screenshotDir);
    });
});

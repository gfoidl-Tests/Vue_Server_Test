import Helper from "./helper";
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
    test("takes screenshot so it can be stored as artifact", async () => {
        await Helper.takeScreenshot("normal.png");
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
});

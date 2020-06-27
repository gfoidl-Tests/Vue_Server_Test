import HelloResponse from "@store/user/hello-response";
//-----------------------------------------------------------------------------
describe("Requests", () => {
    const baseUrl = "http://localhost:8080";
    //-------------------------------------------------------------------------
    beforeEach(async () => {
        await page.goto(baseUrl);
    });
    //-------------------------------------------------------------------------
    afterEach(async () => {
        await page.setRequestInterception(false);   // reset
    });
    //-------------------------------------------------------------------------
    test("request to backend -> ok", async () => {
        await page.setRequestInterception(true);

        const expectedRequestUrl      = `${baseUrl}/api/greeting/hello?name=himen`;
        let requestUrl: string | null = null;

        const responseData: HelloResponse = {
            message     : "Hello himen",
            connectionId: "conn id 123",
            threadId    : 42
        };

        page.on("request", function callback(request) {
            requestUrl = request.url();

            if (requestUrl === expectedRequestUrl) {
                request.respond({
                    status     : 200,
                    contentType: "application/json",
                    body       : JSON.stringify(responseData)
                });
            } else {
                request.continue();
            }

            // Important: remove listener
            // Here not because of a memory leak, but because of letting a different handler
            // be registered without getting an error.
            page.removeListener("request", callback);
        });

        // jest-puppeteer
        await expect(page).toFill("#nameInput", "himen");
        await expect(page).toClick("#sendButton");

        await page.waitForResponse(response => response.url() === expectedRequestUrl);

        expect(requestUrl).toBe(expectedRequestUrl);

        const messageSpan = await expect(page).toMatchElement("#messageSpan", { visible: true });
        const message     = await page.evaluate(el => el.innerHTML, messageSpan);

        expect(message).toBe(responseData.message);
    });
});

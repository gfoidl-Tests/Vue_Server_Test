// In the frontend only on production builds this is enabled, so remember while
// testing!
//-----------------------------------------------------------------------------
describe("Unhandled errors", () => {
    const baseUrl          = "http://localhost:8080";
    const expectedErrorUrl = `${baseUrl}/api/error/client`;
    //-------------------------------------------------------------------------
    beforeAll(async () => {
        // Uncomment for better debugging
        page.on("console", msg => {
            const text = msg.text();
            console.log("[PAGE LOG] ", text);
        });

        await page.goto(baseUrl);
        await page.setRequestInterception(true);
    });
    //-------------------------------------------------------------------------
    test("unhandled error via test-button -> sent to server", async () => {
        let requestMethod: string | null = null;
        let postData = { handler: "" };

        page.on("request", function callback(request) {
            if (request.url() === expectedErrorUrl) {
                requestMethod = request.method();

                const data = request.postData();
                if (data) {
                    postData = JSON.parse(data);
                }

                request.respond({ status: 200 });
            } else {
                request.continue();
            }

            page.removeListener("request", callback);
        });

        await expect(page).toClick("#errorButton");
        await page.waitForResponse(response => response.url() === expectedErrorUrl);

        expect(requestMethod).toMatch(/post/i);
        expect(postData.handler).toBe("vue");
    });
});

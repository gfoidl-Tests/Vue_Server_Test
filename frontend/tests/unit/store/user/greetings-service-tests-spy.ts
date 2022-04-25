import GreetingService from "@store/user/greeting-service";
import HelloResponse   from "@store/user/hello-response";
import { HttpClient }  from "@svc/httpclient";
//-----------------------------------------------------------------------------
describe("GreetingService with spy", () => {
    describe("hello", () => {
        test("name given -> response ok", async () => {
            const name = "himen";
            const helloResponse: HelloResponse = {
                message     : "Hi himen",
                connectionId: "conn 123",
                threadId    : 42
            };

            const spy = jest.spyOn(HttpClient.Default, "get")
                .mockResolvedValue(helloResponse);

            const sut    = new GreetingService(HttpClient.Default);
            const actual = await sut.hello(name);

            expect.assertions(2);
            expect(spy)   .toHaveBeenCalledWith(`greeting/hello?name=${name}`);
            expect(actual).toBe(helloResponse.message);
        });
        //---------------------------------------------------------------------
        test("other name given -> mocked response from previous test isn't used", async () => {
            const name = "batman";
            const helloResponse: HelloResponse = {
                message     : "Hi batman",
                connectionId: "conn 123",
                threadId    : 42
            };

            jest.spyOn(HttpClient.Default, "get")
                .mockResolvedValue(helloResponse);

            const sut    = new GreetingService(HttpClient.Default);
            const actual = await sut.hello(name);

            expect.assertions(1);
            expect(actual).not.toMatch(/himen/);
        });
    });
});

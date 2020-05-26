import GreetingService from "@view/main/greeting-service";
import HelloResponse   from "@view/main/hello-response";
import { HttpClient }  from "@svc/httpclient";
//-----------------------------------------------------------------------------
jest.mock("@svc/httpclient");
const MockedHttpClient = (HttpClient as unknown) as jest.Mock<HttpClient>;
const mockedHttpClient = new MockedHttpClient() as jest.Mocked<HttpClient>;
const sut              = new GreetingService(mockedHttpClient);
//-----------------------------------------------------------------------------
afterEach(() => {
    jest.resetAllMocks();
});
//-----------------------------------------------------------------------------
describe("GreetingService with mock", () => {
    describe("hello", () => {
        test("name given -> response ok", async () => {
            const name = "himen";
            const helloResponse: HelloResponse = {
                message     : "Hi himen",
                connectionId: "conn 123",
                threadId    : 42
            };

            mockedHttpClient.get.mockResolvedValue(helloResponse);

            const actual = await sut.hello(name);

            expect.assertions(2);
            expect(mockedHttpClient.get).toBeCalledWith(`greeting/hello?name=${name}`);
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

            mockedHttpClient.get.mockResolvedValue(helloResponse);
            const actual = await sut.hello(name);

            expect.assertions(1);
            expect(actual).not.toMatch(/himen/);
        });
    });
});

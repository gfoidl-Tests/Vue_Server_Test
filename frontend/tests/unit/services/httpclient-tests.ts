// For HTTP-bases testing 'nock' seems better, as the underlying HTTP
// infrastructure is overwritten, i.e. it simulates the network instead of
// just mocking the api-calls.
//
// When using jest-mocks take care of the implementation of HttpClient,
// as in this file the Axios-instance gets mocked, so in the HttpClient it will
// be undefined at some point, thus crashing.
// So either use a different file, or just don't use jest-mocks here. That's
// why they're commented out.
//
// A better and easier approach would be to use jest.spyOn.
// See ../views/main/ReadMe.md for further info.
//-----------------------------------------------------------------------------
import { HttpClient }                          from "@svc/httpclient";
import Axios                                   from "axios";
import * as nock                               from "nock";
import { HttpResponseError, HttpRequestError } from "@svc/httpclient-errors";
//import { mocked }                              from "ts-jest/utils";
//-----------------------------------------------------------------------------
//jest.mock("axios");
//const mockedAxios = mocked(Axios, true);
//const sut = new HttpClient(Axios);

// https://www.npmjs.com/package/nock#axios
Axios.defaults.adapter = require("axios/lib/adapters/http");
const nockScope        = nock("http://localhost/api/");
//-----------------------------------------------------------------------------
afterEach(() => {
    //mockedAxios.mockClear();
});
//-----------------------------------------------------------------------------
describe("HttpClient", () => {
    describe("get", () => {
        //test("ok -> response.data returned (jest-mock)", async () => {
        //    const data = { msg: "Yeah" };
        //    const response: Partial<AxiosResponse> = {
        //        status: 200,
        //        statusText: "OK",
        //        data
        //    };

        //    //mockedAxios.get.mockImplementation(() => Promise.resolve(response));

        //    //const actual = (await Axios.get<typeof data>("test")).data;
        //    const actual = await sut.get<typeof data>("test");

        //    expect(actual).toMatchObject(data);
        //});
        //---------------------------------------------------------------------
        test("ok -> response.data returned", async () => {
            const data = { msg: "Yeah" };
            nockScope.get("/test").reply(200, data);

            expect.assertions(1);
            await expect(HttpClient.Default.get<typeof data>("test"))
                .resolves
                .toMatchObject(data);
        });
        //---------------------------------------------------------------------
        test("response error -> throws HttpResponseError", () => {
            nockScope.get("/test").reply(400);

            expect.assertions(1);

            // either returning the Promise<void> or awaiting it works
            // the expect.assertions(1) makes sure that 1 assertion must be
            // expected
            return expect(HttpClient.Default.get("test"))
                .rejects
                .toThrowError(HttpResponseError);
        });
        //---------------------------------------------------------------------
        test("request error -> throws HttpRequestError", async () => {
            expect.assertions(1);
            await expect(HttpClient.Default.get("not-available"))
                .rejects
                .toThrowError(HttpRequestError);
        });
    });
    //-------------------------------------------------------------------------
    describe("post", () => {
        test("ok -> response.data returned", async () => {
            const data = { msg: "Yeah" };
            nockScope.post("/test").reply(200, data);

            expect.assertions(1);
            await expect(HttpClient.Default.post<typeof data>("test", "42"))
                .resolves
                .toMatchObject(data);
        });
        //---------------------------------------------------------------------
        test("response error -> throws HttpResponseError", async () => {
            nockScope.post("/test").reply(400);

            expect.assertions(1);
            await expect(HttpClient.Default.post("test"))
                .rejects
                .toThrowError(HttpResponseError);
        });
        //---------------------------------------------------------------------
        test("request error -> throws HttpRequestError", async () => {
            expect.assertions(1);

            await expect(HttpClient.Default.post("not-available"))
                .rejects
                .toThrowError(HttpRequestError);
        });
    });
});

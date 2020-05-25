import { IHttpClient } from "@svc/httpclient";
import HelloResponse   from "./hello-response";
//-----------------------------------------------------------------------------
export default class GreetingService {
    private readonly _httpClient: IHttpClient;
    //-------------------------------------------------------------------------
    constructor(httpClient: IHttpClient) {
        this._httpClient = httpClient;
    }
    //-------------------------------------------------------------------------
    public async hello(name: string): Promise<string> {
        const url = `greeting/hello?name=${name}`;

        console.debug(`sending request to ${url}`);

        const response = await this._httpClient.get<HelloResponse>(url);
        const message  = response.message;

        console.info("got response from server", response);

        return message;
    }
}

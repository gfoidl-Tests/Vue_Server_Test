import Axios, { AxiosInstance, CancelToken } from "axios";
//import * as http                             from "http";
//import * as https                            from "https";
//-----------------------------------------------------------------------------
export interface IHttpClient {
    /**
     * gets thre requested ressource from the `BASE_URL`
     * @param url url from which the ressource should be got
     * @param cancellationToken optional token to cancel the request
     *
     * @example
     * ```ts
     * const source = Axios.CancelToken.source();
     * const httpClient = new HttpClient();
     * const requestPromise = httpClient.get<string>(url, source.token);
     * 
     * source.cancel("Operation cancelled by user");
     * ```
     */
    get<TResponse>(url: string, cancellationToken?: CancelToken): Promise<TResponse>;
}
//-----------------------------------------------------------------------------
export class HttpClient implements IHttpClient {
    private static s_instance     : HttpClient    = new HttpClient();
    private static s_axiosInstance: AxiosInstance = Axios.create({
        baseURL        : BASE_URL + "api/",
        withCredentials: false,     // see Server.Startup for info, must match
        // Browsers have this by default for XHR/fetch
        //httpAgent      : new http.Agent ({ keepAlive: true }),
        //httpsAgent     : new https.Agent({ keepAlive: true })
    });
    //-------------------------------------------------------------------------
    static get Default(): HttpClient {
        return HttpClient.s_instance;
    }
    //-------------------------------------------------------------------------
    public async get<TResponse>(url: string, cancellationToken?: CancelToken): Promise<TResponse> {
        try {
            const response = await HttpClient.s_axiosInstance.get<TResponse>(url, {
                cancelToken: cancellationToken
            });

            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(`Failed at response for ${url}`, error.response);
            } else if (error.request) {
                console.error(`Failed at request for ${url}`, error.request);
            } else {
                console.error(`Failed request for ${url}`, error.message);
            }

            throw error;
        }
    }
}

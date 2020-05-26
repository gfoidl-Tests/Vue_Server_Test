import Axios, { AxiosInstance, CancelToken, AxiosError } from "axios";
//import * as http  from "http";
//import * as https from "https";
import { Nullable }    from "@ext/types";
import * as httpErrors from "./httpclient-errors";
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
    //-------------------------------------------------------------------------
    post<TRequest, TResponse>(url: string, data: TRequest, cancellationToken?: CancelToken): Promise<TResponse>;
}
//-----------------------------------------------------------------------------
export class HttpClient implements IHttpClient {
    private static s_axiosInstance: Nullable<AxiosInstance> = null;
    private static s_instance     : Nullable<HttpClient>    = null;
    //-------------------------------------------------------------------------
    private static get AxiosInstance(): AxiosInstance {
        if (HttpClient.s_axiosInstance === null) {
            if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
                console.debug("HttpClient axios instance is null, creating it");
            }

            const baseURL = __BASE_URL__ + "api/";
            HttpClient.s_axiosInstance = Axios.create({
                baseURL,
                withCredentials: false,     // see Server.Startup for info, must match
                // Browsers have this by default for XHR/fetch
                //httpAgent      : new http.Agent ({ keepAlive: true }),
                //httpsAgent     : new https.Agent({ keepAlive: true })
            });

            console.assert(HttpClient.s_axiosInstance !== undefined, "HttpCllient axios instance not created");
            if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
                console.debug("HttpClient axios instance created with baseURL", baseURL);
            }
        }

        return HttpClient.s_axiosInstance;
    }
    //-------------------------------------------------------------------------
    public static get Default(): HttpClient {
        if (HttpClient.s_instance === null) {
            if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
                console.debug("HttpClient instance is null, creating it with axios");
            }

            HttpClient.s_instance = new HttpClient(HttpClient.AxiosInstance);

            console.assert(HttpClient.s_instance !== undefined, "HttpCllient instance not created");
            if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
                console.debug("HttpClient instance created");
            }
        }

        return HttpClient.s_instance;
    }
    //-------------------------------------------------------------------------
    private _axios: AxiosInstance;
    //-------------------------------------------------------------------------
    constructor(axios = HttpClient.AxiosInstance) {
        this._axios = axios;
    }
    //-------------------------------------------------------------------------
    public async get<TResponse>(url: string, cancellationToken?: CancelToken): Promise<TResponse> {
        try {
            const logMsg = `get for '${url}'`;

            if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
                console.debug(`starting get ${logMsg}`);
                console.time(logMsg);
            }

            const response = await this._axios.get<TResponse>(url, {
                cancelToken: cancellationToken
            });

            if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
                console.timeEnd(logMsg);
            }

            return response.data;
        } catch (error) {
            this.handleError(url, error);
        }
    }
    //-------------------------------------------------------------------------
    public async post<TResponse>(url: string, data?: unknown, cancellationToken?: CancelToken): Promise<TResponse> {
        try {
            const logMsg = `post for '${url}'`;

            if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
                console.debug(`starting post ${url}`);
                console.time(logMsg);
            }

            const response = await this._axios.post<TResponse>(url, data, {
                cancelToken: cancellationToken
            });

            if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
                console.timeEnd(logMsg);
            }

            return response.data;
        } catch (error) {
            this.handleError(url, error);
        }
    }
    //-------------------------------------------------------------------------
    private handleError(url: string, error: AxiosError): never {
        if (error.response) {
            const response = error.response;
            throw new httpErrors.HttpResponseError(url, response.status, response.statusText, response.data, error);
        } else if (error.request) {
            throw new httpErrors.HttpRequestError(url, error);
        } else {
            throw error;
        }
    }
}

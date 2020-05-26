abstract class HttpError extends Error {
    public url       : string;
    public innerError: Error;
    //-------------------------------------------------------------------------
    constructor(url: string, message: string, innerError: Error, name = "HttpError") {
        super(`${message}\ninner: ${innerError.message}`);
        this.name       = name;
        this.url        = url;
        this.innerError = innerError;
    }
}
//-----------------------------------------------------------------------------
export class HttpResponseError extends HttpError {
    public status    : number;
    public statusText: string;
    public data      : unknown;
    //-------------------------------------------------------------------------
    constructor(url: string, status: number, statusText: string, data: unknown, innerError: Error) {
        super(url, `Failed at response from '${url}'`, innerError, "HttpResponseError");

        this.status     = status;
        this.statusText = statusText;
        this.data       = data;
    }
}
//-----------------------------------------------------------------------------
export class HttpRequestError extends HttpError {
    constructor(url: string, innerError: Error) {
        super(url, `Failed at request for '${url}'`, innerError, "HttpRequestError");
    }
}

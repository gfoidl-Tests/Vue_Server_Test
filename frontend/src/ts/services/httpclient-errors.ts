abstract class HttpError extends Error {
    public url: string;
    //-------------------------------------------------------------------------
    constructor(url: string, message: string, name = "HttpError") {
        super(message);
        this.name = name;
        this.url  = url;
    }
}
//-----------------------------------------------------------------------------
export class HttpResponseError extends HttpError {
    public status: number;
    public statusText: string;
    public data: unknown;
    //-------------------------------------------------------------------------
    constructor(url: string, status: number, statusText: string, data: unknown) {
        super(url, `Failed at response from ${url}`, "HttpResponseError");

        this.status     = status;
        this.statusText = statusText;
        this.data       = data;
    }
}
//-----------------------------------------------------------------------------
export class HttpRequestError extends HttpError {
    constructor(url: string) {
        super(url, `Failed at request for ${url}`, "HttpRequestError");
    }
}
//-----------------------------------------------------------------------------
export class GenericHttpError extends HttpError {
    constructor(url: string) {
        super(url, `Generic failure at request for ${url}`, "GenericHttpError");
    }
}

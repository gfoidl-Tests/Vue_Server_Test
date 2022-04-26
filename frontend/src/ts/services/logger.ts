import { App } from "vue";
//-----------------------------------------------------------------------------
export interface ErrorData {
    message: string;
    stack? : string;
    data   : unknown;
    handler: "vue" | "window" | "signalR";
}
//-----------------------------------------------------------------------------
// https://stackoverflow.com/a/42193905/347870
interface Console {
    [key: string]: unknown;
}
//-----------------------------------------------------------------------------
export default class Logger {
    public static init(app: App): void {
        if (!__DEBUG__) {
            //const logMethodsToDisable = ["log", "info", "warn", "error", "debug"];
            const logMethodsToDisable = ["log", "debug", "time", "timeEnd"];
            Logger.removeConsoleLogging(logMethodsToDisable);

            app.config.errorHandler = (err, _vm, info) => {
                const error = err as Error;

                const errorData: ErrorData = {
                    message: error.message,
                    stack  : error.stack,
                    handler: "vue",
                    data   : {
                        err,
                        info
                    }
                };

                Logger.logUnhandledException(errorData);
            };

            window.onerror = function (msg: string | Event, source: string | undefined, lineNo: number | undefined, columnNo: number | undefined, error: Error | undefined) {
                const errorData: ErrorData = {
                    message: error?.message ?? (msg as string),
                    stack  : error?.stack,
                    handler: "window",
                    data   : {
                        source,
                        lineNo,
                        columnNo,
                    }
                };

                Logger.logUnhandledException(errorData);
            }
        }
    }
    //-------------------------------------------------------------------------
    private static removeConsoleLogging(logMethodsToDisable: string[]): void {
        for (const method of logMethodsToDisable) {
            ((console as unknown) as Console)[method] = function () { /**/ };
        }
    }
    //-------------------------------------------------------------------------
    public static async logUnhandledException(error: ErrorData): Promise<void> {
        console.error("Unhandled error", error);

        const HttpClient = (await import("./httpclient")).HttpClient;

        HttpClient.Default.post<void>("error/client", error);
        console.info("sent error info to server");
    }
}

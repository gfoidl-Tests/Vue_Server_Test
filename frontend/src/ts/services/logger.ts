import Vue            from "vue";
import { HttpClient } from "./httpclient";
//-----------------------------------------------------------------------------
interface ErrorData {
    message: string;
    stack? : string;
    data   : unknown;
    handler: "vue" | "window";
}
//-----------------------------------------------------------------------------
// https://stackoverflow.com/a/42193905/347870
interface Console {
    [key: string]: unknown;
}
//-----------------------------------------------------------------------------
export default class Logger {
    public static init(): void {
        if (!__DEBUG__) {
            //const logMethodsToDisable = ["log", "info", "warn", "error", "debug"];
            const logMethodsToDisable = ["log", "debug"];
            Logger.removeConsoleLogging(logMethodsToDisable);
            
            Vue.config.errorHandler = (err, _vm, info) => {
                const errorData: ErrorData = {
                    message: err.message,
                    stack  : err.stack,
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
    private static logUnhandledException(error: ErrorData): void {
        console.error("Unhandled error", error);

        HttpClient.Default.post<ErrorData, void>("error/client", error);
        console.info("sent error info to server");
    }
}

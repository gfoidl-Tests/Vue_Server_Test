import _Vue                                 from "vue";
import { createLogger, transports, format } from "winston";
//-----------------------------------------------------------------------------
export default function WinstonLoggerPlugin(Vue: typeof _Vue): void {
    const consoleTransport = new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    });

    const httpTransport = new transports.Http({
        level: "warn"
    });

    const logger = createLogger({
        level: __DEBUG__ ? "debug" : "info",
        transports: [
            consoleTransport,
            httpTransport
        ]
    });

    Vue.prototype.$logger = logger;
}

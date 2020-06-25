import isServerHealthy                         from "./server-health-check";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import GreetingHandler                         from "./greeting-handler";
import Logger, { ErrorData }                   from "@svc/logger";
import { UserStore }                           from "@store/user/user";
//-----------------------------------------------------------------------------
export default class GreetingHub {
    private _connection: HubConnection | null;
    //-------------------------------------------------------------------------
    constructor(userStore: UserStore) {
        this._connection = null;
        this.init(userStore);
    }
    //-------------------------------------------------------------------------
    private async init(userStore: UserStore): Promise<void> {
        const serverConnection = await isServerHealthy();

        if (!serverConnection) {
            console.info("[GreetingHub] server is not healthy, skipping registration of hub");
            return;
        }

        this._connection = new HubConnectionBuilder()
            .withUrl("/hubs/greeting")
            .withAutomaticReconnect()
            .build();

        const greetingHandler = new GreetingHandler(userStore);
        this._connection.on("NewGreeting", (name: string, msg: string) => greetingHandler.onNewGreeting(name, msg));

        try {
            console.debug("[GreetingHub] trying to connect");
            await this._connection.start();
            console.info("[GreetingHub] connected");
        } catch (e) {
            GreetingHub.handleError(e as Error);
        }
    }
    //-------------------------------------------------------------------------
    public async disconnect(): Promise<void> {
        if (this._connection === null) return;

        try {
            console.debug("[GreetingHub] trying to disconnect");
            await this._connection.stop();
            console.info("[GreetingHub] disconnected");
        } catch (e) {
            GreetingHub.handleError(e as Error);
        }
    }
    //-------------------------------------------------------------------------
    private static async handleError(e: Error): Promise<void> {
        console.error("[GreetingHub]", e);

        if (!__DEBUG__) {
            const error: ErrorData = {
                message: e.message,
                stack  : e.stack,
                handler: "signalR",
                data   : {}
            };

            await Logger.logUnhandledException(error);
        }
    }
}

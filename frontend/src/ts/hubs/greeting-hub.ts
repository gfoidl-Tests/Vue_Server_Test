import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import GreetingHandler                         from "./greeting-handler";
import Logger, { ErrorData }                   from "@svc/logger";
import { UserStore }                           from "@store/user/user";
//-----------------------------------------------------------------------------
export default class GreetingHub {
    private _connection: HubConnection;
    //-------------------------------------------------------------------------
    constructor(userStore: UserStore) {
        this._connection = new HubConnectionBuilder()
            .withUrl("/hubs/greeting")
            .withAutomaticReconnect()
            .build();

        this.init(userStore);
    }
    //-------------------------------------------------------------------------
    public async disconnect(): Promise<void> {
        try {
            console.debug("[GreetingHub] trying to disconnect");
            await this._connection.stop();
            console.info("[GreetingHub] disconnected");
        } catch (e) {
            GreetingHub.handleError(e as Error);
        }
    }
    //-------------------------------------------------------------------------
    private async init(userStore: UserStore): Promise<void> {
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

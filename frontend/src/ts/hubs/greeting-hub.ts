import isServerHealthy                         from "./server-health-check";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import GreetingHandler                         from "./greeting-handler";
import Logger, { ErrorData }                   from "@svc/logger";
import { UserStore }                           from "@store/user/user";
//-----------------------------------------------------------------------------
export default class GreetingHub {
    private _connection: HubConnection;
    private _userStore : UserStore;
    //-------------------------------------------------------------------------
    constructor(userStore: UserStore, connection?: HubConnection, init = true) {
        this._userStore = userStore;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._connection = connection ?? null!;

        if (init) {
            this.init();
        }
    }
    //-------------------------------------------------------------------------
    private async init(): Promise<void> {
        const serverConnection = await isServerHealthy();

        if (!serverConnection) {
            console.info("[GreetingHub] server is not healthy, skipping registration of hub");
            return;
        }

        this._connection = new HubConnectionBuilder()
            .withUrl("/hubs/greeting")
            .withAutomaticReconnect()
            .build();

        const greetingHandler = new GreetingHandler(this._userStore);
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
    public async redoHistory(index: number): Promise<void> {
        if (index >= this._userStore.history.value.length) return;

        const { name } = this._userStore.history.value[index];
        await this._connection.send("SendGreeting", name, `Hello '${name}' (SignalR)`);
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

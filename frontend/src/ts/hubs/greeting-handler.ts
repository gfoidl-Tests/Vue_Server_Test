import { UserStore } from "@store/user/user";
//-----------------------------------------------------------------------------
export default class GreetingHandler {
    #userStore: UserStore;
    //-------------------------------------------------------------------------
    constructor(userStore: UserStore) {
        this.#userStore = userStore;

        console.debug("[GreetingHub] handler registered");
    }
    //-------------------------------------------------------------------------
    public onNewGreeting(name: string, message: string) {
        console.info(`[GreetingHub] new greeting, name: ${name}, message: ${message}`);

        this.#userStore.addToHistory({ name, message });
    }
}

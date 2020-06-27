import { UserStore } from "@store/user/user";
//-----------------------------------------------------------------------------
export default class GreetingHandler {
    private _userStore: UserStore;
    //-------------------------------------------------------------------------
    constructor(userStore: UserStore) {
        this._userStore = userStore;

        console.debug("[GreetingHub] handler registered");
    }
    //-------------------------------------------------------------------------
    public onNewGreeting(name: string, message: string) {
        console.info(`[GreetingHub] new greeting, name: ${name}, message: ${message}`);

        this._userStore.addToHistory({ name, message });
    }
}

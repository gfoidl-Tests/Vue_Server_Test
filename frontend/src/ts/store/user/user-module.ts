import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store           from "@store/index";
import GreetingService from "./greeting-service";
import { HttpClient }  from "@svc/httpclient";
//-----------------------------------------------------------------------------
// https://github.com/championswimmer/vuex-module-decorators/issues/131
if (store.hasModule("user")) {
    console.debug("store: module user is registered, unregister it");
    store.unregisterModule("user");
}
//-----------------------------------------------------------------------------
@Module({ namespaced: true, name: "user", dynamic: true, store })
class User extends VuexModule {
    private _greetingService = new GreetingService(HttpClient.Default);
    //-------------------------------------------------------------------------
    public name    = "";
    public message = "";
    //-------------------------------------------------------------------------
    @Mutation
    public setName(name: string): void {
        this.name = name;
    }
    //-------------------------------------------------------------------------
    @Mutation
    public setMessage(message: string): void {
        this.message = message;
    }
    //-------------------------------------------------------------------------
    @Action
    public async hello() {
        const message = await this._greetingService.hello(this.name);

        //this.context.commit("setMessage", message);
        userModule.setMessage(message);
    }
    //-------------------------------------------------------------------------
    @Action
    public reset(): void {
        //this.context.commit("resetName");
        //this.context.commit("resetMessage");

        userModule.resetName();
        userModule.resetMessage();
    }
    //-------------------------------------------------------------------------
    @Mutation
    private resetName(): void {
        this.name = "";
    }
    //-------------------------------------------------------------------------
    @Mutation
    private resetMessage(): void {
        this.message = "";
    }
}
//-----------------------------------------------------------------------------
export const userModule = getModule(User);

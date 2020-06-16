import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import { moduleOptions }                                   from "../module-options";
import GreetingService                                     from "./greeting-service";
import { HttpClient }                                      from "@svc/httpclient";
//-----------------------------------------------------------------------------
export const moduleName = "user";
//-----------------------------------------------------------------------------
export interface UserState {
    name   : string;
    message: string;
}
//-----------------------------------------------------------------------------
@Module(moduleOptions(moduleName))
export class UserStore extends VuexModule implements UserState {
    private readonly _greetingService = new GreetingService(HttpClient.Default);
    //-------------------------------------------------------------------------
    public name    = "";
    public message = "";
    //-------------------------------------------------------------------------
    @Mutation
    public setName(name: string): void {
        this.name = name;

        //console.debug(`name set to ${name}`);
    }
    //-------------------------------------------------------------------------
    @Mutation
    private resetName(): void {
        this.name = "";
    }
    //-------------------------------------------------------------------------
    @Mutation
    public setMessage(message: string): void {
        this.message = message;
    }
    //-------------------------------------------------------------------------
    @Mutation
    private resetMessage(): void {
        this.message = "";
    }
    //-------------------------------------------------------------------------
    @Action
    public async hello(): Promise<void> {
        const message = await this._greetingService.hello(this.name);

        //this.context.commit("setMessage", message);
        this.setMessage(message);
    }
    //-------------------------------------------------------------------------
    @Action
    public reset(): void {
        //this.context.commit("resetName");
        //this.context.commit("resetMessage");

        this.resetName();
        this.resetMessage();
    }
}
//-----------------------------------------------------------------------------
export const userStore = getModule(UserStore);

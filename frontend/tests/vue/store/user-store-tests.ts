import { createLocalVue } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import { moduleOptions } from "@store/module-options";
import { UserStore, UserState, moduleName } from "@store/user/user-store";
import { getModule } from "vuex-module-decorators";
import { cloneState, stateDiff } from "./vuex-test-utils";
//-----------------------------------------------------------------------------
// spy works better than the Mocks (as always ;-))
//
//import GreetingService from "@store/user/greeting-service";
//jest.mock("@store/user/greeting-service");
//const MockedGreetingService = (GreetingService as unknown) as jest.Mock<GreetingService>;
//-----------------------------------------------------------------------------
describe("userStore", () => {
    let store: Store<any>;
    let sut: UserStore;
    let initialState: UserState;
    //-------------------------------------------------------------------------
    beforeEach(() => {
        //MockedGreetingService.mockClear();

        const localVue = createLocalVue();
        localVue.use(Vuex);

        store = new Vuex.Store({
            strict: false,

            // Or register the module like below
            //modules: {
            //    "user": UserStore
            //}
        });

        const options = moduleOptions(moduleName, store);
        store.registerModule(moduleName, UserStore);

        sut = getModule(UserStore, store);

        initialState = cloneState(sut);
        //console.log("initial state", initialState);
    });
    //-------------------------------------------------------------------------
    afterEach(() => {
        store.unregisterModule(moduleName);
        sut.reset();
    });
    //-------------------------------------------------------------------------
    describe("mutations", () => {
        test("setName", () => {
            sut.setName("himen");

            expect(stateDiff(initialState, sut)).toStrictEqual<Partial<UserState>>({
                name: "himen"
            });
        });
        //---------------------------------------------------------------------
        test("setMessage", () => {
            sut.setMessage("foo");

            expect(stateDiff(initialState, sut)).toStrictEqual<Partial<UserState>>({
                message: "foo"
            });
        });
    });
    //-------------------------------------------------------------------------
    describe("actions", () => {
        test("hello", async () => {
            sut.setName("himen");
            initialState = cloneState(sut);

            // When mockedHello is used, the spying on calls is easier -- see below
            //MockedGreetingService.mock.instances[0].hello = jest.fn().mockResolvedValue("Hello himen");
            //const mockedHello = jest.fn().mockResolvedValue("Hello himen");
            //MockedGreetingService.mock.instances[0].hello = mockedHello;

            const spy = jest.spyOn(sut["_greetingService"], "hello").mockResolvedValue("Hello himen");
            await sut.hello();

            expect.assertions(2);

            expect(stateDiff(initialState, sut)).toStrictEqual<Partial<UserState>>({
                message: "Hello himen"
            });

            // Is effectively the same
            //expect(MockedGreetingService.mock.instances[0].hello).toHaveBeenCalledWith(sut.name);
            //expect(mockedHello).toBeCalledWith(sut.name);

            expect(spy).toBeCalledWith(sut.name);
        });
        //---------------------------------------------------------------------
        test("reset", () => {
            sut.setName("a");
            sut.setMessage("b");

            expect(stateDiff(initialState, sut)).toStrictEqual<UserState>({
                name: "a",
                message: "b"
            });

            sut.reset();

            expect(stateDiff(initialState, sut)).toBeNull();
        });
    });
});

import MainView from "@view/main.vue";
import { userStore } from "@store/user/user-store";
import GreetingService                    from "@store/user/greeting-service";
import { mount, createLocalVue, Wrapper } from "@vue/test-utils";
import BootstrapVue                       from "bootstrap-vue";
import Vuex, { Store }                    from "vuex";
import flushPromises                      from "flush-promises";
//-----------------------------------------------------------------------------
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

let sut  : Wrapper<MainView>;
let store: Store<unknown>;
//-----------------------------------------------------------------------------
describe("Main.vue", () => {
    beforeEach(() => {
        store = new Vuex.Store({});
        sut = mount(MainView, { localVue, store });

        console.log("reg", store.hasModule("user"));
    });
    //-------------------------------------------------------------------------
    afterEach(() => {
        if (sut) {
            sut.destroy();
        }
    });
    //-------------------------------------------------------------------------
    test("test wrapper created -> correct name", () => {
        expect(sut.name()).toBe("MainView");
    });
    //-------------------------------------------------------------------------
    test("no name entered -> sendButton disabled, no message shown", () => {
        const sendButton = sut.get("#sendButton");
        expect(sendButton.attributes("disabled")).toBe("disabled");

        //const messageCol = sut.findAll("#messageCol");
        //expect(messageCol.length).toBe(0);
        // Simpler way:
        expect(sut.find("#messageCol").exists()).toBe(false);
    });
    //-------------------------------------------------------------------------
    test("name entered -> sendButton enabled", async () => {
        const nameInput  = sut.get("#nameInput");
        const sendButton = sut.get("#sendButton");

        await nameInput.setValue("himen");

        const actual = sendButton.attributes("disabled");

        expect(actual).toBeUndefined();
        expect.assertions(1);
    });
    //-------------------------------------------------------------------------
    test("name entered and reset -> input cleared and sendButton disabled", async () => {
        const nameInput  = sut.get("#nameInput");
        const sendButton = sut.get("#sendButton");

        await nameInput.setValue("batman");
        expect(sendButton.attributes("disabled")).toBeUndefined();

        await sut.get("form").trigger("reset");

        expect(nameInput.text().length).toBe(0);
        expect(sendButton.attributes("disabled")).toBe("disabled");

        expect.assertions(3);
    });
    //-------------------------------------------------------------------------
    test.skip("send -> message shown", async () => {
        const nameInput = sut.get("#nameInput");
        await nameInput.setValue("himen");

        //const greetingService = sut.vm.$data.greetingService as GreetingService;
        //const spy = jest.spyOn(greetingService, "hello")
        //    .mockResolvedValue("Hi himen");

        //const spy = jest.spyOn(userStore, "hello").mockResolvedValue("Hi himen");

        sut.get("form").trigger("submit");
        // https://vue-test-utils.vuejs.org/guides/testing-async-components.html#asynchronous-behavior-outside-of-vue
        await flushPromises();

        const messageSpan = sut.find("#messageSpan");

        //expect(spy).toHaveBeenCalledWith("himen");
        expect(messageSpan.exists()).toBe(true);
        expect(messageSpan.text()).toBe("Hi himen");
        expect.assertions(3);
    });
});

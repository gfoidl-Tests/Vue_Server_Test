import MainView                           from "@view/main/main.vue";
import GreetingService                    from "@view/main/greeting-service";
import { mount, createLocalVue, Wrapper } from "@vue/test-utils";
import BootstrapVue                       from "bootstrap-vue";
import * as flushPromises                 from "flush-promises";
//-----------------------------------------------------------------------------
describe("Main.vue", () => {
    let sut: Wrapper<MainView>;
    //-------------------------------------------------------------------------
    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(BootstrapVue);

        sut = mount(MainView, { localVue });
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

        await nameInput.setValue("himen");
        expect(sendButton.attributes("disabled")).toBeUndefined();

        await sut.get("form").trigger("reset");

        expect(nameInput.text().length).toBe(0);
        expect(sendButton.attributes("disabled")).toBe("disabled");

        expect.assertions(3);
    });
    //-------------------------------------------------------------------------
    test("send -> message shown", async () => {
        const nameInput = sut.get("#nameInput");
        await nameInput.setValue("himen");

        const greetingService = sut.vm.$data.greetingService as GreetingService;
        const spy = jest.spyOn(greetingService, "hello")
            .mockResolvedValue("Hi himen");

        sut.get("form").trigger("submit");
        // https://vue-test-utils.vuejs.org/guides/testing-async-components.html#asynchronous-behavior-outside-of-vue
        await flushPromises();

        const messageCol = sut.find("#messageCol");

        expect(spy).toHaveBeenCalledWith("himen");
        expect(messageCol.exists()).toBe(true);
        expect(messageCol.text()).toBe("Message: Hi himen");
        expect.assertions(3);
    });
});

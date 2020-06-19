// The mock-setup must be the first thing in the test-file, otherwise
// there's a ReferenceError for `mockHello` (use before initialization)
//-----------------------------------------------------------------------------
const mockHello = jest.fn();

jest.mock("@store/user/greeting-service", () => {
    return {
        __esModule: true,   // necessary for the default export, otherwise MockedGreetingService will have a `default` property
        default   : jest.fn().mockImplementation(() => {
            return {
                //hello: (name: string) => Promise.resolve(`Hi ${name}`)
                //hello: jest.fn().mockResolvedValue("Hi himen")
                hello: mockHello
            };
        })
    };
});
//-----------------------------------------------------------------------------
import MainView                           from "@view/main.vue";
import GreetingService                    from "@store/user/greeting-service";
import { mount, createLocalVue, Wrapper } from "@vue/test-utils";
import BootstrapVue                       from "bootstrap-vue";
import flushPromises                      from "flush-promises";
//-----------------------------------------------------------------------------
const MockedGreetingService = (GreetingService as unknown) as jest.Mock<GreetingService>;
//-----------------------------------------------------------------------------
beforeEach(() => {
    MockedGreetingService.mockClear();
    mockHello.mockClear();
});
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

        mockHello.mockResolvedValue("Hi himen");

        sut.get("form").trigger("submit");
        // https://vue-test-utils.vuejs.org/guides/testing-async-components.html#asynchronous-behavior-outside-of-vue
        await flushPromises();

        const messageSpan = sut.find("#messageSpan");

        expect(mockHello).toHaveBeenCalledWith("himen");
        expect(messageSpan.exists()).toBe(true);
        expect(messageSpan.text()).toBe("Hi himen");
        expect.assertions(3);
    });
});

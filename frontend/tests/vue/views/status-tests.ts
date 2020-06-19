jest.mock("@store/user/greeting-service", () => {
    return {
        __esModule: true,   // necessary for the default export, otherwise MockedGreetingService will have a `default` property
        default: jest.fn().mockImplementation(() => {
            return {
                hello: (name: string) => Promise.resolve(`Hi ${name}`)
            };
        })
    };
});
//-----------------------------------------------------------------------------
import StatusView                         from "@view/status.vue";
import { mount, createLocalVue, Wrapper } from "@vue/test-utils";
import BootstrapVue                       from "bootstrap-vue";
import useUserStore                       from "@store/user/user";
//-----------------------------------------------------------------------------
describe("Status.vue", () => {
    let sut: Wrapper<StatusView>;
    //-------------------------------------------------------------------------
    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(BootstrapVue);

        sut = mount(StatusView, { localVue });
    });
    //-------------------------------------------------------------------------
    afterEach(() => {
        if (sut) {
            sut.destroy();
        }
    });
    //-------------------------------------------------------------------------
    test("empty store --> empty fields", () => {
        const nameCol    = sut.get("#nameCol");
        const messageCol = sut.get("#messageCol");

        expect(nameCol.text())   .toBe("Name:");
        expect(messageCol.text()).toBe("Message:");
    });
    //-------------------------------------------------------------------------
    test("name and message set in store --> fields updated", async () => {
        const { name, hello } = useUserStore();

        name.value = "batman";
        await hello();

        const nameCol    = sut.get("#nameCol");
        const messageCol = sut.get("#messageCol");

        expect(nameCol.text())   .toBe("Name: batman");
        expect(messageCol.text()).toBe("Message: Hi batman");
    });
});

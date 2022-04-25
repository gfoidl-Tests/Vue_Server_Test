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
import StatusView                                   from "@view/status.vue";
import { mount, VueWrapper }                        from "@vue/test-utils";
import { createUserStore, UserStore, userStoreKey } from "@store/user/user";
import { getGlobalMountOptionsForCoreUi }           from "../coreui-test-helper";
//-----------------------------------------------------------------------------
describe("Status.vue", () => {
    const globalMountOptions = getGlobalMountOptionsForCoreUi();

    let sut      : VueWrapper;
    let userStore: UserStore;
    //-------------------------------------------------------------------------
    beforeEach(() => {
        userStore = createUserStore();

        sut = mount(StatusView, {
            global: {
                ...globalMountOptions,
                provide: {
                    ...globalMountOptions.provide,
                    [userStoreKey as symbol]: userStore
                }
            }
        });
    });
    //-------------------------------------------------------------------------
    afterEach(() => {
        if (sut) {
            sut.unmount();
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
        const { name, hello } = userStore;

        name.value = "batman";
        await hello();

        const nameCol    = sut.get("#nameCol");
        const messageCol = sut.get("#messageCol");

        expect(nameCol.text())   .toBe("Name: batman");
        expect(messageCol.text()).toBe("Message: Hi batman");
    });
});

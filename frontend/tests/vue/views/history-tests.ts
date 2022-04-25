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
import HistoryView                                  from "@view/history.vue";
import { mount, VueWrapper }                        from "@vue/test-utils";
import { createUserStore, UserStore, userStoreKey } from "@store/user/user";
import { getGlobalMountOptionsForCoreUi }           from "../coreui-test-helper";
//-----------------------------------------------------------------------------
describe("History.vue", () => {
    const globalMountOptions = getGlobalMountOptionsForCoreUi();

    let sut      : VueWrapper;
    let userStore: UserStore;
    //-------------------------------------------------------------------------
    beforeEach(() => {
        userStore = createUserStore();

        sut = mount(HistoryView, {
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
    test("empty store --> history not rendered", () => {
        expect(sut.find("#historyList").exists()).toBe(false);
    });
    //-------------------------------------------------------------------------
    test("message set in store --> history list shown with correct item(s)", async () => {
        userStore.name.value = "batman";
        await userStore.hello();

        const dataTestItems = sut.findAll("[data-test='history']");

        expect(sut.find("#historyList").exists()).toBe(true);
        expect(dataTestItems.length).toBe(1);
        expect(dataTestItems[0].text()).toMatch(/Hi batman/);
        expect.assertions(3);
    });
    //-------------------------------------------------------------------------
    test("delete history --> item removed", async () => {
        userStore.name.value = "batman";
        await userStore.hello();

        const removeButton = sut.get("#deleteButton_0");
        await removeButton.trigger("click");

        expect(sut.find("#historyList").exists()).toBe(false);
    });
});

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
import HistoryView                                   from "@view/history.vue";
import { createLocalVue, Wrapper }                   from "@vue/test-utils";
import { mountComposition }                          from "../mount-composition";
import BootstrapVue                                  from "bootstrap-vue";
import { provideUserStore, useUserStore, UserStore } from "@store/user/user";
//-----------------------------------------------------------------------------
describe("History.vue", () => {
    let sut      : Wrapper<HistoryView>;
    let userStore: UserStore;
    //-------------------------------------------------------------------------
    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(BootstrapVue);

        sut = mountComposition(HistoryView, localVue, () => {
            provideUserStore();
            userStore = useUserStore();
        });
    });
    //-------------------------------------------------------------------------
    afterEach(() => {
        if (sut) {
            sut.destroy();
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
        expect(dataTestItems.at(0).text()).toMatch(/Hi batman/);
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

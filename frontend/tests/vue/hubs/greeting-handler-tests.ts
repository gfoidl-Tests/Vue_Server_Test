import GreetingHandler                   from "@hub/greeting-handler";
import { createUserStore, HistoryEntry } from "@store/user/user";
//-----------------------------------------------------------------------------
describe("GreetingHandler", () => {
    describe("onNewGreeting", () => {
        test("new greeting --> added to UserStore", () => {
            const userStore = createUserStore();
            const sut       = new GreetingHandler(userStore);

            sut.onNewGreeting("batman", "hi");

            expect(userStore.history.value.length).toBe(1);
            expect(userStore.history.value[0]).toMatchObject<HistoryEntry>({ name: "batman", message: "hi" });
        });
    });
});

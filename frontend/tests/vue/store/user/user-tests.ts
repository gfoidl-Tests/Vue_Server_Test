const mockHello = jest.fn();

jest.mock("@store/user/greeting-service", () => {
    return {
        __esModule: true,   // necessary for the default export, otherwise MockedGreetingService will have a `default` property
        default: jest.fn().mockImplementation(() => {
            return {
                //hello: (name: string) => Promise.resolve(`Hi ${name}`)
                //hello: jest.fn().mockResolvedValue("Hi himen")
                hello: mockHello
            };
        })
    };
});
//-----------------------------------------------------------------------------
import { createUserStore, HistoryEntry } from "@store/user/user";
import GreetingService                   from "@store/user/greeting-service";
//-----------------------------------------------------------------------------
const MockedGreetingService = (GreetingService as unknown) as jest.Mock<GreetingService>;
//-----------------------------------------------------------------------------
beforeEach(() => {
    MockedGreetingService.mockClear();
    mockHello.mockClear();
});
//-----------------------------------------------------------------------------
describe("UserStore", () => {
    describe("name", () => {
        test("set name", () => {
            const { name } = createUserStore();

            name.value = "Himen";
            
            expect(name.value).toBe("Himen");
        });
    });
    //-------------------------------------------------------------------------
    describe("hello", () => {
        test("name given --> correct message set", async () => {
            const userStore = createUserStore();
            userStore.name.value = "batman";

            mockHello.mockResolvedValue("Hi batman");

            await userStore.hello();

            expect(mockHello).toHaveBeenCalledWith("batman");
            expect(userStore.message.value).toBe("Hi batman");
            expect(userStore.history.value[0]).toMatchObject({ name: "batman", message: "Hi batman" });
            expect.assertions(3);
        });
        //---------------------------------------------------------------------
        test("different name given --> message set", async () => {
            const userStore = createUserStore();
            userStore.name.value = "clayman";

            mockHello.mockResolvedValue("Hi clayman");

            await userStore.hello();

            expect(mockHello).toHaveBeenCalledWith("clayman");
            expect(userStore.message.value).toBe("Hi clayman");
            expect(userStore.history.value[0]).toMatchObject({ name: "clayman", message: "Hi clayman" });
            expect.assertions(3);
        });
    });
    //-------------------------------------------------------------------------
    describe("removeFromHistory", () => {
        test("empty history --> nothing happens", () => {
            const userStore = createUserStore();

            userStore.removeFromHistory(1);
        });
        //---------------------------------------------------------------------
        test("filled history --> message removed", async () => {
            const userStore = createUserStore();

            userStore.name.value = "himen";
            await userStore.hello();

            userStore.removeFromHistory(0);

            expect(userStore.history.value.length).toBe(0);
        });
    });
    //-------------------------------------------------------------------------
    describe("redoHistory", () => {
        test("empty history --> nothing happens", async () => {
            const userStore = createUserStore();

            await userStore.redoHistory(1);
        });
        //---------------------------------------------------------------------
        test("filled history --> item replayed", async () => {
            const userStore = createUserStore();

            userStore.name.value = "himen";
            await userStore.hello();
            userStore.name.value = "";
            await userStore.redoHistory(0);

            expect(userStore.name.value).toBe("himen");
            expect(userStore.history.value.length).toBe(2);
            expect.assertions(2);
        });
    });
    //-------------------------------------------------------------------------
    describe("addToHistory", () => {
        test("entry given --> added to history", () => {
            const userStore = createUserStore();

            const entry: HistoryEntry = {
                name   : "batman",
                message: "hi"
            };

            userStore.addToHistory(entry);

            expect(userStore.history.value.length).toBe(1);
            expect(userStore.history.value[0]).toMatchObject(entry);
        });
    });
    //-------------------------------------------------------------------------
    describe("reset", () => {
        test("resets properties", async () => {
            const userStore = createUserStore();

            userStore.name.value = "himen";
            await userStore.hello();

            userStore.reset();

            expect(userStore.name.value)   .toBe("");
            expect(userStore.message.value).toBe("");
            expect(userStore.history.value.length).toBe(0);
            expect.assertions(3);
        });
    });
});

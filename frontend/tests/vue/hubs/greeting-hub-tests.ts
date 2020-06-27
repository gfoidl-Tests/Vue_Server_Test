jest.mock("@store/user/greeting-service", () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => {
            return {
                hello: (name: string) => Promise.resolve(`Hi ${name}`)
            };
        })
    };
});
//-----------------------------------------------------------------------------
import GreetingHub         from "@hub/greeting-hub";
import { createUserStore } from "@store/user/user";
import { HubConnection }   from "@microsoft/signalr";
//-----------------------------------------------------------------------------
jest.mock("@microsoft/signalr");
const MockedHubConnection = (HubConnection as unknown) as jest.Mock<HubConnection>;
const mockedHubConnection = new MockedHubConnection()  as jest.Mocked<HubConnection>;
//-----------------------------------------------------------------------------
beforeEach(() => {
    MockedHubConnection.mockClear();
});
//-----------------------------------------------------------------------------
describe("GreetingHub", () => {
    describe("redoHistory", () => {
        const userStore = createUserStore();
        const sut = new GreetingHub(userStore, mockedHubConnection, false);
        //---------------------------------------------------------------------
        test("empty history --> nothing happens", async () => {
            await sut.redoHistory(1);
        });
        //---------------------------------------------------------------------
        test("history filled --> redo with correct args", async () => {
            userStore.name.value = "batman";
            await userStore.hello();

            await sut.redoHistory(0);

            expect(mockedHubConnection.send).toBeCalledWith("SendGreeting", "batman", "Hello 'batman' (SignalR)");
        });
    });
});

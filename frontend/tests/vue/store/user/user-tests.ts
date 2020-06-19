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
import UserStore       from "@store/user/user";
import GreetingService from "@store/user/greeting-service";
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
            UserStore.name.value = "Himen";

            expect(UserStore.name.value).toBe("Himen");
        });
    });
    //-------------------------------------------------------------------------
    describe("hello", () => {
        test("name given --> correct message set", async () => {
            UserStore.name.value = "batman";

            mockHello.mockResolvedValue("Hi batman");

            await UserStore.hello();

            expect(mockHello).toHaveBeenCalledWith("batman");
            expect(UserStore.message.value).toBe("Hi batman");
            expect.assertions(2);
        });
        //---------------------------------------------------------------------
        test("different name given --> message set", async () => {
            UserStore.name.value = "clayman";

            mockHello.mockResolvedValue("Hi clayman");

            await UserStore.hello();

            expect(mockHello).toHaveBeenCalledWith("clayman");
            expect(UserStore.message.value).toBe("Hi clayman");
            expect.assertions(2);
        });
    });
    //-------------------------------------------------------------------------
    describe("reset", () => {
        test("resets properties", () => {
            UserStore.reset();

            expect(UserStore.name.value)   .toBe("");
            expect(UserStore.message.value).toBe("");
        });
    });
});

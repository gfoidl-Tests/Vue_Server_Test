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
import useUserStore    from "@store/user/user";
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
            const { name } = useUserStore();

            name.value = "Himen";
            
            expect(name.value).toBe("Himen");
        });
    });
    //-------------------------------------------------------------------------
    describe("hello", () => {
        test("name given --> correct message set", async () => {
            const { name, hello, message } = useUserStore();
            name.value = "batman";

            mockHello.mockResolvedValue("Hi batman");

            await hello();

            expect(mockHello).toHaveBeenCalledWith("batman");
            expect(message.value).toBe("Hi batman");
            expect.assertions(2);
        });
        //---------------------------------------------------------------------
        test("different name given --> message set", async () => {
            const { name, hello, message } = useUserStore();
            name.value = "clayman";

            mockHello.mockResolvedValue("Hi clayman");

            await hello();

            expect(mockHello).toHaveBeenCalledWith("clayman");
            expect(message.value).toBe("Hi clayman");
            expect.assertions(2);
        });
    });
    //-------------------------------------------------------------------------
    describe("reset", () => {
        test("resets properties", () => {
            const { reset, name, message } = useUserStore();

            reset();

            expect(name.value)   .toBe("");
            expect(message.value).toBe("");
        });
    });
});

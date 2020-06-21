using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Moq;
using NUnit.Framework;
using Server.Greeting;
using Server.Hubs;

namespace Server.Tests.Greeting
{
    [TestFixture]
    public class HelloNotificationHandlerTests
    {
        [Test]
        public async Task Notification_given___Clients_called()
        {
            var hubContextMock     = new Mock<IHubContext<GreetingHub, IGreetingClient>>(MockBehavior.Strict);
            var hubClientsMock     = new Mock<IHubClients<IGreetingClient>>(MockBehavior.Strict);
            var greetingClientMock = new Mock<IGreetingClient>(MockBehavior.Strict);

            const string name      = "Dummy";
            string expectedMessage = $"Hello '{name}' from SignalR";

            hubContextMock
                .Setup(h => h.Clients)
                .Returns(hubClientsMock.Object)
                .Verifiable();

            hubClientsMock
                .Setup(h => h.All)
                .Returns(greetingClientMock.Object)
                .Verifiable();

            greetingClientMock
                .Setup(g => g.NewGreeting(name, expectedMessage))
                .Returns(Task.CompletedTask)
                .Verifiable();

            var notification = new HelloQuery(name);
            var sut          = new HelloNotificationHandler(hubContextMock.Object);

            await sut.Handle(notification);

            hubContextMock    .Verify();
            hubClientsMock    .Verify();
            greetingClientMock.Verify();
        }
    }
}

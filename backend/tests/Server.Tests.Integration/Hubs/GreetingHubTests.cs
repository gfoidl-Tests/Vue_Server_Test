using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.AspNetCore.TestHost;
using NUnit.Framework;
using Server.Hubs;

// Based on https://lurumad.github.io/integration-tests-in-aspnet-core-signalr

namespace Server.Tests.Integration.Hubs
{
    [TestFixture]
    public class GreetingHubTests : IntegrationTestBase
    {
        [Test]
        public async Task SendGreeting___clients_notified()
        {
            using TestServer testServer = _factory.Server;

            var connection = new HubConnectionBuilder()
                .WithUrl(
                    testServer.BaseAddress + GreetingHub.HubUrl,
                    opts => opts.HttpMessageHandlerFactory = _ => testServer.CreateHandler())
                .Build();

            string actualName    = null;
            string actualMessage = null;

            connection.On<string, string>(nameof(IGreetingClient.NewGreeting), (name, msg)
                => (actualName, actualMessage) = (name, msg));

            await connection.StartAsync();

            const string name    = "Batman";
            const string message = "Hi from Batman";

            // "Act" must be done this way, as with `new GreetingHub` no clients will be available --> NullRefException
            await connection.InvokeAsync(nameof(GreetingHub.SendGreeting), name, message);

            await connection.StopAsync();

            Assert.Multiple(() =>
            {
                Assert.AreEqual(name   , actualName);
                Assert.AreEqual(message, actualMessage);
            });
        }
    }
}

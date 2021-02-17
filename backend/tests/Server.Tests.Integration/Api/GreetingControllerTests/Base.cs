using System.Net.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using NUnit.Framework;
using Server.Api.Greeting;

namespace Server.Tests.Integration.Api.GreetingControllerTests
{
    [TestFixture]
    public abstract class Base : IntegrationTestBase
    {
        protected HttpClient CreateHttpClient(Mock<IEventDispatcher> eventDispatcherMock = null)
        {
            return _factory.WithWebHostBuilder(builder =>
            {
                var loggerMock = new Mock<AbstractLogger<GreetingController>>();

                builder.ConfigureTestServices(services =>
                {
                    if (eventDispatcherMock != null)
                    {
                        services.AddScoped(_ => eventDispatcherMock.Object);
                    }

                    services.AddScoped(_ => loggerMock.Object);
                });
            })
            .CreateClient();
        }
    }
}

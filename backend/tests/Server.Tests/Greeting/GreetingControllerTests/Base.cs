using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using Server.Api.Greeting;

namespace Server.Tests.Greeting.GreetingControllerTests
{
    [TestFixture]
    public abstract class Base
    {
        protected readonly Mock<ILogger<GreetingController>> _loggerMock = new Mock<ILogger<GreetingController>>();
    }
}

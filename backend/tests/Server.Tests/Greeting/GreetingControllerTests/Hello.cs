using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using Server.Api.Greeting;

namespace Server.Tests.Greeting.GreetingControllerTests
{
    public class Hello : Base
    {
        [Test]
        public async Task Name_given___200()
        {
            var eventMock = new Mock<IEventDispatcher>(MockBehavior.Strict);
            var sut       = new GreetingController(eventMock.Object, _loggerMock.Object);
            var response  = new HelloResponse("test");

            eventMock
                .Setup(e => e.Get(It.IsAny<HelloQuery>(), It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(response))
                .Verifiable();

            ActionResult<HelloResponse> result = await sut.Hello("name");

            eventMock.Verify();
            Assert.Multiple(() =>
            {
                Assert.IsInstanceOf<OkObjectResult>(result.Result);

                OkObjectResult actual = result.Result as OkObjectResult;
                Assert.AreSame(response, actual.Value);
            });
        }
        //---------------------------------------------------------------------
        [Test]
        public async Task Name_is_null___400()
        {
            var sut = new GreetingController(Mock.Of<IEventDispatcher>(MockBehavior.Strict), _loggerMock.Object);

            ActionResult<HelloResponse> result = await sut.Hello(null);

            Assert.Multiple(() =>
            {
                Assert.IsInstanceOf<BadRequestObjectResult>(result.Result);

                BadRequestObjectResult actual = result.Result as BadRequestObjectResult;
                Assert.AreEqual("Value cannot be null. (Parameter 'name')", actual.Value.ToString());
            });
        }
    }
}

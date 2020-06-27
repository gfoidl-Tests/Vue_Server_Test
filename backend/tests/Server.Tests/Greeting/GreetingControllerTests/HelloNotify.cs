using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using Server.Greeting;

namespace Server.Tests.Greeting.GreetingControllerTests
{
    public class HelloNotify : Base
    {
        [Test]
        public async Task Name_given___202()
        {
            var eventMock = new Mock<IEventDispatcher>(MockBehavior.Strict);
            var sut       = new GreetingController(eventMock.Object, _loggerMock.Object);

            eventMock
                .Setup(e => e.Publish(It.IsAny<HelloQuery>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask)
                .Verifiable();

            ActionResult result = await sut.HelloNotify("name");

            eventMock.Verify();
            Assert.Multiple(() =>
            {
                Assert.IsInstanceOf<StatusCodeResult>(result);
                StatusCodeResult statusCodeResult = result as StatusCodeResult;
                Assert.AreEqual(202, statusCodeResult.StatusCode);
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

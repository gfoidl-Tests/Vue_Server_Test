using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Moq;
using NUnit.Framework;
using Server.Api.Greeting;

namespace Server.Tests.Greeting
{
    [TestFixture]
    public class HelloQueryHandlerTests
    {
        [Test]
        public async Task Query_given___correct_response()
        {
            var envMock = new Mock<IWebHostEnvironment>();
            var query   = new HelloQuery("Dummy");
            var sut     = new HelloQueryHandler(envMock.Object);

            envMock
                .Setup(e => e.ApplicationName)
                .Returns("Test")
                .Verifiable();

            HelloResponse response = await sut.Handle(query);

            envMock.Verify();
            Assert.AreEqual("Hello 'Dummy' from Test", response.Message);
        }
    }
}

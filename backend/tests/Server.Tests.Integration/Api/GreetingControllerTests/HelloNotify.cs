using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;
using Server.Greeting;

namespace Server.Tests.Integration.Api.GreetingControllerTests
{
    public class HelloNotify : Base
    {
        [Test]
        public async Task Name_is_null___bad_request_response()
        {
            HttpClient client = this.CreateHttpClient(new Mock<IEventDispatcher>(MockBehavior.Strict));

            HttpResponseMessage httpResponse = await client.PostAsync("/api/greeting/hello-notify", null);

            Assert.Multiple(async () =>
            {
                Assert.Throws<HttpRequestException>(() => httpResponse.EnsureSuccessStatusCode());
                Assert.AreEqual(HttpStatusCode.BadRequest, httpResponse.StatusCode);
                StringAssert.StartsWith("text/plain", httpResponse.Content.Headers.ContentType.ToString());

                string content = await httpResponse.Content.ReadAsStringAsync();
                Assert.AreEqual("Value cannot be null. (Parameter 'name')", content);
            });
        }
        //---------------------------------------------------------------------
        [Test]
        public async Task Name_is_not_null___OK_response()
        {
            var eventMock = new Mock<IEventDispatcher>(MockBehavior.Strict);

            eventMock
                .Setup(e => e.Publish(It.IsAny<HelloQuery>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask)
                .Verifiable();

            HttpClient client = this.CreateHttpClient(eventMock);

            HttpResponseMessage httpResponse = await client.PostAsync("/api/greeting/hello-notify?name=tester", null);

            Assert.Multiple(() =>
            {
                Assert.DoesNotThrow(() => httpResponse.EnsureSuccessStatusCode());
                Assert.AreEqual(HttpStatusCode.Accepted, httpResponse.StatusCode);
            });
        }
    }
}

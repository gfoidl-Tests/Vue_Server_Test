using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;
using Server.Api.Greeting;

namespace Server.Tests.Integration.Api.GreetingControllerTests
{
    public class Hello : Base
    {
        [Test]
        public async Task Name_is_null___bad_request_response()
        {
            HttpClient client = this.CreateHttpClient(new Mock<IEventDispatcher>(MockBehavior.Strict));

            HttpResponseMessage httpResponse = await client.GetAsync("/api/greeting/hello");

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
            var response  = new HelloResponse("test");

            eventMock
                .Setup(e => e.Get(It.IsAny<HelloQuery>(), It.IsAny<CancellationToken>()))
                .Returns(Task.FromResult(response))
                .Verifiable();

            HttpClient client = this.CreateHttpClient(eventMock);

            HttpResponseMessage httpResponse = await client.GetAsync("/api/greeting/hello?name=tester");

            Assert.Multiple(async () =>
            {
                Assert.DoesNotThrow(() => httpResponse.EnsureSuccessStatusCode());
                Assert.AreEqual(HttpStatusCode.OK, httpResponse.StatusCode);
                StringAssert.StartsWith("application/json", httpResponse.Content.Headers.ContentType.ToString());

                HelloResponse actual = await httpResponse.Content.ReadFromJsonAsync<HelloResponse>();

                Assert.AreEqual(response.Message, actual.Message);
            });
        }
    }
}

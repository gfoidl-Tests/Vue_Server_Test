using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using NUnit.Framework;

namespace Server.Tests.Integration
{
    public class FunctionalTest : IntegrationTestBase
    {
        [Test]
        public async Task Swagger_is_up_and_responds()
        {
            HttpClient client = _factory.CreateClient();

            HttpResponseMessage httpResponse = await client.GetAsync("/swagger/v1/swagger.json");

            Assert.Multiple(() =>
            {
                Assert.DoesNotThrow(() => httpResponse.EnsureSuccessStatusCode());
                Assert.AreEqual(HttpStatusCode.OK, httpResponse.StatusCode);
                StringAssert.StartsWith("application/json", httpResponse.Content.Headers.ContentType.ToString());
            });
        }
        //---------------------------------------------------------------------
        [Test]
        public async Task SwaggerUI_is_up_and_responds()
        {
            HttpClient client = _factory.CreateClient();

            HttpResponseMessage httpResponse = await client.GetAsync("/swagger");

            Assert.Multiple(() =>
            {
                Assert.DoesNotThrow(() => httpResponse.EnsureSuccessStatusCode());
                Assert.AreEqual(HttpStatusCode.OK, httpResponse.StatusCode);
                StringAssert.StartsWith("text/html", httpResponse.Content.Headers.ContentType.ToString());
            });
        }
    }
}

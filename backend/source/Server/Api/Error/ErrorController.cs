using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Server.Api.Error
{
    public class ErrorController : ApiController
    {
        public ErrorController(IEventDispatcher eventDispatcher, ILogger<ErrorController> logger)
            : base(eventDispatcher, logger)
        { }
        //---------------------------------------------------------------------
        [HttpGet("/error")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        public IActionResult Error() => this.Problem();
        //---------------------------------------------------------------------
        [HttpPost("client")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        public Task ClientError(ClientErrorCommand clientErrorCommand) => _eventDispatcher.Send(clientErrorCommand);
    }
}

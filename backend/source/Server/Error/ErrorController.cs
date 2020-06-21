using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Server.Error
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
        public Task ClientError(ClientErrorRequest request) => _eventDispatcher.Handle(request);
    }
}

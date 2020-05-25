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
        public IActionResult Error() => this.Problem();
        //---------------------------------------------------------------------
        [HttpPost("client")]
        public Task ClientError(ClientErrorRequest request)
        {
            return _eventDispatcher.Handle(request);
        }
    }
}

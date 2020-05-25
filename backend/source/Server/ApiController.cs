using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Server
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class ApiController : ControllerBase
    {
        protected readonly IEventDispatcher _eventDispatcher;
        protected readonly ILogger          _logger;
        //---------------------------------------------------------------------
        // ASP.NET Core's DI takes care of not-null in the ctor-args.
        protected ApiController(IEventDispatcher eventDispatcher, ILogger logger)
        {
            _eventDispatcher = eventDispatcher;
            _logger          = logger;
        }
    }
}

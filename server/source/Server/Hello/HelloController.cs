using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;

namespace Server.Hello
{
    public class HelloController : ApiController
    {
        public HelloController(IEventDispatcher eventDispatcher, ILogger<HelloController> logger)
            : base(eventDispatcher, logger)
        { }
        //---------------------------------------------------------------------
        [HttpGet]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        public async Task<ActionResult<HelloResponse>> Hello(string? name, CancellationToken cancellationToken = default)
        {
            HttpContext? httpContext = this.HttpContext;
            if (httpContext != null)
            {
                _logger.LogTrace("Connection id: {ConnectionId}", httpContext.Connection.Id);
            }

            try
            {
                var query = new HelloQuery(name);
                return this.Ok(await _eventDispatcher.Get(query, cancellationToken));
            }
            catch (ArgumentNullException e)
            {
                return this.BadRequest(e.Message);
            }
        }
    }
}

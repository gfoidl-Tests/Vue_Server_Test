using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;

namespace Server.Greeting
{
    public class GreetingController : ApiController
    {
        public GreetingController(IEventDispatcher eventDispatcher, ILogger<GreetingController> logger)
            : base(eventDispatcher, logger)
        { }
        //---------------------------------------------------------------------
        [HttpGet("hello")]
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
                var query              = new HelloQuery(name);
                HelloResponse response = await _eventDispatcher.Get(query, cancellationToken);
                response.ConnectionId  = httpContext?.Connection.Id;

                return this.Ok(response);
            }
            catch (ArgumentNullException e)
            {
                return this.BadRequest(e.Message);
            }
        }
    }
}

using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Server.Hello
{
    public class HelloController : ApiController
    {
        public HelloController(IEventDispatcher eventDispatcher, ILogger<HelloController> logger)
            : base(eventDispatcher, logger)
        { }
        //---------------------------------------------------------------------
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<HelloResponse>> Hello(string? name, CancellationToken cancellationToken)
        {
            var httpContext = this.HttpContext;
            _logger.LogTrace("Connection id: {ConnectionId}", httpContext.Connection.Id);

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

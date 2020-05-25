using Microsoft.AspNetCore.Mvc;

namespace Server
{
    [ApiController]
    public class ErrorController : ControllerBase
    {
        [HttpGet("/error")]
        public IActionResult Error() => this.Problem();
    }
}

using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace Server.Hello
{
    public sealed class HelloQueryHandler : IQueryHandler<HelloQuery, HelloResponse>
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        //---------------------------------------------------------------------
        public HelloQueryHandler(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }
        //---------------------------------------------------------------------
        public Task<HelloResponse> Handle(HelloQuery request, CancellationToken cancellationToken = default)
        {
            string msg   = $"Hello '{request.Name}' from {_webHostEnvironment.ApplicationName}";
            var response = new HelloResponse(msg);

            return Task.FromResult(response);
        }
    }
}

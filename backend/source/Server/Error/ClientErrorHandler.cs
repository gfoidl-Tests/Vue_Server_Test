using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Server.Error
{
    public class ClientErrorHandler : IRequestHandler<ClientErrorRequest>
    {
        private readonly ILogger _logger;
        //---------------------------------------------------------------------
        public ClientErrorHandler(ILogger<ClientErrorHandler> logger)
        {
            _logger = logger;
        }
        //---------------------------------------------------------------------
        public Task<Unit> Handle(ClientErrorRequest request, CancellationToken cancellationToken)
        {
            string json = JsonSerializer.Serialize(request, new JsonSerializerOptions
            {
#if DEBUG
                WriteIndented = true
#endif
            });

            _logger.LogError("Client error: {error}", json);
            return Unit.Task;
        }
    }
}

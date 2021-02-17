using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Server.Api.Error
{
    public record ClientErrorCommand(
        string Message,
        string? Stack,
        object? Data,
        string Handler)
        : ICommand<Unit>;
    //---------------------------------------------------------------------
    public class ClientErrorHandler : ICommandHandler<ClientErrorCommand, Unit>
    {
        private readonly ILogger _logger;
        //---------------------------------------------------------------------
        public ClientErrorHandler(ILogger<ClientErrorHandler> logger)
        {
            _logger = logger;
        }
        //---------------------------------------------------------------------
        public Task<Unit> Handle(ClientErrorCommand clientErrorCommand, CancellationToken cancellationToken)
        {
            string json = JsonSerializer.Serialize(clientErrorCommand, new JsonSerializerOptions
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

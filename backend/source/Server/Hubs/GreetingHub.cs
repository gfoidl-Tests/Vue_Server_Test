using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Server.Hubs
{
    public class GreetingHub : Hub<IGreetingClient>
    {
        public const string HubUrl = "hubs/greeting";
        //---------------------------------------------------------------------
        private readonly ILogger _logger;
        //---------------------------------------------------------------------
        public GreetingHub(ILogger<GreetingHub> logger)
        {
            _logger = logger;
        }
        //---------------------------------------------------------------------
        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation("Client {Client} connected", this.Context.ConnectionId);
            await base.OnConnectedAsync();
        }
        //---------------------------------------------------------------------
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _logger.LogInformation("Client {Client} disconnected", this.Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
        //---------------------------------------------------------------------
        public async Task SendGreeting(string name, string message)
        {
            await this.Clients.All.NewGreeting(name, message);
        }
    }
}

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Server.Hubs;

namespace Server.Api.Greeting
{
    public class HelloNotificationHandler : INotificationHandler<HelloQuery>
    {
        private readonly IHubContext<GreetingHub, IGreetingClient> _hubContext;
        //---------------------------------------------------------------------
        public HelloNotificationHandler(IHubContext<GreetingHub, IGreetingClient> hubContext)
        {
            _hubContext = hubContext;
        }
        //---------------------------------------------------------------------
        public async Task Handle(HelloQuery notification, CancellationToken cancellationToken = default)
        {
            string msg = $"Hello '{notification.Name}' from SignalR";
            await _hubContext.Clients.All.NewGreeting(notification.Name, msg);
        }
    }
}

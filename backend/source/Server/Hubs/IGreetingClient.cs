using System.Threading.Tasks;

namespace Server.Hubs
{
    public interface IGreetingClient
    {
        Task NewGreeting(string name, string message);
    }
}

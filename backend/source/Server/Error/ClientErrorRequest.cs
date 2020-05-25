using MediatR;

namespace Server.Error
{
    public class ClientErrorRequest : IRequest
    {
        public string Message { get; set; } = null!;
        public string? Stack  { get; set; }
        public object? Data   { get; set; }
        public string Handler { get; set; } = null!;
    }
}

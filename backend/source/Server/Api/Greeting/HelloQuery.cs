using System;
using MediatR;

namespace Server.Api.Greeting
{
    public class HelloQuery : IQuery<HelloResponse>, INotification
    {
        public string Name { get; }
        //---------------------------------------------------------------------
        public HelloQuery(string? name)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
        }
    }
}

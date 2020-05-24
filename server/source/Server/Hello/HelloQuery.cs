using System;

namespace Server.Hello
{
    public readonly struct HelloQuery : IQuery<HelloResponse>
    {
        public string Name { get; }
        //---------------------------------------------------------------------
        public HelloQuery(string? name)
        {
            this.Name = name ?? throw new ArgumentNullException(nameof(name));
        }
    }
}

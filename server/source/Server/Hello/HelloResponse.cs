using System;

namespace Server.Hello
{
    // To make this a struct doesn't bear an advantage, as MVC's return needs an
    // object, so it would get boxed.
    public class HelloResponse
    {
        public string Message { get; }
        public int ThreadId   { get; }
        //---------------------------------------------------------------------
        public HelloResponse(string? message)
        {
            this.Message  = message ?? throw new ArgumentNullException(nameof(message));
            this.ThreadId = Environment.CurrentManagedThreadId;
        }
    }
}

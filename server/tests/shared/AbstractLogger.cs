using System;
using System.Diagnostics;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace Server.Tests
{
    [DebuggerNonUserCode]
    public abstract class AbstractLogger<T> : ILogger<T>
    {
        public IDisposable BeginScope<TState>(TState state) => Mock.Of<IDisposable>();
        public bool IsEnabled(LogLevel logLevel)            => true;
        //---------------------------------------------------------------------
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            string msg = formatter(state, exception);
            this.Log(logLevel, exception, msg);

            TestContext.WriteLine(msg);
        }
        //---------------------------------------------------------------------
        public abstract void Log(LogLevel logLevel, Exception ex, string msg);
    }
}

using System;
using Microsoft.AspNetCore.Mvc.Testing;
using NUnit.Framework;

namespace Server.Tests.Integration
{
    [TestFixture]
    public abstract class IntegrationTestBase : IDisposable     // as of NUnit 3.x NUnit will dispose it
    {
        protected readonly WebApplicationFactory<Startup> _factory = new WebApplicationFactory<Startup>();
        //---------------------------------------------------------------------
        public void Dispose() => _factory.Dispose();
    }
}

using System;
using NUnit.Framework;
using Server.Api.Greeting;

namespace Server.Tests.Greeting
{
    [TestFixture]
    public class HelloQueryTests
    {
        [Test]
        public void Ctor_name_is_null___throws_new_ANE()
        {
            Assert.Throws<ArgumentNullException>(() => new HelloQuery(null));
        }
        //---------------------------------------------------------------------
        [Test]
        public void Ctor_name_is_not_null___property_set()
        {
            string name = Guid.NewGuid().ToString();

            var sut = new HelloQuery(name);

            Assert.AreEqual(name, sut.Name);
        }
    }
}

using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Server
{
    public static class Program
    {
        public static async Task Main(string[] args)
        {
            await CreateHostBuilder(args).Build().RunAsync();
            Log.CloseAndFlush();
        }
        //---------------------------------------------------------------------
        public static IHostBuilder CreateHostBuilder(string[] args)
            => Host.CreateDefaultBuilder(args)
                   .ConfigureWebHostDefaults(webBuilder =>
                   {
                       webBuilder.UseStartup<Startup>();
                   })
                   .UseSerilog((hostingContext, loggerConfiguration) =>
                   {
                       SerilogHelper.Setup(loggerConfiguration, hostingContext.Configuration);
                   });
    }
}

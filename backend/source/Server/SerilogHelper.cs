using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Formatting.Json;

namespace Server
{
    internal static class SerilogHelper
    {
        private const string OutputTemplate = "{Timestamp:yyyy-MM-dd HH:mm:ss.ff} [{Level:u3}] {Scope:l} {Message:lj}{NewLine}{Exception}";
        //---------------------------------------------------------------------
        public static void Setup(LoggerConfiguration loggerConfiguration, IConfiguration config)
        {
            loggerConfiguration
                .WriteTo.Console(outputTemplate: OutputTemplate)
                .WriteTo.File("logs/log.txt", buffered: true)
                .WriteTo.File(new JsonFormatter(closingDelimiter: ",", renderMessage: true), "logs/log.json", buffered: true)
                .ReadFrom.Configuration(config.GetSection("Logging"));  // add here, so code-config values can be overwritten
        }
    }
}

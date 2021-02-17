using System;
using System.Diagnostics;
using System.Reflection;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using Server.Hubs;

namespace Server
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        //---------------------------------------------------------------------
        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }
        //---------------------------------------------------------------------
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title   = "Server",
                    Contact = new OpenApiContact
                    {
                        Name = "gfoidl",
                        Url  = new Uri("https://github.com/gfoidl")
                    },
                    Description = "Demo for Client/Server"
                });
            });

            services.AddMediatR(typeof(Startup).Assembly);
            services.AddScoped<IEventDispatcher, MediatorDispatcher>();
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(MediatRBehavior<,>));

            services.AddSignalR();
            services.AddHealthChecks();
        }
        //---------------------------------------------------------------------
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
                app.UseHttpsRedirection();
                app.UseHsts();
            }

            app.UseSerilogRequestLogging(options =>
            {
                options.GetLevel = (httpContext, elapsed, ex) =>
                {
                    bool isSignalR = httpContext.WebSockets.IsWebSocketRequest;

                    if (ex != null)                    return LogEventLevel.Error;
                    if (elapsed > 1_000 && !isSignalR) return LogEventLevel.Warning;
                    return LogEventLevel.Debug;
                };

                options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
                {
                    diagnosticContext.Set("RequestHost"  , httpContext.Request.Host.Value);
                    diagnosticContext.Set("Client-IP"    , httpContext.Connection.RemoteIpAddress);
                    diagnosticContext.Set("Connection-ID", httpContext.Connection.Id);
                };
            });

            var defaultFileOptions = new DefaultFilesOptions();
            defaultFileOptions.DefaultFileNames.Clear();
            defaultFileOptions.DefaultFileNames.Add("index.html");

            app.UseDefaultFiles(defaultFileOptions);
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = context =>
                {
                    if (context.File.Name == "index.html")
                    {
                        context.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
                        context.Context.Response.Headers.Add("Expires", "-1");
                    }
                }
            });

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Server");
            });

            app.UseRouting();

            if (env.IsDevelopment())
            {
                app.UseCors(policy => policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    //.AllowCredentials()   // on client (axios) the same must be set
                    .WithOrigins("http://localhost:8080"));
            }

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<GreetingHub>(GreetingHub.HubUrl);
                endpoints.MapHealthChecks("/health");
                endpoints.Map("/proc-info", HandleProcInfo);

                // When there is no reverse proxy before kestrel, then this is the 
                // SPA catch all route.
                // When there is a reverse proxy (i.e. IIS) before kestrel, then 
                // this route shouldn't be hit.
                endpoints.MapFallbackToFile("index.html");
            });
        }
        //---------------------------------------------------------------------
        private static async Task HandleProcInfo(HttpContext context)
        {
            string msg = $@"
ProcessName   : {Process.GetCurrentProcess().ProcessName}
MainModule    : {Process.GetCurrentProcess().MainModule?.ModuleName ?? "-"}
MainModuleFile: {Process.GetCurrentProcess().MainModule?.FileName ?? "-"}
EntryPoint    : {Assembly.GetEntryAssembly()?.FullName ?? "-"}";

            await context.Response.WriteAsync(msg);
        }
    }
}

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

            app.UseStaticFiles();

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

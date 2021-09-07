using Autofac;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using Shiptech.Common.Middlewares;
using Shiptech.Core;
using Shiptech.Negotiation.Domain.Data.EfCore;
using System.IdentityModel.Tokens.Jwt;

namespace Shiptech.Negotiation.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {            
            // Setting configuration for protected web api
            JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddMicrosoftIdentityWebApi(Configuration.GetSection("AzureAd"))
                    .EnableTokenAcquisitionToCallDownstreamApi()
                    .AddInMemoryTokenCaches();
         
            services.AddCors();
            
            services.AddScoped<ITenantInfoService, TenantInfoService>();
            services.AddTransient<TenantInfoMiddleware>();
            services.AddMemoryCache();
            services.AddHttpContextAccessor();
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Shiptech.Negotiation.Api", Version = "v1" });
            });
            services.AddDbContext<NegotiationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Shiptech.Negotiation.Api v1"));
            }
            
            app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseHttpsRedirection();
            
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseMiddleware<TenantInfoMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.RegisterModule<Negotiation.Domain.Module>();
            builder.RegisterModule<Shiptech.Common.Module>();
        }
    }
}

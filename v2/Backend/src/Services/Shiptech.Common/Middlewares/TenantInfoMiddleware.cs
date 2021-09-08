using Inatech.Shared.Infrastructure.Tenant;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Shiptech.Core;
using Shiptech.Common.Extensions;
using Microsoft.Extensions.Primitives;
using System.Linq;
using System.Security.Claims;
using System.Data.SqlClient;
using Dapper;
using Shiptech.Common.Dtos;
using System;

namespace Shiptech.Common.Middlewares
{
    public class TenantInfoMiddleware : IMiddleware
    {
        private readonly ITenantInfoService _tenantInfoService;        
        private IConfiguration Configuration { get; }

        /// <summary>
        /// The select by upn
        /// </summary>
        private const string SelectByUPN = @"SELECT Id,Name FROM admin.Users WHERE UPPER(UserName) = UPPER(@UPN)";
        public TenantInfoMiddleware(ITenantInfoService tenantInfoService, IConfiguration configuration)
        {
            _tenantInfoService = tenantInfoService;
            Configuration = configuration;            
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            string originUrl = GetOrigin(context?.Request?.Headers); // get the URL from header Origin
            TenantUserSettings tenantInfo = await _tenantInfoService.GetTenantInfo(originUrl, Configuration.GetConnectionString("PrimeDbConnection"));

            var isEnableAuth = Configuration.GetValue<bool>("EnableAuth");
            tenantInfo.UserId = GetUserId(tenantInfo.ConnectionString, context.User, isEnableAuth);
            context.AddTenantInfoToContext(tenantInfo);
            await next(context);            
        }

        private static string GetOrigin(IHeaderDictionary requestHeaders)
        {
            string originAsString = string.Empty;
            if (requestHeaders.TryGetValue("Origin", out StringValues originHeaderValues))
            {
                originAsString = originHeaderValues.FirstOrDefault();
            }

            return originAsString ?? string.Empty;
        }

        public static long GetUserId(string connectionString, ClaimsPrincipal claimsPrincipal, bool isEnableAuth)
        {
            //#if DEBUG
            //return 1L;
            //#endif

            long nonExistentUserId = long.MinValue;
            if (isEnableAuth)
            {
                if (!claimsPrincipal.Identity.IsAuthenticated)
                {
                    return nonExistentUserId;
                }

                IdNameDto user;
                string upn = claimsPrincipal.Claims.FirstOrDefault(c => c.Type == "upn").Value;
                using (var connection = new SqlConnection(connectionString))
                {
                    user = connection.QueryFirstOrDefault<IdNameDto>(SelectByUPN, new
                    {
                        UPN = upn,
                    });
                }
                if (user == null)
                {
                    return nonExistentUserId;
                }

                return Convert.ToInt64(user.Id);
            }
            else
            {
                return 1;
            }
        }

    }
}

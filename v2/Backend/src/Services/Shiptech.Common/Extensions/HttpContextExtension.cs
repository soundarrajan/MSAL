using Inatech.Shared.Infrastructure.Tenant;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shiptech.Common.Extensions
{
    public static class HttpContextExtension
    {
        public static TenantUserSettings GetTenantInfoFromContext(this HttpContext context)
        {
            if (context.Items.TryGetValue("Tenant", out object originHeaderValues))
            {
                return (TenantUserSettings)originHeaderValues;
            }
            return null;
        }

        public static void AddTenantInfoToContext(this HttpContext context, TenantUserSettings tenantInfo)
        {
            context.Items.Add("Tenant", tenantInfo);
        }
    }
}

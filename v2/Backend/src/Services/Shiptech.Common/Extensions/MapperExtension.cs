using Inatech.Shared.Infrastructure.Cqs;
using Inatech.Shared.Infrastructure.Tenant;
using Microsoft.AspNetCore.Http;
using Shiptech.Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shiptech.Common.Extensions
{
    public static class MapperExtensions
    {
        public static T ForUserTenant<T>(this T request, TenantUserSettings tenantInfo) where T : IBaseRequest
        {
            if (request == null)
                return default;

            request.TenantId = tenantInfo.TenantId;
            request.UserId = tenantInfo.UserId;

            return request;
        }

        public static TDomainRequest ToDomain<TDomainRequest>(this BaseRequestDto dto,
            TenantUserSettings tenantInfo, Action<TDomainRequest> configure = null)
            where TDomainRequest : BaseRequest, new()
        {
            var domainRequest = new TDomainRequest();
            if (dto == null)
                return default;

            domainRequest.ForUserTenant(tenantInfo);

            configure?.Invoke(domainRequest);

            return domainRequest;
        }

    }
}

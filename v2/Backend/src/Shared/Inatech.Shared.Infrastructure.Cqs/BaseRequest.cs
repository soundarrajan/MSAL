using System;

namespace Inatech.Shared.Infrastructure.Cqs
{
    public interface IBaseRequest
    {
        int TenantId { get; set; }
        long UserId { get; set; }
    }

    public abstract class BaseRequest : IBaseRequest
    {
        protected BaseRequest()
        {

        }

        protected BaseRequest(int tenantId, long userId)
        {
            TenantId = tenantId;
            UserId = userId;
        }

        public int TenantId { get; set; }

        public long UserId { get; set; }

        public Guid TenantGuid { get; set; }
    }
}
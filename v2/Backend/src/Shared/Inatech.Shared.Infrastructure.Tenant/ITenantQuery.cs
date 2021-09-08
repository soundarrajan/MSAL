using Inatech.Shared.Infrastructure.Cqs;
using System.Data;

namespace Inatech.Shared.Infrastructure.Tenant
{
    public interface ITenantQuery<out TQuery> where TQuery : IQuery
    {
        TQuery Create(int tenantId);

        TQuery Create(IDbTransaction transaction);
    }
}
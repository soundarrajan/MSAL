using Inatech.Shared.Infrastructure.Cqs;
using System.Data;

namespace Inatech.Shared.Infrastructure.Tenant
{
    public interface ITenantCommand<out TCommand> where TCommand : ITransactionalCommand
    {
        TCommand Create(int tenantId);

        TCommand Create(IDbTransaction transaction);
    }
}
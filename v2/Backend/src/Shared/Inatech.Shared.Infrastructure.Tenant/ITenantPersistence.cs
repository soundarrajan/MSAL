using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;

namespace Inatech.Shared.Infrastructure.Tenant
{
    public interface ITenantPersistence
    {
        Task<TReturn> TransactionAsync<TReturn>(int tenantId, Func<IDbTransaction, Task<TReturn>> body);

        Task<TReturn> TransactionAsync<TReturn>(int tenantId, Func<IDbTransaction, CancellationToken, Task<TReturn>> body, CancellationToken cancellationToken);

        Task TransactionAsync(int tenantId, Func<IDbTransaction, Task> body);

        Task TransactionAsync(int tenantId, Func<IDbTransaction, CancellationToken, Task> body, CancellationToken cancellationToken);
    }
}
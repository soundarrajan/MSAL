using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;

namespace Inatech.Shared.Infrastructure.Tenant
{
    public class TenantPersistence : ITenantPersistence
    {
        private readonly ITenantSettingsService _settingsService;

        public TenantPersistence(ITenantSettingsService settingsService)
        {
            this._settingsService = settingsService;
        }

        public virtual Task<TReturn> TransactionAsync<TReturn>(int tenantId, Func<IDbTransaction, Task<TReturn>> body)
        {
            return TransactionAsync(tenantId, async (transaction, token) => await body(transaction), CancellationToken.None);
        }

        public virtual async Task<TReturn> TransactionAsync<TReturn>(int tenantId, Func<IDbTransaction, CancellationToken, Task<TReturn>> body, CancellationToken cancellationToken)
        {
            TenantUserSettings settings = _settingsService.Get(tenantId);

            //TODO: test if settings is not null

            cancellationToken.ThrowIfCancellationRequested();

            using SqlConnection connection = new SqlConnection(settings.ConnectionString);
            await connection.OpenAsync(cancellationToken);

            cancellationToken.ThrowIfCancellationRequested();

            using SqlTransaction transaction = connection.BeginTransaction();
            cancellationToken.ThrowIfCancellationRequested();

            var @return = await body.Invoke(transaction, cancellationToken);

            transaction.Commit();

            return @return;
        }

        public virtual Task TransactionAsync(int tenantId, Func<IDbTransaction, Task> body)
        {
            return TransactionAsync(tenantId, async (transaction, token) => await body(transaction), CancellationToken.None);
        }

        public virtual Task TransactionAsync(int tenantId, Func<IDbTransaction, CancellationToken, Task> body, CancellationToken cancellationToken)
        {
            return TransactionAsync<object>(tenantId, async (trans, token) =>
            {
                await body(trans, token);

                return null;
            }, cancellationToken);
        }
    }
}
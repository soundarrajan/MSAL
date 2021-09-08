using Autofac;
using Autofac.Core;
using Inatech.Shared.Infrastructure.Cqs;
using System.Data;

namespace Inatech.Shared.Infrastructure.Tenant
{
    public class TenantQueryFactory<TQuery> : ITenantQuery<TQuery> where TQuery : IQuery
    {
        private readonly ITenantSettingsService tenantSettingsService;
        private readonly ILifetimeScope container;

        public TenantQueryFactory(ITenantSettingsService tenantSettingsService, ILifetimeScope container)
        {
            this.tenantSettingsService = tenantSettingsService;
            this.container = container;
        }

        public TQuery Create(int tenantId)
        {
            var tenantSettings = tenantSettingsService.Get(tenantId);
            return container.Resolve<TQuery>(new NamedPropertyParameter(nameof(ITransactionalQuery.ConnectionString),
                tenantSettings.ConnectionString));
        }

        public TQuery Create(IDbTransaction transaction)
        {
            return container.Resolve<TQuery>(new NamedPropertyParameter(nameof(ITransactionalQuery.Transaction), transaction));
        }
    }
}
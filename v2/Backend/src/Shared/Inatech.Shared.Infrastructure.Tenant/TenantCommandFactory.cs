using Autofac;
using Autofac.Core;
using Inatech.Shared.Infrastructure.Cqs;
using System.Data;

namespace Inatech.Shared.Infrastructure.Tenant
{
    public class TenantCommandFactory<TCommand> : ITenantCommand<TCommand> where TCommand : ITransactionalCommand
    {
        private readonly ITenantSettingsService _tenantSettingsService;
        private readonly ILifetimeScope _lifetimeScope;

        public TenantCommandFactory(ITenantSettingsService tenantSettingsService, ILifetimeScope lifetimeScope)
        {
            _tenantSettingsService = tenantSettingsService;
            _lifetimeScope = lifetimeScope;
        }

        public TCommand Create(int tenantId)
        {
            using (_lifetimeScope.BeginLifetimeScope())
            {
                var tenantSettings = _tenantSettingsService.Get(tenantId);
                return _lifetimeScope.Resolve<TCommand>(new NamedPropertyParameter(nameof(ITransactionalCommand.ConnectionString),
                    tenantSettings.ConnectionString));
            }
        }

        public TCommand Create(IDbTransaction transaction)
        {
            using (_lifetimeScope.BeginLifetimeScope())
            {
                return _lifetimeScope.Resolve<TCommand>(new NamedPropertyParameter(nameof(ITransactionalCommand.Transaction), transaction));
            }
        }
    }
}
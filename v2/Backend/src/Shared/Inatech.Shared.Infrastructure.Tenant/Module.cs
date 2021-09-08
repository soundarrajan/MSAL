using Autofac;

namespace Inatech.Shared.Infrastructure.Tenant
{
    public class Module : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType(typeof(TenantSettingsService)).As(typeof(ITenantSettingsService)).SingleInstance();

            builder.RegisterType(typeof(TenantPersistence)).As(typeof(ITenantPersistence)).SingleInstance();

            builder.RegisterGeneric(typeof(TenantQueryFactory<>)).As(typeof(ITenantQuery<>)).SingleInstance();

            builder.RegisterGeneric(typeof(TenantCommandFactory<>)).As(typeof(ITenantCommand<>)).SingleInstance();

            builder.RegisterGeneric(typeof(TenantQueryFactory<>)).As(typeof(ITenantQuery<>)).SingleInstance();
        }
    }
}
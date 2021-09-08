using Autofac;
using System;

namespace Shiptech.Negotiation.Domain
{
    public class Module : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterModule(new Inatech.Shared.Infrastructure.Cqs.Module(ThisAssembly));
            builder.RegisterModule(new Inatech.Shared.Infrastrucure.MediatR.Module(ThisAssembly));

            builder.RegisterModule<Inatech.Shared.Infrastructure.Tenant.Module>();
        }
    }
}

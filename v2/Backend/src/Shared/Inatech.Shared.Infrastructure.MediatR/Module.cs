using Autofac;
using MediatR;
using System;
using System.Reflection;

namespace Inatech.Shared.Infrastrucure.MediatR
{
    public class Module : Autofac.Module
    {
        private readonly Assembly _assembly;

        public Module(Assembly assembly)
        {
            _assembly = assembly ?? throw new ArgumentNullException(nameof(assembly));
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder
                .RegisterType<Mediator>()
                .As<IMediator>()
                .InstancePerLifetimeScope();

            builder
                .Register<ServiceFactory>(context =>
                {
                    var ctx = context.Resolve<IComponentContext>();
                    return t =>
                    {
                        var a = ctx.TryResolve(t, out object o) ? o : null;
                        return a;
                    };
                })
                .InstancePerLifetimeScope();

            builder
                .RegisterAssemblyTypes(_assembly)
                .AsClosedTypesOf(typeof(IRequestHandler<,>))
                .InstancePerDependency();

            builder
                .RegisterAssemblyTypes(_assembly)
                .AsClosedTypesOf(typeof(INotificationHandler<>))
                .InstancePerDependency();
        }
    }
}

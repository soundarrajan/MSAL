using Autofac;
using System.Reflection;

namespace Inatech.Shared.Infrastructure.Cqs
{
    public class Module : Autofac.Module
    {
        private readonly Assembly _queryCommandsAssembly;

        public Module(Assembly queryCommandsAssembly)
        {
            _queryCommandsAssembly = queryCommandsAssembly;
        }

        protected override void Load(ContainerBuilder builder)
        {
            // Note: ICommand and IQuery are stateful
            builder
                .RegisterAssemblyTypes(_queryCommandsAssembly)
                .Where(t => t.IsAssignableTo<ICommand>() || t.IsAssignableTo<IQuery>())
                .PropertiesAutowired()
                .AsImplementedInterfaces();
        }
    }
}
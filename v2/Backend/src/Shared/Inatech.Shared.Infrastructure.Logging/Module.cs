using Autofac;
using Microsoft.Extensions.Logging;
using Serilog;
using ILogger = Serilog.ILogger;

namespace Inatech.Shared.Infrastructure.Logging
{
    public class Module : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.Register(c => Log.Logger).As<ILogger>();
            builder.Register(c => GlobalLog.Logger).As<Microsoft.Extensions.Logging.ILogger>();

            builder.Register(c => new SerilogLoggerFactory(Log.Logger, true)).As<ILoggerFactory>();
        }
    }
}
using ILogger = Microsoft.Extensions.Logging.ILogger;

namespace Inatech.Shared.Infrastructure.Logging
{
    public static class GlobalLog
    {
        private static ILogger _logger;

        public static ILogger Logger
        {
            get => _logger = (_logger ??= SetSerilog(new SerilogBuilder().Build()));
            set => _logger = value;
        }

        public static ILogger SetSerilog(Serilog.ILogger logger)
        {
            _logger = new SerilogLoggerFactory(logger, true).CreateLogger(nameof(GlobalLog));

            return _logger;
        }
    }
}
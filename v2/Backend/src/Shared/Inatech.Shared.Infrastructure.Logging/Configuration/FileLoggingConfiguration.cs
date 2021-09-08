using Serilog;
using Serilog.Core;
using Serilog.Events;
using System;

namespace Inatech.Shared.Infrastructure.Logging.Configuration
{
    public class FileLoggingConfiguration
    {
        public string Path { get; set; } = "trace.log";
        public LogEventLevel RestrictedToMinimumLevel { get; set; } = LogEventLevel.Verbose;
        public string OutputTemplate { get; set; } = "{CorrelationId} {Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}";
        public long? FileSizeLimitBytes { get; set; } = 1073741824;
        public LoggingLevelSwitch LevelSwitch { get; set; } = null;
        public bool Buffered { get; set; } = false;
        public bool Shared { get; set; } = false;
        public TimeSpan? FlushToDiskInterval { get; set; }
        public RollingInterval RollingInterval { get; set; } = RollingInterval.Infinite;
        public bool RollOnFileSizeLimit { get; set; } = false;
        public int? RetainedFileCountLimit { get; set; } = 31;
    }
}
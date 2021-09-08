using Serilog.Core;
using Serilog.Events;
using System;

namespace Inatech.Shared.Infrastructure.Logging.Configuration
{
    public class SeqLoggingConfiguration
    {
        public string ServerUrl { get; set; } = "http://bvtapp1.inatech.com:82/";
        public LogEventLevel RestrictedToMinimumLevel { get; set; } = LogEventLevel.Verbose;
        public int BatchPostingLimit { get; set; } = 1000;
        public TimeSpan? Period { get; set; }
        public string ApiKey { get; set; }
        public string BufferBaseFilename { get; set; }
        public long? BufferSizeLimitBytes { get; set; }
        public long? EventBodyLimitBytes { get; set; } = 262144;
        public LoggingLevelSwitch ControlLevelSwitch { get; set; }
        public long? RetainedInvalidPayloadsLimitBytes { get; set; }
        public bool Compact { get; set; } = false;
        public int QueueSizeLimit { get; set; } = 100000;
    }
}
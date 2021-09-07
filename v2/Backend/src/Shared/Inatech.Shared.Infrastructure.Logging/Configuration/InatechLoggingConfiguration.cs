namespace Inatech.Shared.Infrastructure.Logging.Configuration
{
    public class InatechLoggingConfiguration
    {
        public bool WriteToApplicationInsights { get; set; } = true;
        public bool WriteToSeq { get; set; } = false;
        public bool WriteToColoredConsole { get; set; } = false;
        public bool WriteToFile { get; set; } = true;
    }
}
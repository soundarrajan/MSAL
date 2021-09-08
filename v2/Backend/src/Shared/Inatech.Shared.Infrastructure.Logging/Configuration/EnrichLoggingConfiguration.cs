namespace Inatech.Shared.Infrastructure.Logging.Configuration
{
    public class EnrichLoggingConfiguration
    {
        public string EnvName { get; set; }
        public string Build { get; set; }
        public string Release { get; set; }
        public string Branch { get; set; }
        public string Commit { get; set; }
        public string BuiltBy { get; set; }
        public string ReleaseName { get; set; }
        public string ReleaseBy { get; set; }
        public string VstsEnvName { get; set; }
        public string BuildName { get; set; }
    }
}

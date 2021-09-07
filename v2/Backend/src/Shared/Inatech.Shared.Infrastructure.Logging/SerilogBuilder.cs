using Destructurama;
using Inatech.Shared.Infrastructure.Constants;
using Inatech.Shared.Infrastructure.Correlation;
using Inatech.Shared.Infrastructure.Logging.ApplicationInsights;
using Inatech.Shared.Infrastructure.Logging.Configuration;
using Inatech.Shared.Infrastructure.Logging.Enrichers;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Events;
using Serilog.Exceptions;
using System;
using System.IO;
using System.Linq;
using static Inatech.Shared.Infrastructure.Constants.LogProps;

namespace Inatech.Shared.Infrastructure.Logging
{
    public class SerilogBuilder
    {
        private readonly IConfiguration _configuration;

        private LoggerConfiguration _loggerConfiguration = new LoggerConfiguration();
        private string _environment;

        public SerilogBuilder(IConfiguration configuration = default)
        {
            _configuration = configuration;
        }

        public ILogger Build()
        {
            _loggerConfiguration ??= new LoggerConfiguration();

            var inatechLoggingConfig = new InatechLoggingConfiguration();

            var enrichLoggingConfig = new EnrichLoggingConfiguration();
            _configuration?.Bind("Inatech-Logging:Enrich", enrichLoggingConfig);

            _configuration?.Bind("Inatech-Logging:Serilog", inatechLoggingConfig);

            if (inatechLoggingConfig.WriteToSeq)
            {
                var seqLoggingConfig = new SeqLoggingConfiguration();

                _configuration?.Bind("Inatech-Logging:Serilog:Seq", seqLoggingConfig);

                _loggerConfiguration
                    .Destructure.JsonNetTypes()
                    .WriteTo.Seq(
                        seqLoggingConfig.ServerUrl,
                        seqLoggingConfig.RestrictedToMinimumLevel,
                        seqLoggingConfig.BatchPostingLimit,
                        seqLoggingConfig.Period,
                        seqLoggingConfig.ApiKey,
                        seqLoggingConfig.BufferBaseFilename,
                        seqLoggingConfig.BufferSizeLimitBytes,
                        seqLoggingConfig.EventBodyLimitBytes,
                        seqLoggingConfig.ControlLevelSwitch,
                        null,
                        seqLoggingConfig.RetainedInvalidPayloadsLimitBytes,
                        //seqLoggingConfig.Compact,
                        seqLoggingConfig.QueueSizeLimit);
            }

            if (inatechLoggingConfig.WriteToApplicationInsights)
                _loggerConfiguration.WriteTo.ApplicationInsights(
                    telemetryConfiguration: TelemetryConfiguration.CreateDefault(), new OperationTelemetryConverter());

            if (inatechLoggingConfig.WriteToColoredConsole)
                _loggerConfiguration.WriteTo.ColoredConsole();

            if (inatechLoggingConfig.WriteToFile)
            {
                var fileLoggingConfig = new FileLoggingConfiguration();

                _loggerConfiguration.WriteTo.File(
                    // Note: IIS requires write access
                    Path.Combine(Environment.CurrentDirectory, fileLoggingConfig.Path),
                    fileLoggingConfig.RestrictedToMinimumLevel,
                    fileLoggingConfig.OutputTemplate,
                    null,
                    fileLoggingConfig.FileSizeLimitBytes,
                    fileLoggingConfig.LevelSwitch,
                    fileLoggingConfig.Buffered,
                    fileLoggingConfig.Shared,
                    fileLoggingConfig.FlushToDiskInterval,
                    fileLoggingConfig.RollingInterval,
                    fileLoggingConfig.RollOnFileSizeLimit,
                    fileLoggingConfig.RetainedFileCountLimit);
            }


            _loggerConfiguration
                .Enrich.FromLogContext()
                .Enrich.WithExceptionDetails()
                .Enrich.WithMachineName()
                .Enrich.WithEnvironmentUserName()
                .Enrich.WithProcessName()
                .Enrich.WithProcessId()
                .Enrich.WithProperty(INSTANCE_ID, Environment.GetEnvironmentVariable(EnvVars.INA.INSTANCE_ID))
                .Enrich.WithProperty(APPLICATION, "Shiptech")
                .Enrich.WithProperty(ENVIRONMENT, _environment)
                .Enrich.WithProperty(ENV_NAME, enrichLoggingConfig.EnvName);

            _loggerConfiguration.MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Error)
                .MinimumLevel.Override("System", LogEventLevel.Error);

            _loggerConfiguration.Enrich.With(new CorrelationEnricher(new CorrelationContextAccessor()));

            // TODO: Revisit this, although Props is shorter, how much does it cost us to clone the dictionary?
            _loggerConfiguration.Destructure.ByTransformingWhere<Props>(type => type == typeof(Props), value => value.ToDictionary(entry => entry.Key,
                entry => entry.Value));

            return _loggerConfiguration.CreateLogger();
        }

        public SerilogBuilder WithEnvironment(string environment)
        {
            _environment = environment;

            return this;
        }

        public SerilogBuilder WithConfig(LoggerConfiguration loggerConfiguration)
        {
            _loggerConfiguration = loggerConfiguration;

            return this;
        }

        public SerilogBuilder WithConfig(Func<LoggerConfiguration, LoggerConfiguration> configure)
        {
            _loggerConfiguration = configure?.Invoke(_loggerConfiguration);

            return this;
        }
    }
}
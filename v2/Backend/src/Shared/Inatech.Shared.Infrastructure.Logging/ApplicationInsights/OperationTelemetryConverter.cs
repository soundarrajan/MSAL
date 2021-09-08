using Inatech.Shared.Infrastructure.Constants;
using Microsoft.ApplicationInsights.Channel;
using Serilog.Events;
using Serilog.Sinks.ApplicationInsights.Sinks.ApplicationInsights.TelemetryConverters;
using System;
using System.Collections.Generic;

namespace Inatech.Shared.Infrastructure.Logging.ApplicationInsights
{
    public class OperationTelemetryConverter : TraceTelemetryConverter
    {
        public override IEnumerable<ITelemetry> Convert(LogEvent logEvent, IFormatProvider formatProvider)
        {
            // first create a default TraceTelemetry using the sink's default logic
            // .. but without the log level, and (rendered) message (template) included in the Properties
            foreach (var telemetry in base.Convert(logEvent, formatProvider))
            {
                if (logEvent.Properties.ContainsKey(LogProps.USER_ID))
                    telemetry.Context.User.Id = logEvent.Properties[LogProps.USER_ID].ToString();

                if (logEvent.Properties.ContainsKey(LogProps.REQUEST_ID))
                    telemetry.Context.Operation.Id = logEvent.Properties[LogProps.REQUEST_ID].ToString();

                if (logEvent.Properties.ContainsKey(LogProps.CORRELATION_ID))
                    telemetry.Context.Operation.ParentId = logEvent.Properties[LogProps.CORRELATION_ID].ToString();

                yield return telemetry;
            }
        }
    }
}
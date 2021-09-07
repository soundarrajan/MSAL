using Inatech.Shared.Infrastructure.Constants;

namespace Inatech.Shared.Infrastructure.Correlation
{
    /// <summary>
    /// Options for correlation ids.
    /// </summary>
    public class CorrelationIdOptions
    {
        private const string DefaultHeader = HttpHeaders.X_CORRELATION_ID;

        /// <summary>
        /// The name of the header from which the Correlation ID is read/written.
        /// </summary>
        public string Header { get; set; } = DefaultHeader;

        /// <summary>
        /// <para>
        /// Controls whether the correlation ID is returned in the response headers.
        /// </para>
        /// <para>Default: true</para>
        /// </summary>
        public bool IncludeInResponse { get; set; } = true;

        /// <summary>
        /// <para>
        /// Controls whether the ASP.NET Core TraceIdentifier will be set to match the CorrelationId.
        /// </para>
        /// <default>Default: false. Correlation-Id can come from front-end, so we want to keep it.</default>
        /// </summary>
        public bool UpdateTraceIdentifier { get; set; } = false;

        /// <summary>
        /// <para>
        /// Controls whether a GUID will be used in cases where no correlation ID is retrieved from the request header.
        /// When false the TraceIdentifier for the current request will be used.
        /// </para>
        /// <default> Default: false.</default>
        /// </summary>
        public bool UseGuidForCorrelationId { get; set; } = true;
    }
}

using Inatech.Shared.Infrastructure.Logging;
using Microsoft.Extensions.Logging;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace Inatech.Shared.Infrastructure.Cqs
{
    public abstract class BaseCommandQuery : ITransactionalCommand, ITransactionalQuery
    {
        /// <summary>
        /// Injected Property
        /// Note: If this property is set <see cref="RunAsync{TReturn}"/> use the <see cref="IDbTransaction.Connection"/> to execute the command.
        /// Note: This is usually set for composite (grouped) commands that need to run in the same <see cref="IDbTransaction"/>
        /// </summary>
        public IDbTransaction Transaction { get; set; }

        /// <summary>
        /// Injected Property
        /// Note: If this property is set <see cref="RunAsync{TReturn}"/> will create a new connection,
        /// Note: otherwise <see cref="RunAsync{TReturn}"/> will use the <see cref="IDbTransaction.Connection"/> to execute the command.
        /// </summary>
        public string ConnectionString { get; set; }

        /// <summary>
        ///  Injected Property
        /// </summary>
        public ILoggerFactory LoggerFactory { get; set; }

        private ILogger _logger = GlobalLog.Logger;


        public ILogger Logger
        {
            get
            {
                if (_logger == null || _logger == GlobalLog.Logger)
                {
                    _logger = LoggerFactory.CreateLogger(GetType());
                }

                return _logger;
            }
        }

        protected async Task<TReturn> RunAsync<TReturn>(Func<IDbConnection, IDbTransaction, Task<TReturn>> run,
            CancellationToken? cancellationToken = null, [CallerMemberName] string methodName = null)
        {
            if (Transaction == null && string.IsNullOrEmpty(ConnectionString))
            {
                throw new InvalidOperationException($"{nameof(Transaction)} and {nameof(ConnectionString)} were both null. One of the properties should have been injected by the factory.");
            }

            // Use the existing transaction when it is available
            if (Transaction != null && ConnectionString == null)
            {
                return await run(Transaction.Connection, Transaction);
            }

            using var conn = new SqlConnection(ConnectionString);
            await conn.OpenAsync(cancellationToken ?? CancellationToken.None);

            using var trans = conn.BeginTransaction();
            var sw = Stopwatch.StartNew();
            TReturn result;

            try
            {
                result = await run(conn, trans);
            }
            finally
            {
                sw.Stop();
                Logger.LogDebug("{CqsMethodName} of {CqsName} for took {CqsTime:0.0000} ms", methodName, GetType().Name, sw.Elapsed.TotalMilliseconds);
            }

            if (result is IResult r)
            {
                if (r.IsSuccess)
                {
                    trans.Commit();
                }

                return result;
            }

            trans.Commit();

            return result;
        }
    }
}
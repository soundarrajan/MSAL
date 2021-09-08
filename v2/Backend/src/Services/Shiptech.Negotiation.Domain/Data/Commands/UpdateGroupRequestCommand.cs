using Dapper;
using Inatech.Shared.Infrastructure.Cqs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Data.Commands
{
    public interface IUpdateRequestGroupCommand : ITransactionalCommand
    {
        Task<bool> ExecuteAsync(long requestId, int userId, CancellationToken cancellationToken = default);
    }
    public class UpdateRequestGroupCommand : BaseCommandQuery, IUpdateRequestGroupCommand
    {
        private readonly string updateRequestSql = @"Update procurement.Requests Set RequestGroupId = @groupId
                        where id = @requestId";
        public Task<bool> ExecuteAsync(long requestId, int userId, CancellationToken cancellationToken = default)
        {
            return RunAsync(async (conn, trans) =>
            {
                var id = await conn.ExecuteAsync(updateRequestSql
                    , new
                    {
                        userId
                    }
                    , commandType: CommandType.Text
                    , transaction: trans)
                   .ConfigureAwait(false);
                return true;
            }, cancellationToken);

        }
    }
}

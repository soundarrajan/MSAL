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
    public interface ICreateGroupRequestSellersCommand : ITransactionalCommand
    {
        Task<bool> ExecuteAsync(long requestId, int userId, CancellationToken cancellationToken = default);
    }
    public class CreateGroupRequestSellersCommand : BaseCommandQuery, ICreateGroupRequestSellersCommand
    {
        private readonly string createGroupSellersSql = @"INSERT INTO procurement.RequestGroupSellers
                                    (RequestGroupId, RequestId, CounterpartyId, IsDeleted, CreatedBy, CreatedOn) 
                                    VALUES(@requestGroupId, @requestId, @sellerId, 0, @userId, GETUTCDATE())";
        public Task<bool> ExecuteAsync(long requestId, int userId, CancellationToken cancellationToken = default)
        {
            return RunAsync(async (conn, trans) =>
            {
                var result = await conn.ExecuteAsync(createGroupSellersSql
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

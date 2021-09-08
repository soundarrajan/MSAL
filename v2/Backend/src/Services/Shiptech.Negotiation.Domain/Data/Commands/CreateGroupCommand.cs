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
    public interface ICreateGroupCommand : ITransactionalCommand
    {
        Task<long> ExecuteAsync(int userId, CancellationToken cancellationToken = default);
    }
    public class CreateGroupCommand : BaseCommandQuery, ICreateGroupCommand
    {
        private readonly string createGroupSql = @"INSERT INTO procurement.RequestGroups
                                    (IsDeleted, CreatedBy, CreatedOn) 
                                    VALUES(0, @userId, GETUTCDATE());
                                    SELECT SCOPE_IDENTITY() AS Id;";
        public Task<long> ExecuteAsync(int userId, CancellationToken cancellationToken = default)
        {
            return RunAsync(async (conn, trans) =>
            {
                var id = await conn.ExecuteScalarAsync<long>(createGroupSql
                    , new
                    {
                        userId
                    }
                    , commandType: CommandType.Text
                    , transaction: trans)
                   .ConfigureAwait(false);
                return id;
            }, cancellationToken);

        }
    }
}

using Dapper;
using Inatech.Shared.Infrastructure.Cqs;
using Shiptech.Negotiation.Domain.Data.Dtos;
using Shiptech.Negotiation.Domain.Data.Model;
using Slapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Data.Queries
{
    public interface IGetCounterparttypeByIdQuery: IQuery
    {
        Task<List<RequestLocationSellerDto>> ByGroupIdAsync(long GroupId, CancellationToken? cancellationToken = null);
    }
    public class GetCounterparttypeByIdQuery : BaseCommandQuery, IGetCounterparttypeByIdQuery
    {
        private readonly string counterpartytypeByGroupIdSql = @"SELECT C.Id AS CounterpartytypeId,c.Name AS CounterpartytypeName , RLS.RequestLocationId,Rls.SellerCounterpartyId 
                                                                FROM rfq.RequestLocationSellers RLS WITH(NOLOCK)
                                                                JOIN Master.CounterpartyCounterpartyTypes CT WITH(NOLOCK) ON CT.CounterpartyId=RLS.SellerCounterpartyId
                                                                JOIN enums.CounterpartyTypes C WITH(NOLOCK) ON c.Id=CT.CounterpartyTypeId
                                                                WHERE RequestGroupId=@GroupId AND C.Id in(1,3)
                                                                GROUP BY C.Id,c.Name, RLS.RequestLocationId,Rls.SellerCounterpartyId";
        public Task<List<RequestLocationSellerDto>> ByGroupIdAsync(long GroupId, CancellationToken? cancellationToken = null)
        {
            return RunAsync(async (conn, trans) =>
            {
                return (await conn.QueryAsync<RequestLocationSellerDto>(
                     counterpartytypeByGroupIdSql,
                     commandType: CommandType.Text,
                     param: new { GroupId },
                     transaction: trans).ConfigureAwait(false)).AsList();
            }, cancellationToken);
        }
    }
}

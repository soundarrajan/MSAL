using Dapper;
using Inatech.Shared.Infrastructure.Cqs;
using Shiptech.Negotiation.Domain.Data.Dtos;
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
    public interface IGetRequestByIdQuery : IQuery
    {
        Task<RequestDto> ByIdAsync(long requestId, CancellationToken? cancellationToken = null);
    }
    public class GetRequestByIdQuery : BaseCommandQuery, IGetRequestByIdQuery
    {
        private readonly string requestByIdSql = @"select req.Id
                            ,rLoc.Id as Locations_Id
                            ,rProd.Id as Locations_Products_Id
                            ,req.StatusId as Status_Id
	        from [procurement].[Requests] req
		        inner Join	[procurement].[RequestLocations] rLoc on rLoc.[RequestId] = req.[Id]
			    inner Join	[procurement].[RequestProducts] rProd on rProd.[RequestLocationId] = rLoc.[Id]
	        where req.Id = @requestId and rProd.StatusId not in(14,15)";
        public Task<RequestDto> ByIdAsync(long requestId, CancellationToken? cancellationToken = null)
        {
            return RunAsync(async (conn, trans) =>
            {
                var records = await conn.QueryAsync<dynamic>(requestByIdSql, param: new { requestId })
                    .ConfigureAwait(false);
                var mappedRecords = AutoMapper.MapDynamic<RequestDto>(records);

                return mappedRecords.FirstOrDefault();
            }, cancellationToken);
        }
    }
}

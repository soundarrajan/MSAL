using Dapper;
using Inatech.Shared.Infrastructure.Cqs;
using Shiptech.Negotiation.Domain.Data.Dtos;
using Shiptech.Negotiation.Domain.Data.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Data.Queries
{
    public interface IPreferredSellersQuery : IQuery
    {
        Task<List<RequestLocationSellerDto>> GetPreferredSellers(long[] locationIds, long[] productIds, long[] requestLocationIds, CancellationToken? cancellationToken = null);
    }
    public class PreferredSellersQuery : BaseCommandQuery, IPreferredSellersQuery
    {
        private readonly string sellersByLocationProductsIdsSql = @"SELECT lsel.LocationId, lSel.CounterpartyId AS SellerCounterpartyId ,sProd.ProductId ,Rl.Id AS RequestLocationId
                                                                    FROM [master].[LocationSellers] lSel WITH(NOLOCK)
                                                                    INNER JOIN  [master].[SellerProducts] sProd	on sProd.LocationSellerId = lSel.Id 
                                                                    INNER JOIN Procurement.RequestLocations Rl ON lsel.LocationId=Rl.LocationId 
                                                                    where lSel.LocationId in @locationIds and sProd.ProductId in @productIds AND Rl.Id  in @requestLocationIds and lSel.[IsDeleted] = 0";
        public Task<List<RequestLocationSellerDto>> GetPreferredSellers(long[] locationIds, long[] productIds,long[] requestLocationIds, CancellationToken? cancellationToken = null)
        {
            return RunAsync(async (conn, trans) =>
            {
                return (await conn.QueryAsync<RequestLocationSellerDto>(
                    sellersByLocationProductsIdsSql,
                    commandType: CommandType.Text,
                    param: new
                    {
                        locationIds,
                        productIds,
                        requestLocationIds
                    },
                    transaction: trans).ConfigureAwait(false)).AsList();
            }, cancellationToken);
        }
    }
}

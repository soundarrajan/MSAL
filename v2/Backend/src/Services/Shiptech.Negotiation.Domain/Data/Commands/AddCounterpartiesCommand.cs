using Dapper;
using Inatech.Shared.Infrastructure.Cqs;
using Shiptech.Negotiation.Domain.Data.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Data.Commands
{
    public interface IAddCounterpartiesCommand : ITransactionalCommand
    {
        Task<bool> ExecuteAsync(List<RequestLocationSeller> request, CancellationToken cancellationToken = default);
    }
    public class AddCounterpartiesCommand : BaseCommandQuery, IAddCounterpartiesCommand
    {
        private readonly string addcounterpartiesSql = @"INSERT INTO [rfq].[RequestLocationSellers](RequestGroupId, RequestLocationId, LocationId, SellerCounterpartyId, IsDeleted) 
                                VALUES(@requestGroupId,@requestLocationId,@locationId, @sellerCounterpartyId, @isDeleted)";

        public Task<bool> ExecuteAsync(List<RequestLocationSeller> counterparties, CancellationToken cancellationToken = default)
        {
            //DataTable counterpartiesTable = ListToDataTable.ToDataTable(counterparties, "Rfq.RequestLocationSellers");
            //return RunAsync(async (conn, trans) =>
            //{
            //    try
            //    {
            //        var response = await conn.QueryMultipleAsync(addcounterpartiesSql,
            //            new
            //            {
            //                counterpartiesList = counterpartiesTable.AsTableValuedParameter()
            //            },
            //            commandType: CommandType.StoredProcedure,
            //            transaction: trans).
            //            ConfigureAwait(false);
            //        return Task.FromResult(true);
            //    }
            //    catch (SqlException exception)
            //    {
            //        return exception.Message;
            //    }
            //}, cancellationToken);
            return Task.FromResult(true);
        }
    }
}

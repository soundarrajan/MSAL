using Inatech.Shared.Infrastructure.Cqs;
using Shiptech.Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Dapper;

namespace Shiptech.Common.Data.Queries
{
    public interface IGetMastersByIdsQuery : IQuery
    {
        Task<MastersResponseDto> ByIdsAsync(MastersRequestDto mastersRequestDto, CancellationToken? cancellationToken = null);
    }
    public class GetMastersByIdsQuery : BaseCommandQuery, IGetMastersByIdsQuery
    {
        private readonly string requestByIdsSql = @"SELECT id, name FROM master.Vessels WHERE  id IN @vesselIds;
                                                        SELECT id, name FROM master.Locations WHERE id IN @locationIds;
                                                        SELECT id ,Descriptions AS name FROM Master.LocationTerminals WHERE  id IN @terminalIds;
                                                        SELECT id, name  FROM master.Products WHERE id IN @productIds;
                                                        SELECT id, name  FROM Master.services WHERE id IN @serviceIds;
                                                        SELECT id, name  FROM Master.Companies WHERE id IN @companyIds;
                                                        SELECT id, name  FROM master.Counterparties WHERE  id IN @counterpartieIds;";
                                                   //SELECT id, name  FROM master.Uoms WHERE (ISNULL(@uomIds,0) =null OR id IN @uomIds);
        public Task<MastersResponseDto> ByIdsAsync(MastersRequestDto mastersRequestDto, CancellationToken? cancellationToken = null)
        {
            return RunAsync(async (conn, trans) =>
            {
                var records = await conn.QueryMultipleAsync(requestByIdsSql,
                           param: new
                           {
                               vesselIds = mastersRequestDto.VesselIds?.ToArray(),
                               locationIds = mastersRequestDto.LocationIds?.ToArray(),
                               terminalIds = mastersRequestDto.TerminalIds?.ToArray(),
                               productIds = mastersRequestDto.ProductIds?.ToArray(),
                               //uomIds = mastersRequestDto.UomIds.ToArray(),
                               serviceIds = mastersRequestDto.ServiceIds?.ToArray(),
                               companyIds = mastersRequestDto.CompanyIds?.ToArray(),
                               counterpartieIds = mastersRequestDto.CounterpartyIds?.ToArray()
                           }, transaction: trans).ConfigureAwait(false);
                return new MastersResponseDto
                {
                    Vessels = records.Read<IdNameDto>().AsList(),
                    Locations = records.Read<IdNameDto>().AsList(),
                    Terminals = records.Read<IdNameDto>().AsList(),
                    Products = records.Read<IdNameDto>().AsList(),
                    //Uoms = records.Read<BaseDto>().AsList(),
                    Services = records.Read<IdNameDto>().AsList(),
                    Companys = records.Read<IdNameDto>().AsList(),
                    Counterparties = records.Read<IdNameDto>().AsList()
                    //Currencies = records.Read<BaseDto>().AsList()
                };
            }, cancellationToken);
        }
    }
}

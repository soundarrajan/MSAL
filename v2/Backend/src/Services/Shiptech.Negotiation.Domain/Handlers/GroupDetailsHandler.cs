using Inatech.Shared.Infrastructure.Cqs;
using Inatech.Shared.Infrastructure.Tenant;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shiptech.Negotiation.Domain.Data.EfCore;
using Shiptech.Negotiation.Domain.Data.Queries;
using Shiptech.Negotiation.Domain.Requests;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Mapster;
using Shiptech.Negotiation.Domain.Data.Dtos;
using Shiptech.Common;
using Shiptech.Common.Data.Queries;
using Shiptech.Common.Dtos;

namespace Shiptech.Negotiation.Domain.Handlers
{
    public sealed class GroupDetailsHandler : BaseHandler, IRequestHandler<GroupDetailsRequest, GroupDetailsResponse>
    {
        private readonly NegotiationDbContext _context;
        private readonly ITenantQuery<IGetMastersByIdsQuery> _masterByIdsQuery;
        private readonly ILogger<IPreferredSellersQuery> _logger;
        public GroupDetailsHandler(NegotiationDbContext context
            , ITenantQuery<IGetMastersByIdsQuery> masterByIdsQuery
            , ILogger<IPreferredSellersQuery> logger)
        {
            _context = context;
            _masterByIdsQuery = masterByIdsQuery;
            _logger = logger;
        }

        public async Task<GroupDetailsResponse> Handle(GroupDetailsRequest request, CancellationToken cancellationToken)
        {
            List<long> requestLocationIds = new();
            var requests = await _context.Requests
                 .Where(r => request.GroupId == r.RequestGroupId)
                 .Include(re => re.RequestLocations.Where(l => l.IsDeleted == false))
                 .ThenInclude(r => r.RequestProducts.Where(p => p.IsDeleted == false))
                .ProjectToType<RequestDto>()
                .ToListAsync(cancellationToken: cancellationToken);


            var masterRequestDto = new MastersRequestDto
            {
                VesselIds = requests.Select(x => x.VesselId).ToList(),
                TerminalIds = requests.Where(l => l.RequestLocations.Any()).SelectMany(x => x.RequestLocations.Where(r => r.TerminalId.HasValue).Select(y => y.TerminalId.Value)).ToList(),
                LocationIds = requests.Where(l => l.RequestLocations.Any()).SelectMany(x => x.RequestLocations.Select(y => y.LocationId)).ToList(),
                ProductIds = requests.Where(l => l.RequestLocations.Any()).SelectMany(x => x.RequestLocations.Where(p => p.RequestProducts.Any()).SelectMany(y => y.RequestProducts.Select(z => z.ProductId))).ToList(),
                ServiceIds = requests.Where(x => x.ServiceId.HasValue).Select(x => x.ServiceId).ToList(),
                CompanyIds = requests.Where(x => x.CompanyId.HasValue).Select(x => x.CompanyId).ToList()
            };

            var masterResponseDto = await _masterByIdsQuery.Create(request.TenantId).ByIdsAsync(masterRequestDto);
            foreach (var r in requests)
            {
                r.VesselName = masterResponseDto.Vessels.Where(x => x.Id == r.VesselId).Select(x => x.Name).First();
                r.Status = ((Status)r.StatusId).ToString();
                foreach (var l in r.RequestLocations)
                {
                    l.LocationName = masterResponseDto.Locations.Where(x => x.Id == l.LocationId).Select(x => x.Name).First();
                    l.TerminalName = masterResponseDto.Terminals.Where(x => x.Id == l.LocationId).Select(x => x.Name).FirstOrDefault();
                    foreach (var p in l.RequestProducts)
                    {
                        p.ProductName = masterResponseDto.Products.Where(x => x.Id == p.ProductId).Select(x => x.Name).First();
                        p.Status = ((Status)r.StatusId).ToString();
                    }
                }
            }

            return new GroupDetailsResponse { GroupId = request.GroupId, Requests = requests };
        }
    }
}

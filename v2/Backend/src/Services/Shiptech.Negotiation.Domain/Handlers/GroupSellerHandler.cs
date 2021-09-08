using Inatech.Shared.Infrastructure.Cqs;
using Inatech.Shared.Infrastructure.Tenant;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shiptech.Common.Data.Queries;
using Shiptech.Common.Dtos;
using Shiptech.Negotiation.Domain.Data.Dtos;
using Shiptech.Negotiation.Domain.Data.EfCore;
using Shiptech.Negotiation.Domain.Data.Queries;
using Shiptech.Negotiation.Domain.Requests;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Shiptech.Common;

namespace Shiptech.Negotiation.Domain.Handlers
{
    public sealed class GroupSellerHandler : BaseHandler, IRequestHandler<GroupSellersRequest, GroupSellersResponse>
    {
        private readonly NegotiationDbContext _context;
        private readonly ILogger<IPreferredSellersQuery> _logger;
        private readonly ITenantQuery<IGetMastersByIdsQuery> _masterByIdsQuery;
        private readonly ITenantQuery<IGetCounterparttypeByIdQuery> _counterparttypeByGroupIdQuery;
        private readonly int TenantId = 1;
        public GroupSellerHandler(NegotiationDbContext context
            , ILogger<IPreferredSellersQuery> logger
            , ITenantQuery<IGetMastersByIdsQuery> masterByIdsQuery
            ,ITenantQuery<IGetCounterparttypeByIdQuery> counterparttypeByGroupIdQuery)
        {
            _context = context;
            _logger = logger;
            _masterByIdsQuery = masterByIdsQuery;
            _counterparttypeByGroupIdQuery = counterparttypeByGroupIdQuery;
        }

        public async Task<GroupSellersResponse> Handle(GroupSellersRequest request, CancellationToken cancellationToken)
        {
            var requests = await _context.RequestLocationSellers
                .Where(r => request.GroupId == r.RequestGroupId)
                .ProjectToType<RequestLocationSellerDto>()
                .ToListAsync();

            var masterRequestDto = new MastersRequestDto
            {
                CounterpartyIds = requests.Select(x => x.SellerCounterpartyId).ToList(),
            };

            var masterResponseDto = await _masterByIdsQuery.Create(2).ByIdsAsync(masterRequestDto);
            var sellerType = await _counterparttypeByGroupIdQuery.Create(2).ByGroupIdAsync(request.GroupId);
            foreach (var r in requests)
            {
                r.Mail = "";
                r.PortPrice = "$9.8";
                r.PortRating = "4.2";
                r.GenPrice = "$9.4";
                r.GenRating = "4.2";
                r.SellerCounterpartyName = masterResponseDto.Counterparties.Where(x => x.Id == r.SellerCounterpartyId).Select(x => x.Name).FirstOrDefault();
                r.CounterpartytypeId = sellerType.Where(x => x.RequestLocationId == r.RequestLocationId).Where(z => z.SellerCounterpartyId == r.SellerCounterpartyId).Select(y => y.CounterpartytypeId).FirstOrDefault();
                r.CounterpartyTypeName = sellerType.Where(x => x.RequestLocationId == r.RequestLocationId ).Where(z=>z.SellerCounterpartyId==r.SellerCounterpartyId).Select(y => y.CounterpartyTypeName).FirstOrDefault();
            }

            return new GroupSellersResponse { GroupId = request.GroupId, RequestLocationSellers = requests };
        }
    }
}

using Inatech.Shared.Infrastructure.Cqs;
using Inatech.Shared.Infrastructure.Tenant;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shiptech.Negotiation.Domain.Data.EfCore;
using Shiptech.Negotiation.Domain.Data.Commands;
using Shiptech.Negotiation.Domain.Data.Queries;
using Shiptech.Negotiation.Domain.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Mapster;
using Shiptech.Negotiation.Domain.Data.Model;
using Shiptech.Negotiation.Domain.Data.Dtos;
using Shiptech.Negotiation.Domain.Exceptions;
using Shiptech.Common;

namespace Shiptech.Negotiation.Domain.Handlers
{
    public sealed class CreateGroupHandler : BaseHandler, IRequestHandler<CreateGroupRequest, CreateGroupResponse>
    {
        private readonly ITenantQuery<IGetRequestByIdQuery> _requestByIdQuery;
        private readonly ITenantQuery<IPreferredSellersQuery> _preferredSellersQuery;

        private readonly ITenantCommand<ICreateGroupCommand> _createGroupCommand;
        private readonly ITenantCommand<IUpdateRequestGroupCommand> _updateRequestGroupCommand;
        private readonly ITenantCommand<ICreateGroupRequestSellersCommand> _createGroupSellersCommand;

        private readonly ITenantPersistence _persistence;
        private readonly ILogger<IPreferredSellersQuery> _logger;
        private readonly NegotiationDbContext _context;
        public CreateGroupHandler(ITenantQuery<IPreferredSellersQuery> preferredSellersQuery
            , ITenantQuery<IGetRequestByIdQuery> requestByIdQuery
            , ITenantCommand<ICreateGroupCommand> createGroupCommand
            , ITenantCommand<IUpdateRequestGroupCommand> updateRequestGroupCommand
            , ITenantCommand<ICreateGroupRequestSellersCommand> createGroupSellersCommand
            , ITenantPersistence persistence
            , NegotiationDbContext context
            , ILogger<IPreferredSellersQuery> logger)
        {
            _preferredSellersQuery = preferredSellersQuery;
            _requestByIdQuery = requestByIdQuery;
            _createGroupCommand = createGroupCommand;
            _updateRequestGroupCommand = updateRequestGroupCommand;
            _createGroupSellersCommand = createGroupSellersCommand;
            _persistence = persistence;
            _context = context;
            _logger = logger;
        }

        public async Task<CreateGroupResponse> Handle(CreateGroupRequest request, CancellationToken cancellationToken)
        {
            List<long> requestLocationIds = new();
            List<long> locationIds = new();
            List<long> productIds = new();

            var requests = await _context.Requests
                .Where(r => request.RequestIds.Contains(r.Id))
                .Include(re => re.RequestLocations.Where(l => l.IsDeleted == false))
                .ThenInclude(r => r.RequestProducts.Where(p => p.IsDeleted == false)).ToListAsync(cancellationToken: cancellationToken);

            var requestGroup = new RequestGroup { CreatedOn = DateTime.UtcNow, IsDeleted = false };

            foreach (var requestItem in requests)
            {
                // hard validations
                if (requestItem.RequestGroupId.HasValue)
                {
                    throw new RequestGroupedException($"Request ({requestItem.Id}) should not be already grouped.");
                }
                else if (!Constants.validReqGroupStatus.Contains(int.Parse(requestItem.StatusId.Value.ToString())))
                {
                    Status requestStatus = (Status)requestItem.StatusId;
                    throw new RequestGroupedException($"Status {requestStatus} of the Request {requestItem.Id} does not permit grouping of the Request.");
                }
                requestLocationIds.AddRange(requestItem.RequestLocations.Select(x => x.Id));
                locationIds.AddRange(requestItem.RequestLocations.Select(x => x.LocationId));
                productIds.AddRange(requestItem.RequestLocations.SelectMany(x => x.RequestProducts
                        .Where(p => p.StatusId != (int)Status.Stemmed && p.StatusId != (int)Status.Cancelled)
                        .Select(y => y.ProductId)));
                requestGroup.Requests.Add(requestItem);
            }

            List<RequestLocationSellerDto> preferredProductSellers = new();
            preferredProductSellers = await _preferredSellersQuery.Create(request.TenantId).GetPreferredSellers(locationIds.ToArray(), productIds.ToArray(), requestLocationIds.ToArray(), cancellationToken);

            var group = await _context.RequestGroups.AddAsync(requestGroup, cancellationToken);

            foreach (var seller in preferredProductSellers)
            {
                var requestLocationSeller = new RequestLocationSeller { SellerCounterpartyId = seller.SellerCounterpartyId, LocationId = seller.LocationId, IsDeleted = false, IsSelected = true, RequestLocationId = seller.RequestLocationId };
                requestGroup.RequestLocationSellers.Add(requestLocationSeller);
            }

            await _context.SaveChangesAsync(cancellationToken);

            
            return new CreateGroupResponse { GroupId =group.Entity.Id };
        }
        /// <summary>
        /// Create Group
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        /* public async Task<CreateGroupResponse> Handle(CreateGroupRequest request, CancellationToken cancellationToken)
        {
            // Jai
            /* 
             *  1. Get request object by id and validate the request object valid.
             *  2. Prepare list of locationIds and ProductIds
             *  3. Get Preferred sellers by location, product and filter by the status
             *  4. Get TimezoneId, Currency Id from tenant configurations.
             *  5. Create group objects with all information.
             *  6. Prepare unique preferred sellers for each locations
             *  7. Insert unique sellers
             *  8. Update request group id 
            

            // 1 - refers to the dbo.masterconfigurations.TenantId
            // 12342 - refers the request id
            var requestData = await _requestByIdQuery.Create(1).ByIdAsync(12342);

            if (requestData == null || requestData.Status?.Name != "Validated")
            {
                // throw validation error and exit
            }

            var locationIds = requestData.Locations.Select(x => x.Id).ToArray();
            var productIds = requestData.Locations.SelectMany(x => x.Products.Select(y => y.Id)).ToArray();

            var preferredSellers = _preferredSellersQuery.Create(1).GetPreferredSellers(locationIds, productIds);

            var result = await _persistence.TransactionAsync(1, async (transaction) =>
            {
                var requestGroupId = await _createGroupCommand.Create(1).ExecuteAsync(1);
                await _updateRequestGroupCommand.Create(1).ExecuteAsync(1232, 1);

                var result = await _createGroupSellersCommand.Create(1).ExecuteAsync(1232, 1);

                return 1;
            });

            return new CreateGroupResponse {GroupId= 123 };
        } */


    }
}

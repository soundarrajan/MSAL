using Inatech.Shared.Infrastructure.Cqs;
using Inatech.Shared.Infrastructure.Tenant;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Shiptech.Negotiation.Domain.Data.Commands;
using Shiptech.Negotiation.Domain.Data.EfCore;
using Shiptech.Negotiation.Domain.Data.Model;
using Shiptech.Negotiation.Domain.Requests;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Handlers
{
    public sealed class AddCounterpartiesHandler : BaseHandler, IRequestHandler<AddCounterpartiesRequest, AddCounterpartiesResponse>
    {

        private readonly ITenantPersistence _persistence;
        private readonly NegotiationDbContext _context;
        public AddCounterpartiesHandler(ITenantPersistence persistence
            , NegotiationDbContext context
            )
        {
            _persistence = persistence;
            _context = context;
        }

        public async Task<AddCounterpartiesResponse> Handle(AddCounterpartiesRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var requests = await _context.RequestLocationSellers.Where(r => r.RequestGroupId == request.RequestGroupId).ToListAsync();

                foreach (var counterparty in request.counterparties) 
                {
                    var cp_exists = requests.Where(r => (r.RequestLocationId == counterparty.RequestLocationId) &&
                                                        (r.LocationId == counterparty.LocationId) &&
                                                        (r.SellerCounterpartyId == counterparty.SellerCounterpartyId) &&
                                                        (r.IsDeleted == false)
                                                  ).FirstOrDefault();
               
                    if (cp_exists != null) 
                    {
                        if(cp_exists.IsSelected == true && counterparty.IsSelected == true)
                        {
                            String Errormessage = $"Counterparty {counterparty.SellerCounterpartyName} already added";
                            return new AddCounterpartiesResponse { Message = Errormessage.ToString() };
                        }
                        cp_exists.IsSelected = counterparty.IsSelected;
                    }
                    else 
                    {
                        await _context.RequestLocationSellers.AddAsync(new RequestLocationSeller
                        {
                            RequestGroupId = counterparty.RequestGroupId,
                            RequestLocationId = counterparty.RequestLocationId,
                            LocationId = counterparty.LocationId,
                            SellerCounterpartyId = counterparty.SellerCounterpartyId,
                            PerferredProductIds = counterparty.PrefferedProductIds,
                            IsDeleted = counterparty.IsDeleted,
                            IsSelected = counterparty.IsSelected,
                        });
                    }
                } 
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex) {
                return new AddCounterpartiesResponse { Message = ex.Message.ToString() };
            }
            string message = request.isAllLocation ? $"Counterparty added successfully to all locations" : $"Counterparty added successfully to the {request.RequestGroupId}";
            return new AddCounterpartiesResponse { Message = message.ToString()};
        }
    }
}

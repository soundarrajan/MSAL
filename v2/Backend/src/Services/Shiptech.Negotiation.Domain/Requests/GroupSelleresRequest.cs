using Inatech.Shared.Infrastructure.Cqs;
using MediatR;
using Shiptech.Negotiation.Domain.Data.Dtos;
using System.Collections.Generic;

namespace Shiptech.Negotiation.Domain.Requests
{
    public class GroupSellersRequest : BaseRequest, IRequest<GroupSellersResponse>
    {
        public long GroupId { get; set; }
    }

    public class GroupSellersResponse
    {
        public long GroupId { get; set; }
        public virtual ICollection< RequestLocationSellerDto> RequestLocationSellers { get; set; }
    }

}

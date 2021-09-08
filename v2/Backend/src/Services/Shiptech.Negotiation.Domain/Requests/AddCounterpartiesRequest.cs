using MediatR;
using Shiptech.Negotiation.Domain.Data.Dtos;
using System.Collections.Generic;

namespace Shiptech.Negotiation.Domain.Requests
{
    public class AddCounterpartiesRequest : IRequest<AddCounterpartiesResponse>
    {
        public long RequestGroupId { get; set; }
        public bool isAllLocation { get; set; } = false;
        public List<RequestLocationSellerDto> counterparties { get; set; }
    }

    public class AddCounterpartiesResponse
    {
        public string Message { get; set; }
    }
}

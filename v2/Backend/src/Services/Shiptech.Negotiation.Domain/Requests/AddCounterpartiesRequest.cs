using MediatR;
using Shiptech.Negotiation.Domain.Data.Dtos;
using System.Collections.Generic;

namespace Shiptech.Negotiation.Domain.Requests
{
    public class AddCounterpartiesRequest : IRequest<AddCounterpartiesResponse>
    {
        public AddCounterpartiesRequest(long requestGroupId, bool isAllLocation, List<RequestLocationSellerDto> counterparties)
        {
            RequestGroupId = requestGroupId;
            this.isAllLocation = isAllLocation;
            Counterparties = counterparties;
        }

        public long RequestGroupId { get; set; }
        public bool isAllLocation { get; set; } = false;
        public List<RequestLocationSellerDto> Counterparties { get; set; }
    }

    public class AddCounterpartiesResponse
    {
        public bool Status { get; set; } = true;
        public string Message { get; set; }
    }
}

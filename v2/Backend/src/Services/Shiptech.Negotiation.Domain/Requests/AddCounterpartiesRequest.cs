using MediatR;
using Shiptech.Negotiation.Domain.Data.Dtos;
using Shiptech.Negotiation.Domain.Data.Model;
using System.Collections.Generic;

namespace Shiptech.Negotiation.Domain.Requests
{
    public class AddCounterpartiesRequest : IRequest<AddCounterpartiesResponse>
    {
        public List<RequestLocationSellerDto> counterparties;
    }

    public class AddCounterpartiesResponse
    {
        public string Message { get; set; }
    }

}

using Inatech.Shared.Infrastructure.Cqs;
using MediatR;
using Shiptech.Negotiation.Domain.Data.Dtos;
using System.Collections.Generic;

namespace Shiptech.Negotiation.Domain.Requests
{
    public class GroupDetailsRequest : BaseRequest, IRequest<GroupDetailsResponse>
    {
        public long GroupId { get; set; }
    }

    public class GroupDetailsResponse
    {
        public long GroupId { get; set; }
        public virtual ICollection< RequestDto> Requests { get; set; }
    }

}

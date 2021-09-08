using Inatech.Shared.Infrastructure.Cqs;
using MediatR;
using System.Collections.Generic;

namespace Shiptech.Negotiation.Domain.Requests
{
    public class CreateGroupRequest : BaseRequest, IRequest<CreateGroupResponse>
    {
        public List<long> RequestIds { get; set; }
    }

    public class CreateGroupResponse
    {
        public long? GroupId  { get; set; }
    }

}

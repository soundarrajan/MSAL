using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shiptech.Common.Extensions;
using Shiptech.Negotiation.Domain.Data.Dtos;
using Shiptech.Negotiation.Domain.Requests;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class GroupsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<GroupsController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public GroupsController(
              IMediator mediator
            , ILogger<GroupsController> logger, IHttpContextAccessor httpContextAccessor)
        {
            _mediator = mediator;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// create a request group provided with list of request ids
        /// </summary>
        /// <param name="requestDto"></param>
        /// <returns>one request group id</returns>
        [HttpPost("create")]
        public async Task<ActionResult<CreateGroupResponse>> CreateGroup(List<long> requestIds)
        {
            var tenantInfo = _httpContextAccessor.HttpContext.GetTenantInfoFromContext();
            var result = await _mediator.Send(new CreateGroupRequest { RequestIds = requestIds, TenantId = tenantInfo.TenantId });
            return Ok(result);
        }
        
        /// <summary>
        /// get group details by a group id
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns>request group details with requests, locations, products</returns>
        [HttpGet("{groupId}")]
        public async Task<ActionResult<GroupDetailsResponse>> GetGroupDetails(long groupId)
        {
            var tenantInfo = _httpContextAccessor.HttpContext.GetTenantInfoFromContext();
            var result = await _mediator.Send(new GroupDetailsRequest { GroupId = groupId, TenantId = tenantInfo.TenantId });
            return Ok(result);
        }

        /// <summary>
        /// get sellers by group id and requst id
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns>list of preferred sellers</returns>
        [HttpGet("{groupId}/sellers")]
        public async Task<ActionResult<GroupSellersResponse>> GetSellers(long groupId)
        {
            var tenantInfo = _httpContextAccessor.HttpContext.GetTenantInfoFromContext();
            var result = await _mediator.Send(new GroupSellersRequest { GroupId = groupId, TenantId = tenantInfo.TenantId });
            return Ok(result);
        }

        /// <summary>
        /// add new location sellers
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns>returns true</returns>
        [HttpPost("{groupId}/{requestId}/sellers")]
        public async Task<ActionResult<GroupDetailsResponse>> CreateSellers(long groupId, long requestId)
        {
            var tenantInfo = _httpContextAccessor.HttpContext.GetTenantInfoFromContext();
            var result = await _mediator.Send(new GroupDetailsRequest { GroupId = groupId, TenantId = tenantInfo.TenantId });
            return Ok(result);
        }

        /// <summary>
        /// remove a location seller
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns>returns true</returns>
        [HttpDelete("{groupId}/{requestId}/sellers/{seller-id}")]
        public async Task<ActionResult<GroupDetailsResponse>> RemoveSeller(long groupId, long requestId)
        {
            var result = await _mediator.Send(new GroupDetailsRequest { GroupId = groupId });
            return Ok(result);
        }

        [HttpPost("AddCounterparties")]
        public async Task<ActionResult<AddCounterpartiesResponse>> AddCounterparties(AddCounterpartiesRequest requestDto)
        {
            var response = await _mediator.Send(new AddCounterpartiesRequest(requestDto.RequestGroupId, requestDto.isAllLocation, requestDto.Counterparties));
            return response;
        }
    }
}

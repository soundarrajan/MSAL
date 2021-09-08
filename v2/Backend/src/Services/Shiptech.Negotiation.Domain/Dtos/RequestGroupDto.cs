using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Data.Dtos
{
    public class RequestGroupDto : BaseDto
    {
        public RequestGroupDto()
        {
      
            Requests = new HashSet<RequestDto>();
            RequestLocationSellers = new HashSet<RequestLocationSellerDto>();
        }
        public DateTime CreatedOn { get; set; }
        public long CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public virtual ICollection<RequestDto> Requests { get; set; }
        public virtual ICollection<RequestLocationSellerDto> RequestLocationSellers { get; set; }
    }
}

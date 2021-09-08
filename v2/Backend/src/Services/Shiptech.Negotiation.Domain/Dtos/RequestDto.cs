using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Data.Dtos
{
    public class RequestDto : BaseDto
    {
        public long VesselId { get; set; }
        public string VesselName { get; set; }
        public long? ServiceId { get; set; }
        public long? CompanyId { get; set; }
        public long? RequestGroupId { get; set; }
        public int StatusId { get; set; }
        public string Status { get; set; }
        public DateTime RequestDate { get; set; }
        public long? ValidatedBy { get; set; }
        public string Comments { get; set; }
        public DateTime CreatedOn { get; set; }
        public long CreatedById { get; set; }
        public long? LastModifiedById { get; set; }
        public DateTime? LastModifiedOn { get; set; }
        public bool IsDeleted { get; set; }
        public string GeneralComment { get; set; }
        public string PerformanceComment { get; set; }
        public string SupplyComment { get; set; }
        public List<RequestLocationDto> RequestLocations { get; set; }
    }
}

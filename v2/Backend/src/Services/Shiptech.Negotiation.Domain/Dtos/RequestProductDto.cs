using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Data.Dtos
{
    public class RequestProductDto : BaseDto 
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public long? StatusId { get; set; }
        public string Status { get; set; }
        public string WorkflowId { get; set; }
        public double? MinQuantity { get; set; }
        public double? MaxQuantity { get; set; }
        public long? UomId { get; set; }
        public string UomName { get; set; }
    }
}

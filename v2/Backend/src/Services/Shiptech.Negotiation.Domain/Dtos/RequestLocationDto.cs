using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Data.Dtos
{
    public class RequestLocationDto : BaseDto
    {
        public long LocationId { get; set; }

        public string LocationName { get; set; }
        public long? TerminalId { get; set; }
        public string TerminalName { get; set; }
        public long? StatusId { get; set; }
        public DateTime Eta { get; set; }
        public DateTime? DeliveryFrom { get; set; }
        public DateTime? DeliveryTo { get; set; }
        public List<RequestProductDto> RequestProducts { get; set; }
    }
}

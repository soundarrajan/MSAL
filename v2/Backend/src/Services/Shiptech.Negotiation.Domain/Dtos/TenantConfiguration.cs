using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain.Data.Model
{
    public class TenantConfiguration
    {
        public long TimeZoneId { get; set; }
        public long CurrencyId { get; set; }
    }
}

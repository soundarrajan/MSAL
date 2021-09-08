using Shiptech.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shiptech.Negotiation.Domain
{
    public static class Constants
    {
        public static readonly List<int> validReqGroupStatus = new()
        {
            (int)Status.Validated,
            (int)Status.PartiallyInquired,
            (int)Status.Inquired,
            (int)Status.PartiallyQuoted,
            (int)Status.Quoted,
            (int)Status.ReOpen,
            (int)Status.PartiallyStemmed
        };
    }
}
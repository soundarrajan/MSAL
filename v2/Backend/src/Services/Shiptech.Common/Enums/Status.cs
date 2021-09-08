using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shiptech.Common
{
    public enum Status
    {
        New = 1,
        BunkerStrategy = 2,
        Created = 3,
        Questionnaire = 4,
        Validated = 5,
        ReOpen = 6,
        PartiallyInquired = 7,
        Inquired = 8,
        PartiallyQuoted = 9,
        Quoted = 10,
        PartiallyStemmed = 11,
        Stemmed = 12,
        Confirmed = 13,
        Cancelled = 14,
        Overlapped = 15,
        Redelivery = 16,
        Amended = 17,
        Delivered = 18,
        PartiallyDelivered = 19,
        Completed = 20,
        Invoiced = 21,
        Approved = 22,
        Rejected = 23,
        WaitingForApproval = 24,
        Sent = 25,
        Revoked = 26,
        Discrepancy = 27,
        Resolved = 28,
        NearingEta = 29,
        PartiallyInvoiced = 30,
        Planned = 40,
        PlannedVoid = 41,
        NotApproved = 43,
        Verified = 64,
        Pending = 65,
        ResidueStrategy = 66,
        AlkaliStrategy = 67,
    }
}

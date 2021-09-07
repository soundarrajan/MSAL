namespace Shiptech.Negotiation.Domain.Data.Dtos
{
    public class RequestLocationSellerDto:BaseDto
    {
        public long RequestGroupId { get; set; }
        public long RequestLocationId { get; set; }
        public long LocationId { get; set; }
        public long SellerCounterpartyId { get; set; }
        public string SellerCounterpartyName { get; set; }
        public long CounterpartytypeId { get; set; }
        public string CounterpartyTypeName { get; set; }
        public string PrefferedProductIds { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsSelected { get; set; }
        public string SellerComments { get; set; }
        public string Mail { get; set; }
        public string SenRating { get; set; }
        public string GenPrice { get; set; }
        public string GenRating { get; set; }
        public string PortRating { get; set; }
        public string PortPrice { get; set; }
    }
}

namespace Inatech.Shared.Infrastructure.Tenant
{
    public class TenantUserSettings
    {
        public int TenantId { get; set; }
        public string Url { get; set; }
        public string ClientId  { get; set; }
        public string ConnectionString { get; set; }

        public long UserId { get; set; }
    }
}

using Inatech.Shared.Infrastructure.Tenant;
using System.Threading.Tasks;

namespace Shiptech.Core
{
    public interface ITenantInfoService
    {
        Task<TenantUserSettings> GetTenantInfo(string originUrl, string primeDBConnectionString);
    }
}
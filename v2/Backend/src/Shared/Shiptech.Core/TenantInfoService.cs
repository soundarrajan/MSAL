using Inatech.Shared.Infrastructure.Tenant;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading.Tasks;

namespace Shiptech.Core
{
    public class TenantInfoService : ITenantInfoService
    {        
        private readonly ITenantSettingsService _tenantInfoService;

        private readonly IMemoryCache _memCache;
        public TenantInfoService(ITenantSettingsService tenantSettingsService, IMemoryCache _cache)
        {
            _tenantInfoService = tenantSettingsService;
            _memCache = _cache;
        }
        public async Task<TenantUserSettings> GetTenantInfo(string originUrl, string primeDBConnectionString)
        {
            // Look for cache key
            if (!_memCache.TryGetValue("CachedTenantInfo", out TenantUserSettings mappedTenantConfig))
            {
                // Key not in cache, so get data from db                
                mappedTenantConfig = await _tenantInfoService.GetTenantInfo(originUrl, primeDBConnectionString); // db call to get the tenantInfo
                // Set cache options.
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    // Keep in cache for this time, reset time if accessed.
                    .SetSlidingExpiration(TimeSpan.FromSeconds(60));

                // Save data in cache.
                _memCache.Set("CachedTenantInfo", mappedTenantConfig, cacheEntryOptions);
            }

            return mappedTenantConfig;
        }
    }
}

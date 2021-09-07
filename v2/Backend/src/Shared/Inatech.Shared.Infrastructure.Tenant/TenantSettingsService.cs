using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NETCore.Encrypt;
using Slapper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Inatech.Shared.Infrastructure.Tenant
{
    public interface ITenantSettingsService
    {
        TenantUserSettings Get(int tenantId);
        //Task<TenantSettings> TryGetTenantByHostName(string hostName);
        Task<TenantUserSettings> GetTenantInfo(string originUrl, string primeDBConnectionString);
    }

    public sealed class TenantSettingsService : ITenantSettingsService
    {
        private readonly IConfiguration configuration;
        private readonly ILogger<TenantSettingsService> logger;

        private readonly ConcurrentDictionary<int, TenantUserSettings> _settingsCache = new();
        // private readonly Dictionary<string, TenantSettings> _hostNameToTenantIdMap;
        private string EncryptionKey => configuration != null ? configuration.GetValue<string>("ConnectionStringEncryptionKey") : String.Empty;
        
        private const string selectClientSql = @"SELECT DISTINCT ClientId, TenantId,  
                        TenantDbConnectionString as ConnectionString, Url FROM dbo.MasterConfigurations Where TenantId = @tenantId";

        private const string getTenantInfo = @"SELECT TenantId, TenantDbConnectionString as ConnectionString, ClientID, Url FROM dbo.MasterConfigurations WHERE Url = @Url";
        public TenantSettingsService(ILogger<TenantSettingsService> logger, IConfiguration configuration)
        {
            this.logger = logger;
            this.configuration = configuration;
        }

        public TenantUserSettings Get(int tenantId)
        {
            var settings = _settingsCache.GetOrAdd(tenantId, tId =>
            {
                var tenantSettings = GetTenantDetails(tenantId);
                if (tenantSettings == null)
                    throw new InvalidOperationException($"Could not find TenantSettings for TenantId: {tenantId}");

                var connectionString = tenantSettings.ConnectionString;

                if (!string.IsNullOrEmpty(EncryptionKey))
                {
                    connectionString = EncryptProvider.AESDecrypt(connectionString, EncryptionKey);
                }
                else
                {
                    if (logger != null)
                        logger.LogDebug("Using unencrypted connection string.");
                }

                return tenantSettings;
            });

            return settings;
        }

        /*public async Task<TenantSettings> TryGetTenantByHostName(string hostName)
        {
            var tenant = await Task.FromResult<TenantSettings>(GetTenant(hostName));
            return tenant;
        }

        public dynamic GetTenant(string hostName)
        {
            var tenant = new TenantSettings();
            if (!_hostNameToTenantIdMap.ContainsKey(hostName))
            {
                return tenant;
            }
            tenant = _hostNameToTenantIdMap[hostName];
            return tenant;
        }*/

        private static TenantUserSettings GetTenantDetails(int tenantId)
        {
            string primeDBConnectionString = @"Data Source=euw-sl-np-db-01.database.windows.net;Initial Catalog=Shiptech-PRM-BVT;User ID=supportuser;Password=Inatech@123;MultipleActiveResultSets=True";
            using var connection = new SqlConnection(primeDBConnectionString);
            var value = connection.QueryFirstOrDefault<TenantUserSettings>(selectClientSql, new
            {
                tenantId
            });
            return value;
        }

        public async Task<TenantUserSettings> GetTenantInfo(string originUrl, string primeDBConnectionString)
        {
#if DEBUG
            originUrl = "https://bvt.shiptech.com";
#endif
            TenantUserSettings mappedTenantConfig;            
            using (var connection = new SqlConnection(primeDBConnectionString))
            {
                var tenantConfig = await connection.QueryFirstOrDefaultAsync(getTenantInfo, new
                {
                    Url = originUrl,
                }).ConfigureAwait(false);
                if (tenantConfig is null)
                {
                    throw new UnauthorizedAccessException($"Unauthorized origin.");
                }
                mappedTenantConfig =  AutoMapper.MapDynamic<TenantUserSettings>(tenantConfig);
            }
            return mappedTenantConfig;
        }
    }
}
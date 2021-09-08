using Inatech.Shared.Infrastructure.Logging.Configuration;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using static Inatech.Shared.Infrastructure.Constants.LogProps;

namespace Inatech.Shared.Infrastructure.Logging.Extensions
{
    public static class LogSettingsExtensions
    {
        public static void LogStartConfiguration(this Serilog.ILogger logger, IConfiguration configuration = default, bool inatechEnvVars = true, bool serviceFabricEnvVars = true)
        {
            if (configuration != default)
            {
                var configurationDictionary = configuration.AsEnumerable().ToDictionary(x => x.Key, y => y.Value);
                var secrets = configuration.GetSection(APP_SETTING_SECRETS_KEY)?.Get<List<string>>();
                secrets?.ForEach(key => configurationDictionary.Remove(key));

                logger.ForContext(APP_SETTINGS, configurationDictionary, true)
                    .Information("AppSettings dump. See props for details.");


                var enrich = new EnrichLoggingConfiguration();
                configuration.Bind("Inatech-Logging:Enrich", enrich);


                var props = new Dictionary<string, string>
                {
                    [VSTS_ENV_NAME] = enrich.VstsEnvName,
                    [BRANCH] = enrich.Branch,
                    [COMMIT] = enrich.Commit,
                    [BUILD] = enrich.Build,
                    [BUILD_NAME] = enrich.BuildName,
                    [BUILT_BY] = enrich.BuiltBy,
                    [RELEASE] = enrich.Release,
                    [RELEASE] = enrich.Release,
                    [RELEASE_NAME] = enrich.ReleaseName,
                    [RELEASE_BY] = enrich.ReleaseBy,
                };


                logger.ForContext(DEV_OPS, props, true)
                    .Information("DevOps configuration. See props for details.");
            }


            if (inatechEnvVars || serviceFabricEnvVars)
            {
                IDictionary<string, object> inaSettings = new Dictionary<string, object>();
                IDictionary<string, object> sfSettings = new Dictionary<string, object>();

                foreach (DictionaryEntry entry in Environment.GetEnvironmentVariables())
                {
                    var key = entry.Key.ToString();

                    if (inatechEnvVars && key.StartsWith("INA_"))
                        inaSettings.Add(key, entry.Value);

                    if (serviceFabricEnvVars && key.StartsWith("Fabric_"))
                        sfSettings.Add(key, entry.Value);
                }

                if (inatechEnvVars)
                    logger.ForContext(INATECH_ENV_VARS, inaSettings, true)
                        .Information("Inatech environment variables dump. See props for details.");

                if (serviceFabricEnvVars)
                    logger.ForContext(SF_ENV_VARS, sfSettings, true)
                        .Information("ServiceFabric environment variables dump. See props for details.");
            }
        }
    }
}
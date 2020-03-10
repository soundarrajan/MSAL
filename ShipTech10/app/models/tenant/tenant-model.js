angular.module('shiptech.models')
    .factory('tenantModel', [ '$q', 'tenantResource', '$tenantConfiguration', 'tenantSupplierPortalResource', 'tenantGlobalConfigurationResource', 'tenantGlobalConfigurationSupplierPortalResource', 'payloadDataModel', 'tenantCheckBrowser', 'tenantScheduleDashboardConfiguration', 'tenantEmailConfiguration',
        function($q, tenantResource, $tenantConfiguration, tenantSupplierPortalResource, tenantGlobalConfigurationResource, tenantGlobalConfigurationSupplierPortalResource, payloadDataModel, tenantCheckBrowser, tenantScheduleDashboardConfiguration, tenantEmailConfiguration) {
            let request_data;

            let tenant = null;
            let supplierPortal = null;
            let browserSupport = null;
            let globalConfiguration = null;
            var emailConfiguration = null;
            let scheduleDashboardConfiguration = null;
            var emailConfiguration = null;
            let globalConfigurationSupplierPortal = null;

            /**
    * Retrieve all lists
    * @returns {object} all lists.
    */
            function get() {
                var deferred = $q.defer();
                var response = { payload : $tenantConfiguration.procurementConfiguration };
                deferred.resolve(response);
                return deferred.promise;
            }

            /**
    * Retrieve all lists
    * @returns {object} all lists.
    */
            function getForSupplierPortal(token) {
                if (!supplierPortal) {
                    request_data = {
                        Token: token
                    };

                    return tenantSupplierPortalResource.get(request_data).$promise.then((data) => {
                        supplierPortal = data;
                        return data;
                    });
                }
                return supplierPortal;
            }
            function checkBrowserSupport(token, payload) {
                if (!browserSupport) {
                    request_data = {
                        Token: token,
                        Payload: payload
                    };

                    return tenantCheckBrowser.checkBrowserSupport(request_data).$promise.then((data) => {
                        browserSupport = data;
                        return data;
                    });
                }
                return browserSupport;
            }

            /**
    * Gets the global tenant configuration.
    */
            var deferred;
            var response;
            function getGlobalConfiguration() {
                deferred = $q.defer();
                response = { payload : $tenantConfiguration.generalConfiguration };
                deferred.resolve(response);
                return deferred.promise;
            }
            function getEmailConfiguration() {
                deferred = $q.defer();
                response = { payload : $tenantConfiguration.emailConfiguration };
                deferred.resolve(response);
                return deferred.promise;
            }

            function getScheduleDashboardConfiguration() {
                deferred = $q.defer();
                response = { payload : $tenantConfiguration.scheduleDashboardConfiguration };
                deferred.resolve(response);
                return deferred.promise;
            }

            /**
    * Gets the global tenant configuration.
    */
            function getGlobalConfigurationForSupplierPortal(token) {
                if (!globalConfigurationSupplierPortal) {
                    request_data = {
                        Token: token
                    };

                    return tenantGlobalConfigurationSupplierPortalResource.get(request_data).$promise.then((data) => {
                        globalConfigurationSupplierPortal = data;
                        return data;
                    });
                }
                return globalConfigurationSupplierPortal;
            }

            // return public model API
            return {
                get: get,
                getForSupplierPortal: getForSupplierPortal,
                checkBrowserSupport: checkBrowserSupport,
                getScheduleDashboardConfiguration: getScheduleDashboardConfiguration,
                getGlobalConfiguration: getGlobalConfiguration,
                getGlobalConfigurationForSupplierPortal: getGlobalConfigurationForSupplierPortal,
                getEmailConfiguration: getEmailConfiguration
            };
        } ]);

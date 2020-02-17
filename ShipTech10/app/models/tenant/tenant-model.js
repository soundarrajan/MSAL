angular.module('shiptech.models')
.factory('tenantModel', ['$q', 'tenantResource', '$tenantConfiguration', 'tenantSupplierPortalResource', 'tenantGlobalConfigurationResource', 'tenantGlobalConfigurationSupplierPortalResource', 'payloadDataModel','tenantCheckBrowser','tenantScheduleDashboardConfiguration','tenantEmailConfiguration',
    function ($q, tenantResource, $tenantConfiguration, tenantSupplierPortalResource, tenantGlobalConfigurationResource, tenantGlobalConfigurationSupplierPortalResource, payloadDataModel,tenantCheckBrowser,tenantScheduleDashboardConfiguration, tenantEmailConfiguration) {

    var request_data;

    var tenant = null;
    var supplierPortal = null;
    var browserSupport = null;
    var globalConfiguration = null;
    var emailConfiguration = null;
    var scheduleDashboardConfiguration = null;
    var emailConfiguration = null;
    var globalConfigurationSupplierPortal = null;

    /**
    * Retrieve all lists
    * @return {object} all lists.
    */
    function get() {
		deferred = $q.defer();
		response = {"payload" : $tenantConfiguration.procurementConfiguration}
		deferred.resolve(response);
		return deferred.promise;
    }

    /**
    * Retrieve all lists
    * @return {object} all lists.
    */
    function getForSupplierPortal(token) {
        if (!supplierPortal) {
            request_data = {
                Token: token
            };

            return tenantSupplierPortalResource.get(request_data).$promise.then(function (data) {
                supplierPortal = data;
                return data;
            });
        } else {
            return supplierPortal;
        }
    }
    function checkBrowserSupport(token, payload) {
        if (!browserSupport) {
            request_data = {
                Token: token,
                Payload: payload
            };

            return tenantCheckBrowser.checkBrowserSupport(request_data).$promise.then(function (data) {
                browserSupport = data;
                return data;
            });
        } else {
            return browserSupport;
        }
    }

    /**
    * Gets the global tenant configuration.
    */
    function getGlobalConfiguration() {
		deferred = $q.defer();
		response = {"payload" : $tenantConfiguration.generalConfiguration}
		deferred.resolve(response);
		return deferred.promise;
    }
    function getEmailConfiguration() {
		deferred = $q.defer();
		response = {"payload" : $tenantConfiguration.emailConfiguration}
		deferred.resolve(response);
		return deferred.promise;
    }

    function getScheduleDashboardConfiguration() {
		deferred = $q.defer();
		response = {"payload" : $tenantConfiguration.scheduleDashboardConfiguration}
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

            return tenantGlobalConfigurationSupplierPortalResource.get(request_data).$promise.then(function (data) {
                globalConfigurationSupplierPortal = data;
                return data;
            });
        } else {
            return globalConfigurationSupplierPortal;
        }
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

}]);
angular.module('shiptech.models')
.factory('tenantModel', ['tenantResource', 'tenantSupplierPortalResource', 'tenantGlobalConfigurationResource', 'tenantGlobalConfigurationSupplierPortalResource', 'payloadDataModel','tenantCheckBrowser','tenantScheduleDashboardConfiguration','tenantEmailConfiguration',
    function (tenantResource, tenantSupplierPortalResource, tenantGlobalConfigurationResource, tenantGlobalConfigurationSupplierPortalResource, payloadDataModel,tenantCheckBrowser,tenantScheduleDashboardConfiguration, tenantEmailConfiguration) {

    var request_data;

    /**
    * Retrieve all lists
    * @return {object} all lists.
    */
    function get() {
        request_data = payloadDataModel.create();

        return tenantResource.get(request_data).$promise.then(function (data) {
            return data;
        });
    }

    /**
    * Retrieve all lists
    * @return {object} all lists.
    */
    function getForSupplierPortal(token) {
        request_data = {
            Token: token
        };

        return tenantSupplierPortalResource.get(request_data).$promise.then(function (data) {
            return data;
        });
    }
    function checkBrowserSupport(token, payload) {
        request_data = {
            Token: token,
            Payload: payload
        };

        return tenantCheckBrowser.checkBrowserSupport(request_data).$promise.then(function (data) {
            return data;
        });
    }

    /**
    * Gets the global tenant configuration.
    */
    function getGlobalConfiguration() {
        request_data = {
            Payload: false
        };

        return tenantGlobalConfigurationResource.get(request_data).$promise.then(function (data) {
            return data;
        });
    }
    function getEmailConfiguration() {
        request_data = {
            Payload: false
        };

        return tenantEmailConfiguration.get(request_data).$promise.then(function (data) {
            return data;
        });
    }

    function getScheduleDashboardConfiguration() {
        request_data = {
            Payload: false
        };

        return tenantScheduleDashboardConfiguration.get(request_data).$promise.then(function (data) {
            return data;
        });
    }

    /**
    * Gets the global tenant configuration.
    */
    function getGlobalConfigurationForSupplierPortal(token) {
        request_data = {
            Token: token
        };

        return tenantGlobalConfigurationSupplierPortalResource.get(request_data).$promise.then(function (data) {
            return data;
        });
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
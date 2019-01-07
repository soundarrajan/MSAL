angular.module('shiptech.models')
.factory('tenantModel', ['tenantResource', 'tenantSupplierPortalResource', 'tenantGlobalConfigurationResource', 'tenantGlobalConfigurationSupplierPortalResource', 'payloadDataModel','tenantCheckBrowser','tenantScheduleDashboardConfiguration','tenantEmailConfiguration',
    function (tenantResource, tenantSupplierPortalResource, tenantGlobalConfigurationResource, tenantGlobalConfigurationSupplierPortalResource, payloadDataModel,tenantCheckBrowser,tenantScheduleDashboardConfiguration, tenantEmailConfiguration) {

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
        if (!tenant) {
            request_data = payloadDataModel.create();

            return tenantResource.get(request_data).$promise.then(function (data) {
                tenant = data;
                return data;
            });
        } else {
            return tenant;
        }
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
        if (!globalConfiguration) {
            request_data = {
                Payload: false
            };

            return tenantGlobalConfigurationResource.get(request_data).$promise.then(function (data) {
                globalConfiguration = data;
                return data;
            });
        } else {
            return globalConfiguration;
        }
    }
    function getEmailConfiguration() {
        if (!emailConfiguration) {    
            request_data = {
                Payload: false
            };

            return tenantEmailConfiguration.get(request_data).$promise.then(function (data) {
                emailConfiguration = data;
                return data;
            });
        } else {
            return emailConfiguration;
        }
    }

    function getScheduleDashboardConfiguration() {
        if (!scheduleDashboardConfiguration) {
            request_data = {
                Payload: false
            };

            return tenantScheduleDashboardConfiguration.get(request_data).$promise.then(function (data) {
            	window.scheduleDashboardConfiguration = data;
                scheduleDashboardConfiguration = data;
                return data;
            });
            
        } else {
            return scheduleDashboardConfiguration;
        }
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
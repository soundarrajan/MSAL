angular.module('shiptech.models')
.factory('tenantResource', ['$resource', 'API', function($resource, API) {

    return $resource(API.BASE_URL_DATA_ADMIN + '/api/admin/procurementConfiguration/get/:verb', null,
        {
            'get' : {method:'POST'}
        });
}])

.factory('tenantSupplierPortalResource', ['$resource', 'API', function($resource, API) {

    return $resource(API.BASE_URL_DATA_SELLER_PORTAL + '/api/sellerPortal/admin/procurementConfiguration/get/:verb', null,
        {
            'get' : {method:'POST'}
        });
}])
.factory('tenantGlobalConfigurationResource', ['$resource', 'API', function($resource, API) {

    return $resource(API.BASE_URL_DATA_ADMIN + '/api/admin/generalConfiguration/get:verb', null,
        {
            'get' : {method:'POST'}
        });
}])
.factory('tenantCheckBrowser', ['$resource', 'API', function($resource, API) {

    return $resource(API.BASE_URL_DATA_SELLER_PORTAL + '/api/sellerPortal/admin/checkBrowserSupport', null,
        {
            'checkBrowserSupport' : {method:'POST'}
        });
}])
.factory('tenantScheduleDashboardConfiguration', ['$resource', 'API', function($resource, API) {

    return $resource(API.BASE_URL_DATA_ADMIN + '/api/admin/scheduleDashboardConfiguration/get', null,
        {
            'get' : {method:'POST'}
        });
}])
.factory('tenantGlobalConfigurationSupplierPortalResource', ['$resource', 'API', function($resource, API) {

    return $resource(API.BASE_URL_DATA_SELLER_PORTAL + '/api/sellerPortal/admin/generalConfiguration/get:verb', null,
        {
            'get' : {method:'POST'}
        });
}])
.factory('tenantEmailConfiguration', ['$resource', 'API', function($resource, API) {

    return $resource(API.BASE_URL_DATA_ADMIN + '/api/admin/emailConfiguration/get:verb', null,
        {
            'get' : {method:'POST'}
        });
}]);


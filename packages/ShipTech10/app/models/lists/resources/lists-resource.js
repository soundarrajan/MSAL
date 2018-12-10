angular.module('shiptech.models')
.factory('listsResource', ['$resource', 'API', function($resource, API) {
    return $resource(API.BASE_URL_DATA_INFRASTRUCTURE + '/api/infrastructure/static/lists', null,
        {
            'get' : {method:'POST', isArray: true},
        });
}])
.factory('listsSupplierPortalResource', ['$resource', 'API', function($resource, API) {
    return $resource(API.BASE_URL_DATA_SELLER_PORTAL + '/api/sellerPortal/infrastructure/static/lists', null,
        {
            'get' : {method:'POST', isArray: true},
        });
}])
.factory('specGroupResource', ['$resource', 'resourceInterceptor', 'API', function ($resource, resourceInterceptor, API) {
    //return $resource('js/mockups/new-request-api.js', null,
    return $resource(API.BASE_URL_DATA_MASTERS + '/api/masters/specGroups/:verb', null, {
        'getSpecsByProduct': {
            method: 'POST',
            params: {
                verb: 'getByProduct'
            }
        }
    })
}])
.factory('productsResource', ['$resource', 'resourceInterceptor', 'API', function ($resource, resourceInterceptor, API) {
    //return $resource('js/mockups/new-request-api.js', null,
    return $resource(API.BASE_URL_DATA_MASTERS + '/api/masters/products/getProdType', null, {
        'getProductTypeByProduct': {
            method: 'POST'
        }
    })
}])


angular.module('shiptech.models')
.factory('emailResource', ['$resource', 'resourceInterceptor', 'API', function($resource, resourceInterceptor, API) {
// return $resource('js/mockups/lists.js', null,
return $resource(API.BASE_URL_DATA_EMAIL + '/api/mail/:verb/:action', null,
    {
        'getTemplates' : {method:'POST', params: {verb: 'templates', action:'listByTransactionType'}},
        'saveComments' : {method:'POST', params: {verb: 'comments', action:'save'}, interceptor: resourceInterceptor},
        
        'sendEmail' : {method:'POST', params: {verb: 'sendPreview'}, interceptor: resourceInterceptor},
        'discardPreview' : {method:'POST', params: {verb: 'discardSavedPreview'}, interceptor: resourceInterceptor},
    });
}]);


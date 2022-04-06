angular.module('shiptech.models')
    .factory('spotNegotiationResource', [ '$resource', 'resourceInterceptor', 'API',
        function($resource, resourceInterceptor, API) {
            return $resource(`${API.BASE_URL_DATA_NEGOTIATION }/:controller/:verb/:action`, null,
                {
                    groupRequests: { method: 'POST', params: { controller: 'groups', verb: 'create' }, interceptor: resourceInterceptor },
                    updatePreferredSellers: { method: 'PUT', params: { controller: 'groups', verb: 'update' }, interceptor: resourceInterceptor },
                    amendRFQ: { method: 'PUT', params: { controller: 'RFQ', verb: 'amendRfq' }, interceptor: resourceInterceptor },
                    addSeller: { method: 'POST', params: { controller: 'groups', verb: 'addSellers' }, interceptor: resourceInterceptor },
                    getExchangeRate: { method: 'POST', params: { controller: 'Price', verb: 'getExchangeRate' }}
                });
        } ]);

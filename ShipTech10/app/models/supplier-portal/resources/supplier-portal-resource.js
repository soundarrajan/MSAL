angular.module('shiptech.models')
    .factory('supplierPortalResource', [ '$resource', 'resourceInterceptor', 'API', function($resource, resourceInterceptor, API) {
        // return $resource('js/mockups/new-request-api.js', null,
        return $resource(`${API.BASE_URL_DATA_SELLER_PORTAL }/api/sellerPortal/supplierOffer/:verb`, null,
            {
                getRfq : 	{ method:'GET', params:{ verb:'getRfq' } },
                // 'sendQuote': {method: 'POST', params:{verb:'sendQuote'}, interceptor: resourceInterceptor},
                sendQuote: { method: 'POST', params:{ verb:'sendQuoteNew' }, interceptor: resourceInterceptor },
                sendNoQuote: { method: 'POST', params:{ verb:'sendNoQuote' }, interceptor: resourceInterceptor },
                getPriceHistory: { method: 'POST', params:{ verb:'getPriceHistory' }, interceptor: resourceInterceptor },
                addPhysicalSupplier: { method: 'POST', params:{ verb:'addPhysicalSupplier' }, interceptor: resourceInterceptor },
                changeOfferSupplier: { method: 'POST', params:{ verb:'changePhysicalSupplier' }, interceptor: resourceInterceptor },
                copyPackageOffer: { method: 'POST', params:{ verb:'copyPackageOffer' }, interceptor: resourceInterceptor },
                addSeller: { method: 'POST', params:{ verb:'addSeller' }, interceptor: resourceInterceptor },

            });
    } ])
    .factory('supplierPortalResourceForV2Nego', [ '$resource', 'resourceInterceptor', 'API', function($resource, resourceInterceptor, API) {
        return $resource(`${API.BASE_URL_DATA_SELLER_PORTAL }/api/sellerPortal/admin/:verb`, null,
            {
                //addSeller: { method: 'POST', params: { controller: 'groups', verb: 'addSellers' }, interceptor: resourceInterceptor },
                getExchangeRate: { method: 'POST', params: { verb: 'getExchangeRate' }}
            });
    } ]);

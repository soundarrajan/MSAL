angular.module('shiptech.models')
.factory('groupOfRequestsResource', ['$resource', '$state', 'resourceInterceptor', 'API', 'MOCKUP_MAP',
    function($resource, $state, resourceInterceptor, API, MOCKUP_MAP) {

return $resource(API.BASE_URL_DATA_PROCUREMENT + '/api/procurement/rfq/:verb/:action', null,
    {
        'getList': { method:'POST', params: {verb:'selectRequest'}},
        'getRequests': { method: 'POST', params: {verb: 'autocompleteRequest'}},
        'getGroup': { method: 'POST', params: {verb: 'getGroup'}},
        'groupRequests': { method: 'POST', params: {verb: 'groupRequests'}, interceptor: resourceInterceptor },
        'getBestOffer': { method: 'POST', params: {verb: 'bestOffer'}},
        'getBestTco': { method: 'POST', params: {verb: 'bestTco'}},
        'get': { method:'POST', params: {verb:'get'}},
        'getGroupInfo': { method:'POST', params: {verb:'getGroupInfo'}},
        'getSellersSorted': { method:'POST', params: {verb:'sortSellers'}},
        'sendRFQ': { method:'POST', params: {verb:'sendRfq'}, interceptor: resourceInterceptor},
        'skipRFQ': { method:'POST', params: {verb:'copyLines'}, interceptor: resourceInterceptor},
        'confirmOfferView': { method:'POST', params: {verb:'confirmOfferView'}},
        'confirm': { method:'POST', params: {verb:'confirm'}, interceptor: resourceInterceptor},
        'getViewRFQ': { method:'POST', params: {verb:'rfqview'}},
        'previewRFQ': { method:'POST', params:{verb:'previewRfq'}, interceptor: resourceInterceptor},
        'previewRequote': { method:'POST', params:{verb:'previewRequote'}, interceptor: resourceInterceptor},
        'previewRevokeOrAmend': { method:'POST', params:{verb:'previewRevokeOrAmend'}, interceptor: resourceInterceptor},
        'amend': { method:'POST', params: {verb:'amend'}, interceptor: resourceInterceptor},
        'revoke': { method:'POST', params: {verb:'revoke'}, interceptor: resourceInterceptor},
        'requote': { method:'POST', params: {verb:'requote'}, interceptor: resourceInterceptor},
        'include': { method:'POST', params: {verb:'include'}, interceptor: resourceInterceptor},
        'delink': { method:'POST', params:{verb:'delink'}, interceptor: resourceInterceptor},
        'getOfferDetails': { method:'POST', params: {verb:'getOfferDetails'}},
        'getNewOfferDetails': { method:'POST', params: {verb:'getNewOfferDetails'}},
        'updateOfferDetails': { method:'POST', params:{verb:'updateOfferDetails'}, interceptor: resourceInterceptor},
        'updateGroup': { method:'POST', params:{verb:'updateGroup'}, interceptor: resourceInterceptor},
        'duplicateSeller': { method:'POST', params:{verb:'copyRequirements'}, interceptor: resourceInterceptor},
        'saveBuyerQuote': { method:'POST', params:{verb:'saveBuyerQuote'}, interceptor: resourceInterceptor},
        'updateEnergySpecValues': { method:'POST', params:{verb:'updateEnergySpecValues'}, interceptor: resourceInterceptor},
        'updatePhysicalSupplier': { method:'POST', params:{verb:'updatePhysicalSupplier'}, interceptor: resourceInterceptor},
        'updateBroker': { method:'POST', params:{verb:'updateBroker'}, interceptor: resourceInterceptor},
        'updateIncoterm': { method:'POST', params:{verb:'updateIncoterm'}, interceptor: resourceInterceptor},
        'updateContact': { method:'POST', params:{verb:'updateContact'}, interceptor: resourceInterceptor},
        'updatePrice': { method:'POST', params:{verb:'updatePrice'}, interceptor: resourceInterceptor},
        'removeRequirements': { method:'POST', params:{verb:'removeRequirements'}, interceptor: resourceInterceptor},
        'markCurrentSelection': { method:'POST', params:{verb:'markCurrentSelection'}, interceptor: resourceInterceptor},
        'reviewGroup': { method:'POST', params:{verb:'reviewGroup'}, interceptor: resourceInterceptor},
        'sellerNotInterested': { method:'POST', params:{verb:'sellerNotInterested'}, interceptor: resourceInterceptor},
        'saveSupplierCard': { method:'POST', params:{verb:'updateOfferDetails'}, interceptor: resourceInterceptor},
        'addSeller': { method:'POST', params:{verb:'addSeller'}, interceptor: resourceInterceptor},
        'deleteSeller': { method:'POST', params:{verb:'deleteSeller'}, interceptor: resourceInterceptor},
        'addPhysicalSupplierInCard': { method:'POST', params:{verb:'addPhysicalSupplier'}, interceptor: resourceInterceptor},
        'getPriceTimeline': { method:'POST', params:{verb:'getPriceTimeline'}}
    });
}]);
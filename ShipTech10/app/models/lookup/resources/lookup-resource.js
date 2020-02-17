angular.module('shiptech.models').factory('lookupResource', ['$resource', '$state', 'API', 'MOCKUP_MAP', function($resource, $state, API, MOCKUP_MAP) {
    return $resource(API.BASE_URL_DATA_MASTERS + '/api/masters/:type/:verb', null, {
        'getList': {
            method: 'POST'
        },
        'get': {
            method: 'POST',
            params: {
                verb: 'get'
            }
        },
        'getForRequest': {
            method: 'POST',
            params: {
                verb: 'getForRequest'
            }
        },
        'getCounterpartiesAutocomplete': {
            method: 'POST',
            params: {
                verb: 'listbyTypesAutocomplete'
            }
        },
        'getCounterparties': {
            method: 'POST',
            params: {
                verb: 'listbyTypes'
            }
        },
        'counterparties': {
            method: 'POST',
            params: {
                verb: 'allContacts'
            }
        },
        'getContractSellers': {
            method: 'POST',
            params: {
                type: 'counterparties',
                verb: 'getWithContracts'
            }
        },
        'getAdditionalCostTemplate': {
            method: 'POST',
            params: {
                type: 'additionalcosts',
                verb: 'get'
            }
        },
        'getAdditionalCostTypes': {
            method: 'POST',
            params: {
                type: 'additionalcosts',
                verb: 'listApps'
            }
        },
        'getExchangeRate': {
            method: 'POST',
            params: {
                type: 'exchangeRates',
                verb: 'convertDbResult'
            }
        },
        'getConvertedUOM': {
            method: 'POST',
            params: {
                type: 'uoms',
                verb: 'convertQuantity'
            }
        },
        'getFilteredSpecGroup': {
            method: 'POST',
            params: {
                type: 'specGroups',
                verb: 'getByProduct'
            }
        }
    });
}]).factory('lookupSupplierPortalResource', ['$resource', '$state', 'API', 'MOCKUP_MAP', function($resource, $state, API, MOCKUP_MAP) {
    return $resource(API.BASE_URL_DATA_SELLER_PORTAL + '/api/sellerPortal/masters/:type/:verb', null, {
        'getList': {
            method: 'POST',
            params: {
                verb: 'list'
            }
        },
        // 'get': { method:'POST', params:{verb:'get'}},
        // 'getCounterpartiesAutocomplete': {method:'POST', params:{verb:'listbyTypesAutocomplete'}},
        'getCounterparties': {
            method: 'POST',
            params: {
                verb: 'listbyTypes'
            }
        },
        'counterparties': {
            method: 'POST',
            params: {
                verb: 'allContacts'
            }
        },
        'buyers': {
            method: 'POST',
            params: {
                 type: 'buyers',
                verb: 'allContacts'
            }
        },
        'noQuoteReason': {
            method: 'POST',
            params: {
                verb: 'list'
            }
        },
        // 'getContractSellers': {method:'POST', params:{type:'counterparties', verb:'getWithContracts'}},
        // 'getAdditionalCostTemplate': {method:'POST', params:{type:'additionalcosts', verb:'get'}},
        'getAdditionalCostTypes': {
            method: 'POST',
            params: {
                type: 'additionalcosts',
                verb: 'list'
            }
        },
        'getConvertedUOM': {
            method: 'POST',
            params: {
                type: 'uoms',
                verb: 'convertQuantity'
            }
        }
    });
}]).factory('lookupSpecParameterResource', ['$resource', '$state', 'API', 'MOCKUP_MAP', function($resource, $state, API, MOCKUP_MAP) {
    return $resource(API.BASE_URL_DATA_MASTERS + '/api/masters/specGroups/:verb', null, {
        'getByProduct': {
            method: 'POST',
            params: {
                verb: 'getByProduct'
            }
        },
    });
}]);
angular.module('shiptech.models')
.factory('contractResource', ['$resource', 'API', function($resource, API) {
//return $resource('js/mockups/schedule-dashboard-calendar-api.js', null,
return $resource(API.BASE_URL_DATA_CONTRACTS + '/api/contract/contract/:verb', null,
    {
		'getContractsAutocomplete' : { method:'POST', params:{verb:'search'}},
        'getContractList' : { method:'POST', params:{verb:'list'} },
        'getContractEvaluations': { method:'POST', params:{verb:'evaluation'} }
    });
}]);
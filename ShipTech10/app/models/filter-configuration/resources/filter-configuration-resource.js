angular.module('shiptech.models').factory('filterConfigurationResource', ['$resource', '$state', 'API', 'MOCKUP_MAP', function($resource, $state, API, MOCKUP_MAP) {
    return $resource(API.BASE_URL_DATA_MASTERS + '/api/masters/:type/:verb', null, {
        // 'getList': {
        //     method: 'POST'
        // },
        // 'get': {
        //     method: 'POST',
        //     params: {
        //         verb: 'get'
        //     }
        // },
        'getDefaultFiltersConfiguration': {
            method: 'POST',
            params: {
                type: 'filterconfigurations',
                verb: 'get'
            }
        },
        'saveConfiguration': {
            method: 'POST',
            params: {
                type: 'filterconfigurations',
                verb: 'save'
            }
        },
        'deleteConfiguration': {
            method: 'POST',
            params: {
                type: 'filterconfigurations',
                verb: 'delete'
            }
        },
        'getFiltersConfigurations': {
            method: 'POST',
            params: {
                type: 'filterconfigurations',
                verb: 'list'
            }
        }
    });
}])

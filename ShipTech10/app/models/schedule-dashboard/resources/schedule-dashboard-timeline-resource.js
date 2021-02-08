angular.module('shiptech.models')
    .factory('scheduleDashboardTimelineResource', [ '$resource', 'API', function($resource, API) {
        return $resource(`${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/scheduledashboard/:verb`, null,
            {
    	// TODO: all methods to POST
                getWSeparateBunkerPlan: { method:'POST', params:{ verb:'getWSeparateBunkerPlan' } },
                getTable: { method:'POST', params:{ verb:'getTable' } },
            });
    } ]);

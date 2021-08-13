angular.module('shiptech.models')
    .factory('scheduleDashboardCalendarResource', [ '$resource', 'API', function($resource, API) {
        // return $resource('js/mockups/schedule-dashboard-calendar-api.js', null,
        return $resource(`${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/scheduledashboard/:verb`, null,
            {
    	// TODO: all methods to POST
                getTable: { method:'POST', params:{ verb:'getTable' } },
                getTimeline: { method:'POST', params:{ verb:'getTimeline' } },
            });
    } ]);


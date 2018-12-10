angular.module('shiptech.models')
.factory('scheduleDashboardCalendarResource', ['$resource', 'API', function($resource, API) {
//return $resource('js/mockups/schedule-dashboard-calendar-api.js', null,
return $resource(API.BASE_URL_DATA_PROCUREMENT + '/api/procurement/scheduledashboard/:verb', null,
    {
    	//TODO: all methods to POST
        'fetch': { method:'POST',  params:{verb:'get'}},
        'getTable': { method:'POST', params:{verb:'getTable'}},
    });
}]);


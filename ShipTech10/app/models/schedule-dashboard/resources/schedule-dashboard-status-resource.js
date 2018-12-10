angular.module('shiptech.models')
.factory('scheduleDashboardStatusResource', ['$resource', 'API', function($resource, API) {
	//'/api/procurement/scheduledashboard/table'
return $resource(API.BASE_URL_DATA_ADMIN + '/api/admin/scheduleDashboardConfiguration/get', null,
    {
    	//TODO: all methods to POST
        'fetch': { method:'POST' },
    });
}]);

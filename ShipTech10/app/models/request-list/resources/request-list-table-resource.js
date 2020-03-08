angular.module('shiptech.models')
    .factory('requestListTableResource', [ '$resource', 'API', function($resource, API) {
        // 'js/mockups/new-request-api.js'
        // return $resource('js/mockups/request-list-table-api.js', null,
        return $resource(`${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/:view`, null,
            {
                // TODO: all methods to POST
                fetchTable : 	{ method:'POST', params:{ view:'tableView' } },
                fetchPanel :  { method:'POST', params:{ view:'panelView' } },
                export: 		{ method:'POST', params:{ view:'export' }, responseType: 'arraybuffer',
                        	transformResponse: function(data, headers) {
                            	return {
                                	data: data,
                                	filename: parseFilenameFromHeaders(headers)
                            	};
        					}
        				}
            });
    } ]);

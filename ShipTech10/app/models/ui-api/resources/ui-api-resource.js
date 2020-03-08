angular.module('shiptech.models').factory('uiApiResource', [ '$resource', '$state', 'API', 'MOCKUP_MAP', function($resource, $state, API, MOCKUP_MAP) {
    // The following vars are needed solely for switching between mockup and real API:
    let url,
        method;

    function getResource(url) {
        if (API.USE_LOCAL_MOCKUPS || typeof url != 'number') {
            if (!url) {
                url = MOCKUP_MAP[$state.current.name];
            }
            if (!API.USE_LOCAL_MOCKUPS) {
                url = `${API.BASE_URL_OPEN_SERVER }/${ url}`;
            }
            method = 'GET';
        } else {
            url = `${API.BASE_URL_UI }/get`;
            method = 'POST';
        }
        if (!url) {
            throw 'ui-api-resource.js: uiApiResource URL is invalid (empty).';
        }
        return $resource(url, null, {
            fetch: {
                method: method
            }
        });
    }
    return {
        getResource: getResource
    };
} ]).factory('uiListLayout', [ '$resource', 'API', function($resource, API) {
    return $resource(`${API.BASE_URL_DATA_MASTERS }/api/masters/listconfigurations/:verb`, null, {
        get: {
            method: 'POST',
            params: {
                verb: 'get'
            }
        },
        save: {
            method: 'POST',
            params: {
                verb: 'save'
            }
        },
    });
} ]);

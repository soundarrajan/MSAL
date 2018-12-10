angular.module('shiptech.models').factory('uiApiModel', ['uiApiResource', 'uiListLayout',
    function(uiApiResource, uiListLayout) {
        var screenActions = null;

        function get(endpoint) {
            var request_data = {
                "Payload": {
                    "ScreenType": endpoint
                }
            };
            return uiApiResource.getResource(endpoint).fetch(request_data).
            $promise.
            then(function(data) {
                if (data.layout) {
                    screenActions = data.screenButtons;
                    return JSON.parse(data.layout);
                } else {
                    return data;
                }
            });
        }

        function getScreenActions() {
            if (screenActions) {
                return screenActions.slice(0);
            }
            return null;
        }

        function getListLayout(path) {
            var request_data = {
                "Payload": path,
            };
            return uiListLayout.get(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function saveListLayout(path, layout) {
            var request_data = {
                "Payload": {
                    "Route": path,
                    "Layout": JSON.stringify(layout),
                    "PageSize": 10,
                    "Id": layout.id
                }
            };
            return uiListLayout.save(request_data).$promise.then(function(data) {
                return data;
            });
        }
        // Return public model API.
        return {
            get: get,
            getScreenActions: getScreenActions,
            getListLayout: getListLayout,
            saveListLayout: saveListLayout,
        };
    }
]);
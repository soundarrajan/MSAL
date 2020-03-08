angular.module('shiptech.models').factory('uiApiModel', [ 'uiApiResource', 'uiListLayout',
    function(uiApiResource, uiListLayout) {
        let screenActions = null;

        function get(endpoint) {
            let request_data = {
                Payload: {
                    ScreenType: endpoint
                }
            };
            return uiApiResource.getResource(endpoint).fetch(request_data)
                .$promise
                .then((data) => {
                    if (data.layout) {
                        screenActions = data.screenButtons;
                        return JSON.parse(data.layout);
                    }
                    return data;
                });
        }

        function getScreenActions() {
            if (screenActions) {
                return screenActions.slice(0);
            }
            return null;
        }

        function getListLayout(path) {
            let request_data = {
                Payload: path,
            };
            return uiListLayout.get(request_data).$promise.then((data) => {
                return data;
            });
        }

        function saveListLayout(path, layout) {
            let request_data = {
                Payload: {
                    Route: path,
                    Layout: JSON.stringify(layout),
                    PageSize: 10,
                    Id: layout.id
                }
            };
            return uiListLayout.save(request_data).$promise.then((data) => {
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

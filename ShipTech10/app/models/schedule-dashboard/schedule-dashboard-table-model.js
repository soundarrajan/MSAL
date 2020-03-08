angular.module('shiptech.models').factory('scheduleDashboardTableModel', [ 'scheduleDashboardTableResource', 'payloadDataModel',
    function(scheduleDashboardTableResource, payloadDataModel) {
        let request_data;
        let payload = {};

        function scheduleDashboardTableModel(data) {
            angular.extend(this, data);
        }

        /**
         * Retrieve a list of table rows
         * @returns {Array} An a promise of an array of rows as custom objects.
         */
        function get(filters) {
            if (typeof filters != 'undefined' && filters !== null) {
                payload.PageFilters = {
                    Filters: []
                };
                payload.PageFilters.Filters = filters;
            } else {
                payload = null;
            }
            request_data = payloadDataModel.create(payload);
            // TODO: send request data to resource
            return scheduleDashboardTableResource.fetch().$promise.then((data) => {
                return new scheduleDashboardTableModel(data);
            });
        }
        // return public model API
        return {
            get: get,
        };
    }
]);

angular.module('shiptech.models').factory('scheduleDashboardCalendarModel', ['scheduleDashboardCalendarResource', 'payloadDataModel', 'scheduleDashboardStatusResource', '$q',
    function(scheduleDashboardCalendarResource, payloadDataModel, scheduleDashboardStatusResource, $q) {
        var request_data;
        var payload = {};
        //caching last request result in memory for access from the breadcrumbs or from table view
        var currentModel = new scheduleDashboardCalendarModel();
        //caching statuses
        var statuses = null;
        //flag for determining if model info has been retrieved
        var modelReady = false;

        function scheduleDashboardCalendarModel(data) {
            angular.extend(this, data);
        }
        /**
         * Retrieve a list of rows, given a start and end date.
         * @param {Integer} startDate - The start date as a UNIX timestamp.
         * @param {Integer} endDate - The end date as a UNIX timestamp.
         * @return {Array} An a promise of an array of rows as custom objects.
         */
        function get(startDate, endDate, filters, pagination, search) {
            if (typeof filters != "undefined" && filters !== null) {
                payload.PageFilters = {
                    "Filters": []
                };
                payload.PageFilters.Filters = filters;
            }
            if (typeof startDate == "undefined" || startDate === null || typeof endDate == "undefined" || endDate === null) {
                payload.Start = moment().subtract(7, 'd').utc().startOf('day').toISOString();
                payload.End = moment().add(21, 'd').utc().endOf('day').toISOString();
            } else {
                console.log(startDate)
                payload.Start = moment.unix(startDate.timestamp).utc('dd').startOf('day').toISOString();
                payload.End = moment.unix(endDate.timestamp).utc('dd').endOf('day').toISOString();
            }
            if (typeof pagination != "undefined" && pagination !== null) {
                // Pagination
                payload.Pagination = {
                    "Skip": pagination.start,
                    "Take": pagination.length
                };
            } else payload.Pagination = {
                "Skip": 0,
                "Take": 9999
            };
            if (typeof search != "undefined" && search !== null) {
                payload.SearchText = search;
            } else {
                payload.SearchText = null;
            }
            //complete request data with custom payload info
            request_data = payloadDataModel.create(payload);
            return scheduleDashboardCalendarResource.fetch(request_data).$promise.then(function(data) {
                currentModel = new scheduleDashboardCalendarModel(data);
                modelReady = true;
                return data;
            });
        }

        function getTable(startDate, endDate, order, pagination, filters, search) {

            if (typeof filters != "undefined" && filters !== null) {
                payload.PageFilters = {
                    "Filters": []
                };
                payload.PageFilters.Filters = filters;
            }
            if (typeof order != "undefined" && order !== null) {
                payload.Order = {
                    "ColumnName": order.column,
                    "SortOrder": order.order
                };
            }
            if (typeof search != "undefined" && search !== null) {
                payload.SearchText = search;
            }else {
                payload.SearchText = null;
            }
            if (typeof startDate == "undefined" || startDate === null || typeof endDate == "undefined" || endDate === null) {
                payload.Start = moment().subtract(7, 'd').utc().startOf('day').toISOString();
                payload.End = moment().add(28, 'd').utc().endOf('day').toISOString();
            } else {
                payload.Start = moment(startDate.timestamp, 'X').utc().startOf('day').toISOString();
                payload.End = moment(endDate.timestamp, 'X').utc().endOf('day').toISOString();
            }
            if (typeof pagination != "undefined" && pagination !== null) {
                // Pagination
                payload.Pagination = {
                    "Skip": pagination.start,
                    "Take": pagination.length
                };
            } else payload.Pagination = {
                "Skip": 0,
                "Take": 25
            };
            //complete request data with custom payload info
            request_data = payloadDataModel.create(payload);
            return scheduleDashboardCalendarResource.getTable(request_data).$promise.then(function(data) {
                currentModel = new scheduleDashboardCalendarModel(data);
                modelReady = true;
                return currentModel;
            });
        }

        function getLatestVersion() {
            return currentModel;
        }

        function isModelReady() {
            return modelReady;
        }

        function getStatuses() {
            if (statuses !== null) {
                return $q.when(statuses);
            }
            var requestData = payloadDataModel.create();
            return scheduleDashboardStatusResource.fetch(requestData).$promise.then(function(data) {
                statuses = data.payload;
                return statuses;
            });
        }
        // return public model API
        return {
            get: get,
            getTable: getTable,
            getLatestVersion: getLatestVersion,
            isModelReady: isModelReady,
            getStatuses: getStatuses
        };
    }
]);

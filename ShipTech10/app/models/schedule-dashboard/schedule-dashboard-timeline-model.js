angular.module('shiptech.models').factory('scheduleDashboardTimelineModel', ['scheduleDashboardTimelineResource', 'scheduleDashboardStatusResource', 'payloadDataModel', '$q',
    function(scheduleDashboardTimelineResource, scheduleDashboardStatusResource, payloadDataModel, $q) {
        var request_data;
        var payload = {};
        var currentModel = new scheduleDashboardTimelineModel();

        var statuses = null;

        // flag for determining if model info has been retrieved
        var modelReady = false;

        function scheduleDashboardTimelineModel(data) {
            angular.extend(this, data);
        }
        /**
         * Retrieve a list of rows, given a start and end date.
         * @param {Integer} startDate - The start date as a UNIX timestamp.
         * @param {Integer} endDate - The end date as a UNIX timestamp.
         * @return {Array} An a promise of an array of rows as custom objects.
         */
        function get(startDate, endDate, filters, pagination, search) {
        	var payload = {};
            if (typeof filters != "undefined" && filters !== null) {
                payload.PageFilters = {
                    "Filters": []
                };
                payload.PageFilters.Filters = filters;
            }
            /*
            if (typeof startDate == "undefined" || startDate === null || typeof endDate == "undefined" || endDate === null) {
                payload.Start = moment().subtract(7, 'd').utc().startOf('day').toISOString();
                payload.End = moment().add(21, 'd').utc().endOf('day').toISOString();
            } else {
                console.log(startDate)
                payload.Start = moment.unix(startDate.timestamp).utc('dd').startOf('day').toISOString();
                payload.End = moment.unix(endDate.timestamp).utc('dd').endOf('day').toISOString();
            }
            */

            // startDate = moment().subtract('7', 'days').startOf('day').toISOString();
            // endDate = moment().add(30, 'days').startOf('day').toISOString();

            // Hardcodes dates
             // TODO: Remove when ready
            if (!startDate || !endDate) {
                startDate = moment('2019-04-23').startOf('day').toISOString();
                endDate = moment('2019-06-09').startOf('day').toISOString();
            } else {
                startDate = moment(startDate).startOf('day').toISOString();
                endDate = moment(endDate).startOf('day').toISOString();
            }

            payload.Start = startDate;
            payload.End = endDate;

            if (typeof pagination !== "undefined" && pagination !== null) {
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
            return scheduleDashboardTimelineResource.fetch(request_data).$promise.then(function(data) {
                currentModel = new scheduleDashboardTimelineModel(data);
                modelReady = true;
                return data;
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
            getStatuses: getStatuses,
            getLatestVersion: getLatestVersion,
            isModelReady: isModelReady,
        };
    }
]);

angular.module('shiptech.models').factory('scheduleDashboardCalendarModel', [ 'scheduleDashboardCalendarResource', 'payloadDataModel', 'scheduleDashboardStatusResource', '$q',
    function(scheduleDashboardCalendarResource, payloadDataModel, scheduleDashboardStatusResource, $q) {
        let request_data;
        let payload = {};
        // caching last request result in memory for access from the breadcrumbs or from table view
        let currentModel = new scheduleDashboardCalendarModel();
        // caching statuses
        let statuses = null;
        // flag for determining if model info has been retrieved
        let modelReady = false;

        function scheduleDashboardCalendarModel(data) {
            angular.extend(this, data);
        }

        /**
         * Retrieve a list of rows, given a start and end date.
         * @param {Integer} startDate - The start date as a UNIX timestamp.
         * @param {Integer} endDate - The end date as a UNIX timestamp.
         * @returns {Array} An a promise of an array of rows as custom objects.
         */
        function get(startDate, endDate, filters, pagination, search) {
        	let payload = {};
            if (typeof filters != 'undefined' && filters !== null) {
                payload.PageFilters = {
                    Filters: []
                };
                payload.PageFilters.Filters = filters;
            }
            if (typeof startDate == 'undefined' || startDate === null || typeof endDate == 'undefined' || endDate === null) {
                payload.Start = moment().subtract(7, 'd').utc().startOf('day').toISOString();
                payload.End = moment().add(21, 'd').utc().endOf('day').toISOString();
            } else {
                console.log(startDate);
                payload.Start = moment.unix(startDate.timestamp).utc('dd').startOf('day').toISOString();
                payload.End = moment.unix(endDate.timestamp).utc('dd').endOf('day').toISOString();
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                payload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            } else {
                payload.Pagination = {
                    Skip: 0,
                    Take: 9999
                };
            }
            if (typeof search != 'undefined' && search !== null) {
                payload.SearchText = search;
            } else {
                payload.SearchText = null;
            }
            // complete request data with custom payload info
            request_data = payloadDataModel.create(payload);
            return scheduleDashboardCalendarResource.getTimeline(request_data).$promise.then((data) => {
                currentModel = new scheduleDashboardCalendarModel(data);
                modelReady = true;
                return data;
            });
        }

        function getTable(startDate, endDate, order, pagination, filters, search) {
            if (typeof filters != 'undefined' && filters !== null) {
                payload.PageFilters = {
                    Filters: []
                };
                payload.PageFilters.Filters = filters;
            }
            if (typeof order != 'undefined' && order !== null) {
                payload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof search != 'undefined' && search !== null) {
                payload.SearchText = search;
            }else {
                payload.SearchText = null;
            }
            if (typeof startDate == 'undefined' || startDate === null || typeof endDate == 'undefined' || endDate === null) {
                payload.Start = moment().subtract(7, 'd').utc().startOf('day').toISOString();
                payload.End = moment().add(28, 'd').utc().endOf('day').toISOString();
            } else {
                payload.Start = moment(startDate.timestamp, 'X').utc().startOf('day').toISOString();
                payload.End = moment(endDate.timestamp, 'X').utc().endOf('day').toISOString();
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                payload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            } else {
                payload.Pagination = {
                    Skip: 0,
                    Take: 25
                };
            }
            // complete request data with custom payload info
            request_data = payloadDataModel.create(payload);
            return scheduleDashboardCalendarResource.getTable(request_data).$promise.then((data) => {
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
            let requestData = payloadDataModel.create();
            return scheduleDashboardStatusResource.fetch(requestData).$promise.then((data) => {
                if (data.payload.labels) {
                    let sortedLabelsByDisplayOrder = _.orderBy(data.payload.labels, function(obj) {                
                        return obj.displayOrder;          
                    }, 'asc');
                    data.payload.labels = sortedLabelsByDisplayOrder;
                }
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

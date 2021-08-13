angular.module('shiptech.models').factory('scheduleDashboardTimelineModel', [ 'scheduleDashboardTimelineResource', 'scheduleDashboardStatusResource', 'payloadDataModel', '$q',
    function(scheduleDashboardTimelineResource, scheduleDashboardStatusResource, payloadDataModel, $q) {
        let request_data;
        let payload = {};
        let currentModel = new scheduleDashboardTimelineModel();

        let statuses = null;

        // flag for determining if model info has been retrieved
        let modelReady = false;

        function scheduleDashboardTimelineModel(data) {
            angular.extend(this, data);
        }

        /**
         * Retrieve a list of rows, given a start and end date.
         * @param {Integer} startDate - The start date as a UNIX timestamp.
         * @param {Integer} endDate - The end date as a UNIX timestamp.
         * @returns {Array} An a promise of an array of rows as custom objects.
         */
        function get(startDate, endDate, filters, pagination, search, productTypeView) {
        	let payload = {};
            if (typeof filters != 'undefined' && filters !== null) {
                payload.PageFilters = {
                    Filters: []
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
            startDate = `${moment.utc(startDate).startOf('day').format('YYYY-MM-DD') }T00:00:00.000Z`;
            endDate = `${moment.utc(endDate).startOf('day').format('YYYY-MM-DD') }T23:59:59.999Z`;

            payload.Start = startDate;
            payload.End = endDate;

            if (productTypeView) {
                payload.Filters = [];
                let packedFilter = {
                    columnName: 'ProductTypeId',
                    value:  productTypeView.id 
                };
                payload.Filters.push(packedFilter);
            }


            if (typeof pagination !== 'undefined' && pagination !== null) {
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
            // return scheduleDashboardTimelineResource.fetch(request_data).$promise.then(function(data) {
            return scheduleDashboardTimelineResource.getTimeline(request_data).$promise.then((data) => {
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
            getStatuses: getStatuses,
            getLatestVersion: getLatestVersion,
            isModelReady: isModelReady,
        };
    }
]);

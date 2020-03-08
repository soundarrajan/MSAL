angular.module('shiptech.models').factory('requestListTableModel', [ 'requestListTableResource', 'payloadDataModel',
    function(requestListTableResource, payloadDataModel) {
        let request_data;
        let payload = {
            Order: { ColumnName: 'requestId', SortOrder: 'desc' },
            Filters: [],
            SearchText: null,
            Pagination: {
                Skip: 0,
                Take: 25
            }
        };
        // var currentModel = new requestListTableModel();

        // function requestListTableModel(data) {
        //     angular.extend(this, data);
        // }
        /**
         * Retrieve a list of table rows
         * @returns {Object} A requestlistTableModel object
         */
        function getTable(order, pagination, filters, search) {
            console.log(search);
            if (typeof order != 'undefined' && order !== null) {
                payload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof filters != 'undefined' && filters !== null) {
                payload.PageFilters = {
                    Filters: []
                };
                payload.PageFilters.Filters = filters;
            }
            if (typeof search != 'undefined' && search !== null) {
                payload.SearchText = search;
            } else {
                payload.SearchText = null;
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
            request_data = payloadDataModel.create(payload);
            // TODO: send request data to resource
            return requestListTableResource.fetchTable(request_data).$promise.then((data) => {
                return data;
            });
        }

        /**
         * Retrieve a list of panels
         * @returns {Array} A requestlistTableModel object
         */
        function getPanels(order, pagination) {
            if (typeof order != 'undefined' && order !== null) {
                payload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                payload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            }
            request_data = payloadDataModel.create(payload);
            // TODO: send request data to resource
            return requestListTableResource.fetchPanel(request_data).$promise.then((data) => {
                return new requestListTableModel(data);
            });
        }

        /**
         * Export the list of table rows.
         * @returns {Object} A requestlistTableModel object
         */
        function exportList(order, pagination, columns, fileType, filters, search) {
            let listPayload = angular.copy(payload);
            if (typeof fileType !== 'undefined' && fileType !== null) {
                listPayload.ExportType = fileType;
            } else {
                return $q.reject();
            }
            if (typeof order != 'undefined' && order !== null) {
                listPayload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                listPayload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            } else {
                listPayload.Pagination = {
                    Skip: 0,
                    Take: 10
                };
            }
            if (typeof columns != 'undefined' && columns !== null) {
                listPayload.Columns = columns;
            }
            let timeZone = jstz().timezone_name;
            listPayload.timeZone = timeZone;
            let request_data = payloadDataModel.create(listPayload);
            return requestListTableResource.export(request_data).$promise.then((data) => {
                return data;
            }).catch((error) => {
                // convert error from arraybuffer to string
                let charCodeArray = Array.apply(null, new Uint8Array(error.data.data));
                let result = '';
                for (i = 0, len = charCodeArray.length; i < len; i++) {
                    code = charCodeArray[i];
                    result = result + String.fromCharCode(code);
                }
            });
        }
        // return public model API
        return {
            getTable: getTable,
            getPanels: getPanels,
            exportList: exportList
        };
    }
]);

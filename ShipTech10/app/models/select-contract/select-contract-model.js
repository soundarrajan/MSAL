angular.module('shiptech.models').factory('selectContractModel', [
    '$q',
    'newRequestResource',
    'payloadDataModel',
    'contractResource',
    function($q, newRequestResource, payloadDataModel, contractResource) {
        let default_payload = {
            Order: null,
            Filters: [],
            Pagination: {
                Skip: 0,
                Take: 25
            }
        };

        function selectContractModel(data) {
            angular.extend(this, data);
        }

        /**
         * Retrieve a pre-populated request
         * @param {Integer} data - request Id
         * @returns {object} pre-populated request objects.
         */
        function getBestContract(data, pagination, search) {
            let payload = angular.copy(default_payload);
            let request_data = payloadDataModel.create(payload);
            request_data.Payload.Order = null;
            request_data.Payload.Filters = [
                {
                    ColumnName: 'RequestId',
                    Value: data
                }
            ];
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                request_data.Payload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            } else {
                request_data.Payload.Pagination = {
                    Skip: 0,
                    Take: 9999
                };
            }
            if (search) {
                request_data.Payload.SearchText = search;
            }
            return newRequestResource.getBestContract(request_data).$promise.then((data) => {
                return new selectContractModel(data);
            });
        }

        function getAllContract(data, pagination, search) {
            let payload = angular.copy(default_payload);
            let request_data = payloadDataModel.create(payload);
            request_data.Payload.Order = null;
            request_data.Payload.Filters = [
                {
                    ColumnName: 'RequestId',
                    Value: data
                }
            ];
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                request_data.Payload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            } else {
                request_data.Payload.Pagination = {
                    Skip: 0,
                    Take: 25
                };
            }
            if (search) {
                request_data.Payload.SearchText = search;
            }
            return newRequestResource.getAllContract(request_data).$promise.then((data) => {
                return new selectContractModel(data);
            });
        }

        function getContractPlanning(order, pagination, pageFilters, filters, search) {
            let payload = angular.copy(default_payload);
            let request_data = payloadDataModel.create(payload);
            if (typeof pageFilters != 'undefined' && pageFilters !== null) {
                payload.PageFilters = {
                    Filters: []
                };
                payload.PageFilters.Filters = pageFilters;
            }
            if (typeof search != 'undefined' && search !== null) {
                payload.SearchText = search;
            }
            if (typeof order != 'undefined' && order !== null && order.column) {
                request_data.Payload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                request_data.Payload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            }
            request_data.Payload.Filters = filters;
            return newRequestResource.getContractPlanning(request_data).$promise.then((data) => {
                return new selectContractModel(data);
            });
        }

        /**
         * Export the list of table rows.
         * @returns {Object} A requestlistTableModel object
         */
        function getContractPlanningExport(order, filters, pagination, columns, fileType) {
            let listPayload = angular.copy(default_payload);
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
            if (typeof filters != 'undefined' && filters !== null) {
                listPayload.Filters = angular.copy(filters);
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
            return newRequestResource
                .getContractPlanningExport(request_data)
                .$promise.then((data) => {
                    return data;
                })
                .catch((error) => {
                    // convert error from arraybuffer to string
                    let charCodeArray = Array.apply(null, new Uint8Array(error.data.data));
                    let result = '';
                    for (var i = 0, len = charCodeArray.length; i < len; i++) {
                        var code = charCodeArray[i];
                        result = result + String.fromCharCode(code);
                    }
                });
        }

        /**
         * Gets a list of contract evaluations.
         * @param {Object} args - A hash of arguments to pass along to the relevant model/resource.
         * @param {Integer} args.requestId - A valid request ID.
         * @param {Integer} args.contractId - A valid contract ID.
         * @returns {Promise} A promise fetching the requested data upon fullfilment.
         */
        function getContractEvaluations(args) {
            let payload = angular.copy(default_payload);
            let request_data = payloadDataModel.create(payload);
            request_data.Payload.Order = null;
            request_data.Payload.Filters = [
                {
                    ColumnName: 'RequestId',
                    Value: args.requestId
                },
                {
                    ColumnName: 'ContractId',
                    Value: args.contractId
                }
            ];
            request_data.Payload.Pagination = null;
            return contractResource.getContractEvaluations(request_data).$promise.then((data) => {
                return new selectContractModel(data);
            });
        }

        function getSuggestedContracts(order, pagination, filters) {
            let payload = angular.copy(default_payload);
            let request_data = payloadDataModel.create(payload);
            request_data.Payload.Order = null;
            request_data.Payload.Filters = filters;
            request_data.Payload.Pagination = {
                Skip: 0,
                Take: 100
            };
            return newRequestResource.getSuggestedContracts(request_data).$promise.then((data) => {
                return new selectContractModel(data);
            });
        }

        function getContractsAutocomplete(search) {
            let payload = angular.copy(default_payload);
            let request_data = payloadDataModel.create(payload);
            request_data.Payload.Order = null;
            // request_data.Payload.Filters = [{
            //     "ColumnName": "Name",
            //     "Value": 2016
            // }];
            return contractResource.getContractsAutocomplete(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getContractList(order, pagination) {
            let payload = angular.copy(default_payload);
            if (typeof order != 'undefined' && order !== null && order.column) {
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
            let request_data = payloadDataModel.create(payload);
            return contractResource.getContractList(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getRequestContract(requestId, contractId) {
            let payload = angular.copy(default_payload);
            let request_data = payloadDataModel.create(payload);
            request_data.Payload.Order = null;
            request_data.Payload.Filters = [
                {
                    ColumnName: 'RequestId',
                    Value: requestId
                },
                {
                    ColumnName: 'ContractId',
                    Value: contractId
                }
            ];
            return newRequestResource.getRequestContract(request_data).$promise.then((data) => {
                return data;
            });
        }
        // return public model API
        return {
            getBestContract: getBestContract,
            getContractsAutocomplete: getContractsAutocomplete,
            getRequestContract: getRequestContract,
            getContractList: getContractList,
            getAllContract: getAllContract,
            getContractPlanning: getContractPlanning,
            getContractPlanningExport: getContractPlanningExport,
            getContractEvaluations: getContractEvaluations,
            getSuggestedContracts: getSuggestedContracts
        };
    }
]);

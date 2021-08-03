angular.module('shiptech.models').factory('lookupModel', [ 'lookupResource', 'lookupSupplierPortalResource', 'lookupSpecParameterResource', 'payloadDataModel', 'groupOfRequestsModel', 'selectContractModel', 'LOOKUP_TYPE', 'IDS',
    function(lookupResource, lookupSupplierPortalResource, lookupSpecParameterResource, payloadDataModel, groupOfRequestsModel, selectContractModel, LOOKUP_TYPE, IDS) {
        // Setup vessel name lookup request data.
        let payload = {
            Order: null,
            Filters: [],
            Pagination: {
                Skip: 0,
                Take: 25
            }
        };

        /**
         * Get data via the associated resource.
         * @returns {Promise} A promise.
         */
        function getList(type, order, pagination, filters, search, vesselId, destinationId) {
            let typeForCall = type;
            let verb = 'list';
            if (type === LOOKUP_TYPE.VOYAGES) {
                var dest;
                var vess;
                if (destinationId) {
                    dest = destinationId;
                } else {
                    dest = null;
                }
                if (vesselId) {
                    vess = vesselId;
                } else {
                    vess = null;
                }
                typeForCall = 'locations';
                verb = 'listVessel';
                payload.filters = [ {
                    ColumnName: 'VesselId',
                    Value: vess
                }, {
                    ColumnName: 'VesselVoyageDetailId',
                    Value: dest
                } ];
            }
            let lookupPayload = angular.copy(payload);
            if (type === LOOKUP_TYPE.REQUEST) {
                return groupOfRequestsModel.getResourceList(order, pagination, search);
            }
            if (type === LOOKUP_TYPE.CONTRACT) {
                return selectContractModel.getContractList(order, pagination);
            }
            if (typeof search != 'undefined' && search !== null) {
                lookupPayload.SearchText = search;
            }
            if (typeof order != 'undefined' && order !== null && order.column) {
                lookupPayload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                lookupPayload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            }
            if (typeof filters != 'undefined' && filters !== null) {
                lookupPayload.Filters.length = 0;
                //handle multi column filter payload
                if (filters?.length) {
                    lookupPayload.Filters.push(...filters);
                } else {
                    lookupPayload.Filters.push(filters);
                }
            }
            let request_data = payloadDataModel.create(lookupPayload);
            return lookupResource.getList({
                verb: verb,
                type: typeForCall,
            }, request_data).$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get data via the associated resource.
         * @returns {Promise} A promise.
         */
        function getListForSupplierPortal(token, type, order, pagination, filters, search) {
            let lookupPayload = angular.copy(payload);
            if (type === LOOKUP_TYPE.REQUEST) {
                return groupOfRequestsModel.getResourceList(order, pagination);
            }
            if (type === LOOKUP_TYPE.CONTRACT) {
                return selectContractModel.getContractList(order, pagination);
            }
            if (typeof search != 'undefined' && search !== null) {
                payload.SearchText = search;
            }
            if (typeof order != 'undefined' && order !== null && order.column) {
                lookupPayload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                lookupPayload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            }
            if (typeof filters != 'undefined' && filters !== null) {
                lookupPayload.Filters.length = 0;
                lookupPayload.Filters.push(filters);
            }
            let request_data = {
                Token: token,
                Parameters: lookupPayload
            };
            return lookupSupplierPortalResource.getList({
                type: type
            }, request_data).$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get data via the associated resource.
         * @param {*} requestData - Payload request data, request-specific.
         * @returns {Promise} A promise.
         */
        function get(type, id) {
            let request_data = payloadDataModel.create(id);
            return lookupResource.get({
                type: type
            }, request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getForRequest(type, id) {
            let request_data = payloadDataModel.create(id);
            return lookupResource.getForRequest({
                type: type
            }, request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get data via the associated resource.
         * @param {*} requestData - Payload request data, request-specific.
         * @returns {Promise} A promise.
         */
        function getAdditionalCostTemplate(additionalCostTypeId) {
            let request_data = payloadDataModel.create(additionalCostTypeId);
            return lookupResource.getAdditionalCostTemplate(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getAdditionalCostTypes() {
            let request_data = payloadDataModel.create({});
            return lookupResource.getAdditionalCostTypes(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getAdditionalCostTypesForSupplierPortal(token) {
            let request_data = {
                Token: token,
                Parameters: {}
            };
            request_data.Token = token;
            return lookupSupplierPortalResource.getAdditionalCostTypes(request_data).$promise.then((data) => {
                return data;
            });
        }
        function getBuyerDetailsForSupplierPortal(token, buyerId) {
            let request_data = {
                Token: token,
                Parameters: buyerId
            };
            request_data.Token = token;
            return lookupSupplierPortalResource.buyers(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getConvertedUOMForSupplierPortal(token, product, quantity, fromUOM, toUOM) {
            let request_data = {
                Token: token,
                Parameters: {}
            };
            request_data.Parameters = {
                ProductId: product,
                Quantity: quantity,
                FromUomId: fromUOM,
                ToUomId: toUOM
            };
            return lookupSupplierPortalResource.getConvertedUOM(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get all contacts associated with a counterparty (be it an agent, buyer, etc.)
         * @param {*} requestData - Payload request data, request-specific.
         * @returns {Promise} A promise.
         */
        function getCounterpartyContacts(counterpartyId) {
            let request_data = payloadDataModel.create(counterpartyId);
            return lookupResource.counterparties({
                type: LOOKUP_TYPE.COUNTERPARTIES
            }, request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get all contacts associated with a counterparty (be it an agent, buyer, etc.)
         * @param {*} requestData - Payload request data, request-specific.
         * @returns {Promise} A promise.
         */
        function getCounterpartyContactsForSupplierPortal(token, counterpartyId) {
            let request_data = {
                Token: token,
                Parameters: counterpartyId
            };
            return lookupSupplierPortalResource.counterparties({
                type: LOOKUP_TYPE.COUNTERPARTIES
            }, request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }
        function getNoQuoteReasonForSupplierPortal(token) {
            let request_data = {
                Token: token,
                Parameters: {}
            };
            return lookupSupplierPortalResource.noQuoteReason({
                type: LOOKUP_TYPE.NO_QUOTE_REASON
            }, request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get seller autocomplete data via the associated resource.
         * @param {Array} sellerTypeIds - list of types for getting the sellers
         * @returns {Promise} A promise.
         */
        function getSellerAutocompleteList(sellerTypeIds) {
            let sellerPayload = angular.copy(payload);
            let autocompleteFilter = {
                ColumnName: 'CounterpartyTypes',
                Value: sellerTypeIds.join(',')
            };
            sellerPayload.Order = {
                ColumnName: 'Name',
                SortOrder: 'Asc'
            };
            sellerPayload.Filters.push(autocompleteFilter);
            sellerPayload.Pagination = null;
            sellerPayload.SearchText = null;
            let request_data = payloadDataModel.create(sellerPayload);
            return lookupResource.getCounterpartiesAutocomplete({
                type: LOOKUP_TYPE.SELLER
            }, request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get seller data via the associated resource.
         * @param {Array} sellerTypeIds - list of types for getting the sellers
         * @returns {Promise} A promise.
         */
        function getSellerList(sellerTypeIds, order, pagination, filters) {
            let sellerPayload = angular.copy(payload);
            let autocompleteFilter = null;
            let type = LOOKUP_TYPE.SELLER;
            if (sellerTypeIds != IDS.FAKE_SELLER_TYPE_ID) {
                autocompleteFilter = [ {
                    ColumnName: 'CounterpartyTypes',
                    Value: sellerTypeIds.join(',')
                } ];
            } else {
                return getContractSellers(order, pagination, filters);
            }
            if (typeof order != 'undefined' && order !== null && order.column) {
                sellerPayload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                sellerPayload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            }
            sellerPayload.Filters = autocompleteFilter;
            sellerPayload.SearchText = null;
            let request_data = payloadDataModel.create(sellerPayload);
            return lookupResource.getCounterparties({
                type: type
            }, request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get seller data via the associated resource.
         * @param {Array} sellerTypeIds - list of types for getting the sellers
         * @returns {Promise} A promise.
         */
        function getSellerListForSupplierPortal(token, sellerTypeIds, order, pagination, filters) {
            let sellerPayload = angular.copy(payload);
            let autocompleteFilter = null;
            let type = LOOKUP_TYPE.SELLER;
            if (sellerTypeIds != IDS.FAKE_SELLER_TYPE_ID) {
                autocompleteFilter = [ {
                    ColumnName: 'CounterpartyTypes',
                    Value: sellerTypeIds.join(',')
                } ];
            } else {
                return getContractSellers(order, pagination, filters);
            }
            if (typeof order != 'undefined' && order !== null && order.column) {
                sellerPayload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                sellerPayload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            }
            sellerPayload.Filters = autocompleteFilter;
            sellerPayload.SearchText = null;
            let request_data = {
                Token: token,
                Parameters: sellerPayload
            };
            return lookupSupplierPortalResource.getCounterparties({
                type: type
            }, request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getContractSellers(order, pagination, filters) {
            let sellerPayload = angular.copy(payload);
            sellerPayload.Filters = filters;
            if (typeof order != 'undefined' && order !== null && order.column) {
                sellerPayload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                sellerPayload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            }
            let request_data = payloadDataModel.create(sellerPayload);
            return lookupResource.getContractSellers(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getExchangeRate(from, to) {
            let request_data = {
                Payload: payload
            };
            request_data.Payload.Filters = [ {
                ColumnName: 'FromCurrencyId',
                Value: from.id
            }, {
                ColumnName: 'ToCurrencyId',
                Value: to.id
            }, {
                ColumnName: 'ExchangeDate',
                Value: moment()
            }, {
                ColumnName: 'Amount',
                Value: 1
            } ];
            return lookupResource.getExchangeRate(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getConvertedUOM(product, quantity, fromUOM, toUOM, orderProductId) {
            let request_data = {
                Payload: payload
            };
            request_data.Payload = {
                ProductId: product,
                OrderProductId: orderProductId,
                Quantity: quantity,
                FromUomId: fromUOM,
                ToUomId: toUOM
            };
            return lookupResource.getConvertedUOM(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Default function to use by Twitter Typehead inputs.
         * @param {Array} strings - An array of strings to match.
         */
        function substrMatcher(strings) {
            return function findMatches(q, cb) {
                let matches;
                // an array that will be populated with substring matches
                matches = [];
                // regex used to determine if a string contains the substring `q`
                var substrRegex = new RegExp(q, 'i');
                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(strings, (i, str) => {
                    if (substrRegex.test(str)) {
                        matches.push(str);
                    }
                });
                cb(matches);
            };
        }

        function getSpecParameterForRequestProduct(productId) {
            // var request_data = payloadDataModel.create(productId);
            var data = {
                Payload: {
                    Filters: [ {
                        ColumnName: 'ProductId',
                        Value: productId
                    } ]
                }
            };
            return lookupSpecParameterResource.getByProduct({
                type: LOOKUP_TYPE.GETBYPRODUCT
            }, data)
                .$promise
                .then((data) => {
                    return data;
                });
        }
        // Return public model API.
        return {
            get: get,
            getList: getList,
            getForRequest: getForRequest,
            substrMatcher: substrMatcher,
            getSellerAutocompleteList: getSellerAutocompleteList,
            getSellerList: getSellerList,
            getCounterpartyContacts: getCounterpartyContacts,
            getAdditionalCostTemplate: getAdditionalCostTemplate,
            getAdditionalCostTypes: getAdditionalCostTypes,
            getExchangeRate: getExchangeRate,
            getConvertedUOM: getConvertedUOM,
            getListForSupplierPortal: getListForSupplierPortal,
            getAdditionalCostTypesForSupplierPortal: getAdditionalCostTypesForSupplierPortal,
            getCounterpartyContactsForSupplierPortal: getCounterpartyContactsForSupplierPortal,
            getSellerListForSupplierPortal: getSellerListForSupplierPortal,
            getConvertedUOMForSupplierPortal: getConvertedUOMForSupplierPortal,
            getSpecParameterForRequestProduct: getSpecParameterForRequestProduct,
            getNoQuoteReasonForSupplierPortal: getNoQuoteReasonForSupplierPortal,
            getBuyerDetailsForSupplierPortal: getBuyerDetailsForSupplierPortal
        };
    }
]);

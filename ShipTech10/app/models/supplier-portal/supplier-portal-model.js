angular.module('shiptech.models').factory('supplierPortalModel', [ 'supplierPortalResource', 'payloadDataModel', 'spotNegotiationResource', 'supplierPortalResourceForV2Nego',
    function(supplierPortalResource, payloadDataModel, spotNegotiationResource, supplierPortalResourceForV2Nego) {
        this.saved = false;

        function newRequestModel(data) {
            angular.extend(this, data);
        }

        /**
         * Retrieve a pre-populated request
         * @param {Integer} data - request Id
         * @returns {object} pre-populated request objects.
         */
        function getRfq(token) {
            return supplierPortalResource.getRfq({
                Token: token
            }).$promise.then((data) => {
                return data;
            });
        }

        function sendQuote(token, payload) {
            let request_data = {
                Token: token,
                Individuals: payload.individuals,
                Packages: payload.packages,
                Validity: payload.validity
            };
            return supplierPortalResource.sendQuote(request_data).$promise.then((data) => {
                return data;
            });
        }

        function sendNoQuote(token, payload) {
            let request_data = {
                Token: token,
                Individuals: payload.individuals,
                Packages: payload.packages
            };
            return supplierPortalResource.sendNoQuote(request_data).$promise.then((data) => {
                return data;
            });
        }

        function addPhysicalSupplier(token, supplier) {
            let request_data = {
                Token: token,
                Payload: supplier
            };
            return supplierPortalResource.addPhysicalSupplier(request_data).$promise.then((data) => {
                return data;
            });
        }


        function copyPackageOffer(token, package) {
            let request_data = {
                Token: token,
                Payload: package
            };
            return supplierPortalResource.copyPackageOffer(request_data).$promise.then((data) => {
                return data;
            });
        }

        function changeOfferSupplier(token, supplier, offerIds) {
            let request_data = {
                Token: token,
                PhysicalSupplierId: supplier,
                RequestOfferIds: offerIds
            };
            return supplierPortalResource.changeOfferSupplier(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getExchangeRateForSellerPortal(token, from, to) {
            let payload = {
                Order: null,
                Filters: [ {
                    ColumnName: 'FromCurrencyId',
                    Value: from.id
                }, {
                    ColumnName: 'ToCurrencyId',
                    Value: to.id
                } ],
                Pagination: {
                    Skip: 0,
                    Take: 25
                }
            };
            let request_data = {
                Token: token,
                Payload: payload
            };

            return supplierPortalResourceForV2Nego.getExchangeRate(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function addSeller(token, payload) {
            let request_data = {
                Token: token,
                Payload: payload
            };
            return supplierPortalResource.addSeller(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getPriceHistory(token, locationId, sellerId) {
            let request_data = {
                Order: null,
                Filters: [ {
                    ColumnName: 'Token',
                    OperationType: 0,
                    ValueType: 5,
                    Value: token
                }, {
                    ColumnName: 'RequestLocationId',
                    OperationType: 0,
                    ValueType: 5,
                    Value: locationId
                }, {
                    ColumnName: 'SellerId',
                    OperationType: 0,
                    ValueType: 5,
                    Value: sellerId
                } ],
                Pagination: {
                    Skip: 0,
                    Take: 10
                }
            };
            return supplierPortalResource.getPriceHistory(request_data).$promise.then((data) => {
                return data;
            });
        }
        // return public model API
        return {
            getRfq: getRfq,
            sendQuote: sendQuote,
            sendNoQuote: sendNoQuote,
            getPriceHistory: getPriceHistory,
            addPhysicalSupplier: addPhysicalSupplier,
            changeOfferSupplier: changeOfferSupplier,
            addSeller: addSeller,
            copyPackageOffer: copyPackageOffer,
            getExchangeRateForSellerPortal: getExchangeRateForSellerPortal
        };
    }
]);

angular.module('shiptech.models').factory('groupOfRequestsModel', [ 'groupOfRequestsResource', 'payloadDataModel', 'SELLER_SORT_ORDER', 'spotNegotiationResource',
    function(groupOfRequestsResource, payloadDataModel, SELLER_SORT_ORDER, spotNegotiationResource) {
        let payload = {
            Order: null,
            Filters: [],
            Pagination: {
                Skip: 0,
                Take: 25
            }
        };

        function groupOfRequestsModel(data) {
            angular.extend(this, data);
        }

        /**
         * Group several requests into a Group of Requests to be used in the respective view.
         * The API call saves the group on the server. One use case is the user clicking on
         * the Group button in All Requests Table.
         * @param {Array} -  An array of the request IDs to be grouped together.
         */
        function groupRequests(requestIds) {
            // let request_data = payloadDataModel.create(requestIds);

            return spotNegotiationResource.groupRequests(requestIds)

                .$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get a Requests list for, e.g., the Request lookup field.
         * @returns {Promise} A promise.
         */
        function getRequests() {
            let requestsPayload = angular.copy(payload);
            let request_data = payloadDataModel.create(requestsPayload);
            // screenLoader.showLoader();
            return groupOfRequestsResource.getRequests(request_data)
                .$promise
                .then((data) => {
                    return data;
                }).finally(() => {
                    // screenLoader.hideLoader();
                });
        }

        /**
         * Get a the data for the whole Group of Requests view.
         * @param {Integer} requestGroupId - The ID of the Request Group.
         * @returns {Promise} A promise.
         */
        function getGroup(requestGroupId) {
            let request_data = payloadDataModel.create(requestGroupId);
            return groupOfRequestsResource.getGroup(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getPriceTimeline(requestId, productId, uomId) {
            let payload = {
                RequestId: requestId,
                // "ProductId": productId,
                RequestProductId: productId,
                UomId: uomId
            };
            let request_data = payloadDataModel.create(payload);
            return groupOfRequestsResource.getPriceTimeline(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get a the Best Offer data.
         * @param {Integer[]} - An array of product IDs.
         * @returns {Promise} A promise.
         */
        function getBestOffer(productIds) {
            let offerPayload = angular.copy(payload);
            // no pagination on best offer so get all the rows at once
            if (!offerPayload) {
                offerPayload = {};
            }
            if (!offerPayload.Pagination) {
                offerPayload.Pagination = {};
            }
            offerPayload.Pagination.Take = 100;
            let request_data = payloadDataModel.create(offerPayload);
            request_data.Payload.Filters = [ {
                ColumnName: 'RequestProductIdList',
                OperationType: 0,
                ValueType: 5,
                Value: productIds
            } ];
            return groupOfRequestsResource.getBestOffer(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getBestTco(productIds, groupId) {
            let offerPayload = angular.copy(payload);
            // no pagination on best offer so get all the rows at once
            if (!offerPayload) {
                offerPayload = {};
            }
            if (!offerPayload.Pagination) {
                offerPayload.Pagination = {};
            }
            offerPayload.Pagination.Take = 100;
            let request_data = payloadDataModel.create(offerPayload);
            request_data.Payload.Filters = [ {
                ColumnName: 'RequestProductIdList',
                OperationType: 0,
                ValueType: 5,
                Value: productIds
            }, {
                ColumnName: 'RequestGroupId',
                OperationType: 0,
                ValueType: 5,
                Value: groupId
            } ];
            return groupOfRequestsResource.getBestTco(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        /**
         * Get data via the associated resource.
         * @returns {Promise} A promise.
         */
        function getResourceList(order, pagination, searchText) {
            let resourcePayload = angular.copy(payload);
            if (typeof order != 'undefined' && order !== null && order.column) {
                resourcePayload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                resourcePayload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            }
            if (typeof searchText != 'undefined' && searchText !== null) {
                resourcePayload.SearchText = searchText;
            } else {
                resourcePayload.SearchText = '';
            }
            let request_data = payloadDataModel.create(resourcePayload);
            return groupOfRequestsResource.getList(request_data).$promise.then((data) => {
                return data;
            });
        }

        /**
         * Get sellers data by preference.
         * @returns {Promise} A promise.
         */
        function getSellersSorted(counterpartyIds, productIds, sortOrder) {
            let sellersPayload = angular.copy(payload);
            let request_data = payloadDataModel.create(sellersPayload);
            if (typeof sortOrder === 'undefined' || sortOrder === null) {
                sortOrder = SELLER_SORT_ORDER.RATING;
            }
            if (typeof request_data.Payload.Filters == 'undefined') {
            	request_data.Payload.Filters = [];
            }
            request_data.Payload.Filters.push({
                ColumnName: 'CounterpartyList',
                Value: counterpartyIds
            });
            request_data.Payload.Filters.push({
                ColumnName: 'RequestProductList',
                Value: productIds
            });
            request_data.Payload.Filters.push({
                ColumnName: 'SortOrder',
                Value: sortOrder
            });
            return groupOfRequestsResource.getSellersSorted(request_data).$promise.then((data) => {
                return data;
            });
        }
        function getEnergyBladeContentByProduct(payload) {
            let request_data = payloadDataModel.create(payload);
            return groupOfRequestsResource.getEnergyBladeContentByProduct(request_data).$promise.then((data) => {
                return data;
            });
        }

        /**
         * Send rfq requirements
         * @returns {Promise} A promise.
         */
        function sendRFQ(rfq) {
            let request_data = payloadDataModel.create(rfq);
            return groupOfRequestsResource.sendRFQ(request_data).$promise.then((data) => {
                return data;
            });
        }

        function skipRFQ(rfq) {
            let request_data = payloadDataModel.create(rfq);
            return groupOfRequestsResource.skipRFQ(request_data).$promise.then((data) => {
                return data;
            });
        }
        function switchHasNoQuote(data) {
            return groupOfRequestsResource.switchHasNoQuote(data).$promise.then((data) => {
                return data;
            });
        }

        function confirmOfferView(productsIds, offerIds) {
            let confirmPayload = angular.copy(payload);
            let request_data = payloadDataModel.create(confirmPayload);
            request_data.Payload.Filters.push({
                ColumnName: 'RequestProductIdList',
                Value: productsIds
            });
            request_data.Payload.Filters.push({
                ColumnName: 'RequestOfferList',
                Value: offerIds
            });
            return groupOfRequestsResource.confirmOfferView(request_data).$promise.then((data) => {
                return data;
            });
        }

        function markCurrentSelection(offerIds) {
            let confirmPayload = angular.copy(payload);
            let request_data = payloadDataModel.create(confirmPayload);
            request_data.Payload.Filters.push({
                ColumnName: 'RequestOfferIdList',
                Value: offerIds
            });
            return groupOfRequestsResource.markCurrentSelection(request_data).$promise.then((data) => {
                return data;
            });
        }

        function confirm(rfq) {
            let request_data = payloadDataModel.create(rfq);
            return groupOfRequestsResource.confirm(request_data).$promise.then((data) => {
                return data;
            });
        }

        function updateEnergySpecValues(params) {
            let request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.updateEnergySpecValues(request_data).$promise.then((data) => {
                return data;
            });
        }

        function updatePhysicalSupplier(params) {
            let request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.updatePhysicalSupplier(request_data).$promise.then((data) => {
                return data;
            });
        }

        function updateBroker(params) {
            let request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.updateBroker(request_data).$promise.then((data) => {
                return data;
            });
        }

        function updateIncoterm(params) {
            let request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.updateIncoterm(request_data).$promise.then((data) => {
                return data;
            });
        }

        function updateContact(params) {
            let request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.updateContact(request_data).$promise.then((data) => {
                return data;
            });
        }

        function sellerNotInterested(params) {
            let request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.sellerNotInterested(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getViewRFQ(data, order, pagination) {
            let rfqPayload = angular.copy(payload);
            let request_data = payloadDataModel.create(rfqPayload);
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
            if (data.LocationId && data.PhysicalSupplierId && data.SellerId) {
                request_data.Payload.Filters.push({
                    ColumnName: 'LocationId',
                    Value: data.LocationId
                });
                request_data.Payload.Filters.push({
                    ColumnName: 'PhysicalSupplierId',
                    Value: data.PhysicalSupplierId
                });
                request_data.Payload.Filters.push({
                    ColumnName: 'SellerId',
                    Value: data.SellerId
                });
            }
            request_data.Payload.Filters.push({
                ColumnName: 'RequestGroupId',
                OperationType: 0,
                ValueType: 5,
                Value: data.RequestGroupId
            });
            return groupOfRequestsResource.getViewRFQ(request_data).$promise.then((data) => {
                return data;
            });
        }

        function amendRFQ(requirements) {
            let request_data = [];    
            let requirementsToAmend = _.groupBy(requirements, 'rfqId');
            angular.forEach(requirementsToAmend, (seller) => {
                let AmendRfq = {
                SellerId: seller[0].sellerId,
                RfqId:  seller[0].rfqId,
                RequestProductIds: seller.map(pro => pro.requestProductId)
                };
                request_data.push(AmendRfq);
            });
        
            return spotNegotiationResource.amendRFQ(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function revokeRFQ(requirements) {
            let request_data = payloadDataModel.create(requirements);
            return groupOfRequestsResource.revoke(request_data).$promise.then((data) => {
                return data;
            });
        }


        function amendAndSend(requirements) {
            let request_data = payloadDataModel.create(requirements);
            return groupOfRequestsResource.amendAndSend(request_data).$promise.then((data) => {
                return data;
            });
        }

        function revokeAndSend(requirements) {
            let request_data = payloadDataModel.create(requirements);
            return groupOfRequestsResource.revokeAndSend(request_data).$promise.then((data) => {
                return data;
            });
        }


        function requoteRFQ(requirements) {
            let request_data = payloadDataModel.create(requirements);
            return groupOfRequestsResource.requote(request_data).$promise.then((data) => {
                return data;
            });
        }

        /**
         * Save group info (comments)
         * @returns {Promise} A promise.
         */
        function updateGroup(groupId, internalComments, externalComments, quoteByDate, quoteByTimezone, quoteByCurrency, quoteByDateFrom) {
            let payload = {
                Id: groupId,
                InternalComments: internalComments,
                ExternalComments: externalComments,
                QuoteByDate: quoteByDate,
                QuoteByDateFrom: quoteByDateFrom,
            };
            if (typeof quoteByTimezone !== 'undefined' && quoteByTimezone !== null) {
                payload.QuoteByTimeZone = {
                    Id: quoteByTimezone.id,
                    Name: quoteByTimezone.name
                };
            }
            if (typeof quoteByCurrency !== 'undefined' && quoteByCurrency !== null) {
                payload.QuoteByCurrency = {
                    Id: quoteByCurrency.id,
                    Name: quoteByCurrency.name
                };
            }
            let request_data = payloadDataModel.create(payload);
            return groupOfRequestsResource.updateGroup(request_data).$promise.then((data) => {
                return data;
            });
        }

        /**
         * Get a the group info and comments
         * @param {Integer} requestGroupId - The ID of the Request Group.
         * @returns {Promise} A promise.
         */
        function getGroupInfo(requestGroupId) {
            let request_data = payloadDataModel.create(requestGroupId);
            return groupOfRequestsResource.getGroupInfo(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function addRequestsToGroup(requestIds, groupId) {
            let request_payload = {
                WorksheetOrGroupId: groupId,
                RequestsIds: requestIds
            };
            let request_data = payloadDataModel.create(request_payload);
            return groupOfRequestsResource.include(request_data).$promise.then((data) => {
                return data;
            });
        }

        function delinkRequests(requestIds, groupId) {
            let request_payload = {
                WorksheetOrGroupId: groupId,
                RequestsIds: requestIds
            };
            let request_data = payloadDataModel.create(request_payload);
            return groupOfRequestsResource.delink(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getOfferDetails(offerId) {
            let request_data = payloadDataModel.create(offerId);
            return groupOfRequestsResource.getOfferDetails(request_data).$promise.then((data) => {
                // $bladeEntity.open("offerDetails");
                return data;
            });
        }

        /**
         * Update an offer.
         * @param {Object} requestOffer - A Request Offer DTO.
         * @param {string} token - A backend-provided key.
         * @returns {object} Pre-populated request objects.
         */
        function updateOfferDetails(locationId, requestOffers, allProductsAdditionalCosts) {
            var request_data = payloadDataModel.create({
                Locations: [ {
                    RequestLocationId: locationId,
                    RequestOffers: requestOffers,
                    AllProductsAdditionalCosts: allProductsAdditionalCosts
                } ]
            });
            return groupOfRequestsResource.updateOfferDetails(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getRfqEmailTemplate(emailData, emailTemplate) {
            emailData.templateName = emailTemplate.name;
            var request_data = payloadDataModel.create(emailData);
            return groupOfRequestsResource.previewRFQ(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getRfqRequoteEmailTemplate(emailData) {
            var request_data = payloadDataModel.create(emailData);
            return groupOfRequestsResource.previewRequote(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getViewRfqEmailTemplate(emailData, template) {
            let templateId = 0;
            let templateName = null;
            if (typeof template != 'undefined' && template !== null) {
                templateId = template.id;
                templateName = template.name;
            }
            let payload = {
                Filters: [ {
                    ColumnName: 'RfqId',
                    Value: emailData.rfqId
                }, {
                    ColumnName: 'TemplateId',
                    Value: templateId
                }, {
                    ColumnName: 'TemplateName',
                    Value: templateName
                } ]
            };
            var request_data = payloadDataModel.create(payload);
            return groupOfRequestsResource.previewRevokeOrAmend(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function duplicateSeller(sellerData) {
            let request_data = payloadDataModel.create(sellerData);
            return groupOfRequestsResource.duplicateSeller(request_data).$promise.then((data) => {
                return data;
            });
        }

        function saveBuyerQuote(data) {
            let request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.saveBuyerQuote(request_data).$promise.then((data) => {
                return data;
            });
        }

        function updatePrice(data) {
            let request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.updatePrice(request_data).$promise.then((data) => {
                return data;
            });
        }

        function removeRequirements(data) {
            let request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.removeRequirements(request_data).$promise.then((data) => {
                return data;
            });
        }

        function reviewGroup(data) {
            let request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.reviewGroup(request_data).$promise.then((data) => {
                return data;
            });
        }

        function addPhysicalSupplierInCard(data) {
            let request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.addPhysicalSupplierInCard(request_data).$promise.then((data) => {
                return data;
            });
        }

        function addSeller(data) {
            let request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.addSeller(request_data).$promise.then((data) => {
                return data;
            });
        }

        function deleteSeller(data) {
            let request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.deleteSeller(request_data).$promise.then((data) => {
                return data;
            });
        }

        function checkSellerRow(data) {
            let request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.checkSellerRow(request_data).$promise.then((data) => {
                return data;
            });
        }

        function updateEnergySpecValuesByProduct(data) {
            let payload = payloadDataModel.create(data);
            return groupOfRequestsResource.updateEnergySpecValuesByProduct(payload).$promise.then((data) => {
                return data;
            });
        }
        function energy6MonthHistory(data) {
            let payload = payloadDataModel.create(data);
            return groupOfRequestsResource.energy6MonthHistory(payload).$promise.then((data) => {
                return data;
            });
        }
        function get6MHSavedLocationsByRequestProductId(data) {
            let payload = payloadDataModel.create(data);
            return groupOfRequestsResource.get6MHSavedLocationsByRequestProductId(payload).$promise.then((data) => {
                return data;
            });
        }

	    function reassignEnergy6MonthReferenceDate(data) {
            let payload = payloadDataModel.create(data);
            return groupOfRequestsResource.reassignEnergy6MonthReferenceDate(payload).$promise.then((data) => {
                return data;
            });
        }
        function updateEnergy6MonthHistory(data) {
            let payload = payloadDataModel.create(data);
            return groupOfRequestsResource.updateEnergy6MonthHistory(payload).$promise.then((data) => {
                return data;
            });
        }

        function saveSupplierCard(data) {
            // var request_data = { "Payload" : data };
            // return groupOfRequestsResource.saveSupplierCard(request_data).$promise.then(function (data) {
            //     return data;
            // });
            request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.updateOfferDetails(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }
        // return public model API
        return {
            getResourceList: getResourceList,
            getRequests: getRequests,
            getGroup: getGroup,
            groupRequests: groupRequests,
            getBestOffer: getBestOffer,
            getBestTco: getBestTco,
            getSellersSorted: getSellersSorted,
            sendRFQ: sendRFQ,
            skipRFQ: skipRFQ,
            confirmOfferView: confirmOfferView,
            switchHasNoQuote: switchHasNoQuote,
            confirm: confirm,
            getViewRFQ: getViewRFQ,
            getGroupInfo: getGroupInfo,
            amendRFQ: amendRFQ,
            energy6MonthHistory: energy6MonthHistory,
            revokeRFQ: revokeRFQ,
            revokeAndSend: revokeAndSend,
            amendAndSend: amendAndSend,
            requoteRFQ: requoteRFQ,
            addRequestsToGroup: addRequestsToGroup,
            delinkRequests: delinkRequests,
            getOfferDetails: getOfferDetails,
            updateOfferDetails: updateOfferDetails,
            updateGroup: updateGroup,
            getRfqEmailTemplate: getRfqEmailTemplate,
            getRfqRequoteEmailTemplate: getRfqRequoteEmailTemplate,
            getViewRfqEmailTemplate: getViewRfqEmailTemplate,
            get6MHSavedLocationsByRequestProductId: get6MHSavedLocationsByRequestProductId,
            getEnergyBladeContentByProduct: getEnergyBladeContentByProduct,
            duplicateSeller: duplicateSeller,
            saveBuyerQuote: saveBuyerQuote,
            updateEnergySpecValues: updateEnergySpecValues,
            updatePhysicalSupplier: updatePhysicalSupplier,
            updateBroker: updateBroker,
            updateContact: updateContact,
            updatePrice: updatePrice,
            updateIncoterm: updateIncoterm,
            updateEnergy6MonthHistory: updateEnergy6MonthHistory,
            removeRequirements: removeRequirements,
            reviewGroup: reviewGroup,
            markCurrentSelection: markCurrentSelection,
            saveSupplierCard: saveSupplierCard,
            sellerNotInterested: sellerNotInterested,
            addSeller: addSeller,
            deleteSeller: deleteSeller,
            checkSellerRow: checkSellerRow,
            updateEnergySpecValuesByProduct: updateEnergySpecValuesByProduct,
            reassignEnergy6MonthReferenceDate: reassignEnergy6MonthReferenceDate,
            addPhysicalSupplierInCard: addPhysicalSupplierInCard,
            getPriceTimeline: getPriceTimeline,
        };
    }
]);

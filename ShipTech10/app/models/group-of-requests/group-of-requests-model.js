angular.module('shiptech.models').factory('groupOfRequestsModel', ['groupOfRequestsResource', 'payloadDataModel', 'SELLER_SORT_ORDER', 'screenLoader',
    function(groupOfRequestsResource, payloadDataModel, SELLER_SORT_ORDER, screenLoader) {
        var payload = {
            "Order": null,
            "Filters": [],
            "Pagination": {
                "Skip": 0,
                "Take": 25
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
            var request_data = payloadDataModel.create(requestIds);

            return groupOfRequestsResource.groupRequests(request_data).
           
            $promise.
            then(function(data) {
                return data;
                
            });
        }
        /**
         * Get a Requests list for, e.g., the Request lookup field.
         * @return {Promise} A promise.
         */
        function getRequests() {
            var requestsPayload = angular.copy(payload);
            var request_data = payloadDataModel.create(requestsPayload);
            //screenLoader.showLoader();
            return groupOfRequestsResource.getRequests(request_data).
            $promise.
            then(function(data) {
                return data;
            }).finally(function(){
               //screenLoader.hideLoader();
            });
        }
        /**
         * Get a the data for the whole Group of Requests view.
         * @param {Integer} requestGroupId - The ID of the Request Group.
         * @return {Promise} A promise.
         */
        function getGroup(requestGroupId) {
            var request_data = payloadDataModel.create(requestGroupId);
            return groupOfRequestsResource.getGroup(request_data).
            $promise.
            then(function(data) {
                return data;
                
            });
        }

        function getPriceTimeline(requestId, productId, uomId) {
            var payload = {
                "RequestId": requestId,
                // "ProductId": productId,
                "RequestProductId": productId,
                "UomId": uomId
            }
            var request_data = payloadDataModel.create(payload);
            return groupOfRequestsResource.getPriceTimeline(request_data).
            $promise.
            then(function(data) {
                return data;
            });
        }
        /**
         * Get a the Best Offer data.
         * @param {Integer[]} - An array of product IDs.
         * @return {Promise} A promise.
         */
        function getBestOffer(productIds) {
            var offerPayload = angular.copy(payload);
            //no pagination on best offer so get all the rows at once
            if (!offerPayload) {offerPayload = {}}
            if (!offerPayload.Pagination) {offerPayload.Pagination = {}}
            offerPayload.Pagination.Take = 100;
            var request_data = payloadDataModel.create(offerPayload);
            request_data.Payload.Filters = [{
                "ColumnName": "RequestProductIdList",
                "OperationType": 0,
                "ValueType": 5,
                "Value": productIds
            }];
            return groupOfRequestsResource.getBestOffer(request_data).
            $promise.
            then(function(data) {
                return data;
            });
        }

        function getBestTco(productIds, groupId) {
            var offerPayload = angular.copy(payload);
            //no pagination on best offer so get all the rows at once
			if (!offerPayload) {offerPayload = {}}
			if (!offerPayload.Pagination) {offerPayload.Pagination = {}}
            offerPayload.Pagination.Take = 100;
            var request_data = payloadDataModel.create(offerPayload);
            request_data.Payload.Filters = [{
                "ColumnName": "RequestProductIdList",
                "OperationType": 0,
                "ValueType": 5,
                "Value": productIds
            }, {
                "ColumnName": "RequestGroupId",
                "OperationType": 0,
                "ValueType": 5,
                "Value": groupId
            }];
            return groupOfRequestsResource.getBestTco(request_data).
            $promise.
            then(function(data) {
                return data;
            });
        }
        /**
         * Get data via the associated resource.
         * @return {Promise} A promise.
         */
        function getResourceList(order, pagination, searchText) {
            var resourcePayload = angular.copy(payload);
            if (typeof order != "undefined" && order !== null && order.column) {
                resourcePayload.Order = {
                    "ColumnName": order.column,
                    "SortOrder": order.order
                };
            }
            if (typeof pagination != "undefined" && pagination !== null) {
                // Pagination
                resourcePayload.Pagination = {
                    "Skip": pagination.start,
                    "Take": pagination.length
                };
            }
            if (typeof searchText != "undefined" && searchText !== null) {
                resourcePayload.SearchText = searchText;
            } else {
                resourcePayload.SearchText = "";
            }
            var request_data = payloadDataModel.create(resourcePayload);
            return groupOfRequestsResource.getList(request_data).$promise.then(function(data) {
                return data;
            });
        }
        /**
         * Get sellers data by preference.
         * @return {Promise} A promise.
         */
        function getSellersSorted(counterpartyIds, productIds, sortOrder) {
            var sellersPayload = angular.copy(payload);
            var request_data = payloadDataModel.create(sellersPayload);
            if (typeof sortOrder === "undefined" || sortOrder === null) {
                sortOrder = SELLER_SORT_ORDER.RATING;
            }
            if (typeof(request_data.Payload.Filters) == 'undefined') {
            	request_data.Payload.Filters = [];
            }
            request_data.Payload.Filters.push({
                "ColumnName": "CounterpartyList",
                "Value": counterpartyIds
            });            	
            request_data.Payload.Filters.push({
                "ColumnName": "RequestProductList",
                "Value": productIds
            });
            request_data.Payload.Filters.push({
                "ColumnName": "SortOrder",
                "Value": sortOrder
            });
            return groupOfRequestsResource.getSellersSorted(request_data).$promise.then(function(data) {
                return data;
            });
        }
        function getEnergyBladeContentByProduct(payload) {
            var request_data = payloadDataModel.create(payload);
            return groupOfRequestsResource.getEnergyBladeContentByProduct(request_data).$promise.then(function(data) {
                return data;
            });
        }        
        /**
         * Send rfq requirements
         * @return {Promise} A promise.
         */
        function sendRFQ(rfq) {
            var request_data = payloadDataModel.create(rfq);
            return groupOfRequestsResource.sendRFQ(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function skipRFQ(rfq) {
            var request_data = payloadDataModel.create(rfq);
            return groupOfRequestsResource.skipRFQ(request_data).$promise.then(function(data) {
                return data;
            });
        }
        function switchHasNoQuote(data) {
            return groupOfRequestsResource.switchHasNoQuote(data).$promise.then(function(data) {
                return data;
            });
        }

        function confirmOfferView(productsIds, offerIds) {
            var confirmPayload = angular.copy(payload);
            var request_data = payloadDataModel.create(confirmPayload);
            request_data.Payload.Filters.push({
                "ColumnName": "RequestProductIdList",
                "Value": productsIds
            });
            request_data.Payload.Filters.push({
                "ColumnName": "RequestOfferList",
                "Value": offerIds
            });
            return groupOfRequestsResource.confirmOfferView(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function markCurrentSelection(offerIds) {
            var confirmPayload = angular.copy(payload);
            var request_data = payloadDataModel.create(confirmPayload);
            request_data.Payload.Filters.push({
                "ColumnName": "RequestOfferIdList",
                "Value": offerIds
            });
            return groupOfRequestsResource.markCurrentSelection(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function confirm(rfq) {
            var request_data = payloadDataModel.create(rfq);
            return groupOfRequestsResource.confirm(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function updateEnergySpecValues(params) {
            var request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.updateEnergySpecValues(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function updatePhysicalSupplier(params) {
            var request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.updatePhysicalSupplier(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function updateBroker(params) {
            var request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.updateBroker(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function updateIncoterm(params) {
            var request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.updateIncoterm(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function updateContact(params) {
            var request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.updateContact(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function sellerNotInterested(params) {
            var request_data = payloadDataModel.create(params);
            return groupOfRequestsResource.sellerNotInterested(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function getViewRFQ(data, order, pagination) {
            var rfqPayload = angular.copy(payload);
            var request_data = payloadDataModel.create(rfqPayload);
            if (typeof order != "undefined" && order !== null && order.column) {
                request_data.Payload.Order = {
                    "ColumnName": order.column,
                    "SortOrder": order.order
                };
            }
            if (typeof pagination != "undefined" && pagination !== null) {
                // Pagination
                request_data.Payload.Pagination = {
                    "Skip": pagination.start,
                    "Take": pagination.length
                };
            }
            if (data.LocationId && data.PhysicalSupplierId && data.SellerId) {
                request_data.Payload.Filters.push({
                    "ColumnName": "LocationId",
                    "Value": data.LocationId
                });
                request_data.Payload.Filters.push({
                    "ColumnName": "PhysicalSupplierId",
                    "Value": data.PhysicalSupplierId
                });
                request_data.Payload.Filters.push({
                    "ColumnName": "SellerId",
                    "Value": data.SellerId
                });
            }
            request_data.Payload.Filters.push({
                "ColumnName": "RequestGroupId",
                "OperationType": 0,
                "ValueType": 5,
                "Value": data.RequestGroupId
            });
            return groupOfRequestsResource.getViewRFQ(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function amendRFQ(requirements) {
            var request_data = payloadDataModel.create(requirements);
            return groupOfRequestsResource.amend(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function revokeRFQ(requirements) {
            var request_data = payloadDataModel.create(requirements);
            return groupOfRequestsResource.revoke(request_data).$promise.then(function(data) {
                return data;
            });
        }


        function amendAndSend(requirements) {
            var request_data = payloadDataModel.create(requirements);
            return groupOfRequestsResource.amendAndSend(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function revokeAndSend(requirements) {
            var request_data = payloadDataModel.create(requirements);
            return groupOfRequestsResource.revokeAndSend(request_data).$promise.then(function(data) {
                return data;
            });
        }
        

        function requoteRFQ(requirements) {
            var request_data = payloadDataModel.create(requirements);
            return groupOfRequestsResource.requote(request_data).$promise.then(function(data) {
                return data;
            });
        }
        /**
         * Save group info (comments)
         * @return {Promise} A promise.
         */
        function updateGroup(groupId, internalComments, externalComments, quoteByDate, quoteByTimezone, quoteByCurrency, quoteByDateFrom) {
            var payload = {
                "Id": groupId,
                "InternalComments": internalComments,
                "ExternalComments": externalComments,
                "QuoteByDate": quoteByDate,
                "QuoteByDateFrom": quoteByDateFrom,
            };
            if (typeof quoteByTimezone !== "undefined" && quoteByTimezone !== null) {
                payload.QuoteByTimeZone = {
                    "Id": quoteByTimezone.id,
                    "Name": quoteByTimezone.name
                };
            }
            if (typeof quoteByCurrency !== "undefined" && quoteByCurrency !== null) {
                payload.QuoteByCurrency = {
                    "Id": quoteByCurrency.id,
                    "Name": quoteByCurrency.name
                };
            }
            var request_data = payloadDataModel.create(payload);
            return groupOfRequestsResource.updateGroup(request_data).$promise.then(function(data) {
                return data;
            });
        }
        /**
         * Get a the group info and comments
         * @param {Integer} requestGroupId - The ID of the Request Group.
         * @return {Promise} A promise.
         */
        function getGroupInfo(requestGroupId) {
            var request_data = payloadDataModel.create(requestGroupId);
            return groupOfRequestsResource.getGroupInfo(request_data).
            $promise.
            then(function(data) {
                return data;
            });
        }

        function addRequestsToGroup(requestIds, groupId) {
            var request_payload = {
                "WorksheetOrGroupId": groupId,
                "RequestsIds": requestIds
            };
            var request_data = payloadDataModel.create(request_payload);
            return groupOfRequestsResource.include(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function delinkRequests(requestIds, groupId) {
            var request_payload = {
                "WorksheetOrGroupId": groupId,
                "RequestsIds": requestIds
            };
            var request_data = payloadDataModel.create(request_payload);
            return groupOfRequestsResource.delink(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function getOfferDetails(offerId) {
            var request_data = payloadDataModel.create(offerId);
            return groupOfRequestsResource.getOfferDetails(request_data).$promise.then(function(data) {
                // $bladeEntity.open("offerDetails");
                return data;
            });
        }
        /**
         * Update an offer.
         * @param {Object} requestOffer - A Request Offer DTO.
         * @param {string} token - A backend-provided key.
         * @return {object} Pre-populated request objects.
         */
        function updateOfferDetails(locationId, requestOffers, allProductsAdditionalCosts) {
            request_data = payloadDataModel.create({
                'Locations': [{
                    RequestLocationId: locationId,
                    RequestOffers: requestOffers,
                    AllProductsAdditionalCosts: allProductsAdditionalCosts
                }]
            });
            return groupOfRequestsResource.updateOfferDetails(request_data).
            $promise.
            then(function(data) {
                return data;
            });
        }

        function getRfqEmailTemplate(emailData, emailTemplate) {
            emailData.templateName = emailTemplate.name;
            request_data = payloadDataModel.create(emailData);
            return groupOfRequestsResource.previewRFQ(request_data).
            $promise.
            then(function(data) {
                return data;
            });
        }

        function getRfqRequoteEmailTemplate(emailData) {
            request_data = payloadDataModel.create(emailData);
            return groupOfRequestsResource.previewRequote(request_data).
            $promise.
            then(function(data) {
                return data;
            });
        }

        function getViewRfqEmailTemplate(emailData, template) {
            var templateId = 0;
            var templateName = null;
            if (typeof template != "undefined" && template !== null) {
                templateId = template.id;
                templateName = template.name;
            }
            var payload = {
                "Filters": [{
                    "ColumnName": "RfqId",
                    "Value": emailData.rfqId
                }, {
                    "ColumnName": "TemplateId",
                    "Value": templateId
                }, {
                    "ColumnName": "TemplateName",
                    "Value": templateName
                }]
            };
            request_data = payloadDataModel.create(payload);
            return groupOfRequestsResource.previewRevokeOrAmend(request_data).
            $promise.
            then(function(data) {
                return data;
            });
        }

        function duplicateSeller(sellerData) {
            var request_data = payloadDataModel.create(sellerData);
            return groupOfRequestsResource.duplicateSeller(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function saveBuyerQuote(data) {
            var request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.saveBuyerQuote(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function updatePrice(data) {
            var request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.updatePrice(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function removeRequirements(data) {
            var request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.removeRequirements(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function reviewGroup(data) {
            var request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.reviewGroup(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function addPhysicalSupplierInCard(data) {
            var request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.addPhysicalSupplierInCard(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function addSeller(data) {
            var request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.addSeller(request_data).$promise.then(function(data) {
                return data;
            });
        }
        function deleteSeller(data) {
            var request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.deleteSeller(request_data).$promise.then(function(data) {
                return data;
            });
        } 

        function checkSellerRow(data) {
            var request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.checkSellerRow(request_data).$promise.then(function(data) {
                return data;
            });
        }                

        function saveSupplierCard(data) {
            // var request_data = { "Payload" : data };
            // return groupOfRequestsResource.saveSupplierCard(request_data).$promise.then(function (data) {
            //     return data;
            // });
            request_data = payloadDataModel.create(data);
            return groupOfRequestsResource.updateOfferDetails(request_data).
            $promise.
            then(function(data) {
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
            getEnergyBladeContentByProduct: getEnergyBladeContentByProduct,
            duplicateSeller: duplicateSeller,
            saveBuyerQuote: saveBuyerQuote,
            updateEnergySpecValues: updateEnergySpecValues,
            updatePhysicalSupplier: updatePhysicalSupplier,
            updateBroker: updateBroker,
            updateContact: updateContact,
            updatePrice: updatePrice,
            updateIncoterm: updateIncoterm,
            removeRequirements: removeRequirements,
            reviewGroup: reviewGroup,
            markCurrentSelection: markCurrentSelection,
            saveSupplierCard: saveSupplierCard,
            sellerNotInterested: sellerNotInterested,
            addSeller: addSeller,
            deleteSeller: deleteSeller,
            checkSellerRow: checkSellerRow,
            addPhysicalSupplierInCard: addPhysicalSupplierInCard,
            getPriceTimeline: getPriceTimeline,
        };
    }
]);
angular.module('shiptech.models').factory('newRequestModel', [ 'newRequestResource', 'payloadDataModel', 'newRequestResourceMasters', 'screenLoader', 'spotNegotiationResource',
    function(newRequestResource, payloadDataModel, newRequestResourceMasters, screenLoader, spotNegotiationResource) {
        this.saved = false;

        function newRequestModel(data) {
            angular.extend(this, data);
        }

        /**
         * Retrieve a pre-populated request
         * @param {Integer} data - request Id
         * @returns {object} pre-populated request objects.
         */
        function getRequest(data) {
            var request_data = payloadDataModel.create(data);
            screenLoader.showLoader();
            return newRequestResource.get(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            }).finally(() => {
                screenLoader.hideLoader();
            });
        }

        /**
         * Create a request
         * @param {Integer} data - vesseldetails Id
         * @returns {object} pre-populated request objects.
         */
        function newRequest(data) {
            var request_data = payloadDataModel.create(data);
            return newRequestResource.new(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        /**
         * Create an empty request
         * @returns {object} pre-populated request objects.
         */
        function getEmptyRequest() {
            var request_data = payloadDataModel.create();
            return newRequestResource.getEmpty(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        /**
         * Update a request
         * @param {Integer} data - vesseldetails Id
         * @returns {object} pre-populated request objects.
         */
        function updateRequest(data) {
            this.saved = true;
            var request_data = payloadDataModel.create(data);
            return newRequestResource.update(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        /**
         * Update a PreferredSellers
         * @param {Integer} data - group id and request Id
         * @returns {boolean} pre-populated request objects.
         */
         function updatePreferredSellers(payload) {
            return spotNegotiationResource.updatePreferredSellers(payload)
                .$promise
                .then((data) => {
                    return data;
                });
        }       

        /**
         * Save a request
         * @param {Integer} data - vesseldetails Id
         * @returns {object} pre-populated request objects.
         */
        function createRequest(data) {
            this.saved = true;
            var request_data = payloadDataModel.create(data);
            return newRequestResource.create(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        /**
         * cancel a request product
         * @param {Integer} data - vesseldetails Id
         */
        function cancelProduct(data) {
            var request_data = payloadDataModel.create(data);
            return newRequestResource.cancelProduct(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        /**
         * cancel a request
         * @param {Integer} data - vesseldetails Id
         */
        function cancelRequest(data) {
            var request_data = payloadDataModel.create(data);
            return newRequestResource.cancel(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        /**
         * cancel a request product
         * @param {Integer} data - vesseldetails Id
         */
        function cancelLocation(data) {
            var request_data = payloadDataModel.create(data);
            return newRequestResource.cancelLocation(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        /**
         * completes a request
         * @param {Integer} data - request Id
         */

        function completeRequest(data) {
            var request_data = payloadDataModel.create(data);
            return newRequestResource.complete(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        // returns default vessel buyer
        function getDefaultBuyer(data) {
            var request_data = payloadDataModel.create(data);
            return newRequestResource.getDefaultBuyer(request_data).$promise.then((data) => {
                return data;
            });
        }

        function search(filters) {
            var request_data = payloadDataModel.create({});
            request_data.Payload.Filters = filters;
            return newRequestResource.search(request_data).$promise.then((data) => {
                return data;
            });
        }

        /**
         * validate a request
         * @param {Integer} data - ?
         */
        var request_data;
        function validate(data) {
            request_data = payloadDataModel.create(data);
            return newRequestResource.validate(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        /**
         * sends pre-request questionnnaire
         * @param {Integer} data - ?
         */
        function sendPrerequest(data) {
            request_data = payloadDataModel.create(data);
            return newRequestResource.sendPrerequest(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        function contractPlanningAutoSave(data) {
            request_data = payloadDataModel.create(data);
            return newRequestResource.contractPlanningAutoSave(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        function getLatestOffer(product, seller) {
            var physicalSupplierId = null;
        	if(seller.offers[0].physicalSupplierCounterparty != null) {
        		physicalSupplierId = seller.offers[0].physicalSupplierCounterparty.id;
        	}
            request_data = payloadDataModel.create();
            request_data.Payload = {
                Order: null,
                Filters: [ {
                    ColumnName: 'RequestProductId',
                    OperationType: 0,
                    ValueType: 5,
                    Value: product.id
                } ],
                Pagination: {
                    Skip: 0,
                    Take: 10
                }
            };
            if (seller != null) {
                request_data.Payload.Filters.push({
                    ColumnName: 'RequestSellerId',
                    OperationType: 0,
                    ValueType: 5,
                    Value: seller.id
                });
                request_data.Payload.Filters.push({
                    ColumnName: 'PhysicalSupplierId',
                    OperationType: 0,
                    ValueType: 5,
                    Value: physicalSupplierId
                });
            }
            return newRequestResource.getLatestOffer(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }

        /**
         * Saves the contract planning data.
         */
        function saveContractPlanning(data) {
            request_data = payloadDataModel.create(data);
            return newRequestResource.contractPlanning(request_data)
                .$promise
                .then((data) => {
                    return new newRequestModel(data);
                });
        }
        function contractPlanningSaveAndSend(data) {
            request_data = payloadDataModel.create(data);
            return newRequestResource.contractPlanningSaveAndSend(request_data)
                .$promise
                .then((data) => {
                    return new newRequestModel(data);
                });
        }

        function getRequestEmailTemplate(emailData, template, transactionTypeId, isPreview) {
            let templateId = 0;
            let templateName = null;
            if (typeof template != 'undefined' && template !== null) {
                templateId = template.id;
                templateName = template.name;
            }
            let payload;
            if (isPreview) {
                payload = {
                    Filters: [ {
                        ColumnName: 'RequestId',
                        Value: emailData.requestId 
                    },{
                        ColumnName: 'TransactionTypeId',
                        Value: transactionTypeId
                    } ]
                };
            } else {
                 payload = {
                    Filters: [ {
                        ColumnName: 'RequestId',
                        Value: emailData.requestId
                    }, {
                        ColumnName: 'TemplateId',
                        Value: templateId
                    }, {
                        ColumnName: 'TransactionTypeId',
                        Value: transactionTypeId
                    }, {
                        ColumnName: 'TemplateName',
                        Value: templateName
                    } ]
                 };
            }
           
          
            request_data = payloadDataModel.create(payload);
            return newRequestResource.getRequestEmailTemplate(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }
        // Update destination port list on type
        function getDestinations(val, vesselId, destinationId, IsDestinationPort) {
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
            let payload = {
                Pagination: {
                    'Skip ': 1,
                    'Take': 10
                },
                Filters: [ {
                    ColumnName: 'VesselId',
                    Value: vess
                }, {
                    ColumnName: 'VesselVoyageDetailId',
                    Value: dest
                }, {
                    ColumnName: 'IsDestinationList',
                    Value: IsDestinationPort
                } ],
                SearchText: val
            };
            request_data = payloadDataModel.create(payload);
            return newRequestResourceMasters.getDestinations(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getContractPlanningEmailTemplate(emailData) {
            var templateName;
        	if (!emailData.templateName) {
        		templateName = 'ContractPlanningEmailTemplate';
        	} else {
        		templateName = emailData.templateName;
        	}
            let payload = {
                Filters: [ {
                    ColumnName: 'RequestId',
                    Value: emailData.requestId
                }, {
                    ColumnName: 'LocationId',
                    Value: emailData.locationId
                }, {
                    ColumnName: 'RequestProductId',
                    Value: emailData.requestProductId
                }, {
                    ColumnName: 'TemplateName',
                    Value: templateName
                }
                ]
            };
            request_data = payloadDataModel.create(payload);
            return newRequestResource.previewContractPlanning(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function omitOffer(data) {
            request_data = payloadDataModel.create(data);
            return newRequestResource.omitOffer(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }
        function canBeCancelled(data) {
            request_data = payloadDataModel.create(data);
            return newRequestResource.canBeCancelled(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getRequestStatusesOrdered() {
            request_data = payloadDataModel.create(null);
            return newRequestResource.getRequestStatusesOrdered(request_data).$promise.then((data) => {
                return data;
            });
        }

        function questionnaireStatus(data) {
            request_data = payloadDataModel.create(data);
            console.log('request_data: ', request_data);
            return newRequestResource.questionnaireStatus(request_data).$promise.then((data) => {
                return data;
            });
        }
        /**
         * Create a request & send Questionnaire 
         * @param {Integer} data - vesseldetails Id
         * @returns {object} pre-populated request objects.
         */
         function sendQuestionnaire(data) {
            var request_data = payloadDataModel.create(data);
            return newRequestResource.sendQuestionnaire(request_data).$promise.then((data) => {
                return new newRequestModel(data);
            });
        }
        function getBunkerPlansForVesselVoyageDetailId(data) {
            request_data = payloadDataModel.create(data);
            return newRequestResource.getBunkerPlansForVesselVoyageDetailId(request_data).$promise.then((data) => {
                return data;
            });
        }


        // return public model API
        return {
            getRequest: getRequest,
            newRequest: newRequest,
            getEmptyRequest: getEmptyRequest,
            updateRequest: updateRequest,
            createRequest: createRequest,
            cancelProduct: cancelProduct,
            cancelRequest: cancelRequest,
            updatePreferredSellers: updatePreferredSellers,
            completeRequest: completeRequest,
            contractPlanningAutoSave: contractPlanningAutoSave,
            cancelLocation: cancelLocation,
            search: search,
            validate: validate,
            sendPrerequest: sendPrerequest,
            saveContractPlanning: saveContractPlanning,
            contractPlanningSaveAndSend: contractPlanningSaveAndSend,
            getLatestOffer: getLatestOffer,
            getRequestEmailTemplate: getRequestEmailTemplate,
            getContractPlanningEmailTemplate: getContractPlanningEmailTemplate,
            getDefaultBuyer: getDefaultBuyer,
            getDestinations: getDestinations,
            canBeCancelled: canBeCancelled,
            omitOffer: omitOffer,
            getRequestStatusesOrdered: getRequestStatusesOrdered,
            getBunkerPlansForVesselVoyageDetailId: getBunkerPlansForVesselVoyageDetailId,
            questionnaireStatus: questionnaireStatus,
            sendQuestionnaire: sendQuestionnaire
        };
    }
]);

angular.module('shiptech.models').factory('orderModel', [ '$q', 'orderResource', 'payloadDataModel', 'screenLoader',
    function($q, orderResource, payloadDataModel, screenLoader) {
        let payload = {
            Order: null,
            Filters: [],
            Pagination: {
                Skip: 0,
                Take: 25
            }
        };
        function getTemplates(transactionId, orderId) {
            let payload = {
                Filters: [
                    {
                        ColumnName: 'EmailTransactionTypeId',
                        Value: transactionId
                    },
                    {
                        ColumnName: 'OrderId',
                        Value: orderId
                    }
                ]
            };
            var request_data = payloadDataModel.create(payload);
            return orderResource.getTemplates(request_data).$promise.then((data) => {
                return data;
            });
        }

        /**
         * Retrieve a pre-populated order
         * @param {Integer} data - Order ID.
         * @return {object} A pre-populated order object.
         */

        function get(data) {
            screenLoader.showLoader();
            let request_data;
            if (data) {
                request_data = payloadDataModel.create(data);
                return orderResource.get(request_data).$promise.then((data) => {
                    screenLoader.hideLoader();
                    return data;
                });
            }
            request_data = payloadDataModel.create();
            return orderResource.new(request_data).$promise.then((data) => {
                screenLoader.hideLoader();
                return data;
            });

            setTimeout(() => {
                screenLoader.hideLoader();
            }, 9000);
        }

        /**
         * Retrieve a list of table rows.
         * @returns {Object} A requestlistTableModel object
         */
        function list(order, pagination, filters, search, uiFilters) {
            let listPayload = angular.copy(payload);

            if (typeof filters != 'undefined' && filters !== null) {
                listPayload.PageFilters = {
                    Filters: []
                };
                listPayload.PageFilters.Filters = filters;
            }
            if (typeof search != 'undefined' && search !== null) {
                listPayload.SearchText = search;
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
                    Take: 25
                };
            }
            let request_data = payloadDataModel.create(listPayload);
            if (typeof uiFilters != 'undefined' && uiFilters !== null) {
                request_data.UiFilters = uiFilters;
            }

            return orderResource.list(request_data).$promise.then((data) => {
                return data;
            });
        }

        /**
         * Export the list of table rows.
         * @returns {Object} A requestlistTableModel object
         */
        function exportList(order, pagination, columns, fileType, pageFilters) {
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
            let timeZone = jstz().timezone_name;
            listPayload.timeZone = timeZone;
            // debugger;
            if (typeof columns != 'undefined' && columns !== null) {
                listPayload.Columns = columns;
            }
            if(typeof pageFilters != 'undefined') {
                if(typeof listPayload.PageFilters == 'undefined') {
                    listPayload.PageFilters = {};
                    listPayload.PageFilters.Filters = [];
                }
                listPayload.PageFilters.Filters = pageFilters;
            }
            let request_data = payloadDataModel.create(listPayload);
            return orderResource.export(request_data).$promise.then((data) => {
                return data;
            }).catch((error) => {
                // convert error from arraybuffer to string
                let charCodeArray = Array.apply(null, new Uint8Array(error.data.data));
                let result = '';
                for (var i = 0, len = charCodeArray.length; i < len; i++) {
                    var code = charCodeArray[i];
                    result = result + String.fromCharCode(code);
                }
            });
        }

        function create(data) {
            let request_data = payloadDataModel.create(data);
            return orderResource.create(request_data).$promise.then((data) => {
                return data;
            });
        }

        function close(data) {
            let request_data = payloadDataModel.create(data);
            return orderResource.close(request_data).$promise.then((data) => {
                return data;
            });
        }

         function getOrderDiffAfterMail(data) {
            let request_data = payloadDataModel.create(data);
            return orderResource.getOrderDiffAfterMail(request_data).$promise.then((data) => {
                return data;
            });
        }


        function getContractProductAdditionalCosts(contractProductId) {
            let request_data = payloadDataModel.create(contractProductId);
            return orderResource.getContractProductAdditionalCosts(request_data).$promise.then((data) => {
                return data;
            });
        }

        function update(data) {
            let request_data = payloadDataModel.create(data);
            screenLoader.showLoader();
            return orderResource.update(request_data).$promise.then((data) => {
                screenLoader.hideLoader();
                return data;
            });
        }

        function verifyOrders(data) {
            let request_data = payloadDataModel.create(data);
            screenLoader.showLoader();
            return orderResource.verifyOrders(request_data).$promise.then((data) => {
                screenLoader.hideLoader();
                return data;
            });
        }

        /**
         * Makes an API call to send an order-specific "command", with a simple payload,
         * containing just the order ID.
         * @param {string} command - The "command" to send. The valid values are
         *   mapped in the orderResource.
         * @param {integer} orderId - The ID of the order.
         */
        function sendOrderCommand(command, orderId) {
            let request_data = payloadDataModel.create(orderId);
            if ([ 'cancel', 'reject', 'approve', 'submitForApproval' ].indexOf(command) != -1) {
            	// request_data = {
            	// 	"Payload" : {
            	// 		"id" : parseFloat(orderId)
            	// 	}
            	// }
            }
            return orderResource[command](request_data).$promise.then((data) => {
                return data;
            });
        }

        function updateCancelOrderReason(params) {
            let request_data = payloadDataModel.create(params);
            return orderResource.updateCancelOrderReason(request_data).$promise.then((data) => {
                return data;
            });
        }

        function mailPreviewConfirmToSeller(data) {
            let payload = payloadDataModel.create(data);
            return orderResource.mailPreviewConfirmToSeller(payload).$promise.then((data) => {
                return data;
            });
        }

        function getManualCancellationEmail(data) {
            let payload = payloadDataModel.create(data);
            return orderResource.getManualCancellationEmail(payload).$promise.then((data) => {
                return data;
            });
        }


        function createWithContract(order, filters, pagination) {
            let contractPayload = angular.copy(payload);
            if (typeof order != 'undefined' && order !== null) {
                contractPayload.Order = {
                    ColumnName: order.column,
                    SortOrder: order.order
                };
            }
            if (typeof pagination != 'undefined' && pagination !== null) {
                // Pagination
                contractPayload.Pagination = {
                    Skip: pagination.start,
                    Take: pagination.length
                };
            } else {
                contractPayload.Pagination = {
                    Skip: 0,
                    Take: 100
                };
            }
            if (typeof filters != 'undefined' && filters !== null) {
                contractPayload.Filters = [ {
                    ColumnName: 'RequestId',
                    Value: filters.requestId
                }, {
                    ColumnName: 'ContractId',
                    Value: filters.contractId
                }, {
                    ColumnName: 'ContractProductId',
                    Value: filters.contractProductId
                }, {
                    ColumnName: 'RequestProductId',
                    Value: filters.requestProductId
                } ];
            } else {
                contractPayload.Filters = [];
            }
            let request_data = payloadDataModel.create(contractPayload);
            return orderResource.createWithContract(request_data).$promise.then((data) => {
                return data;
            });
        }

        function createOrders(orderList) {
            let request_data = payloadDataModel.create(orderList);
            return orderResource.createOrders(request_data).$promise.then((data) => {
                return data;
            });
        }

        function checkIfOrderCanBeCreatedUsingSelectedContract(filters) {
        	// payload.Filters = filters;
            // var send_data = {"Payload": filters};
            let payload = {
                Filters: filters
            };

            var request_data = payloadDataModel.create(payload);
            return orderResource.checkIfOrderCanBeCreatedUsingSelectedContract(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getOrderEmailTemplate(emailData, template) {
            let templateId = 0;
            let templateName = null;
            if (typeof template != 'undefined' && template !== null) {
                templateId = template.id;
                templateName = template.name;
            }
            let payload = {
                Filters: [ {
                    ColumnName: 'OrderId',
                    Value: emailData.orderId
                }, {
                    ColumnName: 'TemplateId',
                    Value: templateId
                }, {
                    ColumnName: 'TemplateName',
                    Value: templateName
                } ]
            };
            var request_data = payloadDataModel.create(payload);
            return orderResource.preview(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function previewOrderToBeDeliveredMail(emailData, template) {
            let templateId = 0;
            let templateName = null;
            if (typeof template != 'undefined' && template !== null) {
                templateId = template.id;
                templateName = template.name;
            }
            let payload = {
                OrderId: emailData.orderId,
                OrderProductsList: emailData.orderProductIds
            };
            var request_data = payloadDataModel.create(payload);
            return orderResource.previewOrderToBeDeliveredMail(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function sendOrderToBeDeliveredMail(orderId, orderProductIds) {
            let payload = {
                OrderId: orderId,
                OrderProductsList: orderProductIds
            };
            var request_data = payloadDataModel.create(payload);
            return orderResource.sendOrderToBeDeliveredMail(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getOrderConfirmationEmailTemplate(emailData, template) {
            let templateId = 0;
            let templateName = null;
            if (typeof template != 'undefined' && template !== null) {
                templateId = template.id;
                templateName = template.name;
            }
            let payload = {
                Filters: [ {
                    ColumnName: 'OrderId',
                    Value: emailData.orderId
                }, {
                    ColumnName: 'TemplateId',
                    Value: templateId
                }, {
                    ColumnName: 'TemplateName',
                    Value: templateName
                } ]
            };
            var request_data = payloadDataModel.create(payload);
            return orderResource.previewConfirmation(request_data)
                .$promise
                .then((data) => {
                    return data;
                });
        }

        function getOrderListForRequest(orderId) {
        	let payload = orderId;
        	var request_data = payloadDataModel.create(payload);
            return orderResource.getOrderListForRequest(request_data)
                .$promise
                .then((data) => {
                    screenLoader.hideLoader();
                    return data;
                });
        }

        function getExistingOrders(data) {
            request_data = payloadDataModel.create(data);
            request_data.Payload = {
                Filters: [ {
                    ColumnName: 'RequestProductIds',
                    Value: `[${data }]`
                } ]
            };
            return orderResource.getExistingOrders(request_data).$promise.then((data) => {
                return data;
            });
        }

        function getFormulaDetails(data) {
            request_data = payloadDataModel.create(data);
            return orderResource.getFormulaDetails(request_data).$promise.then((data) => {
                return data;
            });
        }

        function cancelOrderProduct(data) {
   		    payload = payloadDataModel.create(data);
            return orderResource.cancelOrderProduct(payload).$promise.then((data) => {
                return data;
            });
        }

        function getCustomerConfiguration(data) {
   		    payload = payloadDataModel.create(data);
            return orderResource.getCustomerConfiguration(payload).$promise.then((data) => {
                return data;
            });
        }

        // return public model API
        return {
            getTemplates: getTemplates,
            get: get,
            list: list,
            create: create,
            close: close,
            getOrderDiffAfterMail: getOrderDiffAfterMail,
            update: update,
            verifyOrders: verifyOrders,
            confirm: confirm,
            exportList: exportList,
            createOrders: createOrders,
            sendOrderCommand: sendOrderCommand,
            getFormulaDetails : getFormulaDetails,
            createWithContract: createWithContract,
            cancelOrderProduct : cancelOrderProduct,
            updateCancelOrderReason : updateCancelOrderReason,
            getOrderEmailTemplate: getOrderEmailTemplate,
            previewOrderToBeDeliveredMail: previewOrderToBeDeliveredMail,
            sendOrderToBeDeliveredMail: sendOrderToBeDeliveredMail,
            getOrderListForRequest : getOrderListForRequest,
            mailPreviewConfirmToSeller: mailPreviewConfirmToSeller,
            getManualCancellationEmail : getManualCancellationEmail,
            getContractProductAdditionalCosts: getContractProductAdditionalCosts,
            getOrderConfirmationEmailTemplate: getOrderConfirmationEmailTemplate,
            checkIfOrderCanBeCreatedUsingSelectedContract : checkIfOrderCanBeCreatedUsingSelectedContract,
            getCustomerConfiguration : getCustomerConfiguration,
            getExistingOrders : getExistingOrders
        };
    }
]);

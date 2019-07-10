angular.module('shiptech.models').factory('orderModel', ['$q', 'orderResource', 'payloadDataModel', 'screenLoader',
    function($q, orderResource, payloadDataModel, screenLoader) {
        var payload = {
            "Order": null,
            "Filters": [],
            "Pagination": {
                "Skip": 0,
                "Take": 25
            }
        };
        function getTemplates(transactionId, orderId) {
           
            var payload = {
                "Filters": [
                    {
                        "ColumnName": "EmailTransactionTypeId",
                        "Value": transactionId
                    },
                    {
                        "ColumnName": "OrderId",
                        "Value": orderId
                    }
                ]
            };
            request_data = payloadDataModel.create(payload);
            return orderResource.getTemplates(request_data).$promise.then(function(data) {
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
            var request_data;
            if (data) {
                request_data = payloadDataModel.create(data);
                return orderResource.get(request_data).$promise.then(function(data) {
                   screenLoader.hideLoader();
                    return data;
                });
            } else {
                request_data = payloadDataModel.create();
                return orderResource.new(request_data).$promise.then(function(data) {
                   screenLoader.hideLoader();
                    return data;
                   
                });
            } 
            setTimeout(function(){
                screenLoader.hideLoader();
            }, 9000);

        }

        /**
         * Retrieve a list of table rows.
         * @return {Object} A requestlistTableModel object
         */
        function list(order, pagination, filters, search, uiFilters) {
         
            var listPayload = angular.copy(payload);
           
            if (typeof filters != "undefined" && filters !== null) {
                listPayload.PageFilters = {
                    "Filters": []
                };
                listPayload.PageFilters.Filters = filters;
            }
            if (typeof search != "undefined" && search !== null) {
                listPayload.SearchText = search;
            }
            if (typeof order != "undefined" && order !== null) {
                listPayload.Order = {
                    "ColumnName": order.column,
                    "SortOrder": order.order
                };
            }
            if (typeof pagination != "undefined" && pagination !== null) {
                // Pagination
                listPayload.Pagination = {
                    "Skip": pagination.start,
                    "Take": pagination.length
                };
            } else listPayload.Pagination = {
                "Skip": 0,
                "Take": 25
            };
            var request_data = payloadDataModel.create(listPayload);
            if (typeof uiFilters != "undefined" && uiFilters !== null) {
                request_data.UiFilters = uiFilters;
            }
           
            return orderResource.list(request_data).$promise.then(function(data) {
             
                return data;
            });


        }
        /**
         * Export the list of table rows.
         * @return {Object} A requestlistTableModel object
         */
        function exportList(order, pagination, columns, fileType, pageFilters) {
            var listPayload = angular.copy(payload);
            if (typeof fileType !== "undefined" && fileType !== null) {
                listPayload.ExportType = fileType;
            } else {
                return $q.reject();
            }
            if (typeof order != "undefined" && order !== null) {
                listPayload.Order = {
                    "ColumnName": order.column,
                    "SortOrder": order.order
                };
            }
            if (typeof pagination != "undefined" && pagination !== null) {
                // Pagination
                listPayload.Pagination = {
                    "Skip": pagination.start,
                    "Take": pagination.length
                };
            } else listPayload.Pagination = {
                "Skip": 0,
                "Take": 10
            };
            var timeZone = jstz().timezone_name;
            listPayload.timeZone = timeZone;
            // debugger;
            if (typeof columns != "undefined" && columns !== null) {
                listPayload.Columns = columns;
            }
            if(typeof pageFilters != 'undefined'){
                if(typeof listPayload.PageFilters == 'undefined') {
                    listPayload.PageFilters = {};
                    listPayload.PageFilters.Filters = [];
                }
                listPayload.PageFilters.Filters = pageFilters;
            }
            var request_data = payloadDataModel.create(listPayload);
            return orderResource.export(request_data).$promise.then(function(data) {
              
                return data;
              
            }).catch(function(error) {
                //convert error from arraybuffer to string
                var charCodeArray = Array.apply(null, new Uint8Array(error.data.data));
                var result = '';
                for (i = 0, len = charCodeArray.length; i < len; i++) {
                    code = charCodeArray[i];
                    result += String.fromCharCode(code);
                }
            });
        }

        function create(data) {
            var request_data = payloadDataModel.create(data);
            return orderResource.create(request_data).$promise.then(function(data) {
                return data;
            });
        }


        function getContractProductAdditionalCosts(contractProductId) {
            var request_data = payloadDataModel.create(contractProductId);
            return orderResource.getContractProductAdditionalCosts(request_data).$promise.then(function(data) {
                return data;
            });
        } 

        function update(data) {
            var request_data = payloadDataModel.create(data);
            screenLoader.showLoader();
            return orderResource.update(request_data).$promise.then(function(data) {
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
            var request_data = payloadDataModel.create(orderId);
            if (['cancel','reject','approve','submitForApproval'].indexOf(command) != -1) {
            	request_data = {
            		"Payload" : {
            			"id" : parseFloat(orderId)
            		}
            	}
            }
            return orderResource[command](request_data).$promise.then(function(data) {
               
                return data;
            });
        }

        function mailPreviewConfirmToSeller(data) {
            var payload = payloadDataModel.create(data);
            return orderResource.mailPreviewConfirmToSeller(payload).$promise.then(function(data) {
            
                return data;
            });
        }

        function getManualCancellationEmail (data) {
            var payload = payloadDataModel.create(data);
            return orderResource.getManualCancellationEmail (payload).$promise.then(function(data) {
            
                return data;
            });
        }        



        function createWithContract(order, filters, pagination) {
            var contractPayload = angular.copy(payload);
            if (typeof order != "undefined" && order !== null) {
                contractPayload.Order = {
                    "ColumnName": order.column,
                    "SortOrder": order.order
                };
            }
            if (typeof pagination != "undefined" && pagination !== null) {
                // Pagination
                contractPayload.Pagination = {
                    "Skip": pagination.start,
                    "Take": pagination.length
                };
            } else contractPayload.Pagination = {
                "Skip": 0,
                "Take": 100
            };
            if (typeof filters != "undefined" && filters !== null) {
                contractPayload.Filters = [{
                    "ColumnName": "RequestId",
                    "Value": filters.requestId
                }, {
                    "ColumnName": "ContractId",
                    "Value": filters.contractId
                }, {
                    "ColumnName": "ContractProductId",
                    "Value": filters.contractProductId
                }, {
                    "ColumnName": "RequestProductId",
                    "Value": filters.requestProductId
                }];
            } else contractPayload.Filters = [];
            var request_data = payloadDataModel.create(contractPayload);
            return orderResource.createWithContract(request_data).$promise.then(function(data) {
              
                return data;
            });
        }

        function createOrders(orderList) {
            var request_data = payloadDataModel.create(orderList);
            return orderResource.createOrders(request_data).$promise.then(function(data) {
              
                return data;
            });
        }

        function checkIfOrderCanBeCreatedUsingSelectedContract(filters) {
           
        	// payload.Filters = filters;
            // var send_data = {"Payload": filters};
            var payload = {
                "Filters": filters
            };

            request_data = payloadDataModel.create(payload);
            return orderResource.checkIfOrderCanBeCreatedUsingSelectedContract(request_data).$promise.then(function(data) {
                return data;
            });         
        }

        function getOrderEmailTemplate(emailData, template) {
            var templateId = 0;
            var templateName = null;
            if (typeof template != "undefined" && template !== null) {
                templateId = template.id;
                templateName = template.name;
            }
            var payload = {
                "Filters": [{
                    "ColumnName": "OrderId",
                    "Value": emailData.orderId
                }, { 
                    "ColumnName": "TemplateId",
                    "Value": templateId
                }, {
                    "ColumnName": "TemplateName",
                    "Value": templateName
                }]
            };
            request_data = payloadDataModel.create(payload);
            return orderResource.preview(request_data).
            $promise.
            then(function(data) {
                return data;
            });
        }

        function getOrderConfirmationEmailTemplate(emailData, template) {
            var templateId = 0;
            var templateName = null;
            if (typeof template != "undefined" && template !== null) {
                templateId = template.id;
                templateName = template.name;
            }
            var payload = {
                "Filters": [{
                    "ColumnName": "OrderId",
                    "Value": emailData.orderId
                }, {
                    "ColumnName": "TemplateId",
                    "Value": templateId
                }, {
                    "ColumnName": "TemplateName",
                    "Value": templateName
                }]
            };
            request_data = payloadDataModel.create(payload);
            return orderResource.previewConfirmation(request_data).
            $promise.
            then(function(data) {
                return data;
            });
        }

        function getOrderListForRequest(orderId) {
          
        	var payload = orderId;
        	request_data = payloadDataModel.create(payload);
            return orderResource.getOrderListForRequest(request_data).
            $promise.
            then(function(data) {
                screenLoader.hideLoader();
                return data;
               
            });
        }

        function getExistingOrders(data) {
            request_data = payloadDataModel.create(data);
            request_data.Payload = {
                "Filters": [{
                    ColumnName: "RequestProductIds",
                    Value: "["+data+"]"
                }]
            };
            return orderResource.getExistingOrders(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function getFormulaDetails(data) {
            request_data = payloadDataModel.create(data);
            return orderResource.getFormulaDetails(request_data).$promise.then(function(data) {
                return data;
            });
        }

        function  cancelOrderProduct(data) {
   		    payload = payloadDataModel.create(data);
            return orderResource.cancelOrderProduct(payload).$promise.then(function(data) {
                return data;
            });	
        }

        // return public model API
        return {
            getTemplates: getTemplates,
            get: get,
            list: list,
            create: create,
            update: update,
            confirm: confirm,
            exportList: exportList,
            createOrders: createOrders,
            sendOrderCommand: sendOrderCommand,
            getFormulaDetails : getFormulaDetails,
            createWithContract: createWithContract,
            cancelOrderProduct : cancelOrderProduct,
            getOrderEmailTemplate: getOrderEmailTemplate,
            getOrderListForRequest : getOrderListForRequest,
            mailPreviewConfirmToSeller: mailPreviewConfirmToSeller,
            getManualCancellationEmail : getManualCancellationEmail,
            getContractProductAdditionalCosts: getContractProductAdditionalCosts,
            getOrderConfirmationEmailTemplate: getOrderConfirmationEmailTemplate,
            checkIfOrderCanBeCreatedUsingSelectedContract : checkIfOrderCanBeCreatedUsingSelectedContract,
            getExistingOrders : getExistingOrders
        };
    }
]);

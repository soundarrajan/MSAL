angular.module('shiptech.pages').controller('NewOrderController', [ 'API', '$scope', '$element', '$listsCache', '$attrs', '$timeout','$http', '$state', '$filter', '$stateParams', '$templateCache', '$tenantSettings', '$uibModal', 'STATE', 'SCREEN_LAYOUTS', 'LOOKUP_TYPE', 'LOOKUP_MAP', 'IDS', 'ORDER_COMMANDS', 'VALIDATION_MESSAGES', 'SCREEN_ACTIONS', 'COST_TYPE_IDS', 'COMPONENT_TYPE_IDS', 'EMAIL_TRANSACTION', 'uiApiModel', 'listsModel', 'orderModel', 'lookupModel', 'screenActionsModel', 'tenantService', 'newRequestModel', '$uibModal', 'Factory_Master', 'Factory_Admin', '$rootScope', '$compile', 'statusColors', '$window', '$location',
    function(API, $scope, $element, $listsCache, $attrs, $timeout, $http, $state, $filter, $stateParams, $templateCache, $tenantSettings, uibModal, STATE, SCREEN_LAYOUTS, LOOKUP_TYPE, LOOKUP_MAP, IDS, ORDER_COMMANDS, VALIDATION_MESSAGES, SCREEN_ACTIONS, COST_TYPE_IDS, COMPONENT_TYPE_IDS, EMAIL_TRANSACTION, uiApiModel, listsModel, orderModel, lookupModel, screenActionsModel, tenantService, newRequestModel, $uibModal, Factory_Master, Factory_Admin, $rootScope, $compile, statusColors, $window, $location) {
        let ctrl = this;
        ctrl.state = $state;
        ctrl.STATE = STATE;
        ctrl.orderId = $stateParams.orderId ? $stateParams.orderId : null;
        ctrl.additionalCosts = [];
        ctrl.totalFuelPrice = 0;
        ctrl.totalAdditionalCost = 0;
        ctrl.grandTotal = 0;
        $scope.forms = {};

        ctrl.SCREEN_ACTIONS = SCREEN_ACTIONS;
        ctrl.ORDER_COMMANDS = ORDER_COMMANDS;
        ctrl.lookupInput = null;
        ctrl.additionalCostApplicableFor = {};
        ctrl.LOOKUP_TYPE = LOOKUP_TYPE;
        ctrl.COST_TYPE_UNIT_ID = 2;
        ctrl.PRICING_TYPE_FORMULA_ID = 2;
        ctrl.STATUS = [];
        ctrl.buttonsDisabled = false;
        ctrl.sellerTypeIdArray = [ IDS.SELLER_COUNTERPARTY_ID ];
        ctrl.agentTypeIdArray = [ IDS.AGENT_COUNTERPARTY_ID ];
        ctrl.supplierTypeIdArray = [ IDS.SUPPLIER_COUNTERPARTY_ID ];
        ctrl.fixedCurrency = false;
        ctrl.messageType = null;
        ctrl.tenantSettings = $tenantSettings;

        ctrl.listsCache = $listsCache;

        ctrl.lists = $listsCache;
        ctrl.DefaultAdditionalCosts = $listsCache.AdditionalCost;

        ctrl.orderConfirmationEmailToLabs = { id: 0, name: '' };
        ctrl.orderConfirmationEmailToSurveyor = { id: 0, name: '' };
        tenantService.tenantSettings.then((settings) => {
            ctrl.numberPrecision = settings.payload.defaultValues;
            ctrl.currency = settings.payload.tenantFormats.currency;
            ctrl.tenantUom = settings.payload.tenantFormats.uom;
            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
            ctrl.quantityPrecision = settings.payload.defaultValues.quantityPrecision;
            ctrl.defaultContractAgreementType = settings.payload.defaultValues.defaultContractAgreementType;
            ctrl.defaultSpotAgreementType = settings.payload.defaultValues.defaultSpotAgreementType;
            ctrl.shiptechLite = settings.payload.shiptechLite;
        });

        ctrl.disabledProduct = [];
        tenantService.emailSettings.then((settings) => {
        	ctrl.emailConfiguration = settings.payload;
            $.each(settings.payload, (k, v) => {
                if (v.process == 'Order Confirmation to Lab Email') {
                    ctrl.orderConfirmationEmailToLabs = v.emailType;
            		ctrl.emailToLabsTemplate = v.template;
                }
                if (v.process == 'Order Confirmation to Surveyor Email') {
                    ctrl.orderConfirmationEmailToSurveyor = v.emailType;
            		ctrl.emailToSurveyorTemplate = v.template;
                }
                if (v.process == 'Spot Order Confirmation to Seller Email') {
                	if (!ctrl.confirmToSellerTemplate) {
	            		ctrl.confirmToSellerManual = false;
	                	if (v.emailType.name == 'Manual') {
	                		ctrl.confirmToSellerManual = true;
	                		ctrl.confirmToSellerTemplate = v.template;
	                	}
                	}
                }
                if (v.process == 'Contract Order Confirmation to Seller Email') {
                	if (!ctrl.confirmToSellerContractTemplate) {
	            		ctrl.confirmToSellerContractManual = false;
	                	if (v.emailType.name == 'Manual') {
	                		ctrl.confirmToSellerContractManual = true;
	                		ctrl.confirmToSellerContractTemplate = v.template;
	                	}
                	}
                }
                if (v.process == 'Spot Order Confirmation to Vessel Email') {
                	if (!ctrl.confirmToVesselTemplate) {
	            		ctrl.confirmToVesselManual = false;
	                	if (v.emailType.name == 'Manual') {
	                		ctrl.confirmToVesselManual = true;
	                		ctrl.confirmToVesselTemplate = v.template;
	                	}
                	}
                }

				if (ctrl.customerConfiguration) {
	        		if (ctrl.customerConfiguration.sendSingleEmail) {
		                if (v.process == 'Order Confirmation Single Email') {
		            		ctrl.confirmToVesselManual = false;
		                	if (v.emailType.name == 'Manual') {
		                		// to vessel
		                		ctrl.confirmToVesselManual = true;
		                		ctrl.confirmToVesselTemplate = v.template;
		                		// to labs
								ctrl.orderConfirmationEmailToLabs = v.emailType;
								ctrl.emailToLabsTemplate = v.template;
		                		// to surveyor
			                    ctrl.orderConfirmationEmailToSurveyor = v.emailType;
			            		ctrl.emailToSurveyorTemplate = v.template;								
		                	}
		                }                	
	        		}                	
	        		if (ctrl.customerConfiguration.customerMailConfiguration.name == "Maersk Line") {
		                if (v.process == 'Maersk Line Order Spot Confirmation To Seller Email') {
		            		ctrl.confirmToSellerManual = false;
		                	if (v.emailType.name == 'Manual') {
		                		ctrl.confirmToSellerManual = true;
		                		ctrl.confirmToSellerTemplate = v.template;
		                	}
		                }			                
		                if (v.process == 'Maersk Line Order Contract Confirmation To Seller Email') {
		            		ctrl.confirmToSellerContractManual = false;
		                	if (v.emailType.name == 'Manual') {
		                		ctrl.confirmToSellerContractManual = true;
		                		ctrl.confirmToSellerContractTemplate = v.template;
		                	}
		                }	        			
		                if (v.process == 'Maersk Line Spot Order Confirmation to Vessel Email') {
		                	if (ctrl.confirmToVesselTemplate.name != "OrderConfirmationSingleEmail") {
			            		ctrl.confirmToVesselManual = false;
			                	if (v.emailType.name == 'Manual') {
			                		ctrl.confirmToVesselManual = true;
			                		ctrl.confirmToVesselTemplate = v.template;
			                	}
		                	}
		                }
		                if (v.process == 'Maersk Line Spot Order Confirmation to Lab Email') {
		                	if (ctrl.orderConfirmationEmailToLabs.name != "OrderConfirmationSingleEmail") {
		                		ctrl.orderConfirmationEmailToLabs = v.template;
		                	}
		                }
		                if (v.process == 'Maersk Line Spot Order Confirmation to Surveyor Email') {
		                	if (ctrl.emailToSurveyorTemplate.name != "OrderConfirmationSingleEmail") {
		                		ctrl.emailToSurveyorTemplate = v.template;
		                	}
		        		}                	
	                }
            	}
            });
            // console.log( ctrl.orderConfirmationEmailToLabs)
        });
        ctrl.captureConfirmedQuantity = {};
        tenantService.procurementSettings.then((settings) => {
            ctrl.procurementSettings = settings.payload;
            ctrl.isAgentFreeText = settings.payload.request.agentDisplay.id == 2;
            ctrl.isDeliveryWindow = settings.payload.request.deliveryWindowDisplay.id == 1;
            ctrl.isRecentETA = settings.payload.request.recentEta.id == 1;
            ctrl.needsTransactionLimitApproval = settings.payload.order.needsTransactionLimitApproval;
            ctrl.captureConfirmedQuantity = settings.payload.order.captureConfirmedQuantity;
            ctrl.orderHideMinMax = settings.payload.order.orderHideMinMax;
            ctrl.autoPopulateLabFrom = settings.payload.order.autoPopulateLabInOrderOption;
            ctrl.manualPricingDateOverride = settings.payload.price.pricingEventDateManualOverrride;
            ctrl.defaultDeliveryOption = settings.payload.request.defaultDeliveryOption;
            ctrl.isAgentMandatory = settings.payload.order.isOrderAgentMandatory;
            ctrl.isSurveyorMandatory = settings.payload.order.isOrderSurveyorMandatory;
            ctrl.useOrderPhysicalSupplierFlow = _.get(settings, 'payload.order.useOrderPhysicalSupplierFlow.name') === 'Yes';
        });


        ctrl.$onInit = function() {
            uiApiModel.get(SCREEN_LAYOUTS.NEW_ORDER).then((data) => {
                ctrl.ui = data;
                ctrl.defaultScreenActions = uiApiModel.getScreenActions();
                $scope.formFieldsNew = data;
                // Normalize relevant data for use in template.
                ctrl.vesselDetailsFields = normalizeArrayToHash(ctrl.ui.vesselDetails.fields, 'name');
                ctrl.sellerDetails = normalizeArrayToHash(ctrl.ui.sellerDetails.fields, 'name');
                ctrl.portFields = normalizeArrayToHash(ctrl.ui.Port.fields, 'name');
                ctrl.productColumns = normalizeArrayToHash(ctrl.ui.Product.columns, 'name');


                ctrl.additionalCostColumns = normalizeArrayToHash(ctrl.ui.additionalCost.columns, 'name');
                ctrl.nominationFields = normalizeArrayToHash(ctrl.ui.nomination.fields, 'name');

                $.each(ctrl.defaultScreenActions, (k, v) => {
                    if(v.mappedScreenActionName == 'ManualPricingDateOverride') {
                        ctrl.enableManualPricingDateOverride = true;
                    }
                });

                $.each(ctrl.productColumns, (k, v) => {
                    if(v.name == 'manualPricingDateOverride' && !ctrl.enableManualPricingDateOverride) {
                        ctrl.productColumns[k].visible = false;
                    }
                    if(v.name == 'pretest' && ctrl.procurementSettings.fieldVisibility.isPreTestHidden) {
                        ctrl.productColumns[k].visible = false;
                    }
                    if (v.name == 'productCategory' ) {
                        if(ctrl.procurementSettings.request.isRequestProductCategoryHidden != undefined && ctrl.procurementSettings.request.isRequestProductCategoryHidden == true){
                        ctrl.productColumns[k].visible = false;
                    }
                    else
                       {
                        ctrl.productColumns[k].visible = true;
                       }
                    }
                });

                // Get general-purpose data to be used in lookups etc.
                // ctrl.lists = data;
                ctrl.lists.Seller = _.uniqBy(_.concat(ctrl.lists.Seller, ctrl.lists.Sludge), 'id');
                setAdditionalCostAllowNegative();

                if (window.clickOnSaveAndSend && window.orderDetails) {
                    ctrl.additionalCostTypes = angular.copy(window.orderDetails.additionalCostTypes);
                    let data =  {
                        'payload': ''
                    };
                    orderModel.getOrderDiffAfterMail(ctrl.orderId).then((list) => {
                        window.orderDetails.data.mailSent = angular.copy(list.payload.mailSent);
                        window.orderDetails.data.screenActions  = angular.copy(list.payload.screenActions);
                        data.payload = angular.copy(window.orderDetails.data);
                        loadData(data);
                        $timeout(() => {
                            updateOrderSummary();
                            initDataTables();
                            ctrl.defaultMaxQtyFromConfirmed('init');
                        });
                    });

                    ctrl.lists.bargeCounterparties =  angular.copy(window.orderDetails.lists.bargeCounterparties);

                    ctrl.contractAgreementTypesList = angular.copy(window.orderDetails.contractAgreementTypesList);
                    ctrl.spotAgreementTypesList = angular.copy(window.orderDetails.spotAgreementTypesList);

                    ctrl.canClose = angular.copy(window.orderDetails.canClose);
                } else {
                    lookupModel.getAdditionalCostTypes().then((data) => {
                        ctrl.additionalCostTypes = normalizeArrayToHash(data.payload, 'id');
                        // console.log(ctrl.additionalCostTypes);
                        // Get the order data from server. Replace hardcoded order ID with $scope parameter.

                        orderModel.get(ctrl.orderId).then((data) => {
                            if (window.orderDetails) {
                                if (window.orderDetails.comfirmCancelOrder) {
                                    window.orderDetails.data = data.payload;
                                }
                            }
                            loadData(data);
                            $timeout(() => {
                                updateOrderSummary();
                                initDataTables();
                                ctrl.defaultMaxQtyFromConfirmed('init');
                            });
                        });
                    });
                    lookupModel.getSellerAutocompleteList([ IDS.BARGE_COUNTERPARTY_ID ]).then((data) => {
                        ctrl.lists.bargeCounterparties = data.payload;
                    });
                    // listsModel.get().then(function (data) {
                    // });

                    Factory_Admin.getAgreementTypeIndividualList(true, (response) => {
                        ctrl.contractAgreementTypesList = response.payload.contractAgreementTypesList;
                        ctrl.spotAgreementTypesList = response.payload.spotAgreementTypesList;
                    });

                    ctrl.canCloseOrder();
                }
            });
        };

        ctrl.getPortVisible = function(orderId,data) {
            ctrl.PortLocationEditable = false;
            if(orderId != null && data.status != null && data.status != undefined) {
                ctrl.isEnabledVessel = false;
                if(ctrl.procurementSettings.order?.optionToChangePort?.name == 'Yes' && ctrl.relatedOrders.length > 0 && ctrl.relatedOrders[0].deliveryCount == 0 && (data.status.name == 'Stemmed' || data.status.name == 'Confirmed' || data.status.name == 'Approved')) {
                    ctrl.PortLocationEditable = true;
                    ctrl.isEnabledVessel = true;
                }
                // data.status.name == 'Cancelled' || data.status.name == 'Delivered' || data.status.name == 'PartiallyDelivered' || data.status.name == 'Invoiced' || data.status.name == 'PartiallyInvoiced'
                // else if(data.status == null || $ctrl.data.status.name == 'Stemmed' || $ctrl.data.status.name == 'Confirmed' || $ctrl.data.status.name == 'Approved')
            }
            else { // esle : for new orders enable port change
                ctrl.isEnabledVessel = false;
                ctrl.PortLocationEditable = true;
            }
        };

        ctrl.canCloseOrder = function() {
            let payload = {
                Payload: ctrl.orderId
            }
            ctrl.canClose = false;
            $http.post(`${API.BASE_URL_DATA_PROCUREMENT}/api/procurement/order/canClose`, payload).then((response) => {
                if (response) {
                    if (response.data.payload) {
                        ctrl.canClose = true
                    } else {
                        ctrl.canClose = false;
                    }
                } else {
                    ctrl.canClose = false;
                }
            });
        }

        function setAdditionalCostAllowNegative() {
            //  
            // get val.id, make call to get all info about additional cost
            if (window.clickOnSaveAndSend && window.orderDetails) {
                $.each(ctrl.additionalCosts, (key, value) => {
                    value.additionalCostList = angular.copy(window.orderDetails.lists.AdditionalCost);
                });
            } else {
                Factory_Master.get_master_list_filtered('masters', 'additionalcost', 'masters_additionalcostlist', (response) => {
                    // console.log(response);
                    $.each(response.rows, (key0, value0) => {
                            $.each(ctrl.lists.AdditionalCost, (key1, value1) => {
                                if (value0.id == value1.id) {
                                    ctrl.lists.AdditionalCost[key1].allowNegative = value0.isAllowingNegativeAmmount;
                                }
                            });
                    });
                    $.each(ctrl.additionalCosts, (key, value) => {
                        value.additionalCostList = ctrl.lists.AdditionalCost;
                    });
                    console.log(ctrl.lists.AdditionalCost);
                });
            }
        }

        ctrl.setAdditionalCostsForLocation = function(locationId) {
            let apiJSON = {
                Payload: {
                    Order: null,
                    Filters: [
                        {
                            ColumnName: 'LocationId',
                            Value: locationId
                        }
                    ],
                    Pagination: {
                        Skip: 0,
                        Take: 25
                    },
                    SearchText: null
                }
            };
            
            Factory_Master.getAdditionalCostsForLocation(apiJSON, function(response) {
                // After retrieving location-wise additional costs
                // 1. Save it to separate list & sort them on top in additional cost list
                if(!response || !response.data || !response.data.payload || !response.data.payload.length > 0) {
                    $.each(ctrl.additionalCosts, (key, value) => {
                        value.additionalCostList = ctrl.DefaultAdditionalCosts;
                    });
                    return;
                }
                // Reset add.cost master list and add afresh based on location
                ctrl.lists.AdditionalCost = ctrl.DefaultAdditionalCosts;
                var newArr = [];
                $.each(response.data.payload, (key0, value0) => {
                    let obj = {};
                    obj.id = value0.additionalCostid;
                    obj.name = value0.name;
                    obj.allowNegative = value0.isAllowingNegativeAmmount;
                    obj.locationid = value0.locationid;
                    obj.price = value0.amount;
                    obj.costType = value0.costType;
                    obj.priceUom = value0.priceUom;
                    obj.extras = value0.extrasPercentage;
                    obj.trackId = value0.id;
                    obj.isDeleted = value0.isDeleted;
                    newArr.push(obj);
                });
                if(newArr.length > 0) {
                    ctrl.lists.AdditionalCost = newArr;
                    $.each(ctrl.additionalCosts, (key, value) => {
                        value.additionalCostList = ctrl.getFilteredAdditionalCostMasters(value);
                    });
                    ctrl.locationAdditionalCosts = ctrl.lists.AdditionalCost.filter(x => (x.locationid && x.locationid > 0));
                }
            });
        }

        ctrl.getFilteredAdditionalCostMasters = function(addCostRow) {
            let filteredAddCostList = [];
            if($state.current.name == STATE.NEW_ORDER) {
                filteredAddCostList = ctrl.lists.AdditionalCost.filter(x => (!x.isDeleted || x.isDeleted == false));
            }
            else if($state.current.name == STATE.EDIT_ORDER) {
                if(addCostRow.additionalCost && addCostRow.additionalCost.id) {
                    filteredAddCostList = ctrl.lists.AdditionalCost.filter(x => 
                        ((x.id == addCostRow.additionalCost.id && x.locationid == addCostRow.locationAdditionalCostId) || (!x.isDeleted || x.isDeleted == false)));
                } else {
                    filteredAddCostList = ctrl.lists.AdditionalCost.filter(x => (!x.isDeleted || x.isDeleted == false));
                }
            }
            // if additional cost list does not contain the item mentioned in contract, then do a hard-coded push here
            if(addCostRow.isContract) {
                if(addCostRow.additionalCost && addCostRow.additionalCost.id) {
                    if(!filteredAddCostList.some(x =>
                        ((x.id == addCostRow.additionalCost.id && x.locationid == addCostRow.locationAdditionalCostId)))) {
                            let obj = {};
                            obj.id = addCostRow.additionalCost.id;
                            obj.name = addCostRow.additionalCost.name;
                            obj.allowNegative = addCostRow.additionalCost.isAllowingNegativeAmmount;
                            obj.locationid = addCostRow.locationAdditionalCostId;
                            obj.price = addCostRow.additionalCost.amount;
                            obj.costType = addCostRow.additionalCost.costType;
                            obj.priceUom = addCostRow.additionalCost.priceUom;
                            obj.extras = addCostRow.additionalCost.extrasPercentage;
                            obj.isDeleted = addCostRow.additionalCost.isDeleted;
                            filteredAddCostList.push(obj);
                    }
                }
            }
            return filteredAddCostList;
        }

        ctrl.changedProductContract = function() {
            function checkDeleted(key) {
                if(!ctrl.data.products[key].contract || ctrl.data.products[key].contract.id == null) {
                    // deleted
                    ctrl.data.products[key].contract = null;
                    ctrl.data.products[key].contractId = null;
                }else{
                    // set required fields
                }
            }
            $.each(ctrl.data.products, (key, value) => {
                if(value.id == ctrl.productContractSelecting || value.uniqueIdUI == ctrl.productContractSelecting) {
                    checkDeleted(key);
                }
            });
        };

        ctrl.validateAdditionalCostAllowNegative = function(value, allow, index, additionalCost, additionalCostList) {
            if (typeof value == 'undefined') {
                return true;
            }

            if (additionalCost) {
            	var allowNegative = false;
                $.each(additionalCostList, (k, v) => {
                    if (v.id == additionalCost.id) {
		            	allowNegative = v.allowNegative;
                    }
                });
                if (allowNegative) {
                    return true;
                }
                if (value < 0) {
                    allowNegative = false;
                    return false;
                }
                return true;
            }
            	return true;


            if (typeof ctrl.allowNegativeAdditionalCost == 'undefined') {
                ctrl.allowNegativeAdditionalCost = [];
            }

            $timeout(() => {
                if (allow) {
                    ctrl.allowNegativeAdditionalCost[index] = true;
                    return true;
                }
                if (value < 0) {
                    ctrl.allowNegativeAdditionalCost[index] = false;
                    return false;
                }

                ctrl.allowNegativeAdditionalCost[index] = true;
                return true;
            }, 100);

            // inputName = inputName + "_" + index;
            // $scope.forms.additionalCostsForm[inputName].$setValidity(inputName, true);
        };

        $scope.$watchGroup([ '$ctrl.data.orderDate', '$ctrl.data.deliveryDate' ], () => {
        	if (typeof ctrl.data != 'undefined') {
	        	if (typeof ctrl.data.products != 'undefined') {
	        		setTimeout(() => {

	        			/* COMMENT BELOW FOR PERFORMANCE OPTIMIZATION*/
		        		// ctrl.getAllOrderContractOptions();
	        		}, 500);
	        	}
        	}
        });
        ctrl.getAllOrderContractOptions = function(onlyBuildPayload) {
        	var shouldOnlyBuildPayload = onlyBuildPayload;
        	setTimeout(() => {
	        	if (typeof ctrl.data.products != 'undefined') {
			        $.each(ctrl.data.products, (key, val) => {
			            ctrl.getOrderContractOptions(val, shouldOnlyBuildPayload);
			        });
	        	}
        	});
        };

        ctrl.getOrderContractOptions = function(product, onlyBuildPayload, responseCallback, key) {
            if (window.clickOnSaveAndSend && window.orderDetails) {
                if(typeof ctrl.orderContractOptions == 'undefined') {
                    ctrl.orderContractOptions = {};
                }
                if(typeof ctrl.orderContractOptions[product.product.id] == 'undefined') {
                    ctrl.orderContractOptions[product.product.id] = [];
                }
                if (window.orderDetails.orderContractOptions) {
                    ctrl.orderContractOptions[product.product.id] = angular.copy(window.orderDetails.orderContractOptions[product.product.id]);
                }
                if (ctrl.data.products.length - 1 == key) {
                    window.clickOnSaveAndSend = false;
                    window.orderDetails = null;
                }
                return;
            }
        	if (ctrl.disabledProduct[product.id] || product.requestOfferId) {
        		return;
        	}

        	if (!product.product || !ctrl.data.location || !ctrl.data.seller) {
        		return false;
        	}
            console.log(product);
            console.log(ctrl);

            if(typeof ctrl.productContractFilters == 'undefined') {
                ctrl.productContractFilters = {};
            }
            if(typeof ctrl.productContractFilters[product.product.id] == 'undefined') {
                ctrl.productContractFilters[product.product.id] = [];
            }
            ctrl.productContractFilters[product.product.id] = [
                {
                    ColumnName: 'LocationId',
                    Value: ctrl.data.location.id
                }, {
                    ColumnName: 'OrderDate',
                    Value: ctrl.data.orderDate ? `${ctrl.data.orderDate.split('T')[0] }T00:00:00+00:00` : null
                },
                {
                    ColumnName: 'DeliveryDate',
                    Value: ctrl.data.deliveryDate ? `${ctrl.data.deliveryDate.split('T')[0] }T00:00:00+00:00` : null
                },
                {
                    ColumnName: 'ProductId',
                    Value: product.product.id
                },
                {
                    ColumnName: 'OrderProductId',
                    Value: product.id ? product.id : null
                },
                {
                    ColumnName: 'OrderProductUomId',
                    Value: product.quantityUom ? product.quantityUom.id : null
                },
                {
                    ColumnName: 'SellerId',
                    Value: ctrl.data.seller.id
                }
            ];

       		if (onlyBuildPayload) {
       			return;
       		}

            var field = {
                Type: 'lookup',
                Name: 'Contract',
                masterSource: 'order_contract_autocomplete',
                Filters: ctrl.productContractFilters[product.product.id]
            };


            Factory_Master.get_master_list('procurement', 'order_contract_autocomplete', field, (callback) => {
                if(callback) {
		        	if (responseCallback) {
		        		responseCallback(callback);
		        	}
                    console.log(callback);

                    // init options lists
                    if(typeof ctrl.orderContractOptions == 'undefined') {
                        ctrl.orderContractOptions = {};
                    }
                    if(typeof ctrl.orderContractOptions[product.product.id] == 'undefined') {
                        ctrl.orderContractOptions[product.product.id] = [];
                    }

                    // check if options available
                    if(callback.length) {
                    	$.each(callback, function(k,v){
                    		v.name = v.contract.name;
                    	})
                        ctrl.orderContractOptions[product.product.id] = angular.copy(callback);
                    }else{
                        ctrl.orderContractOptions[product.product.id] = [ {
                            id: -1,
                            searchString: 'No options available!'
                        } ];
                    }
                }
            });
        };
        // function setCheckbox(){
        //     if (typeof ctrl.data.isVerified != "undefined" && typeof ctrl.data != null){
        //         if (ctrl.data.isVerified.name == "Yes") {
        //             $('#verifyCheckboxInput').trigger('click');
        //             $('#verifyCheckboxInput').attr('disabled', 'disabled');

        //         }
        //     }
        // }

        var decodeHtmlEntity = function(str) {
          return str.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
          });
        };

        // set all data mappings 
        getOrderListForRequest();
        function loadData(data) {
            ctrl.data = data.payload;
            ctrl.getOrderinitialSnapshot = angular.copy(ctrl.data);
            ctrl.PortLocationEditable = false;
            ctrl.getPortVisible(ctrl.orderId, ctrl.data);
            $.each(ctrl.data.products, (k, v) => {
                if ((!v.physicalSupplier || !_.get(v, 'physicalSupplier.id')) && _.get(v, 'status.name') !== 'Cancelled') {
                    ctrl.data.missingPhysicalSupplier = true;
                }
                if ((!v.specGroup || !_.get(v, 'specGroup.id')) && _.get(v, 'status.name') !== 'Cancelled') {
                    ctrl.data.missingSpecGroup = true;
                }
                v.comments = decodeHtmlEntity(_.unescape(v.comments)).replace(/<br\s?\/?>/g, '\n');

            });

            ctrl.data.missingSurveyor = !ctrl.data.surveyorCounterparty && ctrl.isSurveyorMandatory;
            ctrl.data.missingAgent = ctrl.isAgentMandatory && (ctrl.isAgentFreeText ? !ctrl.data.agentCounterpartyFreeText : !ctrl.data.agentCounterparty);
            ctrl.data.missingLab = !ctrl.data.lab;
            ctrl.data.missingPretest = true;
            $.each(ctrl.data.products, (k,v) => {
            	if (v.preTest) {
		            ctrl.data.missingPretest = false;
            	}
            })

            ctrl.data.products = $filter('orderBy')(ctrl.data.products, 'productType.id');

            $.each(ctrl.data.products, (k, v) => {
            	let physSup = false;
            	if (v.physicalSupplier) {
            		var foundSupplier = _.filter(ctrl.lists.Supplier, [ 'id', v.physicalSupplier.id ]);
            		if (foundSupplier) {
		                physSup = foundSupplier[0];
            		}
            	}

                if (physSup) {
                    v.physicalSupplier = physSup;
                }
            });

          if (typeof ctrl.data.comments != 'undefined') {
                if (ctrl.data.comments) {
                    ctrl.data.comments = decodeHtmlEntity(_.unescape(ctrl.data.comments)).replace(/<br\s?\/?>/g, '\n');
                }
            }
            if (typeof ctrl.data.customNonMandatoryAttribute10 != 'undefined') {
                if (ctrl.data.customNonMandatoryAttribute10) {
                    ctrl.data.customNonMandatoryAttribute10 = decodeHtmlEntity(_.unescape(ctrl.data.customNonMandatoryAttribute10)).replace(/<br\s?\/?>/g, '\n');
                }
            }
            if (typeof ctrl.data.customNonMandatoryAttribute11 != 'undefined') {
                if (ctrl.data.customNonMandatoryAttribute11) {
                    ctrl.data.customNonMandatoryAttribute11 = decodeHtmlEntity(_.unescape(ctrl.data.customNonMandatoryAttribute11)).replace(/<br\s?\/?>/g, '\n');
                }
            }

            if (typeof ctrl.data.cancelOrderComments  != 'undefined') {
                if (ctrl.data.cancelOrderComments) {
                    ctrl.data.cancelOrderComments = decodeHtmlEntity(_.unescape(ctrl.data.cancelOrderComments)).replace(/<br\s?\/?>/g, '\n');
                }
            }

            if (typeof ctrl.data.customNonMandatoryAttribute1 != 'undefined') {
                if (ctrl.data.customNonMandatoryAttribute1) {
                    ctrl.data.customNonMandatoryAttribute1 = decodeHtmlEntity(_.unescape(ctrl.data.customNonMandatoryAttribute1)).replace(/<br\s?\/?>/g, '\n');
                }
            }

            ctrl.fixedCurrency = ctrl.data.products[0].requestProductId && !ctrl.data.contract;

            for (var i = 0; i < ctrl.data.products.length; i++) {
                if (ctrl.data.products[i].product) {
                    if (window.clickOnSaveAndSend && window.orderDetails) {
                        if (window.orderDetails.data) {
                            ctrl.data.products[i].specGroups = angular.copy(window.orderDetails.data.products[i].specGroups);
                        }
                    } else {
                        listsModel.getSpecGroupByProduct(ctrl.data.products[i].product.id, i).then((server_data) => {
                            filteredIsDeleted = _.filter(server_data.data.payload, function(o) { 
                                return o.isDeleted == false; 
                            });
                            if (ctrl.data.products[server_data.id].specGroup) {
                                if (ctrl.data.products[server_data.id].specGroup.isDeleted) {
                                    filteredIsDeleted.push(ctrl.data.products[server_data.id].specGroup);       
                                }
                            }
                            ctrl.data.products[server_data.id].specGroups = filteredIsDeleted;
                        });
                    }
                }
            }

            for (let j = 0; j < ctrl.data.products.length; j++) {

                ctrl.data.products[j].uniqueIdUI = Math.random().toString(36).substring(7);
            }
            ctrl.globalAdditionalCosts = ctrl.data.additionalCosts;

            ctrl.screenActions = screenActionsModel.intersectActionLists(ctrl.defaultScreenActions, ctrl.data.screenActions);
            // ctrl.productColumns["manualPricingDateOverride"].visible = ctrl.dtoHasAction("ManualPricingDateOverride");
            if (ctrl.data.products[0] && ctrl.data.products[0].id === 0) {
                ctrl.data.products.length = 0;
            }
            if (ctrl.data.carrierCompany === null) {
                ctrl.data.carrierCompany = {};
            }
            if (ctrl.data.paymentCompany === null) {
                ctrl.data.paymentCompany = {};
            }
            if (ctrl.data.agentCounterparty === null) {
                ctrl.data.agentCounterparty = { id: null, name: '' };
            }
            if (ctrl.data.seller === null) {
                ctrl.data.seller = {};
            }
            if (ctrl.data.trader === null) {
                ctrl.data.trader = {};
            }
            if (ctrl.data.deliveryDate === null) {
                ctrl.data.deliveryDate = ctrl.data.eta;
            }
            if (ctrl.data.broker === null) {
                ctrl.data.broker = {};
            }
            if (ctrl.data.surveyorCounterparty === null) {
                ctrl.data.surveyorCounterparty = {};
            }
            if (ctrl.data.lab === null) {
                ctrl.data.lab = {};
            }
            if (ctrl.data.barge === null) {
                ctrl.data.barge = {};
            }
            for(var i = 0; i < ctrl.data.mailSent.length; i++) {
                if (ctrl.data.mailSent[i].emailTemplate.name.indexOf('ConfirmationToSeller') != -1) {
                    ctrl.data.emailToSellerSent = true;
                }

                if (ctrl.data.mailSent[i].emailTemplate.name.indexOf('ConfirmationToVessel') != -1
                    || ctrl.data.mailSent[i].emailTemplate.name.indexOf('OrderConfirmationSingleEmail') != -1
                    || ctrl.data.mailSent[i].emailTemplate.name.indexOf('MaerskLineOrderSpotConfirmationToVesselEmail') != -1
                ) {
                    ctrl.data.emailToVesselSent = true;
                }

                if (ctrl.data.mailSent[i].emailTemplate.name.indexOf('ConfirmationToLab') != -1
                    || ctrl.data.mailSent[i].emailTemplate.name.indexOf('OrderConfirmationSingleEmail') != -1
                    || ctrl.data.mailSent[i].emailTemplate.name.indexOf('MaerskLineOrderSpotConfirmationToLabEmail') != -1
                ) {
                    ctrl.data.emailToLabsSent = true;
                }

                if (ctrl.data.mailSent[i].emailTemplate.name.indexOf('ConfirmationToSurveyor') != -1
                    || ctrl.data.mailSent[i].emailTemplate.name.indexOf('OrderConfirmationSingleEmail') != -1
                    || ctrl.data.mailSent[i].emailTemplate.name.indexOf('MaerskLineOrderSpotConfirmationToSurveyorEmail') != -1
                ) {
                    ctrl.data.emailToSurvSent = true;
                }
            }

            ctrl.loadOrderScreen = true;


            ctrl.getCustomerConfiguration();

            addFirstAdditionalCost();
            updatePageTitle(); // this is for page title
            setPageTitle(); // this is for tab title
            setOrderStatusHeader();
            calculateProductsAmountField();
            getOrderListForRequest();
            // setCheckbox();

            for (var i = 0; i < ctrl.additionalCosts.length; i++) {
                addPriceUomChg(ctrl.additionalCosts[i]);
            }
            updateOrderSummary();
            ctrl.editableIMO();
            ctrl.setIsVerifiedBool();
            ctrl.defaultMaxQtyFromConfirmed('init');
        }

        ctrl.getCustomerConfiguration = () => {
            orderModel.getCustomerConfiguration(ctrl.data.id)
                .then((response) => {
                    ctrl.customerConfiguration = response.payload;
                    if (ctrl.emailConfiguration) {
                        if (ctrl.customerConfiguration) {
                            if (ctrl.customerConfiguration.sendSingleEmail || ctrl.customerConfiguration.customerMailConfiguration.name == "Maersk Line") {
                                $.each(ctrl.emailConfiguration, (k, v) => {
                                    if (ctrl.customerConfiguration.customerMailConfiguration.name == "Maersk Line") {
                                        if (v.process == 'Maersk Line Order Spot Confirmation To Seller Email') {
                                            ctrl.confirmToSellerManual = false;
                                            if (v.emailType.name == 'Manual') {
                                                ctrl.confirmToSellerManual = true;
                                                ctrl.confirmToSellerTemplate = v.template;
                                            }
                                        }
                                        if (v.process == 'Maersk Line Order Contract Confirmation To Seller Email') {
                                            ctrl.confirmToSellerContractManual = false;
                                            if (v.emailType.name == 'Manual') {
                                                ctrl.confirmToSellerContractManual = true;
                                                ctrl.confirmToSellerContractTemplate = v.template;
                                            }
                                        }
                                        if (v.process == 'Maersk Line Spot Order Confirmation to Vessel Email') {
                                            if (ctrl.confirmToVesselTemplate.name != "OrderConfirmationSingleEmail") {
                                                ctrl.confirmToVesselManual = false;
                                                if (v.emailType.name == 'Manual') {
                                                    ctrl.confirmToVesselManual = true;
                                                    ctrl.confirmToVesselTemplate = v.template;
                                                }
                                            }
                                        }
                                        if (v.process == 'Maersk Line Spot Order Confirmation to Lab Email') {
                                            if (ctrl.orderConfirmationEmailToLabs.name != "OrderConfirmationSingleEmail") {
                                                ctrl.orderConfirmationEmailToLabs = v.template;
                                            }
                                        }
                                        if (v.process == 'Maersk Line Spot Order Confirmation to Surveyor Email') {
                                            if (ctrl.emailToSurveyorTemplate.name != "OrderConfirmationSingleEmail") {
                                                ctrl.emailToSurveyorTemplate = v.template;
                                            }
                                        }
                                    }
                                    if (ctrl.customerConfiguration.sendSingleEmail) {
                                        if (v.process == 'Order Confirmation Single Email') {
                                            ctrl.confirmToVesselManual = false;
                                            if (v.emailType.name == 'Manual') {
                                                // to vessel
                                                ctrl.confirmToVesselManual = true;
                                                ctrl.confirmToVesselTemplate = v.template;
                                                // to labs
                                                ctrl.orderConfirmationEmailToLabs = v.emailType;
                                                ctrl.emailToLabsTemplate = v.template;
                                                // to surveyor
                                                ctrl.orderConfirmationEmailToSurveyor = v.emailType;
                                                ctrl.emailToSurveyorTemplate = v.template;
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                });
        }

        /**
         * Initializes the products and additional costs datatable.
         */
        function initDataTables() {
            // ctrl.productsTable = NewOrderProductsDatatable.init({
            //     selector: '#NEW_ORDER_products'
            // });
            // ctrl.addCostsTable = NewOrderAdditionalCostsDatatable.init({
            //     selector: '#new_order_additional_costs'
            // });
        }

        /**
         * Initializes the products and additional costs datatable.
         */
        function destroyDataTables() {
            if (ctrl.productsTable) {
                ctrl.productsTable.destroy();
                ctrl.productsTable = null;
            }
            if (ctrl.addCostsTable) {
                ctrl.addCostsTable.destroy();
                ctrl.addCostsTable = null;
            }
        }

        ctrl.getVesselSchedules = function() {
            ctrl.EnableSingleSelect = true;
            ctrl.voyagePortchangeEnabled = true;
                    $scope.$broadcast('getVesselSchedules', ctrl.data.vessel.id, ctrl.EnableSingleSelect,'NewOrder');
        };

        $scope.portValuechange = function(val){
            // if(ctrl.data.oldLocation == null){
                ctrl.data.oldLocation = 
                    {
                        clientIpAddress: null,
                        code: null,
                        collectionName: null,
                        customNonMandatoryAttribute1: null,
                        displayName: null,
                        id: val.id,
                        internalName: null,
                        isDeleted: false,
                        modulePathUrl: null,
                        name: val.name,
                        userAction: null
                    }
                
               // ctrl.data.oldLocation = angular.copy(ctrl.data.location);
            // }
            // if(ctrl.data.location == null){
                ctrl.data.location = 
                    {
                        clientIpAddress: null,
                        code: null,
                        collectionName: null,
                        customNonMandatoryAttribute1: null,
                        displayName: null,
                        id: val.id,
                        internalName: null,
                        isDeleted: false,
                        modulePathUrl: null,
                        name: val.name,
                        userAction: null
                    }
                
            // }
        }
        
        ctrl.selectVesselSchedulesPort = function(locations) {
            ctrl.EnableSingleSelect = false;
            ctrl.data.oldLocation = angular.copy(ctrl.data.location);
            if(locations && locations.length > 0) {
                // ctrl.data.location.name = locations[0].locationName;
                // ctrl.data.location.id = locations[0].locationId;
                ctrl.data.eta = locations[0].eta;
                ctrl.data.recentEta = locations[0].recentETA ?? locations[0].recentEta;
                ctrl.data.vesselVoyageDetailId = locations[0].vesselVoyageDetailId;
            }

            var isAvailablecontract = false;
            if(ctrl.data.products != undefined && ctrl.data.products.length != 0){
                $.each(ctrl.data.products, (i, e) => {
                    if(e.contractId != null){
                        isAvailablecontract = true;
                    }
                });
                if(isAvailablecontract){
                    toastr.warning("Whether if the port is available in contract or not , the contract has to be reset");
                }
            }

            $.each(ctrl.data.products, (k, v) => {
                // v.price =null;
                v.contract = null;
                v.formula = null;
                v.formulaDescription = null;
                v.contractId = null;
                v.contractProductId = null;
                v.agreementType = ctrl.defaultSpotAgreementType;

                ctrl.productPriceChanged(v);
                ctrl.changedProductContract();
            });
        }

        function updatePageTitle() {
            if (!ctrl.data.vessel) {
                return $state.params.title;
            }
            switch ($state.current.name) {
            case STATE.NEW_ORDER:
                $state.params.title = `New Order - ${ ctrl.data.vessel.name}`;
                break;
            case STATE.EDIT_ORDER:
                $state.params.title = `Edit Order - ${ ctrl.data.name } - ${ ctrl.data.vessel.name}`;
                break;
            }
        }

        function setOrderStatusHeader() {
            if (typeof ctrl.data.status != 'undefined') {
                if (!ctrl.data.status) {
                    ctrl.data.status = {};
                }
                if (ctrl.data.status.name) {
                    $state.params.status = {};
                    $state.params.status.name = ctrl.data.status.displayName;
                    $state.params.status.bg = statusColors.getColorCodeFromLabels(
                        ctrl.data.status,
                        $listsCache.ScheduleDashboardLabelConfiguration);
                    ctrl.data.status.bg = $state.params.status.bg;
                    $state.params.status.color = 'white';
                }
            } else {
                $state.params.status = null;
            }
        }

        function updateOrderSummary() {
            ctrl.totalFuelPrice = calculateTotalFuelPrice() || 0;
            ctrl.totalAdditionalCost = calculateTotalAdditionalCost() || 0;

            /* bug 6676 ???*/
            ctrl.grandTotal = parseFloat(ctrl.totalFuelPrice) + parseFloat(ctrl.totalAdditionalCost);
        }

        /**
         * Checks if the given additional cost belongs
         * to the ProductComponent category.
         */
        function isProductComponent(additionalCost) {
            if (!additionalCost.additionalCost) {
                return false;
            }
            additionalCost.isTaxComponent = false;
            if (ctrl.additionalCostTypes[additionalCost.additionalCost.id].componentType) {
                additionalCost.isTaxComponent = !(ctrl.additionalCostTypes[additionalCost.additionalCost.id].componentType.id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT);
                return ctrl.additionalCostTypes[additionalCost.additionalCost.id].componentType.id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT;
            }
            return null;
        }

        /**
         * Get the corresponding component type ID for a given additional cost.
         */
        function getAdditionalCostDefaultCostType(additionalCost) {
            if (!additionalCost.additionalCost) {
                return false;
            }
            var costType = {};
            if(additionalCost.locationAdditionalCostId || additionalCost.additionalCost.locationid) {
                costType = additionalCost.additionalCost.costType || additionalCost.costType ||
                    ctrl.additionalCostTypes[additionalCost.additionalCost.id].costType;
            }
            else {
                costType = ctrl.additionalCostTypes[additionalCost.additionalCost.id].costType;
            }
            return costType;
        }

        /**
         * Goes through all the products in the payload to update their amount field according to
         * predetermined formula. This is needed to have an initial amount value to display in the
         * products table, since amount comes as 0 from the server. If this changes in the future,
         * this function becomes redundant.
         */
        function calculateProductsAmountField() {
            for (let i = 0; i < ctrl.data.products.length; i++) {
                //  
                productUomChg(ctrl.data.products[i]);
                // .data.products[i].amount = +ctrl.data.products[i].confirmedQtyPrice * +ctrl.data.products[i].confirmedQuantity * +ctrl.data.products[i].price;
            }
        }

        function calculateProductAmount(product) {
            var confirmedQuantityOrMaxQuantity = product.confirmedQuantity;
            if (!product.confirmedQuantity) {
                confirmedQuantityOrMaxQuantity = product.maxQuantity;
            }
            return (Number(confirmedQuantityOrMaxQuantity) || 0) * (Number(product.confirmedQtyPrice) || 0) * (Number(product.price) || 0);
        }

        /**
         * Sum the Amount field of all products.
         */
        function sumProductAmounts() {
            let result = 0;
            for (let i = 0; i < ctrl.data.products.length; i++) {
            	if (!ctrl.data.products[i].status || ctrl.data.products[i].status.id != ctrl.STATUS.Cancelled.id) {
		                result = result + ctrl.data.products[i].amount;
            	}
            }
            return result;
        }

        /**
         * Calculates the amount-related fields of an additional cost, as per FSD p. 210: Amount, Extras Amount, Total Amount.
         */
        function calculateAdditionalCostAmounts(additionalCost, product) {
            let totalAmount, productComponent;
            if (!additionalCost.costType) {
                return additionalCost;
            }
            if (ctrl.defaultValueUom && !additionalCost.priceUom) {
                additionalCost.priceUom = ctrl.defaultValueUom;
            }
            switch (additionalCost.costType.id) {
            case COST_TYPE_IDS.UNIT:
                // if (additionalCost.isAllProductsCost || !productComponent) {
                // addPriceUomChg(additionalCost);
                additionalCost.amount = 0;
                if (!additionalCost.prodConv) {
                    	ctrl.addPriceUomChanged(additionalCost);
                }
                if (additionalCost.priceUom && additionalCost.prodConv && additionalCost.prodConv.length == ctrl.data.products.length) {
                    for (let i = 0; i < ctrl.data.products.length; i++) {
                        let prod = ctrl.data.products[i];
                        if (!prod.status || prod.status.id != ctrl.STATUS.Cancelled.id) {
                            var confirmedQuantityOrMaxQuantity = prod.confirmedQuantity ? prod.confirmedQuantity : prod.maxQuantity;
                            confirmedQuantityOrMaxQuantity = convertDecimalSeparatorStringToNumber(confirmedQuantityOrMaxQuantity);
                            if (additionalCost.isAllProductsCost) {
                                additionalCost.amount = convertDecimalSeparatorStringToNumber(additionalCost.amount) + 
                                    confirmedQuantityOrMaxQuantity * convertDecimalSeparatorStringToNumber(additionalCost.prodConv[i]) *
                                    convertDecimalSeparatorStringToNumber(additionalCost.price);
                            } else if (product === prod) {
                                additionalCost.amount = confirmedQuantityOrMaxQuantity * convertDecimalSeparatorStringToNumber(additionalCost.prodConv[i]) *
                                    convertDecimalSeparatorStringToNumber(additionalCost.price);
                            }
                        }
                    }
                }
                break;
            case COST_TYPE_IDS.FLAT:
                additionalCost.amount = convertDecimalSeparatorStringToNumber(additionalCost.price) || 0;
                additionalCost.priceUom = null;
                break;
            case COST_TYPE_IDS.PERCENT:
                productComponent = isProductComponent(additionalCost);
                if (additionalCost.isAllProductsCost || !productComponent) {
                    totalAmount = sumProductAmounts();
                } else {
                    totalAmount = convertDecimalSeparatorStringToNumber(product.amount);
                }
                if (productComponent) {
                    additionalCost.amount = convertDecimalSeparatorStringToNumber(totalAmount) *
                        convertDecimalSeparatorStringToNumber(additionalCost.price) / 100 || 0;
                } else {
                    totalAmount = convertDecimalSeparatorStringToNumber(totalAmount) + sumProductComponentAdditionalCostAmounts();
                    additionalCost.amount = totalAmount * convertDecimalSeparatorStringToNumber(additionalCost.price) / 100 || 0;
                }
                additionalCost.priceUom = null;
                break;
            case COST_TYPE_IDS.RANGE : case COST_TYPE_IDS.TOTAL :
                additionalCost.amount = additionalCost.price || 0;
                additionalCost.priceUom = null;
                break;
            }
            if (!product) {
                product = ctrl.data.products[0];
            }
         
            additionalCost.quantityUom = product.quantityUom;
            additionalCost.confirmedQuantity = parseFloat(additionalCost.confirmedQuantity) ? parseFloat(additionalCost.confirmedQuantity) : parseFloat(product.maxQuantity);
            additionalCost.extrasAmount = parseFloat(additionalCost.extras) / 100 * parseFloat(additionalCost.amount) || 0;
            additionalCost.totalAmount = parseFloat(additionalCost.amount) + parseFloat(additionalCost.extrasAmount);
            additionalCost.rate = parseFloat(additionalCost.totalAmount) / parseFloat(additionalCost.confirmedQuantity);
            additionalCost.locationAdditionalCostId = additionalCost?.locationAdditionalCostId ?? additionalCost?.additionalCost?.locationid;
            if(additionalCost.additionalCost){
                additionalCost.additionalCost.locationid = additionalCost?.locationAdditionalCostId ?? additionalCost?.additionalCost?.locationid;
            }
            return additionalCost;
        }

        ctrl.setDefaultUomForAdditionalCost = function(additionalCost, product) {
            if(!ctrl.defaultUomsForProduct) {
                ctrl.defaultUomsForProduct = [];
            } 
            let obj = ctrl.defaultUomsForProduct.find(x => x.productUniqueId == product.uniqueIdUI);
            if(obj) {
                if(!ctrl.defaultValueUom) {
                    ctrl.defaultValueUom = obj.defaultUom;
                }
            } else {
                ctrl.getDefaultUomForAdditionalCost(additionalCost, product);
            }
        }

        ctrl.getDefaultUomForAdditionalCost = function(additionalCost, product) {
            console.log(additionalCost);
            console.log(product);
            if (!ctrl.listProductTypeGroupsDefaults) {
                let payload1 = { Payload: {} };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/listProductTypeGroupsDefaults`, payload1).then((response) => {
                    console.log(response);
                    if (response.data.payload != 'null') {
                        ctrl.listProductTypeGroupsDefaults = response.data.payload;
                        let payload = { Payload: product.product.id };
                        $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                            if (response.data.payload != 'null') {
                                let productTypeGroup  = response.data.payload.productTypeGroup;
                                let defaultUomAndCompany = _.find(ctrl.listProductTypeGroupsDefaults, function(object) {
                                        return object.id == productTypeGroup.id;
                                });
                                if (defaultUomAndCompany) {
                                    ctrl.defaultValueUom = defaultUomAndCompany.defaultUom;
                                    if(ctrl.defaultUomsForProduct &&
                                        !ctrl.defaultUomsForProduct.some(x => x.productUniqueId == product.uniqueIdUI)) {
                                        ctrl.defaultUomsForProduct.push({ productUniqueId: product.uniqueIdUI, defaultValueUom: defaultUomAndCompany.defaultUom });
                                    }
                                }
                            }
                        }); 
                    }
                });
            } else {
                let payload = { Payload: product.product.id };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                    if (response.data.payload != 'null') {
                        let productTypeGroup  = response.data.payload.productTypeGroup;
                        let defaultUomAndCompany = _.find(ctrl.listProductTypeGroupsDefaults, function(object) {
                                return object.id == productTypeGroup.id;
                        });
                        if (defaultUomAndCompany) {
                            ctrl.defaultValueUom = defaultUomAndCompany.defaultUom;
                            if(ctrl.defaultUomsForProduct &&
                                !ctrl.defaultUomsForProduct.some(x => x.productUniqueId == product.uniqueIdUI)) {
                                ctrl.defaultUomsForProduct.push({ productUniqueId: product.uniqueIdUI, defaultValueUom: defaultUomAndCompany.defaultUom });
                            }
                        } 
                    }
                });
            }
        }

        /**
         * Sum the amounts of all additional costs that are NOT tax component additional costs.
         */
        function sumProductComponentAdditionalCostAmounts() {
            let result = 0;
            if (ctrl.additionalCosts) {
                for (let i = 0; i < ctrl.additionalCosts.length; i++) {
                    if (isProductComponent(ctrl.additionalCosts[i])) {
                        result = result + ctrl.additionalCosts[i].totalAmount;
                    } else if(ctrl.additionalCosts[i].costType) {
                        if(ctrl.additionalCosts[i].costType.id !== COST_TYPE_IDS.PERCENT) {
	                        result = result + ctrl.additionalCosts[i].totalAmount;
                        }
                    }
                }
            }
            return result;
        }

        /**
         * Calculates the order total fuel price.
         * Total Fuel Price = (Total Quantity x Unit Price) of all the products in the Order (FSD p. 239).
         */
        function calculateTotalFuelPrice() {
            let product,
                result = ctrl.data.totalFuelPrice;
            // for (var i = 0; i < ctrl.data.products.length; i++) {
            //     product = ctrl.data.products[i];
            //     result += product.confirmedQuantity * product.confirmedQtyPrice * product.price;
            // }
            return result;
        }

        function calculateTotalAdditionalCost() {
            let result = 0;
            if (ctrl.additionalCosts) {
                for (var i = 0; i < ctrl.additionalCosts.length; i++) {
                	var parentProductStatus = 0;
                	$.each(ctrl.data.products, (k, v) => {
                		if (v.id == ctrl.additionalCosts[i].parentProductId) {
		                	if (v.status) {
			                	parentProductStatus = v.status.name;
		                	}
                		}
                	});
                    if (!ctrl.additionalCosts[i].isDeleted && parentProductStatus != 'Cancelled') {
                        result = result + (parseFloat(ctrl.additionalCosts[i].totalAmount) || 0);
                    }
                }
            }
            return result;
        }

        function sumProductConfirmedQuantities(products) {
            let result = 0;
            for (let i = 0; i < products.length; i++) {
            	if (!products[i].status || products[i].status.id != ctrl.STATUS.Cancelled.id) {
	                var confirmedQuantityOrMaxQuantity = products[i].confirmedQuantity ? products[i].confirmedQuantity : products[i].maxQuantity;
	                result = result + confirmedQuantityOrMaxQuantity * products[i].confirmedQtyProdZ;
            	}
            }
            return result;
        }

        function getProductById(productId) {
            return $filter('filter')(ctrl.data.products, {
                id: productId
            })[0];
        }

        function findAdditionalCost(additionalCost) {
            let i, j;
            for (i = 0; i < ctrl.globalAdditionalCosts.length; i++) {
                if (additionalCost.fakeId === ctrl.globalAdditionalCosts[i].fakeId) {
                    return {
                        container: ctrl.globalAdditionalCosts,
                        index: i
                    };
                }
            }
            for (i = 0; i < ctrl.data.products.length; i++) {
                for (j = 0; j < ctrl.data.products[i].additionalCosts.length; j++) {
                    if (additionalCost.fakeId === ctrl.data.products[i].additionalCosts[j].fakeId) {
                        return {
                            container: ctrl.data.products[i].additionalCosts,
                            index: j
                        };
                    }
                }
            }
            return null;
        }

        function orderHasAdditionalCosts() {
            ctrl.getAdditionalCosts();
            return ctrl.additionalCosts?.length;
        }

        /**
         * Returns an empty Additional Cost base on a hardcoded template. Yep.
         */
        function createNewAdditionalCostObject() {
            return {
                fakeId: null, // This will be used to identify the new object during frontend manipulation.
                additionalCost: null,
                amount: null,
                amountInBaseCurrency: null,
                comment: '',
                costType: null,
                currency: ctrl.data.products[0].currency,
                extras: null,
                extrasAmount: null,
                isAllProductsCost: false,
                isDeleted: false,
                maxQuantity: null,
                price: null,
                priceUom: null,
                rate: null,
                totalAmount: null
            };
        }

        /**
         * Adds a first additional cost row in case there are none in the respective location.
         */
        function addFirstAdditionalCost() {
            ctrl.getAdditionalCosts();
            return false;
            if (!orderHasAdditionalCosts()) {
                ctrl.addAdditionalCost();
            }
        }

        /**
         * Adds an Additional Cost to the first product, so that the + button becomes available.
         */
        ctrl.addAdditionalCost = function() {
            if (!ctrl.data.products) {
                return;
            }
            if (!ctrl.data.products[0]) {
                return;
            }
            let newAdditionalCost = createNewAdditionalCostObject();
            newAdditionalCost.additionalCostList = ctrl.getFilteredAdditionalCostMasters(newAdditionalCost);
            if (!ctrl.data.products[0].additionalCosts) {
            	ctrl.data.products[0].additionalCosts = [];
            }
            ctrl.data.products[0].additionalCosts.push(newAdditionalCost);
            ctrl.getAdditionalCosts();
            // ctrl.evaluateAdditionalCostList();
        };
        ctrl.deleteAdditionalCost = function(additionalCost) {
            if (additionalCost.fakeId < 0) {
                // This is a newly added object, delete it altogether.
                deleteAdditionalCost(additionalCost);
            } else {
                // This object exists in the database. Mark it for deletion.
                additionalCost.isDeleted = true;
            }
            // Add a new blank additional cost if there aren't any left.
            addFirstAdditionalCost();
            ctrl.evaluateAdditionalCostList();
        };

        /**
         * Moves the given additional cost object under the given product in the given location,
         * deleting it from the product it is currently under.
         * @param {Object} additionalCost - An additional cost object.
         * @param {Object} product - A product object, which is the target parent product.
         */
        ctrl.applicableForChange = function(additionalCost, product, initiatorName) {
            let products = []; // An array of products, needed to preserve code consistency between a product selection and "All".
            // If "All" is selected, product will be undefined.
            // See: http://stackoverflow.com/questions/30604938/add-two-extra-options-to-a-select-list-with-ngoptions-on-it/30606388#30606388
            additionalCost.isAllProductsCost = !product;
            // Delete the additional cost from parent, which is either a product, or the "global" Additional Cost array.
            deleteAdditionalCost(additionalCost);
            // Add the copy to the new parent, be it a product or the "global" Additional Costs array.
            if (additionalCost.isAllProductsCost) {
                additionalCost.parentProductId = -1;
                additionalCost.confirmedQuantity = sumProductConfirmedQuantities(ctrl.data.products);
                additionalCost.quantityUom = ctrl.data.products[0].quantityUom;
                ctrl.globalAdditionalCosts.push(additionalCost);
            } else {
                additionalCost.parentProductId = product.id;
                if (typeof product.additionalCosts == 'undefined') {
	                product.additionalCosts = [];
                }
                additionalCost.confirmedQuantity = convertDecimalSeparatorStringToNumber(product.confirmedQuantity);
                additionalCost.quantityUom = product.quantityUom;
                product.additionalCosts.push(additionalCost);
            }
            if(initiatorName == 'input') {
                if(!additionalCost.isAllProductsCost) {
                    ctrl.setLocationBasedAdditionalCosts(additionalCost, product, 'applicableForChange');
                    calculateAdditionalCostAmounts(additionalCost, product);
                }
                ctrl.evaluateAdditionalCostList();
            }
        };

        /**
         * Deletes the additional cost from its parent, which is either a product, or the "global" Additional Costs array.
         * @param {Object} additionalCost - The additional cost object to delete.
         * @param {Object} parentProduct - The parent product of the additional object. If null,
         *   the additional cost will be searched for/deleted from the "global" Additional Costs array.
         */
        function deleteAdditionalCost(additionalCost) {
            let parentData = findAdditionalCost(additionalCost);
            if (parentData) {
                parentData.container.splice(parentData.index, 1);
                // Also delete from addCostList binding
                if(ctrl.additionalCosts && ctrl.additionalCosts.length > 0) {
                    var idx = ctrl.additionalCosts.indexOf(additionalCost);
                    if(idx > -1) {
                        ctrl.additionalCosts.splice(idx, 1);
                    }
                }
            } else {
                throw `Attempting deletion of a non-existent additional cost: ${ JSON.stringify(additionalCost)}`;
            }
        }

        /**
         * Iterates through products to remove empty additional costs.
         */
        function removeNullAdditionalCosts() {
            let result, product;
            for (let i = 0; i < ctrl.data.products.length; i++) {
                result = [];
                product = ctrl.data.products[i];
                if (product.additionalCosts) {
                    for (let j = 0; j < product.additionalCosts.length; j++) {
                        if (product.additionalCosts[j].additionalCost !== null) {
                            result.push(product.additionalCosts[j]);
                        }
                    }
                    angular.copy(result, product.additionalCosts);
                }
            }
        }

        /**
         * Get the additional costs associated with a given location.
         * @returns {Array} - An array of additionalCosts objects.
         */
        ctrl.getAdditionalCosts = function(initiatorName) {
            let additionalCost,
                result = [];
            if (!ctrl.data) {
                return result;
            }
            // Set result to the global additional costs array in the DTO,
            // which contains the "All Products" additional costs.
            result = ctrl.globalAdditionalCosts;
            ctrl.additionalCostApplicableFor = {};
            if (result) {
                for (let k = 0; k < result.length; k++) {
                    additionalCost = result[k];

                    if (!additionalCost.fakeId) {
                        additionalCost.fakeId = -Date.now();
                    }
                    // Save product model for "Applicable for", and calculate the confirmedQuantity
                    // based on it:
                    ctrl.additionalCostApplicableFor[additionalCost.fakeId] = null;
                    additionalCost.confirmedQuantity = sumProductConfirmedQuantities(ctrl.data.products);
                    // TODO: Get the quantityUom of the first product? Or is there a different business logic for this?
                    // console.log(2)
                    // additionalCost.quantityUom = null;
                    additionalCost.quantityUom = ctrl.data.products[0].quantityUom;
                    additionalCost = calculateAdditionalCostAmounts(additionalCost, null);
                }
            }  
            if (ctrl.data.products) {
                for (let i = 0; i < ctrl.data.products.length; i++) {
                    if (ctrl.data.products[i].additionalCosts) {
                        for (let j = 0; j < ctrl.data.products[i].additionalCosts.length; j++) {
                            additionalCost = ctrl.data.products[i].additionalCosts[j];
                            // We need to manage the newly created additionalCost objects in the front-end,
                            // before they are saved to the server, therefore we need a way to reference
                            // them before the server gives them an UID.
                            // We'll use a fakeId field that acts as a temporary UID.
                            // For objects already existing on the server, it will be equal to their ID field.
                            // For new objects, we'll make one using a negative timestamp.
                            if (!additionalCost.fakeId) {
                                additionalCost.fakeId = -Date.now();
                            }
                            additionalCost.parentProductId = ctrl.data.products[i].id;
                            // Save product model for "Applicable for", and calculate the confirmedQuantity
                            // based on it.
                            ctrl.additionalCostApplicableFor[additionalCost.fakeId] = ctrl.data.products[i];
                            additionalCost.confirmedQuantity = convertDecimalSeparatorStringToNumber(ctrl.data.products[i].confirmedQuantity);
                            // console.log(1)
                            additionalCost.quantityUom = ctrl.data.products[i].quantityUom;
                            additionalCost = calculateAdditionalCostAmounts(additionalCost, ctrl.data.products[i]);
                        }
                        if (result) {
	                        result = result.concat(ctrl.data.products[i].additionalCosts);
                        }
                    }
                }
            }

            result = $filter('filter')(result, {
                isDeleted: false
            });

            ctrl.additionalCosts = result;

			for (i = result.length - 1; i > 0; i--) {
				additionalCost = result[i];
                if (ctrl.data.status && (
                    // ctrl.data.status.name == 'Confirmed' ||
                    ctrl.data.status.name == 'PartiallyDelivered' ||
                  ctrl.data.status.name == 'Delivered' ||
                  ctrl.data.status.name == 'PartiallyInvoiced' ||
                  ctrl.data.status.name == 'Invoiced')) {
                   additionalCost.disabled = true;
                }
                ctrl.costTypeChanged(additionalCost);
			}

            updateOrderSummary();
            return result;
        };


        

        /**
         * Performs certain actions when the users changes the payment company:
         *   - changes the default currency for the entire view, IF ctrl.fixedCurrency is false
         */
        function doPaymentCompanyChanged(company) {
            let i, additionalCosts, exchangeRate;
            if (!ctrl.fixedCurrency) {
                // Replace this if block with async server call to get the exchange rate.
                // TODO: there's a naming convention issue in the DTO - the "currency" object
                // is named "currencyId". This will be changed at some point, and will need
                // changing here, too.
                lookupModel.getExchangeRate(ctrl.currency, company.currencyId).then((server_data) => {
                    exchangeRate = server_data.payload;
                    ctrl.currency = company.currencyId; // see above!!
                    // Update amount and currency in products.
                    for (i = 0; i < ctrl.data.products.length; i++) {
                        ctrl.data.products[i].currency = ctrl.currency;
                        ctrl.data.products[i].price = Number(ctrl.data.products[i].price) * Number(exchangeRate);
                        ctrl.data.products[i].amount = calculateProductAmount(ctrl.data.products[i]);
                    }
                    // Update amount and currency in additional costs.
                    additionalCosts = ctrl.getAdditionalCosts();
                    for (i = 0; i < additionalCosts.length; i++) {
                        additionalCosts[i].currency = ctrl.currency;
                        additionalCosts[i].price = Number(additionalCosts[i].price) * Number(exchangeRate);
                        additionalCosts[i] = calculateAdditionalCostAmounts(additionalCosts[i], getProductById(additionalCosts[i].parentProductId));
                    }
                }).catch((e) => {
                    throw 'Unable to get the exchange rate.';
                });
            }
        }
        ctrl.editableIMO = function() {
            // checks for data to set isEditableIMO, called at init
            ctrl.isEditableIMO = true;
            if (ctrl.data) {
                $.each(ctrl.data.products, (key, val) => {
                    if (val.contractProductId != null) {
                        ctrl.isEditableIMO = false;
                    }
                    if (val.requestOfferId != null) {
                        ctrl.isEditableIMO = false;
                    }
                });
            }
        };

        /**
         * TODO: review the need for this!
         * Late-initializes the date input fields in the template.
         */
        ctrl.initializeDynamicDateInput = function(event) {
            let date = $(event.currentTarget);
            if (date.data('datetimepicker') !== undefined) {
                return false;
            }
            date.datetimepicker({
                isRTL: App.isRTL(),
                format: 'dd MM yyyy - HH:ii P',
                showMeridian: true,
                autoclose: true,
                pickerPosition: App.isRTL() ? 'bottom-right' : 'bottom-left',
                todayBtn: false
            });
            date.focus();
        };
        ctrl.initLookup = function(name, field) {
            ctrl.lookupName = name;
            ctrl.lookupType = LOOKUP_MAP[name];
            ctrl.lookupField = field;
            if (name == 'Trader') {
                ctrl.isTrader = true;
                ctrl.lookupType = LOOKUP_MAP.Buyer;
            } else {
                ctrl.isTrader = false;
            }
        };
        ctrl.getSpecGroups = function(product) {
            listsModel.getSpecGroupByProduct(product.product.id).then((server_data) => {
            	filteredIsDeleted = _.filter(server_data.data.payload, function(o) { 
					return o.isDeleted == false; 
				});
                product.specGroups = filteredIsDeleted;
            });
        };
        ctrl.selectVessel = function(vesselId) {
            let data;
            lookupModel.get(LOOKUP_TYPE.VESSEL, vesselId).then((server_data) => {
                data = server_data.payload;
                ctrl.setDefaultValues('vessel', 'lab', data.defaultLab);
                if (ctrl.data.vessel === null) {
                    ctrl.data.vessel = {};
                }
                if (ctrl.data.service === null) {
                    ctrl.data.service = {};
                }
                if (ctrl.data.buyer === null) {
                    ctrl.data.buyer = {};
                }
                ctrl.data.customer = data.customer;
                ctrl.data.lab = data.defaultLab;
                ctrl.data.vessel.vesselToWatchFlag = data.vesselToWatchFlag;
                newRequestModel.getDefaultBuyer(data.id).then((buyer) => {
                    ctrl.data.buyer = buyer.payload;
                    ctrl.data.vessel.id = data.id;
                    ctrl.data.vessel.name = data.name;
                    ctrl.data.vesselImoNo = data.imoNo;
                    if (data.defaultService) {
                        ctrl.data.service = data.defaultService;
                        ctrl.selectService(ctrl.data.service.id);

                    }
                    // if(data.buyer) {
                    //    ctrl.data.buyer = data.buyer;
                    // }
                    ctrl.data.products.length = 0;
                    var productList = ctrl.data.products;
                    for (let product in productList) {
                    	product.uniqueIdUI = Math.random().toString(36).substring(7);
                        if ($.isEmptyObject(productList[product].physicalSupplier)) {
                            angular.copy(ctrl.data.seller, productList[product].physicalSupplier);
                        }

                    }
                    destroyDataTables();
                    if (data.defaultFuelOilProduct !== null) {
                        ctrl.addProductAndSpecGroupToList(data.defaultFuelOilProduct, data.fuelOilSpecGroup, data.defaultFuelOilProductTypeId, productList);
                    }
                    if (data.defaultDistillateProduct !== null) {
                        ctrl.addProductAndSpecGroupToList(data.defaultDistillateProduct, data.distillateSpecGroup, data.defaultDistillateProductProductTypeId, productList);
                    }
                    if (data.defaultLsfoProduct !== null) {
                        ctrl.addProductAndSpecGroupToList(data.defaultLsfoProduct, data.lsfoSpecGroup, data.defaultLsfoProductTypeId, productList);
                    }
                    if (ctrl.data.products.length > 0) {
	                    ctrl.data.products = $filter('orderBy')(ctrl.data.products, 'productType.id');
                    } 
                    $timeout(() => {
                        updatePageTitle();
                        updateOrderSummary();
                        initDataTables();
                        addFirstAdditionalCost();
                    });
                });
            });
        };
        ctrl.addEmptyProduct = function(products) {
            var product = {
                product: null,
                currency: ctrl.currency,
                // productStatus: null,
                status: null,
                workflowId: null,
                specGroup: null,
                specGroups: [],
                productCategory: null,
                deliveryOption: ctrl.defaultDeliveryOption,
                robOnArrival: null,
                minQuantity: null,
                maxQuantity: null,
                uom: null,
                agreementType: null,
                pricingType: null,
                buyerComments: null,
                sellers: null,
                possibleActions: null,
                contract: null,
                id: null,
                isDeleted: false,
                priceUom: {},
                confirmedQtyPrice: null,
                confirmedQtyProdZ: null,
                uniqueIdUI: Math.random().toString(36).substring(7)
            };
            products.push(product);
        };
        ctrl.addProductAndSpecGroupToList = function(product, specGroup, productTypeId, productList) {
            ctrl.addEmptyProduct(productList);
            let newProduct = productList[productList.length - 1];
            newProduct.product = product;
            newProduct.specGroup = specGroup;
            listsModel.getSpecGroupByProduct(product.id).then((server_data) => {
            	filteredIsDeleted = _.filter(server_data.data.payload, function(o) { 
					return o.isDeleted == false; 
				});
                newProduct.specGroups = filteredIsDeleted;
            });
            listsModel.getProductTypeByProduct(product.id).then((server_data) => {
                console.log('test');
	            newProduct.productType = angular.copy(ctrl.getProductTypeObjById(productTypeId));
                newProduct.productType.productTypeMOTGroup =  angular.copy(server_data.data.payload.productTypeMOTGroup);
	            newProduct.productType.productTypeGroup = server_data.data.payload.productTypeGroup;
                ctrl.loadOrderScreen =  false;
                ctrl.checkBQSConversionCheckbox(newProduct, convertDecimalSeparatorStringToNumber(newProduct.confirmedQuantity) * newProduct.confirmedQtyProdForBqs);
                // newProduct.specGroups = server_data.data.payload;
            });
            payload = { Payload: product.id };
            payload2 = {
              Payload: {
                ProductId: product.id 
              }
            };
            $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/getProdDefaultConversionFactors`, payload2).then((response) => {
                console.log(response);
                if (response.data.payload != 'null') {
                    newProduct.convFactorMassUom = response.data.payload.massUom;
                    newProduct.convFactorValue = response.data.payload.value;
                    newProduct.convFactorVolumeUom = response.data.payload.volumeUom;

                }
            }); 
            $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                if (response.data.payload != 'null') {
                    let productTypeGroup  = response.data.payload.productTypeGroup;
                    let sludgeProductTypeGroup = _.find(ctrl.listsCache.ProductTypeGroup, { name : 'Sludge' });
                    let payload1 = { Payload: {} };
                    $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/listProductTypeGroupsDefaults`, payload1).then((response) => {
                        console.log(response);
                        if (response.data.payload != 'null') {
                           let defaultUomAndCompany = _.find(response.data.payload, function(object) {
                                return object.id == productTypeGroup.id;
                           });
                           console.log(defaultUomAndCompany);
                           console.log(newProduct);
                            if (defaultUomAndCompany) {
                                newProduct.quantityUom = defaultUomAndCompany.defaultUom;
                                newProduct.minMaxQuantityUom = defaultUomAndCompany.defaultUom;
                                newProduct.priceUom = defaultUomAndCompany.defaultUom;
                                newProduct.robOnArrivalUom = defaultUomAndCompany.defaultUom;
                                newProduct.roundVoyageConsumptionUom = defaultUomAndCompany.defaultUom;
                            }
                            if (defaultUomAndCompany.isPriority) {
                                ctrl.data.paymentCompany = defaultUomAndCompany.defaultCompany;
                            }
                          
                        }
                    });       
                }
            });
            newProduct.quantityUom = {};
            newProduct.currency = ctrl.currency;
            // newProduct.fsicalSupplier = angular.copy(ctrl.data.seller);
            ctrl.setPhysicalSupplier(newProduct);
            newProduct.additionalCosts = [];
            addFirstAdditionalCost();
        };
        ctrl.getProductTypeObjById = function(id) {
            let prodType = _.filter($listsCache.ProductType, [ 'id', id ]);
            if (prodType.length > 0) {
                if (typeof prodType[0] != 'undefined') {
                    return prodType[0];
                }
            }
            return null;
        };
        ctrl.selectService = function(serviceId) {
            let data;
            lookupModel.get(LOOKUP_TYPE.SERVICES, serviceId).then((server_data) => {
                data = server_data.payload;
                if (ctrl.data.service === null) {
                    ctrl.data.service = {};
                }
                ctrl.data.service.name = data.name;
                ctrl.data.service.code = data.code;
                ctrl.data.service.id = data.id;
                ctrl.data.is2MDelivery = data.is2MDelivery;
                ctrl.loadOrderScreen = false;
                ctrl.checkBqsForAllProducts(true);
            });
        };
        ctrl.selectBuyer = function(buyer) {
            console.log(ctrl.isTrader);
            if (ctrl.isTrader) {
                ctrl.data.trader.name = buyer.name;
                ctrl.data.trader.code = buyer.code;
                ctrl.data.trader.id = buyer.id;
            } else {
                ctrl.data.buyer.name = buyer.name;
                ctrl.data.buyer.code = buyer.code;
                ctrl.data.buyer.id = buyer.id;
            }
        };
        ctrl.selectTrader = function(trader) {
            ctrl.data.trader.name = trader.name;
            ctrl.data.trader.code = trader.code;
            ctrl.data.trader.id = trader.id;
        };
        ctrl.selectSeller = function(seller) {
            ctrl.data.seller.name = seller.name;
            ctrl.data.seller.code = seller.code;
            ctrl.data.seller.id = seller.id;
            ctrl.getAllOrderContractOptions();
            ctrl.setPhysicalSupplier();
        };

        ctrl.selectAgent = function(sellerId, type) {
            ctrl.counterpartyType = 'counterparties';
            if (ctrl.data.agentCounterparty.name) {
                if (ctrl.data.agentCounterparty.name.id) {
                    ctrl.data.agentCounterparty = ctrl.data.agentCounterparty.name;
                }
            }
            // lookupModel.get(ctrl.counterpartyType, sellerId).then(function (server_data) {
            //     if (server_data.payload) {
            //     ctrl.data.agentCounterparty = {};
            //      ctrl.data.agentCounterparty.id = server_data.payload.id;
            //      ctrl.data.agentCounterparty.name = server_data.payload.name;
            //     }
            // });
        };
        ctrl.selectCounterparty = function(sellerId, type) {
            let data;
            let local = ctrl.lookupInput;
            ctrl.counterpartyType = 'counterparties';
            if (type) {
                ctrl.counterpartyType = type;
            }
            lookupModel.get(ctrl.counterpartyType, sellerId).then((server_data) => {
                data = server_data.payload;
                local.id = data.id;
                local.name = data.name;
            });
        };
        ctrl.setTypeahedVal = function(oldVal, newVal, fromBlur) {
            if (!fromBlur) {
                return angular.copy(newVal);
            }
            return oldVal;
        };
        ctrl.selectCompany = function(companyId) {
            let data;
            lookupModel.get(LOOKUP_TYPE.COMPANY, companyId).then((server_data) => {
                data = server_data.payload;
                ctrl.lookupField.name = data.name;
                ctrl.lookupField.id = data.id;
                ctrl.lookupField.code = data.code;
                if (ctrl.lookupName === 'paymentCompany') {
                    doPaymentCompanyChanged(data);
                }
                if (ctrl.lookupName === 'carrierCompany') {
                    doPaymentCompanyChanged(data);
	            	if (ctrl.data.carrierCompany.name) {
		            	if (typeof ctrl.data.carrierCompany.name.id != 'undefined') {
		            		ctrl.data.carrierCompany = ctrl.data.carrierCompany.name;
		                }
	                }
                }
            });
        };
        ctrl.setPaymentCompany = function() {
        	ctrl.carrierIsPaymentCompany = false;
            if (ctrl.data && $.isEmptyObject(ctrl.data.paymentCompany)) {
                Factory_Master.get_master_entity(ctrl.data.carrierCompany.id, 'company', 'masters', (response) => {
                    var canDefault = 0;
                    $.each(response.companyTypes, (k, v) => {
                        if (v.name == 'OperatingCompany' || v.name == 'PaymentCompany') {
                            canDefault = canDefault + 1;
                        }
                    });
                    if (canDefault >= 2) {
			        	ctrl.carrierIsPaymentCompany = true;
                        angular.copy(ctrl.data.carrierCompany, ctrl.data.paymentCompany);
                    }
                });
            }
        };
        ctrl.clearPhysicalSupplier = function() {
            if (ctrl.data) {
                if (ctrl.data.products) {
                    $.each(ctrl.data.products, (prodK, prodV) => {
                        prodV.physicalSupplier = null;
                    });
                }
            }
        };

        ctrl.setPhysicalSupplier = function(product) {
            function setPS() {
                if (product) {
                    product.physicalSupplier = angular.copy(ctrl.data.seller);
                } else if (ctrl.data) {
                    if (ctrl.data.products) {
                        $.each(ctrl.data.products, (prodK, prodV) => {
                            let prodId = _.get(prodV, 'product.id');

                            let productHasContracts = false;

                            if (ctrl.orderContractOptions && ctrl.orderContractOptions[prodId] && ctrl.orderContractOptions[prodId].length > 0) {
                                $.each(ctrl.orderContractOptions[prodId], (k, v) => {
                                    if (v.id !== -1) {
                                        productHasContracts = true;
                                    }
                                });
                            }

                            if (!productHasContracts) {
                                prodV.physicalSupplier = angular.copy(ctrl.data.seller);
                            }
                        });
                    }
                }
            }

            $timeout(() => {
                if (ctrl.useOrderPhysicalSupplierFlow && _.has(ctrl, 'data.seller.id')) {
                    Factory_Master.getCounterpartyTypes(ctrl.data.seller.id, (data) => {
                        if (data && data.payload) {
                            $.each(data.payload, (k, v) => {
                                if (v.internalName === 'Supplier') {
                                    setPS();
                                    return;
                                }
                            });
                        }
                    });
                }
            });
        };

        ctrl.selectPort = function(selectedLocation, isManualChange) {
            let locationId = selectedLocation.id;
            let location,
                productList,
                agent = {};
            lookupModel.get(LOOKUP_TYPE.LOCATIONS, locationId).then((server_data) => {
                location = server_data.payload;
                if(isManualChange) {
                    ctrl.data.agentCounterparty = {};
                    ctrl.data.agentCounterpartyFreeText = null;
                    if (location.agents.length > 0 && location.agents.some(a => a.isDefault) && location.agents.find(a => a.isDefault).counterpartyId) {
                        let defaultAgent = location.agents.find(a => a.isDefault);
                        ctrl.data.agentCounterparty.id = defaultAgent.counterpartyId;
                        ctrl.data.agentCounterparty.name = defaultAgent.counterpartyName;
                    }
                }
                let selectedLocations = undefined;
                if(selectedLocation.eta) {
                    selectedLocations = [];
                    selectedLocations.push(selectedLocation);
                } else {
                    ctrl.data.vesselVoyageDetailId = null;
                }
                if (isManualChange) {
                    ctrl.selectVesselSchedulesPort(selectedLocations);
                }
                ctrl.data.location = {
                    code: location.code,
                    id: location.id,
                    name: location.name
                };
                ctrl.setDefaultValues('location', 'surveyor', location.defaultSurveyor);
                ctrl.setDefaultValues('location', 'lab', location.defaultLab);
                ctrl.getAllOrderContractOptions();
            });
            
            if (isManualChange) {
                if(ctrl.additionalCosts.some(x => (x.locationAdditionalCostId && x.locationAdditionalCostId > 0))) {
                    toastr.error("Cost associated with location also would be removed.");
                }
                $.each(ctrl.additionalCosts.filter(ac => (ac.locationAdditionalCostId && ac.locationAdditionalCostId > 0)), function (key, additionalCost) {
                    ctrl.deleteAdditionalCost(additionalCost);
                });
            }
            // On location change get location-wise additional costs master
            ctrl.setAdditionalCostsForLocation(locationId);
            ctrl.evaluateAdditionalCostList();
        };

        $rootScope.$on('triggerProductChanging', (ev, product, productIndex) => {
            ctrl.lookupField = ctrl.data.products[productIndex];
            ctrl.selectProduct(product.id, productIndex);
        });
        

        ctrl.selectProduct = function(productId, index) {
            let product;
            lookupModel.get(LOOKUP_TYPE.PRODUCTS, productId).then((server_data) => {
                product = server_data.payload;
                var getContractOptionParam = { product: product };
	            if (product.productType.name.includes("VLSFO") ) {
	            	if (!ctrl.procurementSettings.fieldVisibility.isPreTestHidden) {
	                	ctrl.data.products[index].preTest = true;
	            	}
                } else {
                	ctrl.data.products[index].preTest = false;
                }
                if (typeof(index) != 'undefined' ) {
                	getContractOptionParam.quantityUom = ctrl.data.products[index].quantityUom;
                	ctrl.data.products[index].contract = null;
                	ctrl.data.products[index].contractProductId = null;
                	ctrl.data.products[index].contractId = null;
                	ctrl.data.products[index].formula = null;
                	ctrl.data.products[index].price = null;
					ctrl.data.products[index].agreementType = null;
					ctrl.data.products[index].physicalSupplier = null;
					ctrl.data.products[index].pricingType = null;
					ctrl.data.products[index].formulaDescription = null;
					ctrl.data.products[index].changedOnConfirmedOrder = true;
                    payload = { Payload: product.id };
                    payload2 = {
                      Payload: {
                        ProductId: product.id 
                      }
                    };
                    ctrl.productChanged('selectProduct', ctrl.data.products[index]);
                    $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/getProdDefaultConversionFactors`, payload2).then((response) => {
                        console.log(response);
                        if (response.data.payload != 'null') {
                            ctrl.data.products[index].convFactorMassUom = response.data.payload.massUom;
                            ctrl.data.products[index].convFactorValue = response.data.payload.value;
                            ctrl.data.products[index].convFactorVolumeUom = response.data.payload.volumeUom;

                        }
                    }); 
                    let productTypeGroup  = product.productTypeGroup;
                    let sludgeProductTypeGroup = _.find(ctrl.listsCache.ProductTypeGroup, { name : 'Sludge' });
                    payload = { Payload: {} };
                    $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/listProductTypeGroupsDefaults`, payload).then((response) => {
                        if (response.data.payload != 'null') {
                           let defaultUomAndCompany = _.find(response.data.payload, function(object) {
                                return object.id == productTypeGroup.id;
                           });
                           console.log(defaultUomAndCompany);
                           if (defaultUomAndCompany) {
                                ctrl.data.products[index].quantityUom = defaultUomAndCompany.defaultUom;
                                ctrl.data.products[index].minMaxQuantityUom = defaultUomAndCompany.defaultUom;
                                ctrl.data.products[index].priceUom = defaultUomAndCompany.defaultUom;
                                ctrl.data.products[index].robOnArrivalUom = defaultUomAndCompany.defaultUom;
                                ctrl.data.products[index].roundVoyageConsumptionUom = defaultUomAndCompany.defaultUom;
                                if (defaultUomAndCompany.isPriority) {
                                    ctrl.data.paymentCompany = defaultUomAndCompany.defaultCompany;
                                } else {
                                	if ($("#id_paymentCompany").hasClass("ng-pristine") && !ctrl.orderId) {
	                                	if (ctrl.carrierIsPaymentCompany) {
					                        	angular.copy(ctrl.data.carrierCompany, ctrl.data.paymentCompany);
	                                	} else {
		                                    ctrl.data.paymentCompany = defaultUomAndCompany.defaultCompany;
	                                	}
                                	}
                                }
                           }
                        }
                    });    
                                          
                }
                ctrl.getOrderContractOptions(getContractOptionParam);                
                // If there's a set lookupInput, it means we need
                // to copy the lookup dialog selection into it.
                if (ctrl.lookupField) {
                    if (!ctrl.lookupField.product) {
                        ctrl.lookupField.product = {};
                    }
                    ctrl.lookupField.product.name = product.name;
                    ctrl.lookupField.product.id = product.id;
                    ctrl.lookupField.specGroup = product.defaultSpecGroup;
		            listsModel.getProductTypeByProduct(product.id).then((server_data) => {
			            ctrl.lookupField.productType = product.productType;
                        ctrl.lookupField.productType.productTypeMOTGroup =  angular.copy(server_data.data.payload.productTypeMOTGroup);
			            ctrl.lookupField.productType.productTypeGroup = server_data.data.payload.productTypeGroup;
                        ctrl.loadOrderScreen = false;
                        ctrl.checkBQSConversionCheckbox(ctrl.lookupField, convertDecimalSeparatorStringToNumber(ctrl.lookupField.confirmedQuantity) * ctrl.lookupField.confirmedQtyProdForBqs);
		            });
                    // ctrl.lookupField.productType = product.productType;
                    ctrl.lookupField.tempProduct = ctrl.lookupField.product;
                    ctrl.getSpecGroups(ctrl.lookupField);
	                getContractOptionParam = { product: product }
	                if (!getContractOptionParam.quantityUom) {
	                	getContractOptionParam.quantityUom = ctrl.data.products[index].quantityUom;
	                }
                    ctrl.getOrderContractOptions(getContractOptionParam);

                    ctrl.refreshProduct = true;
                    setTimeout(() => {
                        ctrl.refreshProduct = false;
                    }, 10);
                }
            });
        };

        ctrl.defaultMaxQtyFromConfirmed = function(source, data) {

            /*
                 Confirmed qty comes from:

                 1. user input (if capture conf qty is set to order -> not disabled in order)
                 2. confirm-offer-dialog when confirmed from gor (if capture conf qty is set to offer)
                 3. proceed to order (contract) ???
                (4). delivery - don't care about thar here (if capture conf qty is set to delivery)
            */

            switch(source) {
            case 'input':
                defaultFromInput(data);
                break;
            case 'init':
                initMaxQtyFromConfirmed();
                break;
            case 'offer':
                defaultFromOffer();
                break;
            case 'contract':
                defaultFromContract();
                break;
            default:
                console.log('Error: Confirmed quantity could not be defaulted from defined sources.');
            }
            

            function defaultFromInput(data) {
                // evaluate ctrl.additionalCosts for product qty change
                let quantityModified = false;
                let prodQuantity = convertDecimalSeparatorStringToNumber(data.maxQuantity);
                if(prodQuantity != data.confirmedQuantity) {
                    quantityModified = true;
                }
                data.confirmedQuantity = prodQuantity;
                ctrl.checkBQSCheckbox(data);
                ctrl.confirmedQuantityChanged(data);
                if(quantityModified) {
                    for (let j = 0; j < data.additionalCosts.length; j++) {
                        let additionalCost = data.additionalCosts[j];
                        additionalCost.confirmedQuantity = prodQuantity;
                        additionalCost.quantityUom = data.quantityUom;
                        ctrl.setLocationBasedAdditionalCosts(additionalCost, data, 'quantityChange');
                        additionalCost = calculateAdditionalCostAmounts(additionalCost, data);
                        data.additionalCosts[j] = additionalCost;
                    }
                    ctrl.evaluateAdditionalCostList();
                }
            }

            function initMaxQtyFromConfirmed() {
                $.each(ctrl.data.products, (_, value) => {
                    if(value.confirmedQuantity != null) {
                        if(value.maxQuantity == null) {
                            value.maxQuantity = value.confirmedQuantity;
                            value.minMaxQuantityUom = value.quantityUom;
                            // ctrl.productUomChanged(value);
                        }
                        if (value.minQuantity == null) {
                            value.minQuantity = value.confirmedQuantity;
                            value.minMaxQuantityUom = value.quantityUom;
                            // ctrl.productUomChanged(value);
                        }
                    }
                });
            }
        };

        ctrl.productChanged = function(source, data) {
            if(source == 'selectProduct') {
                if(!data.additionalCosts) {
                    data.additionalCosts = [];
                }
                for (let j = 0; j < data.additionalCosts.length; j++) {
                    let additionalCost = data.additionalCosts[j];
                    if(data.product && data.tempProduct && data.product.id != data.tempProduct.id) {
                        data.amount = 0;
                    }
                    if(additionalCost.costType && additionalCost.costType.name == 'Percent') {
                        additionalCost = calculateAdditionalCostAmounts(additionalCost, data);
                    }
                    ctrl.setLocationBasedAdditionalCosts(additionalCost, data, 'productChanged');
                    additionalCost = calculateAdditionalCostAmounts(additionalCost, data);
                    data.additionalCosts[j] = additionalCost;
                }
            }
        };

        ctrl.confirmQuantityChanged = function(source, data) {
            // evaluate ctrl.additionalCosts for product qty change
            let prodQuantity = convertDecimalSeparatorStringToNumber(data.confirmedQuantity)
            let quantityModified = false;
            for (let j = 0; j < data.additionalCosts.length; j++) {
                let currAddCostQty = convertDecimalSeparatorStringToNumber(data.additionalCosts[j].confirmedQuantity);
                if (currAddCostQty != prodQuantity) {
                    quantityModified = true;
                    break;
                }
            }
            if(quantityModified) {
                for (let j = 0; j < data.additionalCosts.length; j++) {
                    let additionalCost = data.additionalCosts[j];
                    additionalCost.confirmedQuantity = prodQuantity;
                    additionalCost.quantityUom = data.quantityUom;
                    ctrl.setLocationBasedAdditionalCosts(additionalCost, data, 'quantityChange');
                    additionalCost = calculateAdditionalCostAmounts(additionalCost, data);
                    data.additionalCosts[j] = additionalCost;
                }
                ctrl.evaluateAdditionalCostList();
            }
        };

        ctrl.prodPriceChanged = function(source, data) {
            // evaluate ctrl.additionalCosts for product price change
            let prodQuantity = convertDecimalSeparatorStringToNumber(data.price)
            let priceModified = false;
            for (let j = 0; j < data.additionalCosts.length; j++) {
                if (data.additionalCosts[j].price && data.additionalCosts[j].price != prodQuantity) {
                    priceModified = true;
                    break;
                }
            }
            if(priceModified) {
                for (let j = 0; j < data.additionalCosts.length; j++) {
                    let additionalCost = data.additionalCosts[j];
                    if(additionalCost.costType && additionalCost.costType.name == 'Percent') {
                        additionalCost = calculateAdditionalCostAmounts(additionalCost, data);
                    }
                }
                ctrl.evaluateAdditionalCostList();
            }
        };

        ctrl.additionalCostRowPriceChanged = function(additionalCost, initiatorName) {
            if(initiatorName == 'input') {
                let product = ctrl.additionalCostApplicableFor[additionalCost.fakeId];
                additionalCost = calculateAdditionalCostAmounts(additionalCost, product);
                ctrl.evaluateAdditionalCostList();
            }
        };

        ctrl.additionalCostRowExtrasChanged = function(additionalCost, initiatorName) {
            if(initiatorName == 'input') {
                let product = ctrl.additionalCostApplicableFor[additionalCost.fakeId];
                additionalCost = calculateAdditionalCostAmounts(additionalCost, product);
                ctrl.evaluateAdditionalCostList();
            }
        };

        ctrl.selectPaymntTerm = function(term) {
            if (ctrl.data.paymentTerm === null) {
                ctrl.data.paymentTerm = {};
            }
            ctrl.data.paymentTerm.name = term.name;
            ctrl.data.paymentTerm.id = term.id;
        };
        ctrl.setSellerDialogType = function(type, input) {
            if (type === 'Seller') {
                ctrl.counterpartyTypeId = ctrl.sellerTypeIdArray;
                ctrl.counterpartyType = LOOKUP_TYPE.SELLER;
            } else if (type === 'agentCounterparty') {
                ctrl.counterpartyTypeId = ctrl.agentTypeIdArray;
                ctrl.counterpartyType = LOOKUP_TYPE.AGENT;
            } else if (type === 'physicalSupplier') {
                ctrl.counterpartyTypeId = ctrl.supplierTypeIdArray;
                ctrl.counterpartyType = LOOKUP_TYPE.SUPPLIER;
            } else if (type === 'broker') {
                ctrl.counterpartyTypeId = [ IDS.BROKER_COUNTERPARTY_ID ];
                ctrl.counterpartyType = LOOKUP_TYPE.BROKER;
            } else if (type === 'surveyorCounterparty') {
                ctrl.counterpartyTypeId = [ IDS.SURVEYOR_COUNTERPARTY_ID ];
                ctrl.counterpartyType = LOOKUP_TYPE.SURVEYOR;
            } else if (type === 'lab') {
                ctrl.counterpartyTypeId = [ IDS.LAB_COUNTERPARTY_ID ];
                ctrl.counterpartyType = LOOKUP_TYPE.LAB;
            } else if (type === 'barge') {
                ctrl.counterpartyTypeId = [ IDS.BARGE_COUNTERPARTY_ID ];
                ctrl.counterpartyType = LOOKUP_TYPE.BARGE;
            } else if (type === 'Trader') {
                ctrl.counterpartyTypeId = [ IDS.BARGE_COUNTERPARTY_ID ];
                ctrl.counterpartyType = LOOKUP_TYPE.BUYER;
            }
            ctrl.lookupInput = input;
        };
        ctrl.updateModel = function(model, value) {
            angular.copy(value, model);
        };
        ctrl.addPriceUomChanged = function(additionalCost) {
            addPriceUomChg(additionalCost);
        };


        /**
         * Get conversion factor for each product
         * @param {Object} additionalCost - An additional cost object.
         */
        function addPriceUomChg(additionalCost) {
            if (!additionalCost.priceUom) {
                return;
            }

            // amount in additional cost should be calculated using the confirmed quantity uom for each product
            // confirmed quantity uom for additional cost is already defaulted to the confirmed quantity uom for each product
            if (typeof additionalCost.prodConv == 'undefined') {
	            additionalCost.prodConv = [];
            }
            for (let i = 0; i < ctrl.data.products.length; i++) {
                var prod = ctrl.data.products[i];
                if (prod.quantityUom.id == additionalCost.priceUom.id) {
                    additionalCost.prodConv[i] = 1;
                } else {
                	// if (additionalCost.prodConv.length == 1) {
                	// }
	                	getAdditionalCostConversionFactor(prod, additionalCost, i);
                }
            }

            // /ctrl.applicableForChange(additionalCost, ctrl.additionalCostApplicableFor[additionalCost.fakeId]);
        }


        /**
         * Gets conversion factor form api - this is specific to additional cost
         * It gets conv factor from conf qty uom --> add cost price uom
         * @param {Object} prod - product object
         * @param {Object} additionalCost - additional cost object
         * @param {index} i -product index in order products list (ctrl.data.products)
         */
        function getAdditionalCostConversionFactor(prod, additionalCost, i) {
            lookupModel.getConvertedUOM(prod.product.id, 1, prod.quantityUom.id, additionalCost.priceUom.id).then((server_data) => {
                // set conversion factor on additional cost object
                additionalCost.prodConv[i] = server_data.payload;
                // return server_data.payload;
            }).catch((e) => {
                throw 'Unable to get the uom.';
            });
            // return 1;
        }
        ctrl.productUomChanged = function(product, isPriceUom) {
            if (product.contractProductId) {
	            product.referencePriceUomId = product.priceUom.id;
            }
            productUomChg(product, isPriceUom);
            ctrl.getAllOrderContractOptions();
        };


        ctrl.formatAmount = function (num) {
            return $filter("number")(num, ctrl.numberPrecision.amountPrecision);
    
        }

        ctrl.resetContractData = function(productIndex, skipSpecGroup, isQuantityUom){
        	if (ctrl.data.products[productIndex].contract) { 
	        	var initialContractId = angular.copy(ctrl.data.products[productIndex].contract.id);
	        	var initialContract = angular.copy(ctrl.data.products[productIndex].contract);
                var initialContractProductId =  angular.copy(ctrl.data.products[productIndex].contractProductId)
        	}
        	var oldSpecGroup = angular.copy(ctrl.data.products[productIndex].specGroup);
            var isSameContract = false;

            if (initialContract) {
                ctrl.data.products[productIndex].contract = null;
                ctrl.data.products[productIndex].contractProductId = null;
                ctrl.data.products[productIndex].contractId = null;
                // ctrl.data.products[productIndex].formula = null;
                ctrl.data.products[productIndex].agreementType = null;
                ctrl.data.products[productIndex].pricingType = null;
                // ctrl.data.products[productIndex].formulaDescription = null;
                ctrl.data.products[productIndex].totalAmount = null;
                // ctrl.getAllOrderContractOptions();

            } else {
                productUomChg(ctrl.data.products[productIndex], true);
            }
			ctrl.getOrderContractOptions(ctrl.data.products[productIndex], false, function(response){
				if (response && initialContractId) {
					var newContractData = false;
					$.each(response, function(k,v){
						if (v.contract.id == initialContractId && v.contractProductId == initialContractProductId) {
							newContractData = v;
                            isSameContract = true;
						}
					})
					if (newContractData) {
						$scope.selectProductContract(ctrl.data.products[productIndex].id, newContractData, isSameContract, false, isQuantityUom);
						if (skipSpecGroup) {
			                ctrl.data.products[productIndex].specGroup = oldSpecGroup;
						}
		   //              ctrl.data.products[productIndex].priceUom = newContractData.uom;
		   //              ctrl.data.products[productIndex].contract = angular.copy(newContractData.contract);
		   //              ctrl.data.products[productIndex].price = angular.copy(newContractData.price);
		   //              ctrl.data.products[productIndex].formula = angular.copy(newContractData.formula);
		   //              ctrl.data.products[productIndex].agreementType = newContractData.contractAgreementType ? angular.copy(newContractData.contractAgreementType) : ctrl.defaultContractAgreementType;
		   //              ctrl.data.products[productIndex].requiredFields = [];
		   //              ctrl.data.products[productIndex].physicalSupplier = newContractData.physicalSupplier;
					}
				}
				console.log(response);
			});
        }

        function productUomChg(product, isPriceUom) {
            // console.log("__________ productUomChg________", product);
            var confirmedQuantityOrMaxQuantity = product.confirmedQuantity;
            if (!product.confirmedQuantity) {
                confirmedQuantityOrMaxQuantity = product.maxQuantity;
            }
            if (!isPriceUom) {
                if (product.quantityUom.id == product.priceUom.id) {
                    product.confirmedQtyPrice = 1;
                    product.amount = Number(product.confirmedQtyPrice) * Number(confirmedQuantityOrMaxQuantity) * Number(product.price);
                } else {
                	if (!product.contractProductId) {
	                        lookupModel.getConvertedUOM(ctrl.data.products[0].product.id, 1, product.quantityUom.id, product.priceUom.id, product.id).then((server_data) => {
	                        product.confirmedQtyPrice = server_data.payload;
	                        product.amount = Number(product.confirmedQtyPrice) * Number(confirmedQuantityOrMaxQuantity) * Number(product.price);
	                    }).catch((e) => {
	                        throw 'Unable to get the uom.';
	                    });
                	}
                }
            }
            for (let i = 0; i < ctrl.data.products.length; i++) {
                let prod = ctrl.data.products[i];
                if (prod.quantityUom.id == ctrl.data.products[0].quantityUom.id) {
                    prod.confirmedQtyProdZ = 1;
                } else {
                    setConvertedQty(prod);
                }
            }

            setConvertedQtyForBqs(product);

            // also change unit price uom for additional costs & do conversion calculations
            for (let j = 0; j < ctrl.additionalCosts.length; j++) {
                addPriceUomChg(ctrl.additionalCosts[j]);
            }
        }

        function setConvertedQty(prod) {
            lookupModel.getConvertedUOM(prod.product.id, 1, prod.quantityUom.id, ctrl.data.products[0].quantityUom.id).then((server_data) => {
                prod.confirmedQtyProdZ = server_data.payload;
            }).catch((e) => {
                throw 'Unable to get the uom.';
            });
        }

        function setConvertedQtyForBqs(prod) {
            lookupModel.getConvertedUOM(prod.product.id, 1, prod.quantityUom.id, 5).then((server_data) => {
                console.log(server_data);
                prod.confirmedQtyProdForBqs = server_data.payload;
                if (server_data.payload == 1) {
                    ctrl.checkBQSCheckbox(prod);
                } else {
                    ctrl.checkBQSConversionCheckbox(prod, server_data.payload * convertDecimalSeparatorStringToNumber(prod.confirmedQuantity));
                }

            }).catch((e) => {
                throw 'Unable to get the uom.';
            });
        }



        ctrl.checkBQSConversionCheckbox = function(product, confirmedQuantityForBqs) {
            if (ctrl.loadOrderScreen) {
                return;
            }
            if (ctrl.data.is2MDelivery) {
                console.log(product);
                let convertStringToDecimal = convertDecimalSeparatorStringToNumber(product.confirmedQuantity);
                if (product.productType && product.productType.productTypeMOTGroup && (product.productType.productTypeMOTGroup.name == 'LSFO' || product.productType.productTypeMOTGroup.name == 'IFO')) {
                    if (convertDecimalSeparatorStringToNumber(confirmedQuantityForBqs) > 200) {
                        product.isBqs = true;
                        return;
                          
                    }
                } else  if (product.productType && product.productType.productTypeMOTGroup && (product.productType.productTypeMOTGroup.name == 'LSDIS' || product.productType.productTypeMOTGroup.name == 'DIS')) {
                    if (convertDecimalSeparatorStringToNumber(confirmedQuantityForBqs) > 50) {
                        product.isBqs = true;
                        return;
                       
                    }
                }
                product.isBqs = false; 
            }
        }
        ctrl.updateModelProperty = function(model, property, value) {
            model[property] = value;
        };

        ctrl.canSendConfirmToSellerForPreview = function() {
            return ctrl.data.id && !ctrl.data.buttonsDisabled && ctrl.data.seller.name &&
                  (ctrl.hasAction(ctrl.SCREEN_ACTIONS.CONFIRM) || ctrl.data.status.name == 'Confirmed');
        };

        ctrl.canSendConfirmToVesselForPreview = function() {
            return ctrl.data.id && !ctrl.data.buttonsDisabled && ctrl.data.vessel.name &&
                  (ctrl.hasAction(ctrl.SCREEN_ACTIONS.CONFIRM) || ctrl.data.status.name == 'Confirmed');
        };

        ctrl.sendOrderCommand = function(command, orderId) {
            if (command === 'submitForApproval' || command === 'approve') {
            	let aggregatedErrorMessages = [];

            	if (ctrl.data.missingSpecGroup) {
                    aggregatedErrorMessages.push('Spec group is mandatory');
                }
                if (ctrl.data.missingPhysicalSupplier) {
                    aggregatedErrorMessages.push('Physical supplier is mandatory');
                }
                if (ctrl.data.missingSurveyor) {
                    aggregatedErrorMessages.push('Surveyor counterparty is mandatory');
                }
                if (ctrl.data.missingAgent) {
                    aggregatedErrorMessages.push('Agent counterparty is mandatory');
                }
                if (aggregatedErrorMessages.length > 0) {
                    $.each(aggregatedErrorMessages, (k, message) => {
                        toastr.error(message);
                    });
                    return;
                }
            }
            if (command == 'updateCancelOrderReason') {
                if (!ctrl.cancelReason) {
                    ctrl.cancelReason = {};
                }
                if (!ctrl.data.orderCancelReasonOption) {
                    ctrl.cancelReason.cancelReason = $filter('filter')(ctrl.lists.OrderCancelReasonOption, { name: 'Others' })[0];
                } else {
                    ctrl.cancelReason.cancelReason = ctrl.data.orderCancelReasonOption;
                }
                $scope.showModalConfirmCancelOrder('Are you sure you want to cancel the order?', true, (modalresponse) => {
                    if (modalresponse) {
                        if (typeof ctrl.cancelReason != 'undefined') {
                            var orderCancelReasonOption = ctrl.cancelReason.cancelReason;
                        } else {
                            orderCancelReasonOption = null;
                        }
                        let object = { id: orderId, cancelOrderComments: ctrl.data.cancelOrderComments, orderCancelReasonOption: orderCancelReasonOption };
                        orderModel.updateCancelOrderReason(object)
                            .then((response) => {
                                ctrl.data.orderCancelReasonOption = ctrl.cancelReason.cancelReason;
                                ctrl.comfirmCancelOrder = true;
                                $scope.prettyCloseModal();
                            }).catch((error) => {
                                ctrl.buttonsDisabled = false;
                                $scope.prettyCloseModal();
                            });
                    }
                });

                return;
            }
            if (command == 'cancel' && ctrl.comfirmCancelOrder) {
                $state.reload();
            }
            if (command == 'cancel' && !ctrl.comfirmCancelOrder) {
                if (!ctrl.cancelReason) {
                    ctrl.cancelReason = {};
                }
                if (!ctrl.data.orderCancelReasonOption) {
                    ctrl.cancelReason.cancelReason = $filter('filter')(ctrl.lists.OrderCancelReasonOption, { name: 'Others' })[0];
                } else {
                    ctrl.cancelReason.cancelReason = ctrl.data.orderCancelReasonOption;
                }
                $scope.showModalConfirmCancelOrder('Are you sure you want to cancel the order?', true, (modalresponse) => {
                    console.log(modalresponse);
                    if (modalresponse) {
                        if (typeof ctrl.cancelReason != 'undefined') {
                            var orderCancelReasonOption = ctrl.cancelReason.cancelReason;
                        } else {
                            orderCancelReasonOption = null;
                        }
                        let object = { id: orderId, cancelOrderComments: ctrl.data.cancelOrderComments, orderCancelReasonOption: orderCancelReasonOption };
                        orderModel.sendOrderCommand(command, object)
	                    .then((response) => {
                                ctrl.comfirmCancelOrder = true;
                                ctrl.sendOrderCommand('cancel', ctrl.orderId);
	                        $scope.prettyCloseModal();
			                orderModel.getManualCancellationEmail(ctrl.data).then((response) => {
		                    	console.log(response);
		                    	ctrl.defaultCancellationEmail = null;
                                if (response.payload.name == 'OrderCancellationToLabEmail' && (angular.equals(ctrl.data.lab, {}) || !ctrl.data.lab)) {
                                    $scope.prettyCloseModal();
                                    return;
                                }
		                    	if (response.payload.id) {
		                    		ctrl.defaultCancellationEmail = {
		                    			id : response.payload.id,
		                    			name : response.payload.name
		                    		};
			                        ctrl.orderPreviewEmail();
		                    	}
		                        return;
		                    });
	                    }).catch((error) => {
	                        ctrl.buttonsDisabled = false;
	                        $scope.prettyCloseModal();
	                    });
                    }
                });
                // ctrl.comfirmCancelOrder = confirm("Are you sure you want to cancel the order?")
            }
            if (command == 'confirmToLab') {
        		var minProductType = _.minBy(ctrl.data.products, (o) => {
                    return o.productType.productTypeGroup.id;
                });
        		if (minProductType) {
        			var minProductTypeId = minProductType.productType.productTypeGroup.id;
        		}
        		var foundEmailTemplates = _.filter(ctrl.emailConfiguration, (email) => {
        			if (email.productTypeGroup) {
					    return email.productTypeGroup.id === minProductTypeId && email.process.indexOf('Confirmation to Lab') != -1;
        			}
                });
                if (ctrl.customerConfiguration) {
                    if (ctrl.customerConfiguration.customerMailConfiguration.name == "Maersk Line") {
                        foundEmailTemplates = _.filter(foundEmailTemplates, (email) => {
                            return email.process.indexOf('Maersk') != -1;
                        });
                    }
                    if (ctrl.customerConfiguration.sendSingleEmail) {
                        foundEmailTemplates = _.filter(ctrl.emailConfiguration, (email) => {
                            return email.process.indexOf('Order Confirmation Single Email') != -1;
                        });
                    }
                }
            	if (foundEmailTemplates[0].emailType.name == 'Manual') {
	             //    ctrl.orderConfirmationEmailToLabs = v.emailType;
            		// ctrl.emailToLabsTemplate = v.template;
                    //       ctrl.orderConfirmationEmailToSurveyor = v.emailType;
            		// ctrl.emailToSurveyor = v.template;
	                var data = {
	                    orderId: ctrl.orderId,
                        defaultTemplate : foundEmailTemplates[0].template,
                        canSendConfirm : true,
                        command: command
                    };
                    var previewEmailData = {
	                    data: data,
                        transaction: EMAIL_TRANSACTION.ORDER
                    };
                    ctrl.openPreviewEmail(previewEmailData);
	                return false;
            	}
            }
            if (command == 'confirmToSurveyor') {
        		minProductType = _.minBy(ctrl.data.products, (o) => {
                    return o.productType.productTypeGroup.id;
                });
        		if (minProductType) {
        			minProductTypeId = minProductType.productType.productTypeGroup.id;
        		}
        		foundEmailTemplates = _.filter(ctrl.emailConfiguration, (email) => {
        			if (email.productTypeGroup) {
					    return email.productTypeGroup.id === minProductTypeId && email.process.indexOf('Confirmation to Surveyor') != -1;
        			}
                });
                console.log(foundEmailTemplates);
                if (ctrl.customerConfiguration) {
                    if (ctrl.customerConfiguration.customerMailConfiguration.name == "Maersk Line") {
                        foundEmailTemplates = _.filter(foundEmailTemplates, (email) => {
                            return email.process.indexOf('Maersk') != -1;
                        });
                    }
                    if (ctrl.customerConfiguration.sendSingleEmail) {
                        foundEmailTemplates = _.filter(ctrl.emailConfiguration, (email) => {
                            return email.process.indexOf('Order Confirmation Single Email') != -1;
                        });
                    }
                }
            	if (foundEmailTemplates[0].emailType.name == 'Manual') {
	                var data = {
	                    orderId: ctrl.orderId,
                        defaultTemplate : foundEmailTemplates[0].template,
                        canSendConfirm : true,
                        command: command
                    };
                    var previewEmailData = {
	                    data: data,
                        transaction: EMAIL_TRANSACTION.ORDER
                    };
                    ctrl.openPreviewEmail(previewEmailData);
	                return false;
            	}
            }
            if (command == 'confirmToSeller') {
            	// if (ctrl.procurementSettings.order.needConfirmationSellerEmail.name == 'HardStop') {
            		var isContractOrder = false;
                    var alkaliproducttype = false;
                    var otherprodcount = false;
            		$.each(ctrl.data.products, (k, v) => {
                        if(v.productType["id"] == 7){
                            alkaliproducttype = true;
                        }
                        if(v.productType["id"] != 7){
                            otherprodcount = true;
                        }
            			if (v.contractId) {
		            		isContractOrder = true;
            			}
            		});

            		minProductType = _.minBy(ctrl.data.products, (o) => {
                    return o.productType.productTypeGroup.id;
                });
            		if (minProductType) {
            			minProductTypeId = minProductType.productType.productTypeGroup.id;
            		}
            		foundEmailTemplates = _.filter(ctrl.emailConfiguration, (email) => {
            			if (email.productTypeGroup) {
						    return email.productTypeGroup.id === minProductTypeId && email.process.indexOf('Confirmation to Seller') != -1;
            			}
                });
            		console.log(foundEmailTemplates);
                    window.orderDetails = ctrl;
                    if (ctrl.customerConfiguration) {
                        if (ctrl.customerConfiguration.customerMailConfiguration.name == "Maersk Line") {
                            foundEmailTemplates = _.filter(foundEmailTemplates, (email) => {
                                return email.process.indexOf('Maersk') != -1;
                            });
                        }
                    }
            		if (!isContractOrder) {
            			var defaultTemplate = _.filter(foundEmailTemplates, (email) => {
						    return email.process.indexOf('Contract') == -1;
                    });
		            	if (ctrl.confirmToSellerManual) {
			                var data = {
			                    orderId: ctrl.orderId,
		                        defaultTemplate : (otherprodcount ? defaultTemplate[0].template : alkaliproducttype ? defaultTemplate[1].template :  defaultTemplate[0].template),
		                        canSendConfirmToSeller : ctrl.canSendConfirmToSellerForPreview(),
		                        canSendConfirmToVessel : ctrl.canSendConfirmToVesselForPreview(),
		                        command: command
		                    };
		                    var previewEmailData = {
			                    data: data,
		                        transaction: EMAIL_TRANSACTION.ORDER
		                    };
		                    ctrl.openPreviewEmail(previewEmailData);
			                return false;
		            	}
            		} else {
            			defaultTemplate = _.filter(foundEmailTemplates, (email) => {
						    return email.process.indexOf('Contract') != -1 || email.process.indexOf('Alkali') > -1;
                    });
		            	if (ctrl.confirmToSellerContractManual) {
			                var data = {
			                    orderId: ctrl.orderId,
		                        defaultTemplate : (otherprodcount ? defaultTemplate[0].template : alkaliproducttype ? defaultTemplate[1].template :  defaultTemplate[0].template),
		                        canSendConfirmToSeller : ctrl.canSendConfirmToSellerForPreview(),
		                        canSendConfirmToVessel : ctrl.canSendConfirmToVesselForPreview(),
		                        command: command
		                    };
		                    var previewEmailData = {
			                    data: data,
		                        transaction: EMAIL_TRANSACTION.ORDER
		                    };
		                    ctrl.openPreviewEmail(previewEmailData);
			                return false;
		            	}
            		}
            	// }
            }
            if (command == 'confirmToAll') {
                var lngproducttype = false;
                var otherprodcount = false;
        		minProductType = _.minBy(ctrl.data.products, (o) => {
                    return o.productType.productTypeGroup.id;
                });
        		if (minProductType) {
        			minProductTypeId = minProductType.productType.productTypeGroup.id;
        		}
        		foundEmailTemplates = _.filter(ctrl.emailConfiguration, (email) => {
        			if (email.productTypeGroup) {
					    return email.productTypeGroup.id === minProductTypeId && email.process.indexOf('Confirmation to Vessel') != -1;
        			}
                });
                console.log(foundEmailTemplates);

        		isContractOrder = false;
        		$.each(ctrl.data.products, (k, v) => {
                    if(v.productType["id"] == 22){
                        lngproducttype = true;
                    }
                    if(v.productType["id"] != 22){
                        otherprodcount = true;
                    }
        			if (v.contractId) {
	            		isContractOrder = true;
        			}
        		});
                window.orderDetails = ctrl;
        		if (isContractOrder) {
        			defaultTemplate = _.filter(foundEmailTemplates, (email) => {
					    return email.process.indexOf('Contract') != -1 || email.process.indexOf('LNG') > -1; 
                    });
        		} else {
        			defaultTemplate = _.filter(foundEmailTemplates, (email) => {
					    return email.process.indexOf('Contract') == -1;
                    });
                }
                if (ctrl.customerConfiguration) {
                    if (ctrl.customerConfiguration.customerMailConfiguration.name == "Maersk Line") {
                        defaultTemplate = _.filter(ctrl.emailConfiguration, (email) => {
                            return email.process.indexOf('Maersk Line Spot Order Confirmation to Vessel Email') != -1;
                        });
                    }
                    if (ctrl.customerConfiguration.sendSingleEmail) {
                        defaultTemplate = _.filter(ctrl.emailConfiguration, (email) => {
                            return email.process.indexOf('Order Confirmation Single Email') != -1;
                        });
                    }
                }

            	if (defaultTemplate[0].emailType.name == 'Manual' /* && ctrl.procurementSettings.order.needConfirmationVesselEmail.name == 'HardStop'*/) {
	                var data = {
	                    orderId: ctrl.orderId,
                        defaultTemplate : (otherprodcount ? defaultTemplate[0].template : lngproducttype ? defaultTemplate[1].template :  defaultTemplate[0].template),
                        canSendConfirmToSeller : ctrl.canSendConfirmToSellerForPreview(),
                        canSendConfirmToVessel : ctrl.canSendConfirmToVesselForPreview(),
                        command: command
                    };
                    var previewEmailData = {
	                    data: data,
	                    transaction: EMAIL_TRANSACTION.ORDER
                    };
                    ctrl.openPreviewEmail(previewEmailData);
	                return false;
            	}
            }
            var currentCommand = command;

            if (command != 'cancel') {
                ctrl.buttonsDisabled = true;
                var payload = {
                    id : orderId
                };
                if (command == 'confirm') {
                	payload = orderId;
                }
                orderModel.sendOrderCommand(command, payload)
                    .then((response) => {
                        ctrl.buttonsDisabled = false;
                        $state.go(STATE.EDIT_ORDER, {
                            orderId: ctrl.orderId
                        });
                        $scope.prettyCloseModal();
                    }).catch((error) => {
                        ctrl.buttonsDisabled = false;
                        $scope.prettyCloseModal();
                    }).then(() => {
                    });
            }
        };
        $scope.hasMissingSpecGroup = function() {
        	let hasMissingSpecGroup = false;
        	let productsWithoutSpec = [];
        	$.each(ctrl.data.products, (k, v) => {
        		if (!v.specGroup) {
        			if (typeof v.status != 'undefined') {
        				if (v.status) {
		        			if (v.status.name != 'Cancelled') {
                                hasMissingSpecGroup = true;
                                productsWithoutSpec.push(v.tempProduct.name);
		        			}
        				} else {
                            hasMissingSpecGroup = true;
                            productsWithoutSpec.push(v.tempProduct.name);
        				}
        			} else {
                        hasMissingSpecGroup = true;
                        productsWithoutSpec.push(v.tempProduct.name);
        			}
        		}
        	});
        	ctrl.hasMissingSpecGroup = hasMissingSpecGroup;
        	if (hasMissingSpecGroup) {
        		return productsWithoutSpec.join(',');
        	}
    		return false;
        };

        $scope.hasMissingPhysicalSupplier = function() {
            let hasMissingPhysicalSupplier = false;
            let productsWithoutPhysicalSupplier = [];
            $.each(ctrl.data.products, (k, v) => {
                if (!v.physicalSupplier || !_.get(v, 'physicalSupplier.id')) {
                    hasMissingPhysicalSupplier = true;
                    productsWithoutPhysicalSupplier.push(v.product.name);
                }
            });
            if (hasMissingPhysicalSupplier) {
                return productsWithoutPhysicalSupplier.join(', ');
            }
            return false;
        };

        // send a command to server and reload the order from the received response
        ctrl.sendOrderCommandReload = function(command, orderId) {
            ctrl.buttonsDisabled = true;
            orderModel.sendOrderCommand(command, orderId)
                .then((response) => {
                    loadData(response);
                    ctrl.buttonsDisabled = false;
                }).catch((error) => {
                    ctrl.buttonsDisabled = false;
                });
        };
        ctrl.orderPreviewEmail = function() {
            if (ctrl.orderId) {
                window.orderDetails = angular.copy(ctrl);
                var canSend = false;
                var canSendStatuses = [ 'Approved', 'Confirmed', 'Amended', 'Delivered', 'PartiallyDelivered', 'Invoiced', 'PartiallyInvoiced', 'Stemmed' ];
                if (ctrl.data.status) {
	                if (ctrl.procurementSettings.order.needsTransactionLimitApproval && canSendStatuses.indexOf(ctrl.data.status.name) != -1) {
                        canSend = true;
                    }
                }
                if (!ctrl.procurementSettings.order.needsTransactionLimitApproval) {
                    canSend = true;
                }

                let data = {
                    orderId: ctrl.orderId,
                    canSend: canSend,
                    canSendConfirmToSeller : ctrl.canSendConfirmToSellerForPreview(),
                    canSendConfirmToVessel : ctrl.canSendConfirmToVesselForPreview(),
                    canSendConfirm : ctrl.hasAction(ctrl.SCREEN_ACTIONS.CONFIRM)
                };

                if (ctrl.defaultCancellationEmail) {
                	data.defaultCancellationEmail = ctrl.defaultCancellationEmail;
                }

                // $state.go(STATE.PREVIEW_EMAIL, {
                //     data: data,
                //     transaction: EMAIL_TRANSACTION.ORDER
                // });


                let previewEmailData = {
                    data: data,
                    transaction: EMAIL_TRANSACTION.ORDER
                };

                ctrl.openPreviewEmail(previewEmailData);
            }
        };
        ctrl.orderConfirmationPreviewEmail = function() {
            if (ctrl.orderId) {
                let data = {
                    orderId: ctrl.orderId,
                    orderCanConfirmSelerEmail: ctrl.dtoHasAction(ctrl.SCREEN_ACTIONS.CONFIRMSELLEREMAIL)
                };
                let previewEmailData = {
                    data: data,
                    transaction: EMAIL_TRANSACTION.ORDER_CONFIRM
                };
                ctrl.openPreviewEmail(previewEmailData);
            }
        };


        ctrl.closeOrder = function() {
            if (ctrl.orderId) {
                let payload = angular.copy(ctrl.data);
                orderModel.close(payload).then((payload) => {
                    $state.reload();
                }).catch((err) => {
                    ctrl.buttonsDisabled = false;
                });
            } 
        }


        ctrl.saveOrder = function() {
            console.log($rootScope.notes);
            ctrl.data.orderNotes = $rootScope.notes;
            $('form').addClass('submitted');
            let aggregatedErrorMessages = [];
            let forms_validation = validateForms(),
                payload = {};
            if (forms_validation !== null) {
            	aggregatedErrorMessages.push(VALIDATION_MESSAGES.INVALID_FIELDS + forms_validation.join(', '));
                // toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + forms_validation.join(", "));
                // return false;
            }
            if ($scope.hasMissingSpecGroup()) {
                aggregatedErrorMessages.push(`Please select a Spec Group for : ${ $scope.hasMissingSpecGroup()}`);
        		// toastr.error("Please select a Spec Group for : " + $scope.hasMissingSpecGroup());
        		// return;
            }

            // checkf for invalid additional cost unit price
            let invalidAddCost = $('.additional_cost_invalid');
            if (invalidAddCost.length > 0) {
                aggregatedErrorMessages.push('Additional cost Unit Price cannot be negative.');

                // toastr.error('Additional cost Unit Price cannot be negative.');
                // return;
            }

            // check for min max and confimed quantities
            let qtyError = {
                min: false,
                max: false,
                conf: false
            };
            if(ctrl.captureConfirmedQuantity.name != 'Offer') {
                // for Order and Delivery
                // 1. min max are required
                $.each(ctrl.data.products, (key, val) => {
                    if(!val.minQuantity) {
                        qtyError.min = true;
                    }
                    if(!val.maxQuantity) {
                        qtyError.max = true;
                    }
                });

                // 2. confirmed qty is only required after order confirm, check stusus
                var confRequired = ctrl.requiredAndDisabledRules('required', 'confirmedQty');
                if(confRequired) {
                    $.each(ctrl.data.products, (key, val) => {
                        if(!val.confirmedQuantity) {
                            qtyError.conf = true;
                        }
                    });
                }
            }
            if(ctrl.captureConfirmedQuantity.name == 'Offer') {
                // 1. min and max are disabled, no validation needed
                // 2. confirmed qty is required
                $.each(ctrl.data.products, (key, val) => {
                    if(!val.confirmedQuantity) {
                        qtyError.conf = true;
                    }
                });
            }
            let errorMsg = '';
            if(qtyError.min) {
                errorMsg = `${errorMsg }Min Quantity is required. \n`;
            }
            if(qtyError.min) {
                errorMsg = `${errorMsg }Max Quantity is required. \n`;
            }
            if(qtyError.min) {
                errorMsg = `${errorMsg }Confirmed Quantity is required. \n`;
            }

    		var hasAdditionalCostError = false;
            $.each(ctrl.data.products, (pk, pv) => {
            	if (pv.status) {
	            	if (pv.status.name == 'Cancelled' && pv.additionalCosts.length > 0) {
	            		$.each(pv.additionalCosts, (ack, acv) => {
	            			if (acv.additionalCost) {
	            				if (!acv.isDeleted) {
				            		hasAdditionalCostError = true;
	            				}
	            			}
	            		});
	             	}
            	}
            });
            if (hasAdditionalCostError) {
            	errorMsg = `${errorMsg }You have additional costs that have applicable for set on cancelled products \n`;
            }

            if(errorMsg != '') {
            	aggregatedErrorMessages.push(errorMsg);
                // toastr.error(errorMsg);
                // return;
            }

            // check products agreement type + pricing type
            /*            
            $.each(ctrl.data.products, function(key,val){
                if((val.agreementType.name.toLowerCase() == "spot") && (val.pricingType.name.toLowerCase() == "formula")){
                    var idx = key + 1;
                    errorMesg = "Product can not have Pricing Type 'Formula' and Agreement Type 'Spot' - product " + idx;
                }
            });
            if(errorMsg != ""){
                toastr.error(errorMsg);
                return;
            }
 */


            // ctrl.buttonsDisabled = true;
            removeNullAdditionalCosts();

            /*
             * Due to FK exception in backend when sending empty objects instead of null, must
             * revert the empty objects we use for binding to nulls, but NOT in ctrl.data -
             * there we still need them as objects - we'll use a local "payload" var.
             */

            if ($scope.checkProductsHaveSameProductType() == false) {
	        	ctrl.buttonsDisabled = false;
	        	aggregatedErrorMessages.push('Order can contain only products with same group.');
             	// toastr.error("Order can contain only products with same group.");
             	// return;
            }

            if (moment(ctrl.data.deliveryFrom).diff(moment(ctrl.data.deliveryTo)) > 0 ) {
            	aggregatedErrorMessages.push("Delivery To should be greater than Delivery From");
            }


            if (aggregatedErrorMessages.length > 0) {
             	$.each(aggregatedErrorMessages, (k, message) => {
	             	toastr.error(message);
             	});
             	return;
            }
            if (ctrl.data.isVerified == true) {
                ctrl.data.verifiedBy = $rootScope.user;
                ctrl.data.code = null;
                ctrl.data.collectionName = null;
                ctrl.data.verifiedOn = moment().format();
            }

            $.each(ctrl.data.products, (pk, pv) => {
                if (pv.additionalCosts && pv.additionalCosts.length > 0) {
                    $.each(pv.additionalCosts, (ack, acv) => {
                        if (acv.costType.name == 'Flat' || acv.costType.name == 'Range' || acv.costType.name == 'Total') {
                            acv.priceUom = null;
                        }
                    });
                }
            });

            angular.copy(ctrl.data, payload);
            if ($.isEmptyObject(payload.broker) || !payload.broker.name) {
                payload.broker = null;
            }
            if ($.isEmptyObject(payload.surveyorCounterparty) || !payload.surveyorCounterparty.name) {
                payload.surveyorCounterparty = null;
            }
            if ($.isEmptyObject(payload.agentCounterparty) || !payload.agentCounterparty.name) {
                payload.agentCounterparty = null;
            }
            if ($.isEmptyObject(payload.lab) || !payload.lab.name) {
                payload.lab = null;
            }
            if ($.isEmptyObject(payload.trader) || !payload.trader.name) {
                payload.trader = null;
            }
            if ($.isEmptyObject(payload.barge) || !payload.barge.name) {
                payload.barge = null;
            }
            if (typeof payload.additionalCosts != 'undefined') {
                length;
                if (payload.additionalCosts.length == 0) {
                    delete payload.additionalCosts;
                }
            }
            if (typeof payload.comments != 'undefined') {
            	if (payload.comments) {
		            payload.comments = payload.comments.replace(/(\r\n|\n)/g, '<br/>');
            	}
            }
            if (typeof payload.customNonMandatoryAttribute10 != 'undefined') {
            	if (payload.customNonMandatoryAttribute10) {
		            payload.customNonMandatoryAttribute10 = payload.customNonMandatoryAttribute10.replace(/(\r\n|\n)/g, '<br/>');
            	}
            }
            if (typeof payload.customNonMandatoryAttribute11 != 'undefined') {
            	if (payload.customNonMandatoryAttribute11) {
		            payload.customNonMandatoryAttribute11 = payload.customNonMandatoryAttribute11.replace(/(\r\n|\n)/g, '<br/>');
            	}
            }
            if (typeof payload.products != 'undefined' && payload.products.length > 0) {
                $.each(payload.products, (key, val) => {
                    if (typeof val.additionalCosts != 'undefined') {
                        if (val.additionalCosts.length == 0) {
                            delete val.additionalCosts;
                        }
                    }
                });
            }
            if (typeof payload.isVerified != 'undefined' && payload.isVerified != null) {
                payload.isVerified = null;
                payload.isVerified = { id: 1, name: 'Yes' };
                payload.isVerified.id = 1;
                payload.isVerified.name = 'Yes';
            }

            console.log(payload.products);



            if (ctrl.orderId) {
                var validActiveSpecGroupMessage = ctrl.checkInactiveSpecGroup();
               
                if (validActiveSpecGroupMessage != true) {
                    toastr.error(validActiveSpecGroupMessage);
                    return false;
                }
                payload = ctrl.prepareReasonsForSave(payload);
                orderModel.update(payload).then((responseData) => {
                    ctrl.buttonsDisabled = false;
                    $state.go(STATE.EDIT_ORDER, {
                        orderId: ctrl.orderId
                    });
                    addFirstAdditionalCost();
                }).catch((err) => {
                    ctrl.buttonsDisabled = false;
                    addFirstAdditionalCost();
                });
            } else {
                orderModel.create(payload).then((responseData) => {
                    ctrl.buttonsDisabled = false;
                    $state.go(STATE.EDIT_ORDER, {
                        orderId: responseData.payload.id
                    });
                    addFirstAdditionalCost();
                }).catch((err) => {
                    ctrl.buttonsDisabled = false;
                    addFirstAdditionalCost();
                });
            }
        };

        ctrl.checkInactiveSpecGroup = function() {
            var specGroupErrors = []; 
            $.each(ctrl.data.products, (key2, val2) => {
                if (val2.specGroup != null) {
                    var findSpecGroup = _.find($listsCache.SpecGroup, function(object) {
                        return object.id == val2.specGroup.id;
                    });
                    if (val2.specGroup.isDeleted) {
                        if (val2.product) {
                            if (val2.status) {
                                if ( val2.status.name != "Cancelled") {
                                       specGroupErrors.push(`Spec Group for "`+val2.product.name+ ` is invalid.`);
                                }
                            }
                        }
                    }
                } else {
                    if (val2.product) {
                        if (val2.status) {
                            if ( val2.status.name != "Cancelled") {
                                specGroupErrors.push(`Please select a specGroup for "`+val2.product.name+`" from ` + val.location.name + `.`);
                            }
                        } else {
                            specGroupErrors.push(`Please select a specGroup for "`+val2.product.name+`" from ` + val.location.name + `.`);

                        }
                    } 
                }
            });

            if (specGroupErrors.length > 0) {
                text = specGroupErrors.join("<br>");
                return text;
            }
            return true;
        }

        $scope.checkProductsHaveSameProductType = function() {
        	var currentProductTypes = _.uniqBy(ctrl.data.products, 'productType.productTypeGroup.id');
        	return currentProductTypes.length == 1;
        };

        ctrl.hasAction = function(action) {
            return screenActionsModel.hasAction(action, ctrl.screenActions);
        };
        ctrl.dtoHasAction = function(action) {
            // if(action == "ManualPricingDateOverride") return true;
            if (ctrl.data) {
                if (ctrl.data.screenActions) {
                    for (let i = 0; i < ctrl.data.screenActions.length; i++) {
                        if (ctrl.data.screenActions[i].name == action) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        ctrl.canSave = function() {
            return screenActionsModel.canSave(ctrl.screenActions);
        };

        /**
         * check if we should show extra buttons
         */
        ctrl.extraButtons = function() {
            return $('.st-extra-buttons').find('li').length === 0;
        };
        // retrieve invalid fields from a form
        function getInvalidFields(form) {
            let fields = [];
            let fieldName;
            for (let errorName in form.$error) {
                for (let i = 0; i < form.$error[errorName].length; i++) {
                    fieldName = form.$error[errorName][i].$name;
                    if (fields.indexOf(fieldName) === -1) {
                        fields.push(fieldName);
                    }
                }
            }
            return fields;
        }

        /**
         * Validate new request forms and fields
         */
        function validateForms() {
            let pageValid = true;
            let forms = $scope.forms;
            let index, nonInputInvalidFields, form;
            let aggregatedErrorMessages = [];
            if (!forms.vesselDetailsForm.$valid) {
            	aggregatedErrorMessages.push(getInvalidFields(forms.vesselDetailsForm));
                // return getInvalidFields(forms.vesselDetailsForm);
            }
            // if (!forms.portsForm.$valid) {
            //     return getInvalidFields(forms.portsForm);
            // }
            // if (!forms.sellerDetailsForm.$valid) {
            //     return getInvalidFields(forms.sellerDetailsForm);
            // }
            if (!forms.productsForm.$valid) {
            	aggregatedErrorMessages.push(getInvalidFields(forms.productsForm));
                // return getInvalidFields(forms.productsForm);
            }
            // if (!forms.additionalCostsForm.$valid) {
            //     return getInvalidFields(forms.additionalCostsForm);
            // }
            nonInputInvalidFields = validateAdditionalCostsNonInputs();
            if (nonInputInvalidFields !== null) {
            	aggregatedErrorMessages.push(nonInputInvalidFields);
                // return nonInputInvalidFields;
            }
            nonInputInvalidFields = validateProductNonInputs();
            if (nonInputInvalidFields !== null) {
            	aggregatedErrorMessages.push(nonInputInvalidFields);
                // return nonInputInvalidFields;
            }
            // var mergedErrorMessages = {};
            // $.each(aggregatedErrorMessages, function(k,v){
	           //  mergedErrorMessages = _.merge(aggregatedErrorMessages, v)
            // })
            if (aggregatedErrorMessages.length > 0) {
            	return aggregatedErrorMessages;
            }
            return null;
        }

        /**
         * Validates Product non-inputs, (i.e. button dropdowns) and returns array of invalid fields.
         */
        function validateProductNonInputs() {
            let compare,
                product,
                nonFields = [ 'quantityUom', 'priceUom', 'currency' ];
            for (let i = 0; i < ctrl.data.products.length; i++) {
                product = ctrl.data.products[i];
                for (let j = 0; j < nonFields.length; j++) {
                    compare = product[nonFields[j]];
                    if (!compare || angular.equals({}, compare)) {
                        return [ nonFields[j] ];
                    }
                }
            }
            return null;
        }

        /**
         * Validates Additional Cost non-inputs, (i.e. button dropdowns) and returns array of invalid fields.
         */
        function validateAdditionalCostsNonInputs() {
            let additionalCosts = ctrl.getAdditionalCosts(),
                compare,
                product,
                additionalCost,
                nonFields = [ 'currency', 'priceUom' ];
            if (typeof additionalCosts != 'undefined') {
                if (additionalCosts != null) {
                    for (let i = 0; i < additionalCosts.length; i++) {
                        for (let j = 0; j < nonFields.length; j++) {
                            additionalCost = additionalCosts[i];
                            compare = additionalCost[nonFields[j]];
                            if (additionalCost.additionalCost) {
                                if (!compare || angular.equals({}, compare)) {
                                    // Special cases:
                                    // Omit priceUom check if the cost type isn't "Unit".
                                    if (nonFields[j] === 'priceUom' && additionalCost.costType && additionalCost.costType.id !== ctrl.COST_TYPE_UNIT_ID) {
                                        continue;
                                    }
                                    return [ nonFields[j] ];
                                }
                            }
                        }
                    }
                }
            }
            return null;
        }

        function getOrderListForRequest() {
            if (window.clickOnSaveAndSend && window.orderDetails) {
                ctrl.relatedOrders = angular.copy(window.orderDetails.relatedOrders);
            } else {
                orderModel.getOrderListForRequest(ctrl.orderId).then((data) => {
                    ctrl.relatedOrders = data.payload;
                });
            }

        }

        /**
         * Determines whether the Additional Cost's Price UOM field should be enabled.
         * It should only be enabled when the Additional Cost's costType is "Unit" (business rule).
         */
        ctrl.additionalCostPriceUomEnabled = function(additionalCost) {
            return additionalCost.costType && additionalCost.costType.id === ctrl.COST_TYPE_UNIT_ID;
        };

        /**
         * Change the cost type to the default for the respective additional cost.
         */
        ctrl.additionalCostNameChanged = function(additionalCost, initiatorName) {
            if(initiatorName == 'input' && additionalCost.locationAdditionalCostId) {
                additionalCost.locationAdditionalCostId = null;
                additionalCost.amount = null;
                additionalCost.price = null;
                additionalCost.extras = null;
                additionalCost.extrasAmount = null;
                additionalCost.priceUom = null;
                additionalCost.costType = null;
                if(additionalCost.isContract) {
                    additionalCost.isContract = false;
                    additionalCost.additionalCostList = ctrl.getFilteredAdditionalCostMasters(additionalCost);
                }
            }
            additionalCost.costType = getAdditionalCostDefaultCostType(additionalCost);
            // Must do this manually, since a programatic change of the
            // cost type property DOES NOT trigger the event - only actual
            // user interaction does.
            ctrl.costTypeChanged(additionalCost, 'additionalCostNameChanged');
        };

        /**
         * Empty the priceUom if Cost Type for the Additional Cost is not Unit.
         */
        ctrl.costTypeChanged = function(additionalCost, initiatorName) {
            if (!additionalCost.costType) {
                return;
            }

            if (additionalCost.costType.name == 'Percent') {
                additionalCost.priceUom = null;

                if (additionalCost.isTaxComponent) {
                    // ctrl.additionalCostApplicableFor[additionalCost.fakeId] = "";
                    // ctrl.applicableForChange(additionalCost, ctrl.additionalCostApplicableFor[additionalCost.fakeId]);
                    ctrl.applicableForChange(additionalCost, null);
                    additionalCost.isAllProductsCost = true;
                }

                isProductComponent(additionalCost); // this sets isTaxComponent
                if (additionalCost.isTaxComponent) {
                    additionalCost.disabledApplicableFor = true;
                    ctrl.applicableForChange(additionalCost, null);
                } else {
                    additionalCost.disabledApplicableFor = false;
                }
            }

            if (additionalCost.costType.name == 'Flat' || additionalCost.costType.name == 'Range' || additionalCost.costType.name == 'Total') {
                additionalCost.priceUom = null;
            }

            let product = ctrl.additionalCostApplicableFor[additionalCost.fakeId];
            if (additionalCost.costType.name == 'Unit') {
                if (additionalCost.isAllProductsCost) {
                    additionalCost.quantityUom = ctrl.data.products[0].quantityUom;
                } else {
                    ctrl.setDefaultUomForAdditionalCost(additionalCost, product);
                }
                additionalCost.disabledApplicableFor = false;
            }

            if(initiatorName == 'additionalCostNameChanged') {
                ctrl.setLocationBasedAdditionalCosts(additionalCost, product, initiatorName);
            }
            calculateAdditionalCostAmounts(additionalCost, product);
            ctrl.evaluateAdditionalCostList();

            // trigger change function
            // addPriceUomChg(additionalCost);
        };

        function convertDecimalSeparatorStringToNumber(number) {
            var numberToReturn = number;
            var decimalSeparator, thousandsSeparator;
            if (typeof number == 'string') {
                if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
                    if (number.indexOf(',') > number.indexOf('.')) {
                        decimalSeparator = ',';
                        thousandsSeparator = '.';
                    } else {
                        thousandsSeparator = ',';
                        decimalSeparator = '.';
                    }
                    numberToReturn = parseFloat(parseFloat(number.split(decimalSeparator)[0].replace(new RegExp(thousandsSeparator, 'g'), '')) + parseFloat(`0.${number.split(decimalSeparator)[1]}`));
                } else {
                    numberToReturn = parseFloat(number);
                }
            }
            if (isNaN(numberToReturn)) {
                numberToReturn = 0;
            }
            return parseFloat(numberToReturn);
        }

        /**
         * Recalculates product amount and total fuel price when product price changes.
         */
        ctrl.productPriceChanged = function(product) {
			if (product.contractProductId) { 
				product.referencePrice = parseInt(product.price);
			}
            product.amount = calculateProductAmount(product);
            updateOrderSummary();
        };
        ctrl.additionalCostPriceChanged = function() {
            updateOrderSummary();
        };
        ctrl.confirmedQuantityChanged = function(product) {
            product.amount = calculateProductAmount(product);
            updateOrderSummary();
        };
        ctrl.sendOrderConfirmation = function(payload) {
            removeNullAdditionalCosts();
            if (!payload) {
                payload = angular.copy(ctrl.data);
            }
            if ($.isEmptyObject(payload.broker) || !payload.broker.name) {
                payload.broker = null;
            }
            if ($.isEmptyObject(payload.surveyorCounterparty) || !payload.surveyorCounterparty.name) {
                payload.surveyorCounterparty = null;
            }
            if ($.isEmptyObject(payload.agentCounterparty) || !payload.agentCounterparty.name) {
                payload.agentCounterparty = null;
            }
            if ($.isEmptyObject(payload.lab) || !payload.lab.name) {
                payload.lab = null;
            }
            if ($.isEmptyObject(payload.trader) || !payload.trader.name) {
                payload.trader = null;
            }
            if ($.isEmptyObject(payload.barge) || !payload.barge.name) {
                payload.barge = null;
            }
            if (typeof payload.additionalCosts != 'undefined') {
                if (payload.additionalCosts.length == 0) {
                    delete payload.additionalCosts;
                }
            }
            // confirm order
            // ctrl.sendOrderCommand(ctrl.ORDER_COMMANDS.CONFIRM, payload);
            var currentData;
            if (payload) {
                currentData = payload;
            }
            if (ctrl.data) {
                currentData = ctrl.data;
            }
            var quantityError = false;
            var minqtyError = false;
            var maxqtyError = false;
            $.each(currentData.products, (k, v) => {
                if (ctrl.captureConfirmedQuantity.name == 'Offer') {
                    if (!v.confirmedQuantity) {
                        quantityError = true;
                    }
                }
                if (ctrl.captureConfirmedQuantity.name == 'Order') {
                    if (!v.confirmedQuantity) {
                        quantityError = true;
                    }
                    if (!v.minQuantity) {
                        minqtyError = true;
                    }
                    if (!v.maxQuantity) {
                        maxqtyError = true;
                    }
                }
                if (ctrl.captureConfirmedQuantity.name == 'Delivery' || ctrl.captureConfirmedQuantity.name == 'Delivey') {
                    if (!v.minQuantity) {
                        minqtyError = true;
                    }
                    if (!v.maxQuantity) {
                        maxqtyError = true;
                    }
                }
            });
            if (quantityError || minqtyError || maxqtyError) {
                var message = 'Please fill ';
                if (quantityError) {
                    message = `${message }Confirmed quantity, `;
                }
                if (minqtyError) {
                    message = `${message }Min quantity, `;
                }
                if (maxqtyError) {
                    message = `${message }Max quantity, `;
                }
                toastr.error(message);
                return;
            }


            if (payload) {
                ctrl.sendOrderCommand(ctrl.ORDER_COMMANDS.CONFIRM, payload);
            } else {
                ctrl.sendOrderCommand(ctrl.ORDER_COMMANDS.CONFIRM, ctrl.data);
            }
        };

        ctrl.showSpecGroupModal = false;
        ctrl.confirmOrder = function(checkSpecGroup) {
            $('form').addClass('submitted');
            let errorMsg = '';
            var aggregatedErrorMessages = [];
            var forms_validation = validateForms(),
                payload = {};
            if (forms_validation !== null) {
            	aggregatedErrorMessages.push(VALIDATION_MESSAGES.INVALID_FIELDS + forms_validation.join(', '));
                // toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + forms_validation.join(", "));
                // return false;
            }

            if ($scope.checkProductsHaveSameProductType() == false) {
	        	// ctrl.buttonsDisabled = false;
            	aggregatedErrorMessages.push('Order can contain only products with same group.');
                // toastr.error("Order can contain only products with same group.");
                // return;
            }
            if ($scope.hasMissingSpecGroup()) {
                aggregatedErrorMessages.push(`Please select a Spec Group for : ${ $scope.hasMissingSpecGroup()}`);
        		// toastr.error("Please select a Spec Group for : " + $scope.hasMissingSpecGroup());
        		// return;
            }
            var hasAdditionalCostError = false;
            $.each(ctrl.data.products, (pk, pv) => {
            	if (pv.status) {
	            	if (pv.status.name == 'Cancelled' && pv.additionalCosts.length > 0) {
	            		$.each(pv.additionalCosts, (ack, acv) => {
	            			if (acv.additionalCost) {
	            				if (!acv.isDeleted) {
				            		hasAdditionalCostError = true;
	            				}
	            			}
	            		});
	             	}
            	}
            });
            if (hasAdditionalCostError) {
            	errorMsg = `${errorMsg }You have additional costs that have applicable for set on cancelled products \n`;
            }

            if (moment(ctrl.data.deliveryFrom).diff(moment(ctrl.data.deliveryTo)) > 0 ) {
                errorMsg = `${errorMsg }Delivery To should be greater than Delivery From \n`;
            }


            if(errorMsg != '') {
            	aggregatedErrorMessages.push(errorMsg);
                // toastr.error(errorMsg);
                // return;
            }

            ctrl.showSpecGroupModal = false;
            if (ctrl.isAgentFreeText) {
                // if (!ctrl.data.agentCounterpartyFreeText) {
                //     toastr.error("The field Agent is required.");
                //     return;
                // }
                ctrl.data.agentCounterparty = null;
            }
            if (aggregatedErrorMessages.length > 0) {
            	$.each(aggregatedErrorMessages, (k, message) => {
            		toastr.error(message);
            	});
            	return;
            }
            if (checkSpecGroup) {
                console.log(ctrl.data);
                $.each(ctrl.data.products, (key, val) => {
                    if (val.requestProductSpecGroup != null && val.specGroup != null) {
                        if (val.requestProductSpecGroup.id != val.specGroup.id) {
                            ctrl.showSpecGroupModal = true;
                        }
                    }
                });
            }

            if (ctrl.showSpecGroupModal) {
                // show spec group modal validatiom
                $scope.modalInstance = $uibModal.open({
                    templateUrl: 'pages/new-order/views/confirmSpecGroupModal.html',
                    appendTo: angular.element(document.getElementsByClassName('page-container')),
                    windowTopClass: 'fullWidthModal smallModal',
                    windowClass: 'limited-max-height',
                    scope: $scope
                });
            } else if (ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWHARDSTOPPRETESTEMAIL)) {
            	 ctrl.messageType = 'hardPretest';
            	 $('order-email-dialog').modal('show');
            } else if (ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWHARDSTOPCONFIRMEMAIL) || ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWHARDSTOPSELLEREMAIL)) {
                // ctrl.messageType = SCREEN_ACTIONS.SHOWSOFTSTOPCONFIRMEMAIL;
                if (ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWHARDSTOPCONFIRMEMAIL)) {
                    ctrl.messageType = 'hardVessel';
                }
                if (ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWHARDSTOPSELLEREMAIL)) {
                    ctrl.messageType = 'hardSeller';
                }
                if (ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWHARDSTOPCONFIRMEMAIL) && ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWHARDSTOPSELLEREMAIL)) {
                    ctrl.messageType = 'hardBoth';
                }
                $('order-email-dialog').modal('show');
            } else if (ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWSOFTSTOPCONFIRMEMAIL) || ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWSOFTSTOPSELLEREMAIL)) {
                if (ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWSOFTSTOPCONFIRMEMAIL)) {
                    ctrl.messageType = 'softVessel';
                }
                if (ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWSOFTSTOPSELLEREMAIL)) {
                    ctrl.messageType = 'softSeller';
                }
                if (ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWSOFTSTOPCONFIRMEMAIL) && ctrl.dtoHasAction(SCREEN_ACTIONS.SHOWSOFTSTOPSELLEREMAIL)) {
                    ctrl.messageType = 'softBoth';
                }
                $('order-email-dialog').modal('show');
            } else {
                // Save Order before confirming validation
                removeNullAdditionalCosts();
                $('form').addClass('submitted');
                var forms_validation = validateForms(),
                    payload = {};
                if (forms_validation !== null) {
                    	aggregatedErrorMessages.push(VALIDATION_MESSAGES.INVALID_FIELDS + forms_validation.join(', '));
                    // toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + forms_validation.join(", "));
                    // return false;
                }
                // ctrl.buttonsDisabled = true;
                removeNullAdditionalCosts();
                angular.copy(ctrl.data, payload);
                if ($.isEmptyObject(payload.broker) || !payload.broker.name) {
                    payload.broker = null;
                }
                if ($.isEmptyObject(payload.surveyorCounterparty) || !payload.surveyorCounterparty.name) {
                    payload.surveyorCounterparty = null;
                }
                if ($.isEmptyObject(payload.lab) || !payload.lab.name) {
                    payload.lab = null;
                }
                if ($.isEmptyObject(payload.trader) || !payload.trader.name) {
                    payload.trader = null;
                }
                if ($.isEmptyObject(payload.barge) || !payload.barge.name) {
                    payload.barge = null;
                }
                // delete additional costs
                if (typeof payload.additionalCosts != 'undefined') {
                    if (payload.additionalCosts.length == 0) {
                        delete payload.additionalCosts;
                    }
                }
                if (typeof payload.products != 'undefined' && payload.products.length > 0) {
                    $.each(payload.products, (key, val) => {
                        if (val.additionalCosts.length == 0) {
                            delete val.additionalCosts;
                        }
                    });
                }
                // END Save Order before confirming validation

                if (aggregatedErrorMessages.length > 0) {
                    	$.each(aggregatedErrorMessages, (k, message) => {
                    		toastr.error(message);
                    	});
                    	return;
                }
                if (typeof payload.isVerified != 'undefined' && payload.isVerified != null) {
                    payload.isVerified = null;
                    payload.isVerified = { id: 1, name: 'Yes' };
                    payload.isVerified.id = 1;
                    payload.isVerified.name = 'Yes';
                }

                ctrl.sendOrderConfirmation(payload);

                $scope.prettyCloseModal();
                // orderModel.update(payload).then(function(responseData) {
                //  toastr.remove()
                //     ctrl.buttonsDisabled = false;
                //  if (responseData.isSuccess) {
                //  }
                // }).catch(function(err) {
                //     ctrl.buttonsDisabled = false;
                //  $scope.prettyCloseModal();
                // });
            }
        };
        // used in nav
        $scope.NAV = {};
        $scope.NAV.orderId = $state.params.orderId;
        $scope.getAdditionalCostDefaultCostType = function(additionalCost) {
            if (!additionalCost.additionalCost) {
                return;
            }

            var costType;

            $.each(ctrl.additionalCostTypes, (_, v) => {
                if (v.id == additionalCost.additionalCost.id) {
                   costType = v.costType.id;
                }
            });

            // cost types : 1 - Flat; 2 - Unit; 3 - Percent; 4 - Range; 5 - Total;
            var availableCosts = [];
            if (costType == 1 || costType == 2) {
                $.each(ctrl.lists.CostType, (_, v) => {
                    if (v.id == 1 || v.id == 2) {
                        availableCosts.push(v);
                    }
                });
            }
            if (costType == 3) {
                $.each(ctrl.lists.CostType, (_, v) => {
                    if (v.id == 3) {
                        availableCosts.push(v);
                    }
                });
            }
            if (costType == 4) {
                $.each(ctrl.lists.CostType, (_, v) => {
                    if (v.id == 4) {
                        availableCosts.push(v);
                    }
                });
            }
            if (costType == 5) {
                $.each(ctrl.lists.CostType, (_, v) => {
                    if (v.id == 5) {
                        availableCosts.push(v);
                    }
                });
            }
            return availableCosts;
        };
        // modal close
        $scope.prettyCloseModal = function() {
            let modalStyles = {
                transition: '0.3s',
                opacity: '0',
                transform: 'translateY(-50px)'
            };
            let bckStyles = {
                opacity: '0',
                transition: '0.3s'
            };
            $('[modal-render=\'true\']').css(modalStyles);
            $('.modal-backdrop').css(bckStyles);
            setTimeout(() => {
                if ($scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                // $(".modal-scrollable").css("display", "none")
            }, 500);
        };
        $scope.modalConfirmOrder = function() {
            ctrl.confirmOrder();
        };
        $scope.showHideSections = function(obj) {
            if (obj.length > 0) {
                $scope.visible_sections_old = $scope.visible_sections;
            } else {
                if (typeof $scope.visible_sections_old != 'undefined') {
                    $scope.visible_sections = $scope.visible_sections_old;
                    $('select#multiple').selectpicker('val', $scope.visible_sections_old[0]);
                    $('select#multiple').selectpicker('render');
                };
            }
        };
        ctrl.getProductTooltipByProductId = function(productId) {
            // console.log($listsCache);
            var tooltipName = null;
            $.each($listsCache.Product, (pk, pv) => {
                if (pv.id == productId) {
                    tooltipName = pv.displayName;
                }
            });
            return tooltipName;
        };
        ctrl.setDefaultTempProduct = function(product) {
            return angular.copy(product);
        };
        ctrl.triggerFormulaDetailsModal = function(rowData) {
            ctrl.datatest = 'ajsbdbk';
            var tpl = $templateCache.get('pages/new-order/views/formulaDetailsModal.html');
            var payload = {
                Filters: [ {
                    ColumnName: 'OrderId',
                    Value: ctrl.orderId
                }, {
                    ColumnName: 'OrderProductId',
                    Value: rowData.id
                }, {
                    ColumnName: 'ProductId',
                    Value: rowData.product ? rowData.product.id : null
                }, {
                    ColumnName: 'QuantityUomId',
                    Value: rowData.quantityUom ? rowData.quantityUom.id : null
                }, {
                    ColumnName: 'PriceUomId',
                    Value: rowData.priceUom ? rowData.priceUom.id : null
                }, {
                    ColumnName: 'FormulaId',
                    Value: rowData.formula ? rowData.formula.id : null
                }, {
                    ColumnName: 'PricingDate',
                    Value: rowData.pricingDate
                } ]
            };
            orderModel.getFormulaDetails(payload).then((data) => {
                ctrl.formulaDetailsData = data.payload;
                ctrl.productPrices = [];
                $.each(data.payload.formulaSchedules, (k, v) => {
                    $.each(v.schedule, (sk, sv) => {
                        sv.data = v;
                        ctrl.productPrices.push(sv);
                    });
                });
                $scope.modalInstance = $uibModal.open({
                    template: tpl,
                    appendTo: angular.element(document.getElementsByClassName('page-container')),
                    windowTopClass: 'fullWidthModal',
                    windowClass: 'limited-max-height',
                    scope: $scope
                });
            });
        };
        ctrl.canReconfirm = function() {
            if (!ctrl.data) {
                return;
            }
            var canReconfirm = true;
            var hasFormula = false;
            var hasContract = false;
            $.each(ctrl.data.products, (k, v) => {
                if (v.formula) {
                    hasFormula = true;
                }
                if (v.contract) {
		            hasContract = true;
                }
                if (v.formula && !v.isPriceFinal) {
                    canReconfirm = false;
                }
            });
            if (hasContract && hasFormula) {
	            return canReconfirm;
            }
            	return false;
        };
        ctrl.validateMinMaxQuantity = function(min, max) {
            if(typeof min == 'string') {
                min = parseFloat(min);
            }
            if(typeof max == 'string') {
                max = parseFloat(max);
            }
            var response = {
                minQuantity: min,
                maxQuantity: max
            };
            if (min && min > max) {
                response.maxQuantity = null;
            }
            if (max && min > max) {
                response.minQuantity = null;
            }
            if (min && max && min > max) {
                toastr.warning('Min Quantity can\'t be greater than Max Quantity');
            }
            return response;
        };
        ctrl.parseStatuses = function() {
            if (typeof ctrl.STATUS == 'undefined') {
                ctrl.STATUS = {};
            }
            $.each($listsCache.Status, (key, val) => {
                ctrl.STATUS[val.name] = val;
            });
        };
        ctrl.parseStatuses();

        /* set surveyor/lab based on vessel/location selection*/
        ctrl.setDefaultValues = function(source, field, data) {
            if (data == null) {
                return;
            }
            if (typeof data == 'undefined') {
                return;
            }
            // 1. if field == lab, check if source == tenant config source
            if (field == 'lab') {
                // none
                if (ctrl.autoPopulateLabFrom.id == 1) {
                    return;
                }
                // from vessel
                if (ctrl.autoPopulateLabFrom.id == 2 && source == 'vessel' && ctrl.data.status==null) {
                    ctrl.data.lab = data;
                }
                // from location
                if (ctrl.autoPopulateLabFrom.id == 3 && source == 'location' && ctrl.data.status==null) {
                    ctrl.data.lab = data;
                }
            }
            // 2. if field == surveyor, check if source == location and it has default lab
            if (field == 'surveyor' && ctrl.data.status==null) {
                if (source == 'location') {
                    ctrl.data.surveyorCounterparty = data;
                }
            }
        };

        ctrl.addNewProduct = function() {
        	var newProduct = {
  				uniqueIdUI: Math.random().toString(36).substring(7),
  				// physicalSupplier: angular.copy(ctrl.data.seller),
  				deliveryOption : angular.copy(ctrl.defaultDeliveryOption),
        	};
            ctrl.setPhysicalSupplier(newProduct);
            if(ctrl.data.products.length > 0) {
                newProduct.currency = ctrl.data.products[0].currency;
            }
        	ctrl.data.products.push(newProduct);
        };
        ctrl.deleteProduct = function(product) {
            if(product.id) {
                let forms_validation = validateForms();
                var filteredFormValidation = []; /* Should exclude validation for Suveyor, Agent, Physical Supplier*/
                if (forms_validation) {

	                $.each(forms_validation, (k, v) => {
	                	if (v.length > 0) {
	                		$.each(v, (k2, v2) => {
			                	if ([ 'Surveyor', 'Agent', 'Agent', 'physicalSupplier' ].indexOf(v2) == -1 && v2.indexOf('Physical Supplier') == -1) {
			                		filteredFormValidation.push(v2);
			                	}
	                		});
	                	} else if ([ 'Surveyor', 'Agent', 'Agent', 'physicalSupplier' ].indexOf(v) == -1 && v.indexOf('Physical Supplier') == -1) {
		                		filteredFormValidation.push(v);
		                	}
	                });
                }
                if (filteredFormValidation !== null) {
                	if (filteredFormValidation.length > 0) {
	                    toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + filteredFormValidation.join(', '));
	                    return false;
                	}
                }
	            let invalidMinMaxConf = [];
	            if (product.minQuantity == 0 || product.minQuantity == null) {
                    invalidMinMaxConf.push('Min Quantity');
                }
	            if (product.maxQuantity == 0 || product.maxQuantity == null) {
                    invalidMinMaxConf.push('Max Quantity');
                }
	            if (product.confirmedQuantity == 0 || product.confirmedQuantity == null) {
                    invalidMinMaxConf.push('Confirmed Quantity');
                }
	            if (invalidMinMaxConf.length > 0) {
	            	toastr.error(`Please make sure that ${ invalidMinMaxConf.join(', ') } is not empty or 0`);
	            	return;
	            }
            }
            var countOfCancelledProducts = 0;
            let currentProduct = product;
            $.each(ctrl.data.products, (k, v) => {
                if (v.status) {
                    if (v.status.id == ctrl.STATUS.Cancelled.id) {
                        countOfCancelledProducts = countOfCancelledProducts + 1;
                    }
                }
            });
            if (countOfCancelledProducts >= ctrl.data.products.length - 1) {
                toastr.error('One order product is required. Cancel action cannot be processed');
                return false;
            }
            if (currentProduct.id) {
                $scope.showModalConfirm(`Are you sure you want to cancel product ${ currentProduct.product.name }?`, currentProduct, (modalresponse) => {
                    if (modalresponse) {
                        toastr.info(`Please consider changing any additional cost that is applicable for ${ currentProduct.product.name } before canceling the product`);
		                orderModel.cancelOrderProduct(modalresponse.id)
	                    .then((response) => {
	                        ctrl.buttonsDisabled = false;
	                        $scope.prettyCloseModal();
	                        if (response.isSuccess) {

	                        	/* To be modificed after backend call is done*/
	                        	$.each(ctrl.data.products, (key, value) => {
	                        		if (value.id == modalresponse.id) {
                                            value.status = ctrl.STATUS.Cancelled;
                                            ctrl.disabledProduct[value.id] = true;
	                        		}
	                        	});

	                        	/* To be modificed after backend call is done*/
	                        } else {
	                        	toastr.error('An error has ocurred');
	                        }
	                    }).catch((error) => {
	                        ctrl.buttonsDisabled = false;
	                        $scope.prettyCloseModal();
	                    });
                        // console.log("Should make call to cancel product");
                        // product.isDeleted = true;
                    }
                });
            }
            if (product.uniqueIdUI && !currentProduct.id) {
                if (_.has(currentProduct, 'product.name')) {
                    toastr.info(`Please consider changing any additional cost that is applicable for ${ currentProduct.product.name } before removing the product`);
                }
                $.each(ctrl.data.products, (pk, pv) => {
                    if (pv) {
                        if (pv.uniqueIdUI == product.uniqueIdUI) {
                            ctrl.data.products.splice(pk, 1);
                        }
                    }
                });
            }
        };

        $scope.showModalConfirm = function(message, additionalData, callback) {
            $scope.confirmModalAdditionalData = additionalData;
            $('.orderConfirmModal').modal();
            $('.orderConfirmModal').removeClass('hide');
            ctrl.confirmModalData = {
                message : message
            };
            ctrl.confirmedModal = false;
            $('.confirmAction').on('click', () => {
                if (ctrl.confirmedModal) {
                    return;
                }
                ctrl.confirmedModal = true;
                return callback($scope.confirmModalAdditionalData);
            });
        };

        $scope.showModalConfirmCancelOrder = function(message, additionalData, callback) {
            $scope.confirmModalAdditionalData = additionalData;
            $('.orderConfirmModal2').modal();
            $('.orderConfirmModal2').removeClass('hide');
            ctrl.confirmModalData = {
                message : message
            };
            ctrl.confirmedModal = false;
            $('.confirmAction1').on('click', () => {
                if (ctrl.confirmedModal) {
                    return;
                }
                ctrl.confirmedModal = true;
                return callback($scope.confirmModalAdditionalData);
            });
        };


        $scope.selectProductContract = function(productUniqueId, selection, isSameContract, changeContract, isQuantityUom) {
            // find product
            // 1. by id
            console.log(selection);

            let selectContract = function(idx, selection, changeContractAutocomplete) {
                ctrl.data.products[idx].contractProductId = selection.contractProductId;
                ctrl.data.products[idx].priceUom = selection.uom;
                ctrl.data.products[idx].pricePrecision = selection.pricePrecision;
                ctrl.data.products[idx].contract = angular.copy(selection.contract);
                if ((changeContract || changeContractAutocomplete) && !isQuantityUom) { 
                    ctrl.data.products[idx].price = angular.copy(selection.price);
                    ctrl.productPriceChanged(ctrl.data.products[idx]);
                }
                ctrl.recomputeProductPricePrecision(idx);
                ctrl.data.products[idx].formula = angular.copy(selection.formula);
                ctrl.data.products[idx].agreementType = selection.contractAgreementType ?
                    angular.copy(selection.contractAgreementType) : ctrl.defaultContractAgreementType;
                if (!isSameContract) {   
                    ctrl.data.products[idx].convFactorMassUom = angular.copy(selection.conversionFactors.massUom);
                    ctrl.data.products[idx].convFactorValue = angular.copy(selection.conversionFactors.value);
                    ctrl.data.products[idx].convFactorVolumeUom = angular.copy(selection.conversionFactors.volumeUom);
                    ctrl.data.products[idx].physicalSupplier = selection.physicalSupplier;
                }
               

                ctrl.data.products[idx].requiredFields = [];
                if (ctrl.procurementSettings.order.specGroupFlowFromContract.name == 'Yes') {
                    ctrl.data.products[idx].specGroup = selection.specGroup;
                }

                if(selection.pricingType.id == 1) {
                    // fixed
                    ctrl.data.products[idx].pricingType = angular.copy(selection.pricingType);
                    ctrl.data.products[idx].formulaDescription = '';
                    ctrl.data.products[idx].requiredFields.formulaDescription = false;
                } else {
                    // formula
                    ctrl.data.products[idx].pricingType = angular.copy(selection.pricingType);
                    if(selection.formula) {
                        ctrl.data.products[idx].formulaDescription = selection.formula.name;
                        // if contract has a formula, formula details for product is required
                        ctrl.data.products[idx].requiredFields.formulaDescription = true;
                    }
                }
                productUomChg(ctrl.data.products[idx]);
                if (!isSameContract) {
                    let additionalInfo = {
                        productId: selection.product.id,
                        confirmQty: ctrl.data.products[idx].confirmedQuantity,
                        confirmQtyUom: ctrl.data.products[idx].quantityUom.id,
                    };
                    $scope.addAdditionalCostByContractProductId(selection.contractProductId, idx, additionalInfo);
                }
            };
            $.each(ctrl.data.products, (key, value) => {
                if(value.id == productUniqueId) {
                    selectContract(key, selection, true);
                }else if(value.uniqueIdUI == productUniqueId) {
                    selectContract(key, selection, true);
                }
            });
        };

        ctrl.overrideConversion = function(product, index) {
            if (!product.overrideConversionFactor && !product.contract) {
                payload = {
                  Payload: {
                    ProductId: product.product.id  
                  }
                };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/getProdDefaultConversionFactors`, payload).then((response) => {
                    console.log(response);
                    if (response.data.payload != 'null') {
                        ctrl.data.products[index].convFactorMassUom = response.data.payload.massUom;
                        ctrl.data.products[index].convFactorValue = response.data.payload.value;
                        ctrl.data.products[index].convFactorVolumeUom = response.data.payload.volumeUom;

                    }
                }); 
                console.log(ctrl.data.products);
            } else if(!product.overrideConversionFactor && product.contract) {
                if (product.id) {
                    Payload = {
                        "ContractProductId": product.contractProductId,
                        "OrderProductId": product.id,
                        "ProductId": product.product.id,
                        "CancelOrderOverride": true
                    }  
                } else {
                    Payload = {
                        "ContractProductId": product.contractProductId,
                        "ProductId": product.product.id,
                        "CancelOrderOverride": true
                    }  
                }
                payload = { Payload: Payload };
                $http.post(`${API.BASE_URL_DATA_CONTRACTS  }/api/contract/contract/getConversionFactorsForContractProduct`, payload).then((response) => {
                    console.log(response);
                    if (response.data.payload != 'null') {
                        let res = response.data.payload[0];
                        ctrl.data.products[index].convFactorMassUom = res.massUom;
                        ctrl.data.products[index].convFactorValue = res.value;
                        ctrl.data.products[index].convFactorVolumeUom = res.volumeUom;

                    }
                }); 

            }
            console.log(product);
        }

        $scope.addAdditionalCostByContractProductId = function(contractProductId, productIdx, additionalInfo) {
            //     	if (ctrl.data.id) {
            // // applicable only for new order
            //     		return
            //     	}
            let currentProductIndex = productIdx
            let apiJSON = {
                Order: null,
                Filters: [
                    {
                        ColumnName: 'ContractProductId',
                        Value: contractProductId
                    },
                    {
                        ColumnName: 'ProductId',
                        Value: additionalInfo.productId
                    },
                    {
                        ColumnName: 'ConfirmQty',
                        Value: additionalInfo.confirmQty
                    },
                    {
                        ColumnName: 'ConfirmQtyUom',
                        Value: additionalInfo.confirmQtyUom
                    }
                ],
                Pagination: {
                    Skip: 0,
                    Take: 25
                },
                SearchText: null
            };
            orderModel.getContractProductAdditionalCosts(apiJSON).then(function (response) {
                console.log(response);
                if (!ctrl.data.products[currentProductIndex].additionalCosts) {
                    ctrl.data.products[currentProductIndex].additionalCosts = []
                }
                // Commenting as per task #33115 expected behavior
                // /* Remove existing contract based add.costs if any - Start */
                // for (let i = ctrl.data.products[currentProductIndex].additionalCosts.length - 1; i >= 0; i--) {
                //     let addCost = ctrl.data.products[currentProductIndex].additionalCosts[i];
                //     if (addCost.isContract) {
                //         if (addCost.fakeId < 0) {
                //             ctrl.data.products[currentProductIndex].additionalCosts.splice(i, 1);
                //         } else {
                //             addCost.isDeleted = true;
                //         }
                //     }
                // }
                // /* Remove existing contract based add.costs if any - End */
                $.each(response.payload, function(k,v) {
                    v.isContract = true;
                    v.id = 0;
                    v.additionalCostList = ctrl.getFilteredAdditionalCostMasters(v);
                    ctrl.data.products[currentProductIndex].additionalCosts.push(v);
                });
                ctrl.getAdditionalCosts();
            }).catch(function (error) {
            });
        };


        $scope.$on('dataListModal', (e, a) => {
        	if(typeof a.elem != 'undefined') {
        		if(typeof a.val != 'undefined') {
        			if(a.elem[0] == 'vesselImoNo') {
        				ctrl.selectVessel(a.val.id);
        			}
        			if(a.elem[0] == 'vessel') {
        				ctrl.selectVessel(a.val.id);
        			}
        			if(a.elem[0] == 'service') {
        				ctrl.selectService(a.val.id);
        			}
        			if(a.elem[0] == 'seller') {
                        ctrl.selectSeller(a.val);
                        ctrl.setPhysicalSupplier();
                    }
                    if (a.elem[0] == 'barge') {
                        ctrl.data.barge = a.val;
                    }
                    if (a.elem[0] == 'carrier') {
                        ctrl.data.carrierCompany = a.val;
                    }
                    if (a.elem[0] == 'location') {
                        ctrl.selectPort(a.val, true);
                    }
                    if (a.elem[0] == 'broker') {
                        ctrl.data.broker = a.val;
                    }
                    if (a.elem[0] == 'agentCounterparty') {
                        ctrl.data.agentCounterparty = a.val;
                    }
                    if (a.elem[0] == 'lab') {
                        ctrl.data.lab = a.val;
                    }
                    if (a.elem[0] == 'surveyorCounterparty') {
                        ctrl.data.surveyorCounterparty = a.val;
                    }
                    if (a.elem[0] == 'pretestlab') {
                        ctrl.data.preTestLabCounterparty = a.val;
                    }                    
                    if (a.elem[0] == 'paymentTerm') {
                        ctrl.selectPaymntTerm(a.val);
                    }
                    if (a.elem == 'productSupplier') {
                       var productProductId = ctrl.physicalSupplierRowUniqueIdUI;
                        // search for product in ctrl.data.products list
                        $.each(ctrl.data.products, (key, product) => {
                            if (product.uniqueIdUI == ctrl.physicalSupplierRowUniqueIdUI) {
                                product.physicalSupplier = a.val;
                            }
                        });
                        // ctrl.data.products[productIdx].physicalSupplier = a.val;
                    }
                    if (a.elem[0] == 'paymentCompany') {
                        ctrl.data.paymentCompany = a.val;
                        lookupModel.get(LOOKUP_TYPE.COMPANY, a.val.id).then((server_data) => {
                            var data = server_data.payload;
                            doPaymentCompanyChanged(data);
                        });
                    }
                    if (a.elem[0] == 'buyer') {
                        if (!ctrl.isTraderField) {
                            ctrl.data.buyer = a.val;
                        }
                    }
                    if (a.elem[0] == 'trader') {
                        if (ctrl.isTraderField) {
                            ctrl.data.trader = a.val;
                        }
                    }
                    if(a.elem[0] == 'contract') {
                        $scope.selectProductContract(ctrl.productContractSelecting, a.val, false, true);
                    }
                }
            }
        });

        function setPageTitle() {
            // only edit order
            if(ctrl.data.id) {
                if(ctrl.data.vessel) {
                    if(ctrl.data.request) {
                        // 1. if linked to request, display request name
                        var title = `${'Order' + ' - '}${ ctrl.data.request.name } - ${ ctrl.data.vessel.name}`;
                        $rootScope.$broadcast('$changePageTitle', {
                            title: title
                        });
                    }else{
                        // 2. if not linked to request, display order name
                        if(ctrl.data.name) {
                            var title = `Order - ${ ctrl.data.name } - ${ ctrl.data.vessel.name}`;
                            $rootScope.$broadcast('$changePageTitle', {
                                title: title
                            });
                        }
                    }
                }
            }
        }

        ctrl.isDisabledProduct = function(prod) {
            if(typeof prod.status != 'undefined' && prod.status != null) {
                if(prod.status.name == 'Cancelled') {
                    return true;
                } // cancelled
                if(prod.status.name == 'Invoiced') {
                    return true;
                } // invoiced
                if (prod.status.name == 'Closed') {
                    return true;
                }
            }

            return false;
        };

        ctrl.changeAllCurrencyInOrder = function(currency) {
        	$.each(ctrl.data.products, (kp, vp) => {
        		vp.currency = currency;
        		if (vp.additionalCosts) {
	        		$.each(vp.additionalCosts, (kac, vac) => {
	        			vac.currency = currency;
	        		});
        		}
        	});
        	if (ctrl.data.additionalCosts) {
        		$.each(ctrl.data.additionalCosts, (kac, vac) => {
        			vac.currency = currency;
        		});
            }
        };

        ctrl.requiredAndDisabledRules = function(rule, field, data) {
            let result = true;
            if(rule == 'required' && field == 'confirmedQty') {
                // - required only if:
                // - capture conf qty == "Order"
                //     - confirnm order
                //     - after order confirmed
                // AND
                // - not disabled
                if(ctrl.data.id == 0) {
                    // new order
                    if (ctrl.captureConfirmedQuantity.name == 'Offer') {
                        result = true;
                    }
                    if (ctrl.captureConfirmedQuantity.name == 'Order') {
                        result = false;
                    }
                    if (ctrl.captureConfirmedQuantity.name == 'Delivery') {
                        result = false;
                    }
                }else{
                    if (ctrl.captureConfirmedQuantity.name == 'Offer' || data == ctrl.STATUS.Cancelled.id) {
                        result = true;
                    }
                    if (ctrl.captureConfirmedQuantity.name == 'Order') {
                        if(ctrl.data.status.id == ctrl.STATUS.Confirmed.id ||
                            ctrl.data.status.id == ctrl.STATUS.Delivered.id ||
                            ctrl.data.status.id == ctrl.STATUS.PartiallyDelivered.id ||
                            ctrl.data.status.id == ctrl.STATUS.Amended.id ||
                            ctrl.data.status.id == ctrl.STATUS.Invoiced.id ||
                            ctrl.data.status.id == ctrl.STATUS.PartiallyInvoiced.id) {
                            // after confirm
                            result = true;
                        }else{
                            result = false;
                        }
                    }
                    if (ctrl.captureConfirmedQuantity.name == 'Delivery') {
                        result = false;
                    }
                }
            }


            return result;
        };

        $scope.aplicableCostForProduct = function(val) {
            if(typeof val != 'undefined') {
                if(val.status.name != 'Cancelled') {
                    if(val.product.name != '') {
                        return true;
                    }
                }
            }

            return false;
        };

        ctrl.openPreviewEmail = function(data) {
            data.data.missingSurveyor = ctrl.data.missingSurveyor;
            data.data.missingAgent = ctrl.data.missingAgent;
            data.data.missingPhysicalSupplier = ctrl.data.missingPhysicalSupplier;
            data.data.missingSpecGroup = ctrl.data.missingSpecGroup;
            data.data.missingLab = ctrl.data.missingLab;
            data.data.missingPretest = ctrl.data.missingPretest;


            localStorage.setItem('previewEmailData', JSON.stringify(data));
            let url = $state.href(STATE.PREVIEW_EMAIL);
            // $window.open(url, '_blank');
            $location.path(url.replace('#', ''));
        };

        ctrl.sumThose = function(idx, number) {
        	return parseFloat(idx) + parseFloat(number);
        };
        jQuery(document).ready(($) => {
            setTimeout(() => {
                $scope.$apply();
            });
        });


        ctrl.inputChangeProcessing = function(inputName) {
            $timeout(() => {
                switch(inputName) {
                case 'eta':
                    ctrl.data.deliveryDate = angular.copy(ctrl.data.eta);
                    ctrl.isRecentETA ? ctrl.data.recentEta = angular.copy(ctrl.data.eta) : '';
                    break;
                case 'recentEta':
                    	if (!ctrl.data.recentEta) {
                    		if (ctrl.data.eta) {
                    			ctrl.data.deliveryDate = angular.copy(ctrl.data.eta);
                    		}
                    	} else {
                        ctrl.data.deliveryDate = angular.copy(ctrl.data.recentEta);
                    	}
                    break;
                }
            }, 1);
        };

        ctrl.setIsVerifiedBool = function() {
        	ctrl.data.isVerified.name == 'Yes' ? ctrl.data.isVerifiedBool = true : ctrl.data.isVerifiedBool = false;
        	console.log(ctrl.data.isVerifiedBool);
        };
        ctrl.verifyOrder = function() {
        	var payload = [ { Id: ctrl.orderId } ];
	        orderModel.verifyOrders(payload).then((responseData) => {
                $state.reload();
	        }).catch((err) => {
	     		ctrl.data.isVerifiedBool = false;
            });
        };

		ctrl.isPretestLabMandatory = () => {
            var pretestLabMandatory = false;
            productPretestChecked = false;
            if (ctrl.data) {
                if (ctrl.data.products) {
                    $.each(ctrl.data.products, (k,v) => {
                    	if (v.preTest) {
        		            productPretestChecked = true;
                    	}
                    })
                }
            }
            if (productPretestChecked) {
	            pretestLabMandatory = true;
            }
            return pretestLabMandatory;
		}

        ctrl.recomputeProductPricePrecision = (productKey) => {
        	var producInitialPrice = ctrl.data.products[productKey].price;
        	ctrl.data.products[productKey].price = 0
        	$timeout(()=>{
	        	ctrl.data.products[productKey].price = producInitialPrice;
                ctrl.productPriceChanged(ctrl.data.products[productKey]);
        	})
        }
        $scope.createRange = function(min, max) {
	        min = parseInt(min);
	        max = parseInt(max);
	        var input = [];
	        for (let i = min; i <= max; i++) {
	            input.push(i);
	        }
	        return input;
	    };
        
        /**
         * Evaluates the additional cost list based on already added additional costs.
         * Just a setter/getter for ctrl.additionalCosts, which will be bound to UI.
         * @returns The evaluated additionalCostList
         */
        ctrl.evaluateAdditionalCostList = function() {
            let additionalCost, result = [];
            if (!ctrl.data) {
                return result;
            }
            result = ctrl.globalAdditionalCosts;
            if (result) {
                for (let k = 0; k < result.length; k++) {
                    additionalCost = result[k];
                    additionalCost.confirmedQuantity = sumProductConfirmedQuantities(ctrl.data.products);
                    additionalCost.quantityUom = ctrl.data.products[0].quantityUom;
                    additionalCost = calculateAdditionalCostAmounts(additionalCost, null);
                }
            }
            if (ctrl.data.products) {
                for (let i = 0; i < ctrl.data.products.length; i++) {
                    if (ctrl.data.products[i].additionalCosts) {
                        if (result) {
	                        result = result.concat(ctrl.data.products[i].additionalCosts);
                        }
                    }
                }
            }

            result = $filter('filter')(result, {
                isDeleted: false
            });
            ctrl.additionalCosts = result;
            updateOrderSummary();
            return ctrl.additionalCosts;
        }
        
        /**
         * Evaluates all the location based additional costs & updates ctrl.additionalCosts
         * @param {*} additionalCost 
         * @param {*} product 
         * @param {*} initiatorName 
         * @returns 
         */
        ctrl.setLocationBasedAdditionalCosts = function(additionalCost, product, initiatorName) {
            if(initiatorName != 'additionalCostNameChanged' && initiatorName != 'quantityChange' &&
                initiatorName != 'applicableForChange' && initiatorName != 'productChanged' || (!additionalCost.costType ||
                !((additionalCost.additionalCost && additionalCost.additionalCost.locationid > 0) ||
                additionalCost.locationAdditionalCostId > 0))) {
                return;
            }
            
            if(!product) {
                product = ctrl.additionalCostApplicableFor[additionalCost.fakeId];
            }
            if ((additionalCost.costType.id == COST_TYPE_IDS.FLAT || additionalCost.costType.id == COST_TYPE_IDS.UNIT ||
                additionalCost.costType.id == COST_TYPE_IDS.PERCENT)) {
                let locAddCost = ctrl.locationAdditionalCosts.find(x => {
                    if(x.id == additionalCost.additionalCost.id && x.costType.id == additionalCost.costType.id &&
                        (!x.locationid || !additionalCost.additionalCost.locationid || x.locationid == additionalCost.additionalCost.locationid)) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if(!locAddCost) {
                    return;
                }
                let addCostIdx = product.additionalCosts.indexOf(additionalCost);
                additionalCost.extras = locAddCost.extras || additionalCost.extras ||0;
                additionalCost.price = locAddCost.price || additionalCost.price || 0;
                additionalCost.amount = locAddCost.amount || additionalCost.amount || 0;
                additionalCost.priceUom = locAddCost.priceUom || additionalCost.priceUom || null;
                additionalCost.costType = locAddCost.costType || additionalCost.costType || 0;
                additionalCost.locationAdditionalCostId = additionalCost?.locationAdditionalCostId ?? additionalCost?.additionalCost?.locationid;
                if (!additionalCost.costType) {
                    return;
                }
                additionalCost = calculateAdditionalCostAmounts(additionalCost, product);
                product.additionalCosts[addCostIdx] = additionalCost;
                return;
            }
            
            // Do not fetch rangeTotalAdditionalCosts if
            // 1. product is not selected, 2. location is not selected
            // 3. additional cost name is not selected, 4. quantity and quantityUom not selected
            if(!(additionalCost && product && product.product && product.product.id > 0
                    && ctrl.data && ctrl.data.location && ctrl.data.location.id > 0
                    && ((additionalCost.additionalCost && additionalCost.additionalCost.locationid > 0)
                    || additionalCost.locationAdditionalCostId > 0)
                    && additionalCost.costType && additionalCost.costType.id > 0
                    && additionalCost.confirmedQuantity > 0 && additionalCost.quantityUom && additionalCost.quantityUom.id > 0)) {
                return;
            }
            let productId = product.product.id;
            if(product.product && product.tempProduct && product.product.id != product.tempProduct.id) {
                productId = product.tempProduct.id;
            }
            if (additionalCost.costType.id == COST_TYPE_IDS.RANGE || additionalCost.costType.id == COST_TYPE_IDS.TOTAL) {
                let locAddCost = ctrl.locationAdditionalCosts.find(x => {
                    if(x.id == additionalCost.additionalCost.id && x.costType.id == additionalCost.costType.id &&
                        (!x.locationid || !additionalCost.additionalCost.locationid || x.locationid == additionalCost.additionalCost.locationid)) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if(!locAddCost) {
                    return;
                }
                additionalCost.extras = locAddCost.extras || additionalCost.extras ||0;
                additionalCost.price = locAddCost.price || additionalCost.price || 0;
                additionalCost.amount = locAddCost.amount || additionalCost.amount || 0;
                additionalCost.locationAdditionalCostId = additionalCost?.locationAdditionalCostId ?? additionalCost?.additionalCost?.locationid;

                let apiJSON = {
                    Payload: {
                        Order: null,
                        Filters: [
                            {
                                ColumnName: 'ProductId',
                                Value: productId
                            },
                            {
                                ColumnName: 'LocationId',
                                Value: ctrl.data.location.id
                            },
                            {
                                ColumnName: 'AdditionalCostId',
                                Value: additionalCost.locationAdditionalCostId
                            },
                            {
                                ColumnName: 'Qty',
                                Value: additionalCost.confirmedQuantity
                            },
                            {
                                ColumnName: 'QtyUomId',
                                Value: additionalCost.quantityUom.id
                            }
                        ],
                        Pagination: {
                            Skip: 0,
                            Take: 25
                        },
                        SearchText: null
                    }
                };
                Factory_Master.getRangeTotalAdditionalCosts(apiJSON, function(response) {
                    if(response && response.data && response.data.payload) {
                        let addCostIdx = product.additionalCosts.indexOf(additionalCost);
                        additionalCost.price = response.data.payload.price || 0;
                        additionalCost = calculateAdditionalCostAmounts(additionalCost, product);
                        product.additionalCosts[addCostIdx] = additionalCost;
                        ctrl.evaluateAdditionalCostList();
                    }
                });
            }
        }

        ctrl.checkBqsForAllProducts = function(isServiceChanged) {
            for (let i = 0; i < ctrl.data.products.length; i++) {
                if (!isServiceChanged) {
                    ctrl.checkBQSConversionCheckbox(ctrl.data.products[i], convertDecimalSeparatorStringToNumber(ctrl.data.products[i].confirmedQuantity) * ctrl.data.products[i].confirmedQtyProdForBqs);
                } else {
                    ctrl.checkBQSWhenChangeService(ctrl.data.products[i], convertDecimalSeparatorStringToNumber(ctrl.data.products[i].confirmedQuantity) * ctrl.data.products[i].confirmedQtyProdForBqs); 
                }
            }
         }

        ctrl.checkBQSWhenChangeService = function(product, confirmedQuantityForBqs) {
            if (ctrl.loadOrderScreen) {
                return;
            }
            if (ctrl.data.is2MDelivery) {
                console.log(product);
                let convertStringToDecimal = convertDecimalSeparatorStringToNumber(product.confirmedQuantity);
                if (product.productType && product.productType.productTypeMOTGroup && (product.productType.productTypeMOTGroup.name == 'LSFO' || product.productType.productTypeMOTGroup.name == 'IFO')) {
                    if (convertDecimalSeparatorStringToNumber(confirmedQuantityForBqs) > 200) {
                        product.isBqs = true;
                        return;
                          
                    }
                } else  if (product.productType && product.productType.productTypeMOTGroup && (product.productType.productTypeMOTGroup.name == 'LSDIS' || product.productType.productTypeMOTGroup.name == 'DIS')) {
                    if (convertDecimalSeparatorStringToNumber(confirmedQuantityForBqs) > 50) {
                        product.isBqs = true;
                        return;
                       
                    }
                }
            }

            product.isBqs = false; 

        }

        ctrl.checkBQSCheckbox = function(product) {
            if (ctrl.loadOrderScreen) {
                return;
            }
            if (ctrl.data.is2MDelivery) {
                let convertStringToDecimal = convertDecimalSeparatorStringToNumber(product.confirmedQuantity);
                if (product.productType && product.productType.productTypeMOTGroup && (product.productType.productTypeMOTGroup.name == 'LSFO' || product.productType.productTypeMOTGroup.name == 'IFO')) {
                    if (convertDecimalSeparatorStringToNumber(product.confirmedQuantity) > 200 && (product.quantityUom && product.quantityUom.id == 5)) {
                        product.isBqs = true;
                        return;
                    }
                } else  if (product.productType && product.productType.productTypeMOTGroup && (product.productType.productTypeMOTGroup.name == 'LSDIS' || product.productType.productTypeMOTGroup.name == 'DIS')) {
                    if (convertDecimalSeparatorStringToNumber(product.confirmedQuantity) > 50 && (product.quantityUom && product.quantityUom.id == 5)) {
                        product.isBqs = true;
                        return;      
                    }
                } 
                product.isBqs = false;
            } 

        }


        ctrl.checkBQSFromProducts = function() {
            let isSurveyorMandatory = false;
            ctrl.hasBQSCheckedInProducts =  false;
            if (ctrl.data.products) {
                for (let i = 0; i < ctrl.data.products.length; i++) {
                    if (ctrl.data.products[i].isBqs) {
                        ctrl.hasBQSCheckedInProducts =  true;
                        return true;
                    }
                }
            }

        }

        function convertDecimalSeparatorStringToNumber(number) {
            var numberToReturn = number;
            var decimalSeparator, thousandsSeparator;
            if (typeof number == 'string') {
                if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
                    if (number.indexOf(',') > number.indexOf('.')) {
                        decimalSeparator = ',';
                        thousandsSeparator = '.';
                    } else {
                        thousandsSeparator = ',';
                        decimalSeparator = '.';
                    }
                    numberToReturn = parseFloat(parseFloat(number.split(decimalSeparator)[0].replace(new RegExp(thousandsSeparator, 'g'), '')) + parseFloat(`0.${number.split(decimalSeparator)[1]}`));
                } else if (number.indexOf(',') != -1) {
                    numberToReturn = parseFloat(number.replace(new RegExp(',', 'g'), ''));
                } else {
                    numberToReturn = parseFloat(number);
                }
            }
            if (isNaN(numberToReturn)) {
                numberToReturn = 0;
            }
            return parseFloat(numberToReturn);
        }

        /* Capture reason for change */

        ctrl.captureReasonModal = (productIndex, changedFieldName, modelProperty) => {
            if(ctrl.data.id == 0) {
                return false;
            }
            fieldChanged = ctrl.checkIfFieldChanged(productIndex, changedFieldName, modelProperty);
            if (!fieldChanged) {
                return false
            }

            ctrl.captureReasonModalData = {};
            ctrl.captureReasonModalData.changedFieldName = changedFieldName;
            ctrl.captureReasonModalData.productIndex = productIndex;
            ctrl.captureReasonModalData.field = ctrl.getReasonField(changedFieldName);
            ctrl.captureReasonModalData.requestLocation = null;
            ctrl.captureReasonModalData.product = ctrl.data.products[productIndex].product.id;
        }

        ctrl.buildReasonDataStructure = (locationI) => {
            console.log(ctrl.captureReasonModalData);
            data = {
                "id": 0,
                "orderId" : ctrl.data.id,
                "requestLocation" : ctrl.captureReasonModalData.requestLocation,
                "product" : ctrl.captureReasonModalData.product,
                "fieldName" : ctrl.captureReasonModalData.field,
                "reasonName" : ctrl.captureReasonModalData.reason,
                "comments" : ctrl.captureReasonModalData.comments

            }
            return data;
        }

        ctrl.checkIfFieldChanged = (productIndex, changedFieldName, modelProperty) => {
            fieldChanged = true;
            if (!ctrl.data.products[productIndex].tempReasons) {
                ctrl.data.products[productIndex].tempReasons = {};
            }
            if(!ctrl.data.products[productIndex].id){ return false}
            if (typeof(ctrl.getOrderinitialSnapshot.products[productIndex][modelProperty]) == "object") {
                if (ctrl.data.products[productIndex][modelProperty].id == ctrl.getOrderinitialSnapshot.products[productIndex][modelProperty].id) {
                    ctrl.data.products[productIndex].tempReasons[changedFieldName] = null;
                    ctrl.captureReasonModalData = null;
                    fieldChanged = false;
                }
            } else {
                if (ctrl.data.products[productIndex][modelProperty] == ctrl.getOrderinitialSnapshot.products[productIndex][modelProperty]) {
                    ctrl.data.products[productIndex].tempReasons[changedFieldName] = null;
                    ctrl.captureReasonModalData = null;
                    fieldChanged = false;
                }                    
            } 
            return fieldChanged;
        }     
        
        ctrl.getReasonField = (fieldName) => {
            var foundField = false;
            $.each(ctrl.listsCache.FieldName, (k,v) => {
                if (v.name == fieldName) {
                    foundField = v;
                }
            })
            return foundField;
        } 
        
        ctrl.saveCapturedReason = () => {
            if(!ctrl.captureReasonModalData.reason) {
                toastr.error("Please select a reason for change");
                return;
            }  
            if(ctrl.captureReasonModalData.reason.name == "Other" && !ctrl.captureReasonModalData.comments ) {
                toastr.error("Please select a comment for the reason");
                return;
            }  

            if (!ctrl.data.products[ctrl.captureReasonModalData.productIndex].tempReasons) {
                ctrl.data.products[ctrl.captureReasonModalData.productIndex].tempReasons = {}
            }
            ctrl.data.products[ctrl.captureReasonModalData.productIndex].tempReasons[ctrl.captureReasonModalData.changedFieldName] = ctrl.buildReasonDataStructure();
            ctrl.captureReasonModalData = null;
        }    
        

        ctrl.prepareReasonsForSave = (payload) => {

            $.each(payload.products, (k,v) => {
                if (v.tempReasons) {
                    Object.keys(v.tempReasons).forEach(key => {
                        if( v.tempReasons[key] ) {
                            payload.reasons.push(v.tempReasons[key]);
                        }
                    });                    
                }
            })
            return payload;
            
        }        
        /* END Capture reason for change */


        $(document).ready(function () {
            $('.page-container').css('display', 'revert');
            $('.page-content-wrapper').css('display', 'revert');

            console.log($('.page-container'));
            console.log($('.page-content-wrapper'));
        });
    }
]);
angular.module('shiptech.pages').component('newOrder', {
    templateUrl: 'pages/new-order/views/new-order-component.html',
    controller: 'NewOrderController'
});


angular.module('shiptech.pages').filter('aplicableCostForProduct', [ AplicableCostForProduct ]);

function AplicableCostForProduct() {
    return function(arr) {
        let ret = [];
        if(typeof arr != 'undefined') {
            if(arr.length > 0) {
                $.each(arr, (_, val) => {
                    if(val) {
                        if(val.product && val.product.name != '') {
                            ret.push(val);
                        }
                    }
                });
            }
        }
        return ret;
    };
}

/**
 * ScreenLayout_Controller Controller
 */ 

APP_MASTERS.controller("ScreenLayout_Controller", [
    "API",
    "$tenantSettings",
    "tenantService",
    "$scope",
    "$rootScope",
    "$sce",
    "$Api_Service",
    "Factory_Master",
    "$state",
    "$location",
    "$q",
    "$compile",
    "$timeout",
    "$interval",
    "$templateCache",
    "$listsCache",
    "$uibModal",
    "uibDateParser",
    "uiGridConstants",
    "$filter",
    "$http",
    "$window",
    "$controller",
    "payloadDataModel",
    "statusColors",
    "screenLoader",
    "$parse",
    "orderModel",
    function(API, $tenantSettings, tenantService, $scope, $rootScope, $sce, $Api_Service, Factory_Master, $state, $location, $q, $compile, $timeout, $interval, $templateCache, $listsCache, $uibModal, uibDateParser, uiGridConstants, $filter, $http, $window, $controller, payloadDataModel, statusColors, screenLoader, $parse, orderModel) {


    	var vm = $scope.vm
		vm.entity_id = $state.params.entity_id;
   //  	if ($scope.CM) {
			// var vm = angular.extend($scope.CM, vm);
   //  	}
		// var vm = this;


		onlyInScreenLayout_Controller = "ScreenLayout_Controller";

        // if ($state.params.path) {
        //     vm.app_id = $state.params.path[0].uisref.split(".")[0];
        // }
        // if ($scope.screen) {
        //     vm.screen_id = $scope.screen;
        // } else {
        //     vm.screen_id = $state.params.screen_id;
        // }		

        // if (vm.app_id == "invoices") {
	       //  vm.dynamicController = "Controller_Master as CM";
        // }

        if ($state.params.path) {
            vm.app_id = $state.params.path[0].uisref.split(".")[0];
        }
        if ($scope.screen) {
            vm.screen_id = $scope.screen;
        } else {
            vm.screen_id = $state.params.screen_id;
        }

		// ctrl = $controller('Controller_Invoice');

        vm.get_master_entity = function(screenChild) {
            if (localStorage.getItem('createResaleCreditNoteFromInvoiceClaims')) {
                Factory_Master.create_credit_note(JSON.parse(localStorage.getItem('createResaleCreditNoteFromInvoiceClaims')), function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            toastr.success(response.message);
                            $scope.formValues = response.data;
                            // $location.path(vm.app_id + '/claims/edit/');
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                });
                $rootScope.transportData = null;
                localStorage.removeItem("createResaleCreditNoteFromInvoiceClaims");
            }

            if (localStorage.getItem('createDebunkerCreditNoteFromInvoiceClaims')) {
                Factory_Master.create_credit_note(JSON.parse(localStorage.getItem('createDebunkerCreditNoteFromInvoiceClaims')), function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            toastr.success(response.message);
                            $scope.formValues = response.data;
                            // $location.path(vm.app_id + '/claims/edit/');
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                });
                $rootScope.transportData = null;
                localStorage.removeItem("createDebunkerCreditNoteFromInvoiceClaims");
            }

            if (localStorage.getItem('createCreditNoteFromInvoiceClaims')) {
                Factory_Master.create_credit_note(JSON.parse(localStorage.getItem('createCreditNoteFromInvoiceClaims')), function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            toastr.success(response.message);
                            $scope.formValues = response.data;
                            // $location.path(vm.app_id + '/claims/edit/');
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                });
                $rootScope.transportData = null;
                localStorage.removeItem("createCreditNoteFromInvoiceClaims");
            }

         	if (localStorage.getItem("invoiceFromDelivery")) {
         		// $rootScope.transportData = angular.copy(JSON.parse(localStorage.getItem("invoiceFromDelivery")));

		        Factory_Master.create_invoice_from_delivery(angular.copy(JSON.parse(localStorage.getItem("invoiceFromDelivery"))), function(response) {
		            if (response) {
		                if (response.status == true) {
		                    $scope.loaded = true;
		                    $rootScope.transportData = response.data;
		                    if(!$rootScope.transportData.paymentDate) {
		                        $rootScope.transportData.paymentDate = $rootScope.transportData.workingDueDate;
		                    }
                            $scope.formValues = angular.copy($rootScope.transportData);
	                        $scope.triggerChangeFields("InvoiceRateCurrency");
	                        if ($scope.formValues.costDetails) {
		                        if ($scope.formValues.costDetails.length > 0) {
		                            $.each($scope.formValues.costDetails, function(k, v) {
		                                if (v.product == null || v.isAllProductsCost) {
		                                    v.product = {
		                                        id: -1,
		                                        name: "All"
		                                    };
		                                }
		                                if (v.product.id != -1) {
						                	v.product.productId = angular.copy(v.product.id);
						                	if (v.deliveryProductId) {
							                	v.product.id = v.deliveryProductId;
						                	}

						                }
		                            });
		                        }
	                        }		                    
		                } else {
		                    $scope.loaded = true;
		                    toastr.error(response.message);
		                }
		            }
                    $rootScope.transportData = null;
					localStorage.removeItem("invoiceFromDelivery");
		        })

         	}

         	if (localStorage.getItem("reconQuantityDispute")) {

	            var data = angular.copy(JSON.parse(localStorage.getItem("reconQuantityDispute")));
                localStorage.removeItem('reconQuantityDispute');
	            Factory_Master.raise_claim(data, function(response) {
	                if (response) {
	                    if (response.status == true) {
	                        $scope.formValues = response.data;
	                        localStorage.removeItem('reconQuantityDispute');
	                        data = angular.fromJson(response);
	                    } else {
	                        $scope.loaded = true;
	                        toastr.error(response.message);
	                    }
	                }
	            })

         	}

         	if (localStorage.getItem("raiseClaimFromLabsPayload")) {

	            var data = angular.copy(JSON.parse(localStorage.getItem("raiseClaimFromLabsPayload")));
                localStorage.removeItem('raiseClaimFromLabsPayload');
		        Factory_Master.raise_claim(data, function (response) {
		            if (response) {
		                if (response.status == true) {
							$scope.formValues = response.data;
                            localStorage.removeItem('raiseClaimFromLabsPayload');
                            $scope.triggerChangeFields('OrderID');
		                } else {
		                    $scope.loaded = true;
		                    toastr.error(response.message);
		                }
		            }
		        })
		        vm.entity_id = "0"
		        // return false;
         	}


         	if (localStorage.getItem("invoice_createFinalInvoice")) {
	            var invoiceType = angular.copy(JSON.parse(localStorage.getItem("invoice_createFinalInvoice"))).invoiceType;
	            var entity_id = angular.copy(JSON.parse(localStorage.getItem("invoice_createFinalInvoice"))).entityId;
                localStorage.removeItem('invoice_createFinalInvoice');
		        Factory_Master.get_master_entity(entity_id, vm.screen_id, vm.app_id, function(callback2) {
		            if (callback2) {
		                

		                tempformValues = callback2;
					    $.each(tempformValues.productDetails, function(ik,iv){
							tempformValues.productDetails[ik].pricingDate = null;
					    })
		                $scope.formValues = tempformValues;
		                /*
		                if ($scope.formValues.documentType.internalName == "ProvisionalInvoice") {
			                !$scope.formValues.paymentDate ? $scope.formValues.paymentDate = $scope.formValues.workingDueDate : '';
		                }
		                */
	    

	                    $scope.formValues.invoiceSummary.provisionalInvoiceAmount = angular.copy($scope.formValues.invoiceSummary.invoiceAmountGrandTotal)
		                
				        $scope.formValues.id = 0;
				        $scope.formValues.invoiceDetails = null;
				        $scope.formValues.documentNo = null;
				        $scope.formValues.dueDate = null;
				        $scope.formValues.invoiceDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss').split("T")[0] + "T00:00:00";
				        $scope.formValues.invoiceSummary.deductions = null;
				        // $scope.formValues.paymentDate = null;
				        $scope.formValues.accountNumber = null;
				        $scope.formValues.paymentDetails.paidAmount = null;
				        $scope.formValues.documentType = invoiceType;
				        $scope.formValues.paymentDetails = null;
				        $scope.formValues.invoiceDetails = null;
				        $scope.formValues.sellerInvoiceNo = null;
				        $scope.formValues.receivedDate = null;
				        $scope.formValues.manualDueDate = null;
				        $scope.formValues.sellerInvoiceDate = null;
				        $scope.formValues.sellerDueDate = null;
				        $scope.formValues.approvedDate = null;
				        // $scope.formValues.invoiceRateCurrency = null;
				        $scope.formValues.backOfficeComments = null;
				        $scope.formValues.invoiceSummary.invoiceAmountGrandTotal = null;
				        $scope.formValues.invoiceSummary.estimatedAmountGrandTotal = null;
				        $scope.formValues.invoiceSummary.totalDifference = null;
				        $scope.formValues.status = null;
				        $scope.formValues.customStatus = null;
		                $scope.formValues.invoiceSummary.provisionalInvoiceNo = entity_id;
				        $scope.formValues.accountancyDate = null;
				        // $scope.formValues.counterpartyDetails.paymentTerm = null;
		                
		                $scope.formValues.paymentDetails = {};     
		                // $scope.formValues.paymentDetails.paidAmount = $scope.formValues.invoiceSummary.provisionalInvoiceAmount;
                        // $scope.formValues.paymentDetails.paidAmount = null;
		           
		                if (tempformValues.invoiceSummary.invoiceAmountGrandTotal == null) {
		                    invoiceAmountGrandTotal = 0
		                } else {
		                    invoiceAmountGrandTotal = 0
		                }
		                if (tempformValues.invoiceSummary.deductions == null) {
		                    deductions = 0
		                } else {
		                    deductions = 0
		                }
		                $scope.formValues.invoiceSummary.netPayable = invoiceAmountGrandTotal - deductions;
		                $.each($scope.formValues.productDetails, function(k, v) {
		                    v.id = 0;
		                    // v.invoiceQuantity = null;
		                    v.invoiceRate = 0;
		                    v.description = null;
		                    // v.invoiceRateCurrency = null;
		                    v.pricingDate = null;
		                    v.invoiceAmount = null;
		                    v.reconStatus = null;
		                    v.amountInInvoice = null;
		                })
		                $.each($scope.formValues.costDetails, function(k, v) {
		                    v.id = 0;
		                })
				        if ($scope.formValues.costDetails) {
				            $.each($scope.formValues.costDetails, function(k, v) {
			                    v.invoiceRate = null;
			                    v.invoiceExtras = null;
			                    v.description = null;
			                    v.invoiceAmount = null;
				                if (v.product) {
					                if (v.product.id != -1) {
					                	if (v.product.id != v.deliveryProductId) {
						                	v.product.productId = angular.copy(v.product.id);
						                	v.product.id = angular.copy(v.deliveryProductId);
					                	}
					                }
				                } else {
				                	v.product = {
				                		id : -1,
				                	}
				                }
				            });                
				        }

		                var deliveryProductIds = [];
		                $.each($scope.formValues.productDetails, function(k, v) {
		                    deliveryProductIds.push(v.deliveryProductId);
		                });
		                var payload = {
		                    "Payload": {
		                        "DeliveryProductIds": deliveryProductIds,
		                        "OrderId": $scope.formValues.orderDetails.order.id
		                    }
		                }
		                Factory_Master.finalInvoiceDuedates(payload, function(callback3) {
		                    if(callback3) {
		                        $scope.formValues.dueDate = callback3.dueDate;
		                        $scope.formValues.paymentDate = callback3.paymentDate;
		                        $scope.formValues.workingDueDate = callback3.workingDueDate;
		                    }
		                    orderModel.get($scope.formValues.orderDetails.order.id).then(function (callback4) {
								$scope.formValues.counterpartyDetails.paymentTerm = callback4.payload.paymentTerm;

							    $scope.formValues.orderDetails.orderDate = callback4.payload.orderDate;
							    $scope.formValues.deliveryDate = callback4.payload.deliveryDate;
							    $scope.formValues.orderDetails.carrierCompany = callback4.payload.carrierCompany;
							    $scope.formValues.orderDetails.paymentCompany = callback4.payload.paymentCompany;
							    if (callback4.payload.vessel) {
								    $scope.formValues.orderDetails.vesselName = callback4.payload.vessel.name;
							    } else {
								    $scope.formValues.orderDetails.vesselName = null;
							    }
							    $scope.formValues.orderDetails.vesselCode = callback4.payload.vesselCode;

							    // $scope.formValues.orderDetails.portName = callback4.payload;

							    $scope.formValues.orderDetails.eta = callback4.payload.eta;

							    if (callback4.payload.buyer) {
								    $scope.formValues.orderDetails.buyerName = callback4.payload.buyer.name;
							    } else {
								    $scope.formValues.orderDetails.buyerName = null;
							    }
							    if (callback4.payload.trader) {
								    $scope.formValues.orderDetails.traderName = callback4.payload.trader.name;
							    } else {
								    $scope.formValues.orderDetails.traderName = null;
							    }
							    $.each($scope.formValues.productDetails, function(ik,iv){
								    $.each(callback4.payload.products, function(ok,ov){
										if (iv.orderProductId == ov.id) {
											$scope.formValues.productDetails[ik].pricingDate = ov.pricingDate;
										}
								    })
							    })
							    //$scope.formValues.orderDetails.frontOfficeComments = callback4.payload;

								for (var i = 0; i < callback4.payload.products.length; i++) {
									if (callback4.payload.products[i].currency) {
						                $scope.formValues.invoiceRateCurrency = callback4.payload.products[i].currency;
						                $scope.triggerChangeFields("InvoiceRateCurrency");
						                break;
									}
								}
		                    });
		                });
		            }
		        });
         	}
         	
         	if (localStorage.getItem("invoice_createFinalInvoiceFromEditPage")) {
	            var invoiceType = angular.copy(JSON.parse(localStorage.getItem("invoice_createFinalInvoiceFromEditPage"))).invoiceType;
	            var entity_id = angular.copy(JSON.parse(localStorage.getItem("invoice_createFinalInvoiceFromEditPage"))).entityId;
                localStorage.removeItem('invoice_createFinalInvoiceFromEditPage');
                Factory_Master.get_master_entity(entity_id, vm.screen_id, vm.app_id, function(callback2) {
		            if (callback2) { 
		                
		                tempformValues = callback2;
		                $scope.formValues = tempformValues;
		                if ($scope.formValues.documentType.internalName == "ProvisionalInvoice") {
			                !$scope.formValues.paymentDate ? $scope.formValues.paymentDate = $scope.formValues.workingDueDate : '';
		                }
		                
				        $scope.formValues.id = 0;
				        $scope.formValues.invoiceDetails = null;
				        $scope.formValues.documentType = invoiceType;
				        $scope.formValues.paymentDetails = null;
				        $scope.formValues.invoiceDetails = null;
				        $scope.formValues.sellerInvoiceNo = null;
				        $scope.formValues.receivedDate = null;
				        $scope.formValues.manualDueDate = null;
				        $scope.formValues.sellerInvoiceDate = null;
				        $scope.formValues.sellerDueDate = null;
                        $scope.formValues.approvedDate = null;
                        // $scope.formValues.invoiceDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss').split("T")[0] + "T00:00:00";
				        // $scope.formValues.invoiceRateCurrency = null;
                        $scope.formValues.backOfficeComments = null;
                        $scope.formValues.invoiceSummary.invoiceAmountGrandTotal = null
                        $scope.formValues.invoiceSummary.estimatedAmountGrandTotal = null
                        $scope.formValues.invoiceSummary.totalDifference = null
                        $scope.formValues.status = null
                        $scope.formValues.customStatus = null
		                $scope.formValues.invoiceSummary.provisionalInvoiceNo = null;
                        $scope.formValues.accountancyDate = null;
                        $scope.formValues.counterpartyDetails.paymentTerm = null;
                        $scope.formValues.paymentDetails = {};
                        $scope.formValues.paymentDetails.paidAmount = null;
                        // $scope.formValues.paymentDetails.paidAmount = $scope.formValues.invoiceSummary.provisionalInvoiceAmount;
		           
		                if (tempformValues.invoiceSummary.invoiceAmountGrandTotal == null) {
		                    invoiceAmountGrandTotal = 0
		                } else {
		                    invoiceAmountGrandTotal = 0
		                }
		                if (tempformValues.invoiceSummary.provisionalInvoiceAmount == null) {
		                    provisionalInvoiceAmount = 0
		                } else {
		                    provisionalInvoiceAmount = 0
		                }
		                if (tempformValues.invoiceSummary.deductions == null) {
		                    deductions = 0
		                } else {
		                    deductions = 0
		                }
		                $scope.formValues.invoiceSummary.netPayable = invoiceAmountGrandTotal - deductions;
		                $scope.formValues.costDetails = [];
		                $scope.formValues.productDetails = [];
	                    orderModel.get($scope.formValues.orderDetails.order.id).then(function (callback4) {
							$scope.formValues.counterpartyDetails.paymentTerm = callback4.payload.paymentTerm;
							for (var i = 0; i < callback4.payload.products.length; i++) {
								if (callback4.payload.products[i].currency) {
					                $scope.formValues.invoiceRateCurrency = callback4.payload.products[i].currency;
					                break;
								}
							}
			                $location.path('invoices/invoice/edit/');
	                    });
		            }
		        });
         	}

         	if (localStorage.getItem("invoice_createInvoiceFromEdit") && (vm.entity_id == "" || vm.entity_id == 0)) {

	            var data = angular.copy(JSON.parse(localStorage.getItem("invoice_createInvoiceFromEdit")));
				$scope.formValues = data;
                
			    $.each($scope.formValues.productDetails, function(ik,iv){
					$scope.formValues.productDetails[ik].pricingDate = null;
			    })                
                var deliveryProductIds = [];
                $.each(data.productDetails, function(k, v) {
                    deliveryProductIds.push(v.deliveryProductId);
                });
                var payload = {
                    "Payload": {
                        "DeliveryProductIds": deliveryProductIds,
                        "OrderId": data.orderDetails.order.id
                    }
                }
                Factory_Master.finalInvoiceDuedates(payload, function(callback3) {
                    if(callback3) {
                        $scope.formValues.dueDate = callback3.dueDate;
                        $scope.formValues.paymentDate = callback3.paymentDate;
                        $scope.formValues.workingDueDate = callback3.workingDueDate;
                    }
                    orderModel.get($scope.formValues.orderDetails.order.id).then(function (callback4) {
						$scope.formValues.counterpartyDetails.paymentTerm = callback4.payload.paymentTerm;

					    $scope.formValues.orderDetails.orderDate = callback4.payload.orderDate;
					    $scope.formValues.deliveryDate = callback4.payload.deliveryDate;
					    $scope.formValues.orderDetails.carrierCompany = callback4.payload.carrierCompany;
					    $scope.formValues.orderDetails.paymentCompany = callback4.payload.paymentCompany;
					    if (callback4.payload.vessel) {
						    $scope.formValues.orderDetails.vesselName = callback4.payload.vessel.name;
					    } else {
						    $scope.formValues.orderDetails.vesselName = null;
					    }
					    $scope.formValues.orderDetails.vesselCode = callback4.payload.vesselCode;

					    // $scope.formValues.orderDetails.portName = callback4.payload;

					    $scope.formValues.orderDetails.eta = callback4.payload.eta;

					    if (callback4.payload.buyer) {
						    $scope.formValues.orderDetails.buyerName = callback4.payload.buyer.name;
					    } else {
						    $scope.formValues.orderDetails.buyerName = null;
					    }
					    if (callback4.payload.trader) {
						    $scope.formValues.orderDetails.traderName = callback4.payload.trader.name;
					    } else {
						    $scope.formValues.orderDetails.traderName = null;
					    }
					    $.each($scope.formValues.productDetails, function(ik,iv){
						    $.each(callback4.payload.products, function(ok,ov){
								if (iv.orderProductId == ov.id) {
									$scope.formValues.productDetails[ik].pricingDate = ov.pricingDate;
								}
						    })
					    })
					    //$scope.formValues.orderDetails.frontOfficeComments = callback4.payload;

						for (var i = 0; i < callback4.payload.products.length; i++) {
							if (callback4.payload.products[i].currency) {
				                $scope.formValues.invoiceRateCurrency = callback4.payload.products[i].currency;
				                $scope.triggerChangeFields("InvoiceRateCurrency");
				                break;
							}
						}
                    });
                });
                localStorage.removeItem('invoice_createInvoiceFromEdit');
         	}


            vm.get_master_structure(screenChild);
            // console.log(screenChild);
            setTimeout(function() {
                vm.addHeadeActions();
            }, 10);
            if ($scope.entity == -1) {
                vm.entity_id = "";
            } else if ($scope.entity > 0) {
                vm.entity_id = $scope.entity;
            } else {
                vm.entity_id = vm.entity_id;
            }
        	if (vm.entity_id == "") {
        		if (vm.app_id == "masters" && vm.screen_id == "location") {
        			$scope.formValues.portType = {id: 1};
        			$scope.formValues.displayPortInMap = true;
        		}
	          	if (vm.app_id === 'masters' && vm.screen_id === 'service') {
	                $scope.formValues.hsfoUom = $scope.tenantSetting.tenantFormats.uom;
	                $scope.formValues.dmaUom = $scope.tenantSetting.tenantFormats.uom;
	                $scope.formValues.lsfoUom = $scope.tenantSetting.tenantFormats.uom;
	            }
        	}

            if (vm.entity_id == "0") {
            } else {
                // $rootScope.transportData este variabila globala folosita pentru cazurile in care avem nevoie
                // sa populam un ecran de create, atunci cand datele vin in urma unei actiuni.
                if ($rootScope.transportData != null) {
                    $scope.isCopiedEntity = true;
                    $scope.formValues = $rootScope.transportData;
                    $rootScope.transportData = null;

                   
               
                    if (vm.app_id == "invoices" && vm.screen_id == "invoice") {
						    $scope.triggerChangeFields("InvoiceRateCurrency");
	                        if ($scope.formValues.costDetails) {
		                        if ($scope.formValues.costDetails.length > 0) {
		                            $.each($scope.formValues.costDetails, function(k, v) {
		                                if (v.product == null || v.isAllProductsCost) {
		                                    v.product = {
		                                        id: -1,
		                                        name: "All"
		                                    };
		                                } else {
						                	if (v.product.id != v.deliveryProductId) {
							                	v.product.productId = angular.copy(v.product.id);
							                	v.product.id = angular.copy(v.deliveryProductId);
						                	}						                	
		                                }
		                            });
		                        }
	                        }	
                    }
                } else {
                    if (localStorage.getItem(vm.app_id + vm.screen_id + "_copy")) {
                        id = angular.copy(localStorage.getItem(vm.app_id + vm.screen_id + "_copy"));
                        localStorage.removeItem(vm.app_id + vm.screen_id + "_copy");
                        if (id > 0) {
                            $scope.copiedId = id;
                            
                            Factory_Master.get_master_entity(id, vm.screen_id, vm.app_id, function(response) {
                                if (response) {
                                    $scope.formValues = response;
                                    $scope.formValues.lastModifiedBy = null;
                                    $scope.formValues.lastModifiedByUser = null;
                                    $scope.formValues.lastModifiedOn = null;
                                
                                    $.each($scope.formValues, function(key, val) {
                                        if (val && angular.isArray(val)) {
                                            $.each(val, function(key1, val1) {
                                                if (val && val1 && val1.hasOwnProperty("isDeleted")) {
                                                	if (vm.app_id == "labs" && vm.screen_id == "labresult") {
                                                		response[key][0].id = 0;
                                                	} else if (vm.app_id != "contracts" && vm.screen_id != "contract" && vm.app_id != "admin" && vm.screen_id != "users") {
                                                        response[key][key1].id = 0;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    $scope.formValues.id = 0;
                                    if (typeof $scope.formValues.name != "undefined") {
                                        $scope.formValues.name = null;
                                    }
                                    if ($scope.formValues.conversionFactor) {
                                        $scope.formValues.conversionFactor.id = 0;
                                    }
                                    // reset contract status
                                    if (vm.app_id == "contracts" && vm.screen_id == "contract") {
                                        $scope.formValues.status = null;
                                        $.each($scope.formValues.details, function(k, v) {
                                            v.id = 0;
                                        });
                                        $.each($scope.formValues.products, function(k, v) {
                                            v.id = 0;
                                            $.each(v.details, function(k1, v1) {
                                                v1.id = 0;
                                            });
                                            $.each(v.additionalCosts, function(k1, v1) {
                                                v1.id = 0;
                                            });                                            
                                            v.formula = null;
                                            v.mtmFormula = null;
                                            v.price = null;
                                            v.mtmPrice = null;
                                        });
                                        $scope.formValues.summary.plannedQuantity = 0;
                                        $scope.formValues.summary.utilizedQuantity = 0;
                                        $scope.formValues.summary.availableQuantity = $scope.formValues.summary.contractedQuantity;
                                        $scope.formValues.summary.copiedContract = true;
                                        $scope.formValues.createdBy = null;
                                        toastr.info($filter("translate")("Formula and MTM Formula was reset for all products"));
                                    }
                                    if (vm.app_id == "admin" && vm.screen_id == "users") {
                                        $scope.formValues.contactInformation.id = 0;
                                        $scope.formValues.contactInformation.address.id = 0;
                                    }
                                    if (vm.app_id == "admin" && vm.screen_id == "role") {
                                        $scope.formValues.roles.id = 0;
                                        $.each($scope.formValues.roles.rights, function(key,val){
                                            $scope.formValues.roles.rights[key].id = 0;
                                        });
                                    }
                                    if (vm.app_id == "masters" && vm.screen_id == "product") {
                                        $scope.formValues.defaultSpecGroup = null;
                                    }
                                    if (vm.app_id == "claims" && vm.screen_id == "claims") {
                                        $scope.formValues = {};
                                        $scope.formValues.claimsPossibleActions = null;
                                        $scope.formValues.isEditable = true;
                                        $scope.formValues.orderDetails = response.orderDetails;
                                        $scope.formValues.deliveryDate = response.deliveryDate;
                                        $scope.triggerChangeFields("OrderID", "orderDetails.order");
                                    }
                                    if (vm.screen_id == "labresult") {
                                    	if ($scope.formValues.status.name == "Verified" || $scope.formValues.status.name == "Off Spec" || $scope.formValues.status.name == "In Spec") {
                                    		vm.listsCache.LabResultStatus.forEach(function(obj, index) {
                                    			if (obj.name == "New") {
                                					$scope.formValues.orderRelatedLabResults[0].labStatus = obj;
                                					$scope.formValues.status = obj;
                                    			}
                                    		});
                                    	}			             
                                		$scope.formValues.labSealNumberInformation.forEach(function(object) {
                                			object.labResult = null;
                                			object.labSealNumbers.forEach(function(object1) {
                                				object1.id  = 0;
                                				object1.labSealNumberInformation = null;
                                			});

                                		});
                                		$scope.formValues.labTestResults.forEach(function(object) {
                                			object.labResult = null;
                                		});
                                		
                                        vm.checkVerifiedDeliveryFromLabs("loadedData");
                                    }
                                    if (vm.app_id == "masters" && vm.screen_id == "paymentterm") {
                                        vm.checkVerifiedDeliveryFromLabs("loadedData");
                                        $.each($scope.formValues.conditions, function(k,v){
	                                        v.paymentTerm = null	
                                        }) 
                                    }
				                    $("#header_action_verify").attr("disabled", "disabled");
                                    toastr.success("Entity copied");
                                    $scope.$emit("formValues", $scope.formValues);
                                }
                            });
                        }
                    } else {
                        if(vm.entity_id){
                            screenLoader.showLoader();
                        }
                        Factory_Master.get_master_entity(
                            vm.entity_id,
                            vm.screen_id,
                            vm.app_id,
                            function(callback) {
                                screenLoader.hideLoader();
                                if (callback) {
                                    
                                    $scope.formValues = callback;
                                    if(vm.screen_id === 'emaillogs') {
                                        if($scope.formValues.to && typeof($scope.formValues.to) === 'string') {
                                          $scope.formValues.to = $scope.formValues.to.replace(/,/g, ';');
                                        }
                                        if($scope.formValues.cc && typeof($scope.formValues.cc) === 'string') {
                                          $scope.formValues.cc = $scope.formValues.cc.replace(/,/g, ';');
                                        }
                                        if($scope.formValues.bcc && typeof($scope.formValues.bcc) === 'string') {
                                          $scope.formValues.bcc = $scope.formValues.bcc.replace(/,/g, ';');
                                        }
                                    }

                                    if(vm.app_id === 'masters' && vm.screen_id === 'buyer') {
                                      $scope.formValues.showCode = !!$scope.formValues.code;
                                    }
                                    if(vm.app_id === 'masters' && vm.screen_id === 'vessel') {
                                    	$scope.flattenVesselVoyages();
										$scope.initRobTable();
                                    }  




				                    if (vm.app_id == "invoices" && vm.screen_id == "invoice") {
				                        $scope.triggerChangeFields("InvoiceRateCurrency");
				                        if ($scope.formValues.costDetails.length > 0) {
				                            $.each($scope.formValues.costDetails, function(k, v) {
				                                if (v.product == null || v.isAllProductsCost) {
				                                    v.product = {
				                                        id: -1,
				                                        name: "All"
				                                    };
				                                }
				                                if (v.product.id != -1) {
								                	v.product.productId = angular.copy(v.product.id);
								                	// v.product.id = angular.copy(v.deliveryProductId);
								                }
				                            });
				                        }
				                    }				                   
				                     if (vm.app_id == "masters" && vm.screen_id == "additionalcost") {
					                    if($scope.formValues.costType.name == 'Flat' || $scope.formValues.costType.name == 'Unit') {
					                        $scope.formValues.componentType = null;
					                        $('.edit_form_fields_ComponentType_masters').hide();
					                    } else {
					                        $('.edit_form_fields_ComponentType_masters').show();
					                    }
				                    }

                                    $rootScope.$broadcast("formValues", $scope.formValues);
                                    $scope.refreshSelect();
                                    $rootScope.formValuesLoaded = callback;
                                    if (vm.screen_id == "invoice" && vm.app_id == "invoices") {
                                      if(!$scope.formValues.paymentDate) {
                                        $scope.formValues.paymentDate = $scope.formValues.workingDueDate;
                                      }
                                        if ($scope.formValues.costDetails.length > 0) {
                                            $.each($scope.formValues.costDetails, function(k, v) {
                                                if (v.product == null || v.isAllProductsCost) {
                                                    v.product = {
                                                        id: -1,
                                                        name: "All"
                                                    };
                                                }
                                            });
                                        }
                                        $.each($scope.formValues.productDetails, function(k, v) {
                                        	if (v.sapInvoiceAmount) {
                                        		v.invoiceAmount = v.sapInvoiceAmount;
                                        	} else {
                                        		v.invoiceAmount = v.invoiceComputedAmount;
                                        	}
                                        });
                                    }
                                    if (vm.app_id == "labs" && vm.screen_id == "labresult") {
                                        vm.checkVerifiedDeliveryFromLabs("loadedData");
                                    }
                                    if (vm.app_id == "invoices") {
                                        $scope.initInvoiceScreen();
                                    }
                                    if (vm.app_id == "contracts") {
                                        $scope.initContractScreen();
                                    }
                                    if ($location.hash() == "mail") {
                                        $scope.sendEmails();
                                        $location.hash("");
                                    }
                                    if (vm.app_id == "admin" && vm.screen_id == "configuration") {
    	                            	$.each($scope.formValues.email, function(k,v){
		                            		if (v.toEmailsConfiguration) {
		                            			v.toEmailsConfiguration = v.toEmailsConfiguration.split(",");
		                            			tempToEmailsConfiguration = [];
		                            			$.each(v.toEmailsConfiguration, function(tok,tov){
		                            				tempToEmailsConfiguration.push({"id" : parseFloat(tov)});
		                            			})
		                        				$scope.formValues.email[k].toEmailsConfiguration = tempToEmailsConfiguration;
		                            		}
		                            		if (v.ccEmailsConfiguration) {
		                            			v.ccEmailsConfiguration = v.ccEmailsConfiguration.split(",");
		                            			tempCcEmailsConfiguration = [];
		                            			$.each(v.ccEmailsConfiguration, function(tok,tov){
			                            			tempCcEmailsConfiguration.push({"id" : parseFloat(tov)});
		                            			})
		                        				$scope.formValues.email[k].ccEmailsConfiguration = tempCcEmailsConfiguration;
		                            		}     
		                            		if (v.attachmentDocumentTypes) {
		                            			v.attachmentDocumentTypes = v.attachmentDocumentTypes.split(",");
		                            			tempAttachmentDocumentTypes = [];
		                            			$.each(v.attachmentDocumentTypes, function(tok,tov){
			                            			tempAttachmentDocumentTypes.push({"id" : parseFloat(tov)});
		                            			})
		                        				$scope.formValues.email[k].attachmentDocumentTypes = tempAttachmentDocumentTypes;
		                            		}  		                            		                       		
		                            	})
                                    }

                                }
                            },
                            screenChild
                        );
                    }
                    if (localStorage.getItem(vm.app_id + vm.screen_id + "_newEntity")) {
                        screenLoader.hideLoader();
                        data = angular.fromJson(localStorage.getItem(vm.app_id + vm.screen_id + "_newEntity"));
                        localStorage.removeItem(vm.app_id + vm.screen_id + "_newEntity");
                        $scope.formValues = data;
                    }
                }
            }
            $scope.loaded = true;
            $scope.undirtyForm();
        };

        $scope.undirtyForm = function() {
            if (vm.editInstance) {
                vm.editInstance.$pristine = true;
                vm.editInstance.$dirty = false;
                angular.forEach(vm.editInstance, function(input, key) {
                    if (typeof input == "object" && input.$name) {
                        if (input.$pristine) input.$pristine = true;
                        if (input.$dirty) {
                            input.$dirty = false;
                        }
                    }
                });
            }
        };


        vm.addHeadeActions = function() {
            $('.page-content-wrapper a[data-group="extern"]').each(function() {
                if ($(this).attr("data-compiled") == 0) {
                    if ($(this).attr("data-method") != "") {
                        $(this).attr("ng-click", $(this).data("method") + ';submitedAcc("' + $(this).data("method") + '")');
                        $(this).attr("data-method", "");
                        $(this).attr("data-compiled", 1);
                        $compile($(this))($scope);
                    }
                }
            });
            if (vm.app_id == "masters" && vm.screen_id == "counterparty") {
                $(".entity_active").attr("ng-model", "formValues.isDeleted");
            } else {
                $(".entity_active")
                    .attr("ng-checked", "!CM.entity_id || formValues.isDeleted == false")
                    .attr("ng-true-value", "false")
                    .attr("ng-false-value", "true")
                    .attr("ng-model", "formValues.isDeleted");
                $(".completed").attr("ng-model", "formValues.completed");
                if (vm.screen_id == "claimtype") {
                    $(".entity_active").attr("ng-disabled", "formValues.name ? true : false");
                }
            }
            $compile($(".entity_active"))($scope);
            $compile($(".completed"))($scope);
            // added++;
        };

        vm.get_master_structure = function(screenChild) {
            $scope.getAdminConfiguration();
            if (window.location.href.indexOf('structure') != -1) {
                vm.get_master_elements(screenChild);
            }
            var generic_layout = false;
        
            console.log('get_master_structure',$state);
        

            //load default screen and app
            var app_id = vm.app_id;
            var screen_id = vm.screen_id;
        

            //you might not need to change app & screen, but load entity_documents
            if(screenChild == 'entity_documents'){
                // is generic layout (for now, documents only)
                generic_layout = {
                    needed: true,
                    layout: screenChild
                }

                // if app & screen needs to be changed for layout call, match in map (for documents page)
                var entity_documents_map = {
                    "default.view-request-documents": {
                        app: "procurement",
                        screen: "request_entity_documents"
                    },
                    "default.view-group-of-requests-documents": {
                        app: "procurement",
                        screen: "group_of_requests_entity_documents"
                    },
                    "default.view-order-documents": {
                        app: "procurement",
                        screen: "order_entity_documents"
                    },
                    "delivery.documents": {
                        app: "delivery",
                        screen: "entity_documents"
                    },
                    "contracts.documents": {
                        app: "contracts",
                        screen: "entity_documents"
                    },
                    "labs.documents": {
                        app: "labs",
                        screen: "entity_documents"
                    },
                    "claims.documents": {
                        app: "claims",
                        screen: "entity_documents"
                    },
                    "invoices.documents": {
                        app: "invoices",
                        screen: "entity_documents"
                    },
                    "masters.documents": {
                        app: "masters",
                        screen: "entity_documents"
                    }

                }
                if(entity_documents_map[$state.current.name]){
                    app_id = entity_documents_map[$state.current.name].app;
                    screen_id = entity_documents_map[$state.current.name].screen;
                }
            }

            Factory_Master.get_master_structure(app_id, screen_id, generic_layout, vm.isDev, function(callback) {
                if (callback) {
                    screenLoader.hideLoader();
                    $scope.screenId = callback.id;
                    delete callback.id;
                    // debugger;
                    $scope.formFields = callback;
                    // multiple layouts
                    if (callback.children) {
                        if (screenChild) {
                            $scope.formFields = callback.children[screenChild];
                        } else {
                            $scope.formFields = callback.children["edit"];
                        }
                        $scope.updateScreenID = callback.children.id;
                    }
                    // {end} multiple layouts
                    $scope.sortableGroups = [];
                    if (vm.app_id == "invoices") {
                        if ($state.params.screen_id == "claims") {
                            delete $scope.formFields["CostDetails"];
                            delete $scope.formFields["ProductDetails"];
                            delete $scope.formFields["InvoiceSummary"];
                        }
                        if ($state.params.screen_id == "invoice") {
                            delete $scope.formFields["ClaimDetails"];
                        }
                    }
                    if (vm.app_id == "masters" && vm.screen_id == "additionalcost") {
	                    if($scope.formValues.costType.name == 'Flat' || $scope.formValues.costType.name == 'Unit') {
	                        $scope.formValues.componentType = null;
	                        setTimeout(function(){
		                        $('.edit_form_fields_ComponentType_masters').hide();
	                        })
	                    } else {
	                    	setTimeout(function(){
		                        $('.edit_form_fields_ComponentType_masters').show();
	                    	})
	                    }
                    }                    
                    if ($scope.isCreate && vm.screen_id == "counterparty" && vm.app_id == "masters") {
                        $scope.formValues.status = { id: 1 };
                    }
                    $.each($scope.formFields, function(index, value) {
                        $scope.sortableGroups.push(value);
                        $.each(value.children, function(key, val) {
                            val.Active = false;
                            if ($scope.tenantSetting.companyDisplayName.name == "Pool") {
                                val.Label = val.Label.replace("COMPANY", "POOL");
                                val.Label = val.Label.replace("CARRIER", "POOL");
                                val.Label = val.Label.replace("CARRIERS", "POOLS");
                                val.Label = val.Label.replace("COMPANIES", "POOLS");
                            }
                            if ($scope.tenantSetting.serviceDisplayName.name == "Operator") {
                                val.Label = val.Label.replace("SERVICE", "OPERATOR");
                            }
                            // if (val.Label.indexOf(Compan) == "Label") {}
                        });
                    });
                    $rootScope.$broadcast("formFields", $scope.formFields);
                    vm.checkLabelsHeight();
                    if (vm.app_id == "contracts") {
                        $scope.initContractScreen();
                    }
                } else {
                    screenLoader.hideLoader();
                }
            });
        };

        $scope.getAdminConfiguration = function() {
            // console.log(1);
            if (!$rootScope.getAdminConfigurationCall) {
                // console.log("from Master");
                $rootScope.getAdminConfigurationCall = true;
                Factory_Master.get_master_entity(1, "configuration", "admin", function(callback2) {
                    if (callback2) {
                    	$rootScope.$broadcast("adminConfiguration", callback2)
                        $rootScope.getAdminConfigurationCall = false;
                        // console.log("from Master done");
                        vm.adminConfiguration = callback2;
                        $rootScope.adminConfiguration = callback2;
                        $scope.getAdminConfigurationGH(callback2);
                    }
                });
            }
        };

        $scope.checkIfTab = function() {
            $scope.$watch("formFields", function() {
                setTimeout(function() {
                    tab = $(".grp_unit")
                        .children(".tab-pane")
                        .first()
                        .addClass("active in");
                    // console.log(tab);
                    $("#tabs_navigation")
                        .insertBefore(tab)
                        .removeClass("hidden");
                    $("#tabs_navigation ul li")
                        .first()
                        .addClass("active");
                }, 10);
            });
        };

        $scope.triggerModal = function(template, clc, name, id, formvalue, idx, field_name, filter, ctrlData) {
        	if (!clc) {
        		return;
        	}
            tpl = "";

            if (template == "formula") {
                $scope.modal = {
                    clc: "masters_formulalist",
                    app: "masters",
                    screen: "formulalist",
                    name: name,
                    source: id,
                    field_name: field_name
                };
                if (formvalue) {
                    $scope.modal.formvalue = formvalue;
                    $scope.modal.idx = idx;
                }
                if (vm.app_id == "contracts") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "ContractId",
                            Value: vm.entity_id ? vm.entity_id : null
                        }
                    ];
                }
                tpl = $templateCache.get("app-general-components/views/modal_formula.html");
            } else if (template == "alerts") {
                tpl = $templateCache.get("app-general-components/views/modal_alerts.html");
                $scope.modal = {
                    source: clc
                };
            } else if (template == "general") {
                tpl = $templateCache.get("app-general-components/views/modal_general_lookup.html");
                if (clc == "deliveries_transactionstobeinvoiced") {
                    clcs = ["invoices", "transactionstobeinvoiced"];
                } else if (clc == "payableTo") {
                    clcs = ["invoices", "payableTo"];
                } else if (clc == "contactplanning_contractlist") {
                    // clcs = ['procurement','contractplanning_contractlist'];
                } else {
                    if (typeof clc != "undefined") {
                        clcs = clc.split("_");
                    } else {
                        console.log("CLC not defined for modal!");
                        return;
                    }
                }

                $scope.modal = {
                    clc: clc,
                    app: clcs[0],
                    screen: clcs[1],
                    name: name,
                    source: id,
                    field_name: field_name
                };

                if (clc == "PreRequest") {
                    $scope.modal.app = "procurement";
                    $scope.modal.screen = "request_entity_documents";
                    $scope.modal.clc = "entity_documents";
        	    	var transactionTypeId = _.find(vm.listsCache["TransactionType"], function(el){
			    		return el.name == "Request";
			    	}).id;
			    	$scope.modal.filters = [
			    		{
			    			"ColumnName": "ReferenceNo",
			    			"Value": _.get(ctrlData, 'requestId')
			    		},
			    		{
			    			"ColumnName": "TransactionTypeId",
			    			"Value": transactionTypeId
			    		}
		    		]
		    		$scope.filters = $scope.modal.filters;
                }

                if (clc == "Order") {
                    $scope.modal.app = "procurement";
                    $scope.modal.screen = "order_entity_documents";
                    $scope.modal.clc = "entity_documents";
        	    	var transactionTypeId = _.find(vm.listsCache["TransactionType"], function(el){
			    		return el.name == "Order";
			    	}).id;
			    	$scope.modal.filters = [
			    		{
			    			"ColumnName": "ReferenceNo",
			    			"Value": _.get(ctrlData, 'orderId')
			    		},
			    		{
			    			"ColumnName": "TransactionTypeId",
			    			"Value": transactionTypeId
			    		}
		    		]
		    		$scope.filters = $scope.modal.filters;
                }

                if (clc == "group_of_requests_entity_documents") {
                    $scope.modal.app = "procurement";
                    $scope.modal.screen = "request_entity_documents";
                    $scope.modal.clc = "entity_documents";
        	    	var transactionTypeId = _.find(vm.listsCache["TransactionType"], function(el){
			    		return el.name == "Offer";
			    	}).id;
			    	$scope.modal.filters = [
			    		{
			    			"ColumnName": "ReferenceNo",
			    			"Value": _.get($state, 'params.groupId')
			    		},
			    		{
			    			"ColumnName": "TransactionTypeId",
			    			"Value": transactionTypeId
			    		}
		    		]
		    		$scope.filters = $scope.modal.filters;
                }

                if (clc == "claims_entity_documents") {
                    $scope.modal.app = "claims";
                    $scope.modal.screen = "entity_documents";
                    $scope.modal.clc = "entity_documents";
                }

                if (clc == "contracts_entity_documents") {
                    $scope.modal.app = "contracts";
                    $scope.modal.screen = "entity_documents";
                    $scope.modal.clc = "entity_documents";
                }

                if (clc == "labs_entity_documents") {
                    $scope.modal.app = "labs";
                    $scope.modal.screen = "entity_documents";
                    $scope.modal.clc = "entity_documents";
                }

                if (clc == "payableTo") {
                    $scope.modal.app = "masters";
                    $scope.modal.screen = "counterpartylist";
                }
                if (clc == "contactplanning_contractlist") {
                    $scope.modal.filters = filter;
                }
                if (clc == "procurement_bunkerableport" || clc == "procurement_destinationport") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "VesselId",
                            Value: filter.id
                        },
                        {
                            ColumnName: "VesselVoyageDetailId",
                            Value: null
                        }
                    ];
                }
                if (clc == "procurement_requestcounterpartytypes") {
                    var filterString = "";
                    $.each(filter, function(key, val) {
                        filterString += val;
                        filterString += ",";
                    });
                    filterString = filterString.slice(0, -1);
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: filterString
                        }
                    ];
                }
                if (clc == "procurement_buyerlist") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "VesselId",
                            Value: filter.id
                        },
                        {
                            ColumnName: "VesselVoyageDetailId",
                            Value: null
                        }
                    ];
                }
                if(clc == "procurement_productcontractlist"){
                    $scope.modal.filters = filter;
                }
                if (filter == "filter__invoices_order_id") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "Order_Id",
                            Value: $scope.formValues.orderDetails ? $scope.formValues.orderDetails.order.id : ""
                        }
                    ];
                }
                if (filter == "mass") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "UomType",
                            Value: 2
                        }
                    ];
                }
                if (filter == "volume") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "UomType",
                            Value: 3
                        }
                    ];
                }
                if (filter == "sellerList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: "2, 11"
                        }
                    ];
                    $scope.modal.clc = "masters_counterpartylist_seller";
                }
                if (filter == "agentList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: 5
                        }
                    ];
                }
                if (filter == "brokerList") {
                    $scope.modal.clc = "masters_counterpartylist_broker";
                }
                if (filter == "supplierList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: 1
                        }
                    ];
                }
                if (filter == "surveyorList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: 6
                        }
                    ];
                }
                if (filter == "labsList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: 8
                        }
                    ];
                }
                if (filter == "bargeList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: 7
                        }
                    ];
                }
                if (filter == "price_period_filter") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "SystemInstrumentId",
                            Value: $scope.formValues.systemInstrument.id
                        }
                    ];
                }
                if (filter == "filter__vessel_defaultFuelOilProduct") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "ProductId",
                            Value: $scope.formValues.defaultFuelOilProduct.id
                        }
                    ];
                }

                if (filter == "filter__vessel_defaultDistillateProduct") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "ProductId",
                            Value: $scope.formValues.defaultDistillateProduct.id
                        }
                    ];
                }
                if (filter == "filter__vessel_defaultLsfoProduct") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "ProductId",
                            Value: $scope.formValues.defaultLsfoProduct.id
                        }
                    ];
                }
                if (filter == "filter__productDefaultSpec") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "ProductId",
                            Value: $scope.formValues.id
                        }
                    ];
                }
                if (filter == "delivery_order_filter") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "id",
                            Value: "7"
                        }
                    ];
                }
                if (filter == "filter__admin_templates") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "EmailTransactionTypeId",
                            Value: $scope.grid ? $scope.grid.appScope.fVal().formValues.email[idx].transactionType.id : $scope.formValues.email[idx].transactionType.id
                        },
                        {
                            ColumnName: "Process",
                            Value: $scope.grid ? $scope.grid.appScope.fVal().formValues.email[idx].process : $scope.formValues.email[idx].process 
                        }
                    ];
                }
                if (filter == "filter__master_documenttypetemplates") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "EmailTransactionTypeId",
                            Value: $scope.grid.appScope.fVal().formValues.templates[idx].transactionType.id
                        }
                    ];
                }
                if (filter == "filter__vessel_tankProduct") {
                    $scope.modal.filters = [
						{columnValue: "ProductType_Id", ColumnType: "Number", ConditionValue: "=", Values: [$scope.formValues.temp.tanks.productType.id], FilterOperator: 0}
						// {columnValue: "ProductType_Name", ColumnType: "Text", ConditionValue: "LIKE", Values: [$scope.formValues.temp.tanks.productType.name], FilterOperator: 0}
                    ];
                    localStorage.setItem("uniqueModalTableIdentifier", "productsInVesselMaster");
                }                
                if (clc == "masters_marketinstrumentlist") {
                    $scope.modal.screen = "marketinstrument";
                }
                if (formvalue) {
                    $scope.modal.formvalue = formvalue;
                    $scope.modal.idx = idx;
                }
            } else if (template == "sellerrating") {
                $scope.getSellerRating();
                tpl = $templateCache.get("app-general-components/views/modal_sellerrating.html");
            } else if (template == "setResetPassword") {
                tpl = $templateCache.get("app-general-components/views/modal_setPassword.html");
            } else if (template == "labsResultRecon") {
                tpl = $templateCache.get("app-general-components/views/modal_labsResultRecon.html");
            } else if (template == "raiseClaimType") {
                tpl = $templateCache.get("app-general-components/views/modal_raiseClaimType.html");
            } else if (template == "splitDeliveryModal") {
                tpl = $templateCache.get("app-general-components/views/modal_splitDelivery.html");
            }
            if (template == "splitDeliveryModal" || template == "raiseClaimType") {
                $scope.modalInstance = $uibModal.open({
                    template: tpl,
                    size: "full",
                    appendTo: angular.element(document.getElementsByClassName("page-container")),
                    windowTopClass: "fullWidthModal smallModal",
                    scope: $scope //passed current scope to the modal
                });
                return;
            }
            $scope.modalInstance = $uibModal.open({
                template: tpl,
                size: "full",
                appendTo: angular.element(document.getElementsByClassName("page-container")),
                windowTopClass: "fullWidthModal",
                scope: $scope //passed current scope to the modal
            });
        };
    }

]);

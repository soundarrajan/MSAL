/**
 * ScreenLayout_Controller Controller
 */

APP_MASTERS.controller('ScreenLayout_Controller', [
    'API',
    '$tenantSettings',
    'tenantService',
    '$scope',
    '$rootScope',
    '$sce',
    '$Api_Service',
    'Factory_Master',
    '$state',
    '$location',
    '$q',
    '$compile',
    '$timeout',
    '$interval',
    '$templateCache',
    '$listsCache',
    '$uibModal',
    'uibDateParser',
    'uiGridConstants',
    '$filter',
    '$http',
    '$window',
    '$controller',
    'payloadDataModel',
    'statusColors',
    'screenLoader',
    '$parse',
    'orderModel',
    function(API, $tenantSettings, tenantService, $scope, $rootScope, $sce, $Api_Service, Factory_Master, $state, $location, $q, $compile, $timeout, $interval, $templateCache, $listsCache, $uibModal, uibDateParser, uiGridConstants, $filter, $http, $window, $controller, payloadDataModel, statusColors, screenLoader, $parse, orderModel) {
    	let vm = $scope.vm;
        vm.entity_id = $state.params.entity_id;
        //  	if ($scope.CM) {
        // var vm = angular.extend($scope.CM, vm);
        //  	}
        // var vm = this;


        var onlyInScreenLayout_Controller = 'ScreenLayout_Controller';

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
            vm.app_id = $state.params.path[0].uisref.split('.')[0];
        }
        if ($scope.screen) {
            vm.screen_id = $scope.screen;
        } else {
            vm.screen_id = $state.params.screen_id;
        }

        // ctrl = $controller('Controller_Invoice');

        vm.get_master_entity = function(screenChild) {
            if (localStorage.getItem('createResaleCreditNoteFromInvoiceClaims')) {
                Factory_Master.create_credit_note(JSON.parse(localStorage.getItem('createResaleCreditNoteFromInvoiceClaims')), (response) => {
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
                localStorage.removeItem('createResaleCreditNoteFromInvoiceClaims');
            }

            if (localStorage.getItem('createDebunkerCreditNoteFromInvoiceClaims')) {
                Factory_Master.create_credit_note(JSON.parse(localStorage.getItem('createDebunkerCreditNoteFromInvoiceClaims')), (response) => {
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
                localStorage.removeItem('createDebunkerCreditNoteFromInvoiceClaims');
            }

            if (localStorage.getItem('createCreditNoteFromInvoiceClaims')) {
                Factory_Master.create_credit_note(JSON.parse(localStorage.getItem('createCreditNoteFromInvoiceClaims')), (response) => {
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
                localStorage.removeItem('createCreditNoteFromInvoiceClaims');
            }

            if (localStorage.getItem('createPreclaimCreditNoteFromInvoiceClaims')) {
                Factory_Master.claims_create_preclaim_cn(JSON.parse(localStorage.getItem('createPreclaimCreditNoteFromInvoiceClaims')), (response) => {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            toastr.success(response.message);
                            $scope.formValues = response.data;
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                });
                $rootScope.transportData = null;
                localStorage.removeItem('createPreclaimCreditNoteFromInvoiceClaims');
            }

         	if (localStorage.getItem('invoiceFromDelivery')) {
         		// $rootScope.transportData = angular.copy(JSON.parse(localStorage.getItem("invoiceFromDelivery")));

                let lsInvoiceFromDelivery = angular.copy(JSON.parse(localStorage.getItem('invoiceFromDelivery')));
                localStorage.removeItem('invoiceFromDelivery');
		        Factory_Master.create_invoice_from_delivery(lsInvoiceFromDelivery, (response) => {
		            if (response) {
		                if (response.status == true) {
		                    $scope.loaded = true;
		                    $rootScope.transportData = response.data;
		                    if(!$rootScope.transportData.paymentDate) {
		                        $rootScope.transportData.paymentDate = $rootScope.transportData.workingDueDate;
		                    }
                            $scope.formValues = angular.copy($rootScope.transportData);
	                        $scope.triggerChangeFields('InvoiceRateCurrency');
	                        if ($scope.formValues.costDetails) {
		                        if ($scope.formValues.costDetails.length > 0) {
		                            $.each($scope.formValues.costDetails, (k, v) => {
		                                if (v.product == null || v.isAllProductsCost) {
		                                    v.product = {
		                                        id: -1,
		                                        name: 'All'
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
		        });
         	}

         	if (localStorage.getItem('reconQuantityDispute')) {
	            var data = angular.copy(JSON.parse(localStorage.getItem('reconQuantityDispute')));
                localStorage.removeItem('reconQuantityDispute');
	            Factory_Master.raise_claim(data, (response) => {
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
	            });
         	}

         	if (localStorage.getItem('raiseClaimFromLabsPayload')) {
	            var data = angular.copy(JSON.parse(localStorage.getItem('raiseClaimFromLabsPayload')));
                localStorage.removeItem('raiseClaimFromLabsPayload');
		        Factory_Master.raise_claim(data, (response) => {
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
		        });
		        vm.entity_id = '0';
		        // return false;
         	}


         	if (localStorage.getItem('invoice_createFinalInvoice')) {
	            var invoiceType = angular.copy(JSON.parse(localStorage.getItem('invoice_createFinalInvoice'))).invoiceType;
	            var entity_id = angular.copy(JSON.parse(localStorage.getItem('invoice_createFinalInvoice'))).entityId;
                localStorage.removeItem('invoice_createFinalInvoice');
		        Factory_Master.get_master_entity(entity_id, vm.screen_id, vm.app_id, (callback2) => {
		            if (callback2) {
		                var tempformValues = callback2;
					    $.each(tempformValues.productDetails, (ik, iv) => {
                            tempformValues.productDetails[ik].pricingDate = null;
					    });
		                $scope.formValues = tempformValues;

		                /*
		                if ($scope.formValues.documentType.internalName == "ProvisionalInvoice") {
			                !$scope.formValues.paymentDate ? $scope.formValues.paymentDate = $scope.formValues.workingDueDate : '';
		                }
		                */


	                    $scope.formValues.invoiceSummary.provisionalInvoiceAmount = angular.copy($scope.formValues.invoiceSummary.invoiceAmountGrandTotal);

				        $scope.formValues.id = 0;
				        $scope.formValues.invoiceDetails = null;
				        $scope.formValues.documentNo = null;
				        $scope.formValues.dueDate = null;
				        $scope.formValues.invoiceDate = `${moment(new Date()).format('YYYY-MM-DDTHH:mm:ss').split('T')[0] }T00:00:00`;
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


                        var invoiceAmountGrandTotal = 0;
                        var deductions = 0;

		                $scope.formValues.invoiceSummary.netPayable = invoiceAmountGrandTotal - deductions;
		                $.each($scope.formValues.productDetails, (k, v) => {
		                    v.id = 0;
		                    // v.invoiceQuantity = null;
		                    v.invoiceRate = 0;
		                    v.description = null;
		                    // v.invoiceRateCurrency = null;
		                    v.pricingDate = null;
		                    v.invoiceAmount = null;
		                    v.reconStatus = null;
		                    v.amountInInvoice = null;
		                });
		                $scope.formValues.counterpartyDetails.paymentTerm = callback2.counterpartyDetails.orderPaymentTerm;
                        $scope.formValues.deliveryDate = callback2.orderDeliveryDate;
                        $scope.formValues.orderDetails.carrierCompany = callback2.orderDetails.orderCarrierCompany;
                        $scope.formValues.orderDetails.paymentCompany = callback2.orderDetails.orderPaymentCompany;

                        $.each($scope.formValues.productDetails, (ik, iv) => {
						 	$scope.formValues.productDetails[ik].pricingDate = callback2.productDetails[ik].orderProductPricingDate;
                        });
                        for (let i = 0; i < callback2.productDetails.length; i++) {
                            if (callback2.productDetails[i].currency) {
				                $scope.formValues.invoiceRateCurrency = callback2.productDetails[i].currency;
				                $scope.triggerChangeFields('InvoiceRateCurrency');
				                break;
                            }
                        }
		                $.each($scope.formValues.costDetails, (k, v) => {
		                    v.id = 0;
		                });
				        if ($scope.formValues.costDetails) {
				            $.each($scope.formValues.costDetails, (k, v) => {
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
				                	};
				                }
				            });
				        }

		                let deliveryProductIds = [];
		                $.each($scope.formValues.productDetails, (k, v) => {
		                    deliveryProductIds.push(v.deliveryProductId);
		                });
		                let payload = {
		                    Payload: {
		                        DeliveryProductIds: deliveryProductIds,
		                        OrderId: $scope.formValues.orderDetails.order.id
		                    }
		                };
		                Factory_Master.finalInvoiceDuedates(payload, (callback3) => {
		                    if(callback3) {
		                        $scope.formValues.dueDate = callback3.dueDate;
		                        $scope.formValues.paymentDate = callback3.paymentDate;
		                        $scope.formValues.workingDueDate = callback3.workingDueDate;
		                    }
		                });
		            }
		        });
         	}

         	if (localStorage.getItem('invoice_createFinalInvoiceFromEditPage')) {
	            var invoiceType = angular.copy(JSON.parse(localStorage.getItem('invoice_createFinalInvoiceFromEditPage'))).invoiceType;
	            var entity_id = angular.copy(JSON.parse(localStorage.getItem('invoice_createFinalInvoiceFromEditPage'))).entityId;
                localStorage.removeItem('invoice_createFinalInvoiceFromEditPage');
                Factory_Master.get_master_entity(entity_id, vm.screen_id, vm.app_id, (callback2) => {
		            if (callback2) {
		                tempformValues = callback2;
		                $scope.formValues = tempformValues;
		                if ($scope.formValues.documentType.internalName == 'ProvisionalInvoice') {
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
                        $scope.formValues.invoiceSummary.invoiceAmountGrandTotal = null;
                        $scope.formValues.invoiceSummary.estimatedAmountGrandTotal = null;
                        $scope.formValues.invoiceSummary.totalDifference = null;
                        $scope.formValues.status = null;
                        $scope.formValues.customStatus = null;
		                $scope.formValues.invoiceSummary.provisionalInvoiceNo = null;
                        $scope.formValues.accountancyDate = null;
                        $scope.formValues.counterpartyDetails.paymentTerm = null;
                        $scope.formValues.paymentDetails = {};
                        $scope.formValues.paymentDetails.paidAmount = null;
                        // $scope.formValues.paymentDetails.paidAmount = $scope.formValues.invoiceSummary.provisionalInvoiceAmount;

                        var invoiceAmountGrandTotal = 0;
                        var provisionalInvoiceAmount = 0;
                        var deductions = 0;

		                $scope.formValues.invoiceSummary.netPayable = invoiceAmountGrandTotal - deductions;
		                $scope.formValues.costDetails = [];
		                $scope.formValues.productDetails = [];
	                    orderModel.get($scope.formValues.orderDetails.order.id).then((callback4) => {
                            $scope.formValues.counterpartyDetails.paymentTerm = callback4.payload.paymentTerm;
                            for (let i = 0; i < callback4.payload.products.length; i++) {
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

         	if (localStorage.getItem('invoice_createInvoiceFromEdit') && (vm.entity_id == '' || vm.entity_id == 0)) {
	            var data = angular.copy(JSON.parse(localStorage.getItem('invoice_createInvoiceFromEdit')));
                $scope.formValues = data;
                $rootScope.additionalCostsComponentTypes = $scope.formValues.costDetails;
			    $.each($scope.formValues.productDetails, (ik, iv) => {
                    $scope.formValues.productDetails[ik].pricingDate = null;
			    });
                let deliveryProductIds = [];
                $.each(data.productDetails, (k, v) => {
                    deliveryProductIds.push(v.deliveryProductId);
                });
                let payload = {
                    Payload: {
                        DeliveryProductIds: deliveryProductIds,
                        OrderId: data.orderDetails.order.id
                    }
                };
                Factory_Master.finalInvoiceDuedates(payload, (callback3) => {
                    if(callback3) {
                        $scope.formValues.dueDate = callback3.dueDate;
                        $scope.formValues.paymentDate = callback3.paymentDate;
                        $scope.formValues.workingDueDate = callback3.workingDueDate;
                    }
                });
                $scope.formValues.counterpartyDetails.paymentTerm = $scope.formValues.counterpartyDetails.orderPaymentTerm;
                $scope.formValues.deliveryDate = $scope.formValues.orderDeliveryDate;
                $scope.formValues.orderDetails.carrierCompany = $scope.formValues.orderDetails.orderCarrierCompany;
                $scope.formValues.orderDetails.paymentCompany = $scope.formValues.orderDetails.orderPaymentCompany;
            	$.each($scope.formValues.productDetails, (ik, iv) => {
                    $scope.formValues.productDetails[ik].pricingDate = $scope.formValues.productDetails[ik].orderProductPricingDate;
                });
                for (let i = 0; i < $scope.formValues.productDetails.length; i++) {
                    if ($scope.formValues.productDetails[i].currency) {
		                $scope.formValues.invoiceRateCurrency = $scope.formValues.productDetails[i].currency;
		                $scope.triggerChangeFields('InvoiceRateCurrency');
		                break;
                    }
                }

                localStorage.removeItem('invoice_createInvoiceFromEdit');
         	}

         	if (screenChild != 'entity_documents') {
	            vm.get_master_structure(screenChild);
         	} else {
         		$rootScope.$on('documentsScreenLayout', (e, callback) => {
         			callback = callback.layout;
                    $scope.formFields = callback;
                    if (callback.children) {
                        $scope.formFields = callback.children[screenChild];
                    }
         		});
         	}
            // console.log(screenChild);
            setTimeout(() => {
                vm.addHeadeActions();
            }, 10);
            if ($scope.entity == -1) {
                vm.entity_id = '';
            } else if ($scope.entity > 0) {
                vm.entity_id = $scope.entity;
            }
        	if (vm.entity_id == '') {
        		if (vm.app_id == 'masters' && vm.screen_id == 'location') {
        			$scope.formValues.portType = { id: 1 };
        			$scope.formValues.displayPortInMap = true;
        		}
	          	if (vm.app_id === 'masters' && vm.screen_id === 'service') {
	                $scope.formValues.hsfoUom = $scope.tenantSetting.tenantFormats.uom;
	                $scope.formValues.dmaUom = $scope.tenantSetting.tenantFormats.uom;
	                $scope.formValues.lsfoUom = $scope.tenantSetting.tenantFormats.uom;
	            }
	            if (vm.app_id == 'claims' && vm.screen_id == 'claims' && window.location.href.indexOf('?orderId') != -1) {
	            	var params = window.location.href.split('?')[1];
	            	params = params.split('&');
	            	var objParams = {};
	            	$.each(params, (k, v) => {
	            		var key = v.split('=')[0];
	            		var val = parseFloat(v.split('=')[1]);
	            		objParams[key] = val;
	            	});
	            	$timeout(() => {
		            	$scope.formValues.orderDetails = {
		            		order : {
		            			id:objParams.orderId,
		            			name:objParams.orderId
		            		},
		            		product : {
		            			id:objParams.productId,
		            		}
		            	};
		            	$scope.triggerChangeFields('OrderID');
	            	});
	            }
            }

            if (vm.entity_id != '0') {
            	if (vm.app_id == 'claims' && vm.screen_id == 'claims') {
            		if (localStorage.getItem('raiseNewClaimData')){
            			data = JSON.parse(localStorage.getItem('raiseNewClaimData'));
            			localStorage.removeItem('raiseNewClaimData');
            			$rootScope.transportData = data;
            		}
            	}
                // $rootScope.transportData este variabila globala folosita pentru cazurile in care avem nevoie
                // sa populam un ecran de create, atunci cand datele vin in urma unei actiuni.
                if ($rootScope.transportData != null) {
                    $scope.isCopiedEntity = true;
                    $scope.formValues = $rootScope.transportData;
                    if (vm.app_id == 'claims' && vm.screen_id == 'claims') {
	                    $scope.formValues.initialOrderPrice = angular.copy($rootScope.transportData.orderDetails.orderPrice);
	                    $scope.triggerChangeFields('OrderID');
                    }
                    $rootScope.transportData = null;


                    if (vm.app_id == 'invoices' && vm.screen_id == 'invoice') {
						    $scope.triggerChangeFields('InvoiceRateCurrency');
	                        if ($scope.formValues.costDetails) {
		                        if ($scope.formValues.costDetails.length > 0) {
		                            $.each($scope.formValues.costDetails, (k, v) => {
		                                if (v.product == null || v.isAllProductsCost) {
		                                    v.product = {
		                                        id: -1,
		                                        name: 'All'
		                                    };
		                                } else if (v.product.id != v.deliveryProductId) {
							                	v.product.productId = angular.copy(v.product.id);
							                	v.product.id = angular.copy(v.deliveryProductId);
						                	}
		                            });
		                        }
	                        }
                    }
                } else {
                    if (localStorage.getItem(`${vm.app_id + vm.screen_id }_copy`)) {
                        var id = angular.copy(localStorage.getItem(`${vm.app_id + vm.screen_id }_copy`));
                        localStorage.removeItem(`${vm.app_id + vm.screen_id }_copy`);
                        if (id > 0) {
                            $scope.copiedId = id;

                            Factory_Master.get_master_entity(id, vm.screen_id, vm.app_id, (response) => {
                                if (response) {
                                    $scope.formValues = response;
                                    $scope.formValues.lastModifiedBy = null;
                                    $scope.formValues.lastModifiedByUser = null;
                                    $scope.formValues.lastModifiedOn = null;
                                    if (vm.screen_id == 'specparameter') {
                                    	$scope.formValues.energyParameterCode = null;
                                    }


                                    $.each($scope.formValues, (key, val) => {
                                        if (val && angular.isArray(val)) {
                                            $.each(val, (key1, val1) => {
                                                if (val1 && val1.hasOwnProperty('isDeleted')) {
                                                	if (vm.app_id == 'labs' && vm.screen_id == 'labresult') {
                                                		response[key][0].id = 0;
                                                	} else if (vm.screen_id != 'company' && vm.app_id != 'contracts' && vm.screen_id != 'contract' && vm.app_id != 'admin' && vm.screen_id != 'users' && vm.screen_id != 'marketinstrument' && vm.screen_id != 'systeminstrument' && vm.screen_id != 'specparameter') {
                                                        response[key][key1].id = 0;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    $scope.formValues.id = 0;
                                    console.log("6666666666666 vm.screen_id", vm.screen_id);
                                    console.log("6666666666666 $scope.formValues", $scope.formValues);
                                    console.log("6666666666666 $scope.formValues.counterpartyLocations", $scope.formValues.counterpartyLocations);
                                    if (vm.screen_id == 'counterparty') {
                                    	$scope.formValues.address.id = 0;
                                    	$.each($scope.formValues.counterpartyLocations, (key, val) => {
	                                            $.each(val.products, (key1, val1) => {
	                                            	val1.id = 0;
	                                            });
	                                     });
                                    }
                                    if (typeof $scope.formValues.name != 'undefined') {
                                        $scope.formValues.name = null;
                                    }
                                    if ($scope.formValues.conversionFactor) {
                                        $scope.formValues.conversionFactor.id = 0;
                                    }
                                    if (vm.app_id == 'masters' && vm.screen_id == 'vessel') {
                                    	$.each($scope.formValues.tanks, (k, v) => {
                                    		v.vessel.id = 0;
                                    	});
                                    	$.each($scope.formValues.robs, (k, v) => {
                                    		v.vesselId = 0;
                                    	});
                                    }
                                    // reset contract status
                                    if (vm.app_id == 'contracts' && vm.screen_id == 'contract') {
                                        $scope.formValues.status = null;
                                        $.each($scope.formValues.details, (k, v) => {
                                            v.id = 0;
                                        });
                                        $.each($scope.formValues.products, (k, v) => {
                                            v.id = 0;
                                            $.each(v.details, (k1, v1) => {
                                                v1.id = 0;
                                            });
                                            $.each(v.additionalCosts, (k1, v1) => {
                                                v1.id = 0;
                                            });
                                            $.each(v.conversionFactors, (k1, v1) => {
                                                v1.id = 0;
                                                if (v1.contractProduct) {
	                                                v1.contractProduct.id = 0;
                                                }
                                                if (v1.contractProductId) {
                                                	v1.contractProductId = 0;
                                                }
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
                                         $scope.formValues.hasInvoicedOrder = false;
                                        toastr.info($filter('translate')('Formula and MTM Formula was reset for all products'));
                                    }
                                    if (vm.app_id == 'admin' && vm.screen_id == 'users') {
                                        $scope.formValues.contactInformation.id = 0;
                                        $scope.formValues.contactInformation.address.id = 0;
                                    }
                                    if (vm.app_id == 'admin' && vm.screen_id == 'role') {
                                        $scope.formValues.roles.id = 0;
                                        $.each($scope.formValues.roles.rights, (key, val) => {
                                            $scope.formValues.roles.rights[key].id = 0;
                                            $.each($scope.formValues.roles.rights[key].moduleScreenConfigurations, (key1, val1) => {
                                            	$scope.formValues.roles.rights[key].moduleScreenConfigurations[key1].id = 0;
                                            });
                                        });
                                    }
                                    if (vm.app_id == 'masters' && vm.screen_id == 'product') {
                                        $scope.formValues.defaultSpecGroup = null;
                                    }
                                    if (vm.app_id == 'claims' && vm.screen_id == 'claims') {
                                        $scope.formValues = {};
                                        
                                        $scope.formValues.claimsPossibleActions = null;
                                        $scope.formValues.isEditable = true;
                                        
                                        $scope.formValues.orderDetails = response.orderDetails;
                                        $scope.formValues.deliveryDate = response.deliveryDate;
                                        $scope.triggerChangeFields('OrderID', 'orderDetails.order');
                                    }
                                    if (vm.app_id == 'labs' && vm.screen_id == 'labresult') {
                                    	if ($scope.formValues.status.name == 'Verified' || $scope.formValues.status.name == 'Off Spec' || $scope.formValues.status.name == 'In Spec') {
                                    		vm.listsCache.LabResultStatus.forEach((obj, index) => {
                                    			if (obj.name == 'New') {
                                					$scope.formValues.orderRelatedLabResults[0].labStatus = obj;
                                					$scope.formValues.status = obj;
                                    			}
                                    		});
                                    	}
                                		$scope.formValues.labSealNumberInformation.forEach((object) => {
                                			object.labResult = null;
                                			object.labSealNumbers.forEach((object1) => {
                                				object1.id = 0;
                                				object1.labSealNumberInformation = null;
                                			});
                                		});
                                		$scope.formValues.labTestResults.forEach((object) => {
                                			object.labResult = null;
                                		});

                                        vm.checkVerifiedDeliveryFromLabs('loadedData');
                                    }
                                    if (vm.app_id == 'masters' && vm.screen_id == 'paymentterm') {
                                        vm.checkVerifiedDeliveryFromLabs('loadedData');
                                        $.each($scope.formValues.conditions, (k, v) => {
	                                        v.paymentTerm = null;
                                        });
                                    }
                                    if (vm.app_id == 'masters' && vm.screen_id == 'vesseltype') {
                                    	$.each($scope.formValues.robs, function(k,v){
                                    		v.vesselTypeId = null;
                                    	})	
                                    }                                    
				                    $('#header_action_verify').attr('disabled', 'disabled');
                                    toastr.success('Entity copied');
                                    $scope.$emit('formValues', $scope.formValues);
                                }
                            });
                        }
                    } else {
                        if(vm.entity_id) {
                            screenLoader.showLoader();
                        }
                        if (window.location.href.indexOf('invoices/invoice/documents') != -1) {
                        	return;
                        }
                        Factory_Master.get_master_entity(
                           
                           vm.entity_id,
                            vm.screen_id,
                            vm.app_id,
                            (callback) => {
                                screenLoader.hideLoader();
                                if (callback) {
	                                $scope.formValues = callback;
	                                if (vm.app_id == 'masters' && vm.screen_id == 'specparameter') {
	                                	let claimTypeList = $listsCache.ClaimType;
					                    let isAutoSaveClaimDisabled = true;
					                    for (let i = 0; i < $scope.formValues.claimTypes.length; i++) {
					                        let claimType = $scope.formValues.claimTypes[i];
					                        let findClaimTypeWithAutoSaveClaimChecked = _.filter(claimTypeList, function(object) {
					                            return object.id == claimType.id && object.databaseValue == 1;
					                        });
					                        if (findClaimTypeWithAutoSaveClaimChecked && findClaimTypeWithAutoSaveClaimChecked.length) {
					                            isAutoSaveClaimDisabled = false;
					                            break;
					                        }
					                    }
					                    $scope.formValues.isAutoSaveClaimDisabled = isAutoSaveClaimDisabled;
					                    console.log($scope.formValues.isAutoSaveClaimDisabled);

	                                }
                                    if(vm.screen_id === 'emaillogs') {
                                        if($scope.formValues.to && typeof $scope.formValues.to === 'string') {
                                            $scope.formValues.to = $scope.formValues.to.replace(/,/g, ';');
                                        }
                                        if($scope.formValues.cc && typeof $scope.formValues.cc === 'string') {
                                            $scope.formValues.cc = $scope.formValues.cc.replace(/,/g, ';');
                                        }
                                        if($scope.formValues.bcc && typeof $scope.formValues.bcc === 'string') {
                                            $scope.formValues.bcc = $scope.formValues.bcc.replace(/,/g, ';');
                                        }
                                    }

                                    if(vm.app_id === 'masters' && vm.screen_id === 'buyer') {
                                        $scope.formValues.showCode = Boolean($scope.formValues.code);
                                    }
                                    if(vm.app_id === 'masters' && vm.screen_id === 'vessel') {
                                    	$scope.flattenVesselVoyages();
                                        $scope.initRobTable();
                                    }

                                    if (vm.app_id == 'admin' && vm.screen_id == 'sellerrating') {
                                    	for (let i = 0; i < $scope.formValues.applications.length; i++) {
                                    		let findAllLocations = _.filter($scope.formValues.applications[i].locations, function(object) {
                                    			return !object.location;
                                    		});
                                    		let findSpecificLocations = _.filter($scope.formValues.applications[i].locations, function(object) {
                                    			return object.location;
                                    		});
                                    		$scope.formValues.applications[i].allLocations = Object.assign({}, findAllLocations[0]);
                                    		$scope.formValues.applications[i].specificLocations = findSpecificLocations;
                                    	}
							            setTimeout(() => {
							                $scope.initMultiTags('applications');
							            }, 500);
                                    }

				                    if (vm.app_id == 'invoices' && vm.screen_id == 'invoice') {
				                    	$rootScope.reloadPage = true;
				                        $scope.triggerChangeFields('InvoiceRateCurrency');
				                        if ($scope.formValues.costDetails.length > 0) {
				                            $.each($scope.formValues.costDetails, (k, v) => {
				                                if (v.product == null || v.isAllProductsCost) {
				                                    v.product = {
				                                        id: -1,
				                                        name: 'All'
				                                    };
				                                }
				                                if (v.product.id != -1) {
								                	v.product.productId = angular.copy(v.product.id);
								                	// v.product.id = angular.copy(v.deliveryProductId);
								                }
				                            });
				                        }
				                    }
				                    if (vm.app_id == 'masters' && vm.screen_id == 'additionalcost') {
					                    if($scope.formValues.costType.name == 'Flat' || $scope.formValues.costType.name == 'Unit' || $scope.formValues.costType.name == 'Range' || $scope.formValues.costType.name == 'Total') {
					                        $scope.formValues.componentType = null;
					                        $('.edit_form_fields_ComponentType_masters').hide();
					                    } else {
					                        $('.edit_form_fields_ComponentType_masters').show();
					                    }
                                    }

				                    if (vm.screen_id == 'claims' && vm.app_id == 'claims' && vm.entity_id) {
				                		$rootScope.reloadClaimPage = true;
				                    }

                                    $rootScope.$broadcast('formValues', $scope.formValues);
                                    $scope.refreshSelect();
                                    $rootScope.formValuesLoaded = callback;
                                    if (vm.screen_id == 'invoice' && vm.app_id == 'invoices') {
                                        if(!$scope.formValues.paymentDate) {
                                            $scope.formValues.paymentDate = $scope.formValues.workingDueDate;
                                        }
                                        if ($scope.formValues.costDetails.length > 0) {
                                            $.each($scope.formValues.costDetails, (k, v) => {
                                                if (v.product == null || v.isAllProductsCost) {
                                                    v.product = {
                                                        id: -1,
                                                        name: 'All'
                                                    };
                                                }
                                            });
                                        }
                                        $.each($scope.formValues.productDetails, (k, v) => {
                                        	if (v.sapInvoiceAmount) {
                                        		v.invoiceAmount = v.sapInvoiceAmount;
                                        	} else {
                                        		v.invoiceAmount = v.invoiceComputedAmount;
                                        	}
                                        });
                                    }
                                    if (vm.app_id == 'labs' && vm.screen_id == 'labresult') {
                                        vm.checkVerifiedDeliveryFromLabs('loadedData');
                                    }
                                    if (vm.app_id == 'invoices') {
                                        $scope.initInvoiceScreen();
                                    }
                                    if (vm.app_id == 'contracts') {
                                        $scope.initContractScreen();
                                    }
                                    if ($location.hash() == 'mail') {
                                        $scope.sendEmails();
                                        $location.hash('');
                                    }
                                    if (vm.app_id == 'admin' && vm.screen_id == 'configuration') {
    	                            	$.each($scope.formValues.email, (k, v) => {
		                            		if (v.toEmailsConfiguration) {
		                            			v.toEmailsConfiguration = v.toEmailsConfiguration.split(',');
		                            			var tempToEmailsConfiguration = [];
		                            			$.each(v.toEmailsConfiguration, (tok, tov) => {
		                            				tempToEmailsConfiguration.push({ id : parseFloat(tov) });
		                            			});
		                        				$scope.formValues.email[k].toEmailsConfiguration = tempToEmailsConfiguration;
		                            		}
		                            		if (v.ccEmailsConfiguration) {
		                            			v.ccEmailsConfiguration = v.ccEmailsConfiguration.split(',');
		                            			var tempCcEmailsConfiguration = [];
		                            			$.each(v.ccEmailsConfiguration, (tok, tov) => {
			                            			tempCcEmailsConfiguration.push({ id : parseFloat(tov) });
		                            			});
		                        				$scope.formValues.email[k].ccEmailsConfiguration = tempCcEmailsConfiguration;
		                            		}
		                            		if (v.attachmentDocumentTypes) {
		                            			v.attachmentDocumentTypes = v.attachmentDocumentTypes.split(',');
		                            			var tempAttachmentDocumentTypes = [];
		                            			$.each(v.attachmentDocumentTypes, (tok, tov) => {
			                            			tempAttachmentDocumentTypes.push({ id : parseFloat(tov) });
		                            			});
		                        				$scope.formValues.email[k].attachmentDocumentTypes = tempAttachmentDocumentTypes;
		                            		}
		                            	});
                                    }
                                }
                            },
                            screenChild
                        );
                    }
                    if (localStorage.getItem(`${vm.app_id + vm.screen_id }_newEntity`)) {
                        screenLoader.hideLoader();
                        data = angular.fromJson(localStorage.getItem(`${vm.app_id + vm.screen_id }_newEntity`));
                        localStorage.removeItem(`${vm.app_id + vm.screen_id }_newEntity`);
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
                angular.forEach(vm.editInstance, (input, key) => {
                    if (typeof input == 'object' && input.$name) {
                        if (input.$pristine) {
                            input.$pristine = true;
                        }
                        if (input.$dirty) {
                            input.$dirty = false;
                        }
                    }
                });
            }
        };


        vm.addHeadeActions = function() {
            $('.page-content-wrapper a[data-group="extern"]').each(function() {
                if ($(this).attr('data-compiled') == 0) {
                    if ($(this).attr('data-method') != '') {
                        $(this).attr('ng-click', `${$(this).data('method') };submitedAcc("${ $(this).data('method') }")`);
                        $(this).attr('data-method', '');
                        $(this).attr('data-compiled', 1);
                        $compile($(this))($scope);
                    }
                }
            });
            if (vm.app_id == 'masters' && vm.screen_id == 'counterparty') {
                $('.entity_active').attr('ng-model', 'formValues.isDeleted');
            } else {
                $('.entity_active')
                    .attr('ng-checked', '!CM.entity_id || formValues.isDeleted == false')
                    .attr('ng-true-value', 'false')
                    .attr('ng-false-value', 'true')
                    .attr('ng-model', 'formValues.isDeleted');
                $('.completed').attr('ng-model', 'formValues.completed');
                if (vm.screen_id == 'claimtype') {
                    $('.entity_active').attr('ng-disabled', 'formValues.name ? true : false');
                }
            }
            $compile($('.entity_active'))($scope);
            $compile($('.completed'))($scope);
            // added++;
        };

        vm.get_master_structure = function(screenChild) {
            $scope.getAdminConfiguration();
            if (window.location.href.indexOf('structure') != -1) {
                vm.get_master_elements(screenChild);
            }
            let generic_layout = false;

            console.log('get_master_structure', $state);


            // load default screen and app
            let app_id = vm.app_id;
            let screen_id = vm.screen_id;


            // you might not need to change app & screen, but load entity_documents
            if(screenChild == 'entity_documents') {
                // is generic layout (for now, documents only)
                generic_layout = {
                    needed: true,
                    layout: screenChild
                };

                // if app & screen needs to be changed for layout call, match in map (for documents page)
                let entity_documents_map = {
                    'default.view-request-documents': {
                        app: 'procurement',
                        screen: 'request_entity_documents'
                    },
                    'default.view-group-of-requests-documents': {
                        app: 'procurement',
                        screen: 'group_of_requests_entity_documents'
                    },
                    'default.view-order-documents': {
                        app: 'procurement',
                        screen: 'order_entity_documents'
                    },
                    'delivery.documents': {
                        app: 'delivery',
                        screen: 'entity_documents'
                    },
                    'contracts.documents': {
                        app: 'contracts',
                        screen: 'entity_documents'
                    },
                    'labs.documents': {
                        app: 'labs',
                        screen: 'entity_documents'
                    },
                    'claims.documents': {
                        app: 'claims',
                        screen: 'entity_documents'
                    },
                    'invoices.documents': {
                        app: 'invoices',
                        screen: 'entity_documents'
                    },
                    'masters.documents': {
                        app: 'masters',
                        screen: 'entity_documents'
                    }

                };
                if(entity_documents_map[$state.current.name]) {
                    app_id = entity_documents_map[$state.current.name].app;
                    screen_id = entity_documents_map[$state.current.name].screen;
                }
            }

            Factory_Master.get_master_structure(app_id, screen_id, generic_layout, vm.isDev, (callback) => {
                if (callback) {
                    screenLoader.hideLoader();
                    $scope.screenId = callback.id;
                    delete callback.id;
                    //  
                    $scope.formFields = callback;
                    // multiple layouts
                    if (callback.children) {
                        if (screenChild) {
                            $scope.formFields = callback.children[screenChild];
                        } else {
                            $scope.formFields = callback.children.edit;
                        }
                        $scope.updateScreenID = callback.children.id;
                    }
                    // {end} multiple layouts
                    $scope.sortableGroups = [];
                    if (vm.app_id == 'invoices') {
                    	if (window.location.href.indexOf('structure') == -1) {
	                        if ($state.params.screen_id == 'claims') {
	                            delete $scope.formFields.CostDetails;
	                            delete $scope.formFields.ProductDetails;
	                            delete $scope.formFields.InvoiceSummary;
	                        }
	                        if ($state.params.screen_id == 'invoice') {
	                            delete $scope.formFields.ClaimDetails;
	                        }
                    	}
                    }
                    if (vm.app_id == 'masters' && vm.screen_id == 'additionalcost') {
	                    if($scope.formValues.costType.name == 'Flat' || $scope.formValues.costType.name == 'Unit' || $scope.formValues.costType.name == 'Range' || $scope.formValues.costType.name == 'Total') {
	                        $scope.formValues.componentType = null;
	                        setTimeout(() => {
		                        $('.edit_form_fields_ComponentType_masters').hide();
	                        });
	                    } else {
	                    	setTimeout(() => {
		                        $('.edit_form_fields_ComponentType_masters').show();
	                    	});
	                    }
                    }
                    if ($scope.isCreate && vm.screen_id == 'counterparty' && vm.app_id == 'masters') {
                        $scope.formValues.status = { id: 1 };
                    }
                    $.each($scope.formFields, (index, value) => {
                        $scope.sortableGroups.push(value);
                        $.each(value.children, (key, val) => {
                            val.Active = false;
                            if ($scope.tenantSetting.companyDisplayName.name == 'Pool') {
                                val.Label = val.Label.replace('COMPANY', 'POOL');
                                val.Label = val.Label.replace('CARRIER', 'POOL');
                                val.Label = val.Label.replace('CARRIERS', 'POOLS');
                                val.Label = val.Label.replace('COMPANIES', 'POOLS');
                            }
                            if ($scope.tenantSetting.serviceDisplayName.name == 'Operator') {
                                val.Label = val.Label.replace('SERVICE', 'OPERATOR');
                            }
                            if (vm.app_id == 'contracts' && vm.entity_id) {
                            	if (val.Unique_ID == 'createdOn' || val.Unique_ID == 'entryDate') {
                            		val.DefaultToday = false;
                            	}
                            }
                            // if (val.Label.indexOf(Compan) == "Label") {}
                        });
                    });
                    $rootScope.$broadcast('formFields', $scope.formFields);
                    vm.checkLabelsHeight();
                    if (vm.app_id == 'contracts') {
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
                Factory_Master.get_master_entity(1, 'configuration', 'admin', (callback2) => {
                    if (callback2) {
                    	$rootScope.$broadcast('adminConfiguration', callback2);
                        $rootScope.getAdminConfigurationCall = false;
                        // console.log("from Master done");
                        vm.adminConfiguration = callback2;
                        $rootScope.adminConfiguration = callback2;
                    }
                });
            }
        };

        $scope.checkIfTab = function() {
            $scope.$watch('formFields', () => {
                setTimeout(() => {
                    var tab = $('.grp_unit')
                        .children('.tab-pane')
                        .first()
                        .addClass('active in');
                    // console.log(tab);
                    $('#tabs_navigation')
                        .insertBefore(tab)
                        .removeClass('hidden');
                    $('#tabs_navigation ul li')
                        .first()
                        .addClass('active');
                }, 10);
            });
        };

        $scope.triggerModal = function(template, clc, name, id, formvalue, idx, field_name, filter, ctrlData) {
        	if (!clc && (window.location.href.indexOf('preview-email?reportId') != -1 || $rootScope.reportId)) {
        		clc = 'QuantityControlReport';
        	}
        	if (!clc) {
        		return;
        	}
            var tpl = '';

            if (template == 'formula') {
                $scope.modal = {
                    clc: 'masters_formulalist',
                    app: 'masters',
                    screen: 'formulalist',
                    name: name,
                    source: id,
                    field_name: field_name
                };
                if (formvalue) {
                    $scope.modal.formvalue = formvalue;
                    $scope.modal.idx = idx;
                }
                if (vm.app_id == 'contracts') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'ContractId',
                            Value: vm.entity_id ? vm.entity_id : null
                        }
                    ];
                }
                tpl = $templateCache.get('app-general-components/views/modal_formula.html');
            } else if (template == 'alerts') {
                tpl = $templateCache.get('app-general-components/views/modal_alerts.html');
                $scope.modal = {
                    source: clc
                };
            } else if (template == 'general') {
                tpl = $templateCache.get('app-general-components/views/modal_general_lookup.html');
                var clcs;
                if (clc == 'deliveries_transactionstobeinvoiced') {
                    clcs = [ 'invoices', 'transactionstobeinvoiced' ];
                } else if (clc == 'payableTo') {
                    clcs = [ 'invoices', 'payableTo' ];
                } else if (clc == 'contactplanning_contractlist') {
                    // clcs = ['procurement','contractplanning_contractlist'];
                } else if (typeof clc != 'undefined') {
                    clcs = clc.split('_');
                } else {
                    console.log('CLC not defined for modal!');
                    return;
                }

                $scope.modal = {
                    clc: clc,
                    app: clcs[0],
                    screen: clcs[1],
                    name: name,
                    source: id,
                    field_name: field_name
                };

                if (clc == 'masters_documenttypelist') {
                	let screen_name = $state.params.screen_id.toLowerCase();
                	let transactionTypeName = {
                		// 'claim': 'Claims',
                		// 'contract': 'Contract',
                		labresult: 'Labs',
                		request_procurement: 'Request',
                		request_procurement_documents: 'Offer',
                		order_procurement: 'Order',
                		counterparty : 'Counterparties',
                		company: 'Companies',
                		country: 'Countries',
                		strategy: 'Strategies',
                		currency: 'Currencies',
                		status: 'Statuses'
                	};
                	if (transactionTypeName[screen_name]) {
                		screen_name = transactionTypeName[screen_name].toLowerCase();
                	}

	        	    var transactionTypeId = _.find(vm.listsCache.TransactionType, (el) => {
		    			return el.name.toLowerCase().indexOf(screen_name) > -1;
		    		}).id;

		    		if (screen_name == 'statuses') {
                        transactionTypeId = 39;
                    }

			    	$scope.modal.filters = [
			    		{
			    			ColumnName: 'ReferenceNo',
			    			Value: vm.entity_id
			    		},
			    		{
			    			ColumnName: 'TransactionTypeId',
			    			Value: transactionTypeId
			    		}
		    		];

		    		$scope.filters = $scope.modal.filters;
                }

                if (clc == 'PreRequest') {
                    $scope.modal.app = 'procurement';
                    $scope.modal.screen = 'request_entity_documents';
                    $scope.modal.clc = 'entity_documents';
        	    	var transactionTypeId = _.find(vm.listsCache.TransactionType, (el) => {
			    		return el.name == 'Request';
			    	}).id;
			    	$scope.modal.filters = [
			    		{
			    			ColumnName: 'ReferenceNo',
			    			Value: _.get(ctrlData, 'requestId')
			    		},
			    		{
			    			ColumnName: 'TransactionTypeId',
			    			Value: transactionTypeId
			    		}
		    		];
		    		$scope.filters = $scope.modal.filters;
                }

                if (clc ==  'QuantityControlReport') {
                	$scope.modal.app = 'procurement';
                    $scope.modal.screen = 'request_entity_documents';
                    $scope.modal.clc = 'entity_documents';
        	    	var transactionTypeId = _.find(vm.listsCache.TransactionType, (el) => {
			    		return el.name == 'QuantityControlReport';
			    	}).id;
			    	$scope.modal.filters = [
			    		{
			    			ColumnName: 'ReferenceNo',
			    			Value:  $rootScope.reportId
			    		},
			    		{
			    			ColumnName: 'TransactionTypeId',
			    			Value: transactionTypeId
			    		}
		    		];
		    		$scope.filters = $scope.modal.filters;
                }

                if (clc == 'RequestChanges') {
                    $scope.modal.app = 'procurement';
                    $scope.modal.screen = 'request_entity_documents';
                    $scope.modal.clc = 'entity_documents';
        	    	var transactionTypeId = _.find(vm.listsCache.TransactionType, (el) => {
			    		return el.name == 'Offer';
			    	}).id;
			    	$scope.modal.filters = [
			    		{
			    			ColumnName: 'ReferenceNo',
			    			Value: _.get(ctrlData, 'groupId')
			    		},
			    		{
			    			ColumnName: 'TransactionTypeId',
			    			Value: transactionTypeId
			    		}
		    		];
		    		$scope.filters = $scope.modal.filters;
                } 

                if (clc == 'masters_counterpartylist_subdepartment') {
                    $scope.modal.app = 'masters';
                    $scope.modal.screen = 'counterpartylist';
                    if (vm.screen_id == "vessel") {
                    	if (!$scope.formValues.customer) {
                    		toastr.error("Please select customer first!");
                    		return false;
                    	}
                    	counterpartyId = $scope.formValues.customer.id
                    }

			    	$scope.modal.filters = [
			    		{
			    			ColumnName: 'CounterpartyId',
			    			Value: counterpartyId
			    		}
		    		];
		    		$scope.filters = $scope.modal.filters;
                } 

                if (clc == 'Requote') {
                    $scope.modal.app = 'procurement';
                    $scope.modal.screen = 'request_entity_documents';
                    $scope.modal.clc = 'entity_documents';
        	    	var transactionTypeId = _.find(vm.listsCache.TransactionType, (el) => {
			    		return el.name == 'Offer';
			    	}).id;
			    	$scope.modal.filters = [
			    		{
			    			ColumnName: 'ReferenceNo',
			    			Value: _.get(ctrlData, 'groupId')
			    		},
			    		{
			    			ColumnName: 'TransactionTypeId',
			    			Value: transactionTypeId
			    		}
		    		];
		    		$scope.filters = $scope.modal.filters;
                }                 

                if (clc == 'Order' || clc == 'OrderNoBDNToVesselEmail') {
                    $scope.modal.app = 'procurement';
                    $scope.modal.screen = 'order_entity_documents';
                    $scope.modal.clc = 'entity_documents';
        	    	var transactionTypeId = _.find(vm.listsCache.TransactionType, (el) => {
			    		return el.name == 'Order';
			    	}).id;
			    	$scope.modal.filters = [
			    		{
			    			ColumnName: 'ReferenceNo',
			    			Value: _.get(ctrlData, 'orderId')
			    		},
			    		{
			    			ColumnName: 'TransactionTypeId',
			    			Value: transactionTypeId
			    		}
		    		];
		    		$scope.filters = $scope.modal.filters;
                }

                if (clc == 'group_of_requests_entity_documents') {
                    $scope.modal.app = 'procurement';
                    $scope.modal.screen = 'request_entity_documents';
                    $scope.modal.clc = 'entity_documents';
        	    	var transactionTypeId = _.find(vm.listsCache.TransactionType, (el) => {
			    		return el.name == 'Offer';
			    	}).id;
			    	$scope.modal.filters = [
			    		{
			    			ColumnName: 'ReferenceNo',
			    			Value: _.get($state, 'params.groupId')
			    		},
			    		{
			    			ColumnName: 'TransactionTypeId',
			    			Value: transactionTypeId
			    		}
		    		];
		    		$scope.filters = $scope.modal.filters;
                }

                if (clc == 'claims_entity_documents') {
                    $scope.modal.app = 'claims';
                    $scope.modal.screen = 'entity_documents';
                    $scope.modal.clc = 'entity_documents';
                }

                if (clc == 'contracts_entity_documents') {
                    $scope.modal.app = 'contracts';
                    $scope.modal.screen = 'entity_documents';
                    $scope.modal.clc = 'entity_documents';
                }

                if (clc == 'labs_entity_documents') {
                    $scope.modal.app = 'labs';
                    $scope.modal.screen = 'entity_documents';
                    $scope.modal.clc = 'entity_documents';
                }

                if (clc == 'payableTo') {
                    $scope.modal.app = 'masters';
                    $scope.modal.screen = 'counterpartylist';
                }
                if (clc == 'contactplanning_contractlist') {
                    $scope.modal.filters = filter;
                }
                if (clc == 'masters_productlist') {
                    $scope.modal.filters = filter;
                }
                if (clc == 'procurement_bunkerableport' || clc == 'procurement_destinationport') {
                	$scope.modal.filters = [
                        {
                            ColumnName: 'VesselId',
                            Value: filter.id
                        },
                        {
                            ColumnName: 'VesselVoyageDetailId',
                            Value: ctrlData ? _.get(ctrlData, 'vesselVoyageDetailId') : null,
                        },
                        {
                        	ColumnName: 'IsDestinationList',
                        	Value: Boolean(($state.params.title.indexOf('New Request') !== -1 || $state.params.title.indexOf('Edit Request') !== -1) && clc == 'procurement_destinationport')
                        }
               		];
                }
                if (clc == 'procurement_requestcounterpartytypes') {
                    let filterString = '';
                    $.each(filter, (key, val) => {
                        filterString = filterString + val;
                        filterString = `${filterString },`;
                    });
                    filterString = filterString.slice(0, -1);
                    $scope.modal.filters = [
                        {
                            ColumnName: 'CounterpartyTypes',
                            Value: filterString
                        }
                    ];
                }
                if (clc == 'procurement_buyerlist') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'VesselId',
                            Value: filter.id
                        },
                        {
                            ColumnName: 'VesselVoyageDetailId',
                            Value: null
                        }
                    ];
                }
                if(clc == 'procurement_productcontractlist') {
                    $scope.modal.filters = filter;
                }
                if (filter == 'filter__invoices_order_id') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'Order_Id',
                            Value: $scope.formValues.orderDetails ? $scope.formValues.orderDetails.order.id : ''
                        }
                    ];
                }
                if (filter == 'mass') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'UomType',
                            Value: 2
                        }
                    ];
                }
                if (filter == 'volume') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'UomType',
                            Value: 3
                        }
                    ];
                }
                if (filter == 'sellerList') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'CounterpartyTypes',
                            Value: '2, 11'
                        }
                    ];
                    $scope.modal.clc = 'masters_counterpartylist_seller';
                }
                if (filter == 'agentList') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'CounterpartyTypes',
                            Value: 5
                        }
                    ];
                }
                if (filter == 'brokerList') {
                    $scope.modal.clc = 'masters_counterpartylist_broker';
                }
                if (filter == 'supplierList') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'CounterpartyTypes',
                            Value: 1
                        }
                    ];
                }
                if (filter == 'surveyorList') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'CounterpartyTypes',
                            Value: 6
                        }
                    ];
                }
                if (filter == 'labsList') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'CounterpartyTypes',
                            Value: 8
                        }
                    ];
                }
                if (filter == 'bargeList') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'CounterpartyTypes',
                            Value: 7
                        }
                    ];
                }
               
                if (clc=="masters_productlist" && template=="general") {
                    if($scope.formValues.tradeBookMappings != undefined && $scope.formValues.tradeBookMappings.length>0){
                        $scope.modal.filters = $scope.tradeBookfilter;
                        localStorage.setItem("uniqueModalTableIdentifier", "productsInTradeBookMapping");
                    }                   
                }
                if (filter == 'price_period_filter') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'SystemInstrumentId',
                            Value: $scope.formValues.systemInstrument.id
                        }
                    ];
                }
                if (filter == 'filter__vessel_defaultFuelOilProduct') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'ProductId',
                            Value: $scope.formValues.defaultFuelOilProduct.id
                        }
                    ];
                }

                if (filter == 'filter__vessel_defaultDistillateProduct') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'ProductId',
                            Value: $scope.formValues.defaultDistillateProduct.id
                        }
                    ];
                }
                if (filter == 'filter__vessel_defaultLsfoProduct') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'ProductId',
                            Value: $scope.formValues.defaultLsfoProduct.id
                        }
                    ];
                }
                if (filter == 'filter__productDefaultSpec') {
                	if (!$scope.formValues.id && vm.screen_id == "product" && vm.app_id == "masters") {
                		toastr.warning("You can select Default Spec Group only after saving the product");	
                		return false;
                	}
                    $scope.modal.filters = [
                        {
                            ColumnName: 'ProductId',
                            Value: $scope.formValues.id
                        }
                    ];
                }
                if (filter == 'delivery_order_filter') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'id',
                            Value: '7'
                        }
                    ];
                }
                if (filter == 'filter__admin_templates') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'EmailTransactionTypeId',
                            Value: $scope.grid ? $scope.grid.appScope.fVal().formValues.email[idx].transactionType.id : $scope.formValues.email[idx].transactionType.id
                        },
                        {
                            ColumnName: 'Process',
                            Value: $scope.grid ? $scope.grid.appScope.fVal().formValues.email[idx].process : $scope.formValues.email[idx].process
                        }
                    ];
                }
                if (filter == 'filter__master_documenttypetemplates') {
                    $scope.modal.filters = [
                        {
                            ColumnName: 'EmailTransactionTypeId',
                            Value: $scope.grid.appScope.fVal().formValues.templates[idx].transactionType.id
                        }
                    ];
                }
                if (filter == 'filter__vessel_tankProduct') {
                    localStorage.setItem('uniqueModalTableIdentifier', 'productsInVesselMaster');
                }
                if (clc == 'masters_marketinstrumentlist') {
                    $scope.modal.screen = 'marketinstrument';
                }
                if (formvalue) {
                    $scope.modal.formvalue = formvalue;
                    $scope.modal.idx = idx;
                }
            } else if (template == 'sellerrating') {
                $scope.getSellerRating();
                tpl = $templateCache.get('app-general-components/views/modal_sellerrating.html');
            } else if (template == 'setResetPassword') {
                tpl = $templateCache.get('app-general-components/views/modal_setPassword.html');
            } else if (template == 'labsResultRecon') {
                tpl = $templateCache.get('app-general-components/views/modal_labsResultRecon.html');
            } else if (template == 'raiseClaimType') {
                tpl = $templateCache.get('app-general-components/views/modal_raiseClaimType.html');
            } else if (template == 'splitDeliveryModal') {
                tpl = $templateCache.get('app-general-components/views/modal_splitDelivery.html');
            }
            if (template == 'splitDeliveryModal' || template == 'raiseClaimType') {
                $scope.modalInstance = $uibModal.open({
                    template: tpl,
                    size: 'full',
                    appendTo: angular.element(document.getElementsByClassName('page-container')),
                    windowTopClass: 'fullWidthModal smallModal',
                    scope: $scope // passed current scope to the modal
                });
                return;
            }
            $scope.modalInstance = $uibModal.open({
                template: tpl,
                size: 'full',
                appendTo: angular.element(document.getElementsByClassName('page-container')),
                windowTopClass: 'fullWidthModal',
                scope: $scope // passed current scope to the modal
            });
        };
    }

]);

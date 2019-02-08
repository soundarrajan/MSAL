/**
 * Invoice Controller
 */
APP_INVOICE.controller('Controller_Invoice', ['$scope', '$rootScope', 'Factory_Invoice', '$state', '$location', '$q', '$compile', '$timeout', 'Factory_Master', '$listsCache', '$http', 'API', 'statusColors', '$tenantSettings', 'screenLoader', 'COMPONENT_TYPE_IDS', 'COST_TYPE_IDS', 'lookupModel', function($scope, $rootScope, Factory_Invoice, $state, $location, $q, $compile, $timeout, Factory_Master, $listsCache, $http, API, statusColors, $tenantSettings, screenLoader, COMPONENT_TYPE_IDS,COST_TYPE_IDS, lookupModel) {
    var vm = this;
    var guid = '';
    if ($state.params.path) {
        vm.app_id = $state.params.path[0].uisref.split('.')[0];
    }
    if ($scope.screen) {
        vm.screen_id = $scope.screen;
    } else {
        vm.screen_id = $state.params.screen_id;
    }
    vm.master_id = $state.params.master_id;
    vm.entity_id = $state.params.entity_id;
    $scope.addedFields = new Object;
    vm.response = "";
    vm.ids = '';
    vm.additionalCostTypes = [];
    $scope.listsCache = $listsCache;
    vm.invoiceTree = [];
    vm.invoiceCatalog = function() {
        console.log('##########################################');
        vm.invoiceTree = [{
            id: 1,
            title: 'Deliveries List',
            slug: 'deliveries',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, {
            id: 2,
            title: 'Claims List',
            slug: 'claims',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, {
            id: 3,
            title: 'Invoices List',
            slug: 'invoice',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, {
            id: 4,
            title: 'Complete View',
            slug: 'complete_view',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, /*{
            id: 5,
            title: 'Filters',
            slug: 'filters',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        },*/ {
            id: 6,
            title: 'Treasury Report',
            slug: 'treasuryreport',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, ];
    };


    vm.selectInvoiceScreen = function(id, name) {
        $location.path('/invoices/' + id);
        $scope.invoice_screen_name = name;
    };




    $scope.initInvoiceScreen = function() {

        if(!$scope.formValues.paymentDate) {
            $scope.formvalues.paymentDate = $scope.formValues.workingDueDate;
        }
        if ($scope.formValues.relatedInvoices) {
        	$.each($scope.formValues.relatedInvoices, function(k,v){
        		v.invoiceStatus.colorCode = statusColors.getColorCodeFromLabels(
                    v.invoiceStatus,
                    $scope.listsCache.ScheduleDashboardLabelConfiguration)
        	})
        }
        if (typeof($scope.formValues.status) != 'undefined') {
            if ($scope.formValues.status.name) {
                // $state.params.title = "DEL - " + delID + " - " + $scope.formValues.order.name + ' - ' + $scope.formValues.temp.deliverysummary.vesselName;
                // $state.params.title = 'CTRL' + $scope.formValues.name;
                if (!$state.params.status) {
                    $state.params.status = {};
                }
                // $state.params.status.name = $scope.formValues.status.name;
                $state.params.status.name = $scope.formValues.status.displayName;
                $state.params.status.bg = statusColors.getColorCodeFromLabels(
                    $scope.formValues.status,
                    $scope.listsCache.ScheduleDashboardLabelConfiguration);
                $state.params.status.color = 'white';
            }

            /*Disable some fields if invoice STATUS is Approved*/
            if ($scope.formValues.status.name == "Approved") {
            	console.log($scope.formFields);
            	$.each($scope.formFields["OrderDetails"].children, function(k,v){
            		if (v.required == true || v.Required == true) {v.disabled = true;v.Disabled = true;}
            	})
            	$.each($scope.formFields["CounterpartyDetails"].children, function(k,v){
            		if (v.required == true || v.Required == true) {v.disabled = true;v.Disabled = true;}
            	})
            	$.each($scope.formFields["invoiceDetails"].children, function(k,v){
            		if (v.required == true || v.Required == true) {v.disabled = true;v.Disabled = true;}
            	})

            }
        } else {
            $state.params.status = null;
        }
        if ($scope.formValues.costDetails) {
            $.each($scope.formValues.costDetails, function(k, v) {
                if (v.product.id != -1) {
                	if (v.product.id != v.deliveryProductId) {
	                	v.product.id = angular.copy(v.deliveryProductId);
	                	v.product.productId = angular.copy(v.product.id);
                	}
                }
            });                
        }

    }

    $scope.dtMasterSource = {};
    $scope.$watch("formValues", function(val) {
    	if (!val) {return false;}
		vm.initialDueDate = angular.copy($scope.formValues.dueDate);
    	if ($scope.formValues.manualDueDate) {
    		if (vm.initialDueDate != $scope.formValues.manualDueDate) {
	    		$scope.formValues.dueDate = $scope.formValues.manualDueDate;
    		}
    	}	
        if (Object.keys(val).length > 0) {
            $timeout(function() {
                $scope.dtMasterSource.applyFor = [];
                if (typeof $scope.formValues.orderDetails != 'undefined') {
                    var order_id = $scope.formValues.orderDetails.order.id;
                    // if (typeof($rootScope.called_get_apply_for_list) == 'undefined') {
						// $rootScope.called_get_apply_for_list = 1;
	                    Factory_Master.get_apply_for_list(order_id, function(callback) {
	                        if (callback.status == true) {
	                            callback.data.forEach(function(val, key) {
	                            	if (val.name != "All") {
		                                itemName = key + " - " + val.name
	                            	} else {
		                                itemName = val.name
	                            	}

	                                var element = {
	                                    code: val.code,
	                                    id: val.id,
	                                    name: itemName,
	                                    productId: val.productId,
	                                    deliveryProductId: val.deliveryProductId,
	                                    finalQuantityAmountUomId: val.finalQuantityAmountUomId,
	                                    finalQuantityAmount: val.finalQuantityAmount 
	                                };
	                                $scope.dtMasterSource.applyFor.push(element);
	                            });
                                // $rootScope.$broadcast("setInvoiceApplicableFor", $scope.dtMasterSource.applyFor)
	                        } else {
	                            // toastr.error(callback.message);
	                        }
					        $.each($scope.dtMasterSource.applyFor, function(key,val){
						        $scope.getUomConversionFactor(val.productId, val.finalQuantityAmount, val.finalQuantityAmountUomId, $tenantSettings.tenantFormats.uom.id, function (response) {
									val.convertedFinalQuantityAmount = response
								});
					        })
	                    });
                    // }
                    if ($scope.dtMasterSource.applyFor) {
				        // $rootScope.$broadcast("setInvoiceApplicableFor", $scope.dtMasterSource.applyFor)
                    }
                }

            });
        }
    })
    // if ($scope.formValues) {
	   //  $scope.initInvoiceScreen();
    // }
    $scope.triggerChangeFieldsAppSpecific = function(name, id) {
        dueDate = $scope.formValues.dueDate;
        $scope.computeInvoiceTotalConversion($scope.CM.conversionRoe, $scope.CM.conversionTo)
        if (name == "DueDate") {
        	if (vm.initialDueDate) {
	    		if (vm.initialDueDate.split("T")[0] != $scope.formValues.dueDate) {
		        	$scope.formValues.manualDueDate = $scope.formValues.dueDate;
	    		} else {
	    			$scope.formValues.manualDueDate = null;
	    		}
        	} else {
	        	$scope.formValues.manualDueDate = $scope.formValues.dueDate;
        	}
            Factory_Master.get_working_due_date(dueDate, function(response) {
                $scope.formValues.workingDueDate = response.data;
                $scope.formatDates.formValues.workingDueDate = $scope.CM.formatSimpleDate(response.data, true);
                if (!$scope.formValues.paymentDate) {
	                $scope.formValues.paymentDate = response.data;
	                $scope.formatDates.formValues.paymentDate = $scope.CM.formatSimpleDate(response.data, true);
                }
            });
        }
        if (name == "costType") {
        	if ($scope.formValues.costDetails.length > 0) {
	            if ($scope.formValues.costDetails[id].costType.name == "Flat") {
	                $scope.formValues.costDetails[id].invoiceQuantity = 1;
	            } else {
	                $scope.formValues.costDetails[id].invoiceQuantity = '';
	            }
        	}
        }
        if (name == "InvoiceRateCurrency") {
            $.each($scope.formValues.productDetails, function(key, value) {
                value.invoiceRateCurrency = $scope.formValues.invoiceRateCurrency;
            })
            $.each($scope.formValues.costDetails, function(key, value) {
                value.invoiceRateCurrency = $scope.formValues.invoiceRateCurrency;
            })
            if (window.location.href.indexOf("invoices/claims")) {
                console.log(window.location.href);
                $.each($scope.formValues.invoiceClaimDetails, function(key, value) {
                    exchangeDate = $scope.formValues.createdAt;
                    if ($scope.formValues.createdAt == '0001-01-01T00:00:00') {
                        exchangeDate = null;
                    }
                    if (value.invoiceAmountCurrency.id != $scope.formValues.invoiceRateCurrency.id) {
                        $scope.convertCurrency(value.baseInvoiceAmountCurrency.id, $scope.formValues.invoiceRateCurrency.id, exchangeDate, value.baseInvoiceAmount, function(response) {
                            value.invoiceAmount = response;
                        });
                        value.invoiceAmountCurrency = $scope.formValues.invoiceRateCurrency;
                    }
                })
            }

            // this is triggered after formValues are received
            $scope.recalcultateAdditionalCost();
        }
        if (name == 'invoiceSummaryDeductions') {
            $scope.invoiceConvertUom(null, null, $scope.formValues);
        }
        if (name == 'documentNo'){
            $scope.formValues.documentNo = parseInt($scope.formValues.documentNo);
        }

        if (name == "PaymentTerm" || name == "DeliveryDate") {
        	payload = {"Payload":{
	        		"InvoiceId":$scope.formValues.id,
	        		"PaymentTermId":$scope.formValues.counterpartyDetails.paymentTerm.id,
	        		"InvoiceDeliveryDate":$scope.formValues.deliveryDate,
	        		"ManualDueDate":$scope.formValues.manualDueDate
        		}
        	}
        	if (!$scope.formValues.id) {
        		return;
        	}
	        Factory_Master.dueDateWithoutSave(payload, function(callback) {
	        	if (callback.status == true) {
					// if (!callback.data.manualDueDate) { return }
					if (!callback.data.dueDate) { return }
					if (!callback.data.paymentDate) { return }
					if (!callback.data.workingDueDate) { return }
					// $scope.formValues.manualDueDate = callback.data.manualDueDate;	
					$scope.formValues.dueDate = callback.data.dueDate;	
					$scope.formValues.paymentDate = callback.data.paymentDate;	
					$scope.formValues.workingDueDate = callback.data.workingDueDate;	
					$scope.formatDates.formValues.workingDueDate = $scope.CM.formatSimpleDate(callback.data.workingDueDate, true);
					$scope.formatDates.formValues.dueDate = $scope.CM.formatSimpleDate(callback.data.dueDate, true);
					$scope.formatDates.formValues.paymentDate = $scope.CM.formatSimpleDate(callback.data.paymentDate, true);
					$('.date-picker [name="Workingduedate"]').parent().datetimepicker('setDate', new Date( callback.data.workingDueDate ) )	
					$('.date-picker [name="DueDate"]').parent().datetimepicker('setDate', new Date( callback.data.dueDate ) )	
					$('.date-picker [name="PaymentDate"]').parent().datetimepicker('setDate', new Date( callback.data.paymentDate ) )	
	        	}
		    	// api/invoice/dueDateWithoutSave
	        });
        	
        }

    }
    // Cancel Invoice
    $scope.cancel_invoice = function() {
        Factory_Master.cancel_invoice(vm.entity_id, function(callback) {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
            } else {
                toastr.error(callback.message);
            }
        });
    }
    // Submit Invoice for Review
    $scope.submit_invoice_review = function() {
 
        screenLoader.showLoader();
        Factory_Master.submit_invoice_review(vm.entity_id, function(callback) {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                screenLoader.hideLoader();
                $state.reload();
            } else {
                toastr.error(callback.message);
            }
        });
    }
    // Accept Invoice
    $scope.accept_invoice = function() {
        vm.fields = angular.toJson($scope.formValues);
        Factory_Master.accept_invoice(vm.entity_id, function(callback) {
            $scope.loaded = true;
            if (callback.status == true) {
                toastr.success(callback.message);
                $state.reload();
            } else {
                toastr.error(callback.message);
            }
        });
    }
    // Submit Invoice for Approve
    $scope.submit_invoice_approve = function() {
        vm.fields = angular.toJson($scope.formValues);
        screenLoader.showLoader();
        Factory_Master.submit_invoice_approve(vm.entity_id, function(callback) {
            screenLoader.showLoader();
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
                screenLoader.hideLoader();
            } else {
                toastr.error(callback.message);
            }
        });
    }
    // Approve Invoice
    $scope.approve_invoice = function() {
        vm.fields = angular.toJson($scope.formValues);
        screenLoader.showLoader();
        Factory_Master.approve_invoice(vm.entity_id, function(callback) {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
                screenLoader.hideLoader();
            } else {
                toastr.error(callback.message);
            }
        });
    }
    // Revert Invoice
    $scope.revert_invoice = function() {
        vm.fields = angular.toJson($scope.formValues);
        Factory_Master.revert_invoice(vm.entity_id, function(callback) {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
            } else {
                toastr.error(callback.message);
            }
        });
    }      
    // Reject Invoice
    $scope.reject_invoice = function() {
        vm.fields = angular.toJson($scope.formValues);
        Factory_Master.reject_invoice(vm.entity_id, function(callback) {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
            } else {
                toastr.error(callback.message);
            }
        });
    }
    $scope.addCostDetail = function(data) {
        // console.log($scope.CM.getAdditionalCostsComponentTypes());
        $scope.CM.getAdditionalCostsComponentTypes(function(additionalCostsComponentTypes) {
            $scope.additionalCostsComponentTypes = additionalCostsComponentTypes;
            isTaxComponent = false;
            $.each(additionalCostsComponentTypes, function(k, v) {
                if (v.id == data) {
                    if (v.componentType) {
                        if (v.componentType.id == COMPONENT_TYPE_IDS.TAX_COMPONENT) {
                            isTaxComponent = true;
                        }
                    }
                    // flat costs (costType.id == 1) should allow choosing applicable product
                    //else if (v.costType) {
                    //    if (v.costType.id == 1) {
                    //        isTaxComponent = true;
                    //    }
                    //}
                }
            })
            if (typeof(data) != 'undefined' && data != '') {
                var selected = {};
                $scope.additionalCostsList.forEach(function(item, key) {
                    if (item.id == data) selected = item;
                });
                $scope.formValues.costDetails.push({
                    costName: {
                        id: selected.id,
                        name: selected.name,
                        code: selected.code,
                        collectionName: null,
                    },
                    invoiceQuantity: null,
                    invoiceQuantityUom: $tenantSettings.tenantFormats.uom,
                    invoiceRate: null,
                    invoiceRateCurrency: $scope.formValues.invoiceRateCurrency,
                    product: {
                        "id": -1,
                        "name": "All",
                        "deliveryProductId": null
                    },
                    isTaxComponent: isTaxComponent
                });
                $scope.recalcultateAdditionalCost();
            } else {
                toastr.error("Please select a Cost");
            }
        })
        // debugger
    };
    vm.getOptions = function(field) {
        //Move this somewhere nice and warm
        var objectByString = function(obj, string) {
            if (string.includes(".")) {
                return objectByString(obj[string.split(".", 1)], string.replace(string.split(".", 1) + ".", ""));
            } else {
                return obj[string];
            }
        }
        if (field) {
            setTimeout(function() {
                if (field.Filter && typeof($scope.formValues) != 'undefined') {
                    field.Filter.forEach(function(entry) {
                        if (entry.ValueFrom == null) return;
                        var temp = 0;
                        try {
                            temp = eval('$scope.formValues.' + entry.ValueFrom);
                        } catch (error) {}
                        entry.Value = temp;
                    });
                }
                if (!$scope.options) {
                    $scope.options = [];
                }
                Factory_Master.get_master_list(vm.app_id, vm.screen_id, field, function(callback) {
                    if (callback) {
                        $scope.options[field.Name] = callback;
                        $scope.$watchGroup([$scope.formValues, $scope.options], function() {
                            $timeout(function() {
                                if (field.Type == 'textUOM') {
                                    id = '#' + field.Name;
                                } else {
                                    id = '#' + field.masterSource + field.Name;
                                }
                                if ($(id).data('val')) {
                                    $(id).val($(id).data('val'));
                                }
                            }, 50);
                        })
                    }
                });
            }, 1000)
        }
    };
    /*INVOICES FROM DELIVERIES*/
    $scope.initInvoiceTypeOptions = function() {
        vm.getOptions({
            "Name": "DocumentTypeEnum",
            "Type": "dropdown",
            "masterSource": "DocumentTypeEnum"
        });
        $('#newInvoiceType').find("option").remove();
        if (!$scope.options) {
            $scope.options = [];
        }
        // $scope.CM.listsCache['DocumentTypeEnum'];
        $($("[name='newInvoiceType']").parent().parent()[1]).hide();
        $('#newInvoiceType').append($('<option>', {
            value: "",
            text: ""
        }));
        $.each($scope.CM.listsCache['DocumentTypeEnum'], function(k,v) {
            $('#newInvoiceType').append($('<option>', {
                // value: v.name,
                value: v.internalName,
                internalName: v.internalName + "",
                text: v.name + ""
            }));
        });
    }
    $scope.createInvoiceFromDelivery = function() {
        var productIds = $('#flat_invoices_app_deliveries_list').jqGrid.Ascensys.selectedProductIds;
        var orderAdditionalCostId = $('#flat_invoices_app_deliveries_list').jqGrid.Ascensys.selectedOrderAdditionalCostId;
        var invoiceType = $("#newInvoiceType").val();
        if (!invoiceType) {
            toastr.error("Please select invoice type");
            return;
        }
        if (!orderAdditionalCostId) {
            toastr.error("Please select at least one row");
            return;
        }
        if (productIds.length == 0 && orderAdditionalCostId.length == 0) {
            toastr.error("Please select at least one row");
            return;
        }
        var data = {
            "DeliveryProductIds": productIds,
            "OrderAdditionalCostIds": orderAdditionalCostId,
            "InvoiceTypeName": invoiceType,
        }
        localStorage.setItem('invoiceFromDelivery', angular.toJson(data));
        window.open("/#/" + vm.app_id + '/' + 'invoice' + '/edit/', '_blank');

    }
    /*INVOICES FROM DELIVERIES*/
    /*INVOICES - CLAIMS*/
    $scope.createCreditNote = function() {
        var selectedRowData = $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData;
        if (selectedRowData) {
            var claimSettlementType = selectedRowData.settlementType.name;
            var actualSettlementAmount = selectedRowData.actualSettlementAmount;
            var claimType = selectedRowData.claimType.name;
            var claimId = selectedRowData.id;
            var data = {
                "ClaimId": claimId
            }
            if (selectedRowData.claimsPossibleActions.canCreateCreditNote) {
                Factory_Master.create_credit_note(data, function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            toastr.success(response.message);
                            $rootScope.transportData = response.data;
                            $location.path(vm.app_id + '/claims/edit/');
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                })
            } else {
                toastr.error("You can't create credit note for this claim");
            }
            $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData = null
        } else {
            toastr.error("Please select one claim");
        }
    }
    $scope.claims_create_credit_note = function(id) {
        var data = {
            "claimId": vm.entity_id,
            "InvoiceTypeName": "CreditNote"
        }
        if (id == 1) {
            data.IsResale = 1;
        }
        if (id == 2) {
            data.IsDebunker = 1;
        }
        Factory_Master.claims_create_credit_note(data, function(response) {
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    toastr.success(response.message);
                    $rootScope.transportData = response.data;
                    $location.path('invoices/claims/edit/');
                } else {
                    $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        })
    }
    $scope.createDebunkerCreditNote = function() {
        var selectedRowData = $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData;
        if (selectedRowData) {
            var claimSettlementType = selectedRowData.settlementType.name;
            var actualSettlementAmount = selectedRowData.actualSettlementAmount;
            var claimType = selectedRowData.claimType.name;
            var claimId = selectedRowData.id;
            if (selectedRowData.claimsPossibleActions.canCreateDebunkerCreditNote) {
                var data = {
                    "ClaimId": claimId,
                    "IsDebunker": 1
                }
                Factory_Master.create_credit_note(data, function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            toastr.success(response.message);
                            $rootScope.transportData = response.data;
                            $location.path(vm.app_id + '/claims/edit/');
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                })
            } else {
                toastr.error("You can't create debunker credit note for this claim");
            }
        } else {
            toastr.error("Please select one claim");
        }
    }
    $scope.createResaleCreditNote = function() {
        var selectedRowData = $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData;
        if (selectedRowData) {
            var claimSettlementType = selectedRowData.settlementType.name;
            var actualSettlementAmount = selectedRowData.actualSettlementAmount;
            var resaleAmount = selectedRowData.resaleAmount;
            var claimType = selectedRowData.claimType.name;
            var claimId = selectedRowData.id;
            if (selectedRowData.claimsPossibleActions.canCreateResaleCreditNote) {
                var data = {
                    "ClaimId": claimId,
                    "IsResale": 1
                }
                Factory_Master.create_credit_note(data, function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            toastr.success(response.message);
                            $rootScope.transportData = response.data;
                            $location.path(vm.app_id + '/claims/edit/');
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                })
            } else {
                toastr.error("You can't create resale credit note for this claim");
            }
        } else {
            toastr.error("Please select one claim");
        }
    }
    /*INVOICES - CLAIMS*/
    $scope.saveTreasury = function() {
        checkedRows = $rootScope.treasuryChangedfields;
        var CLC = $('#invoices_treasuryreport');
        var rowData = CLC.jqGrid.Ascensys.gridObject.rows
        rowsToSave = []
        if (!checkedRows) {
            toastr.error("Please select at least one row!");
            return;
        }
        Object.keys(checkedRows).forEach(function(key, index) {
            if (this[key].isChecked == true) {
                selectedData = this[key];
                $.each(rowData, function(k, v) {
                    if (v.id == key) {
                        rowsToSave.push(v);
                    }
                })
                $.each(rowsToSave, function(k1, v1) {
                    if (v1.id == key) {
                        $.each(v1, function(k3, v3) {
                            $.each(selectedData, function(k2, v2) {
                                if (k3 == k2) {
                                    v1[k3] = v2;
                                }
                            })
                        })
                    }
                })
            }
        }, checkedRows);
        console.log(rowsToSave);
        Factory_Master.saveTreasuryTableData(rowsToSave, function(response) {
            if (response) {
                if (response.status == true) {
                    console.log(response);
                    if (response.status) {
                        toastr.success("Saved successfully!")
                    } else {
                        toastr.error("An error has occured!")
                    }
                } else {
                    toastr.error("An error has occured!")
                }
            }
        })
    }

    $rootScope.$on("gridDataDone", function(data,res){
    	isTreasuryReport = window.location.hash.indexOf("treasuryreport") != -1;
    	if (isTreasuryReport) {
				var CLC = $('#invoices_treasuryreport');
				var rowData = CLC.jqGrid.Ascensys.gridData[0];
				$scope.treasuryReportTotals = JSON.parse(rowData.totals);
				console.log(rowData);
    	}
    });

    // $scope.getTreasuryReportTotals = function(tableParams) {
    // 	// Elements.settings.flat_invoices_app_complete_view_list.source.tableParams;
    //     var apiJSON = {
    //         Payload: {
    //             Order: null,
    //             PageFilters: {
    //                 Filters: []
    //             },
    //             SortList: {
    //                 SortList: []
    //             },
    //             Filters: [],
    //             SearchText: null,
    //             Pagination: {
    //                 Skip: 0,
    //                 Take: 25
    //             }
    //         }
    //     };    
		
	// 	if (typeof($rootScope.lastGridDataDone) == 'undefined') {
	// 		$rootScope.lastGridDataDone = 0;
	// 	}

	// 	apiJSON.Payload.PageFilters.Filters = tableParams.PageFilters
	// 	apiJSON.Payload.Filters = tableParams.filters
	// 	apiJSON.UIFilters = tableParams.UIFilters
	// 	apiJSON.Payload.SearchText = tableParams.SearchText
	// 	apiJSON.Payload.SortList.SortList = tableParams.PageFilters.sortList        
	// 	apiJSON.Payload.Pagination.Take =tableParams.rows;
	// 	apiJSON.Payload.Pagination.Skip =tableParams.rows * (tableParams.page - 1);	
	// 	if ( (new Date().getTime() - $rootScope.lastGridDataDone) > 1500) {
	// 		$rootScope.lastGridDataDone = new Date().getTime();
	// 	    $http.post(API.BASE_URL_DATA_INVOICES + '/api/invoice/getTreasuryReportTotals', apiJSON
	// 	    ).then(function successCallback(response) {
	// 	    	if (response.data.isSuccess == true) {
	// 	    		$scope.treasuryReportTotals = response.data.payload;
	// 	    	} else {
	// 	    		toastr.error(response.data.errorMessage);
	// 	    	}
	// 	    });
	// 	}
    // }

  
    $scope.invoiceConvertUom = function(type, rowIndex, formValues, oneTimeRun) {

    	if ($('form[name="CM.editInstance"]').hasClass("ng-pristine") ) {
    		if (!window.compiledinvoiceConvertUom) {
    			window.compiledinvoiceConvertUom = [];
    		}
    		if (!(window.compiledinvoiceConvertUom[type + "-" + rowIndex] < 2)) {
				// var myEl = angular.element($(".group_productDetails"));
				// var myScope = angular.element(myEl).scope();   		
				// $compile($(".group_productDetails"))(myScope)
    			window.compiledinvoiceConvertUom[type + "-" + rowIndex] += 1;
				// myScope.$apply();
    		} else {
    			return;
    		}
    		// $scope.$apply();	
    		// return;
    	}

        if (typeof($rootScope.additionalCostsData) == 'undefined') {
            $rootScope.additionalCostsData = $scope.getAdditionalCostsData();
        }
        $scope.CM.type = type;
        if ($scope.CM.type == 'product') {
            product = formValues.productDetails[rowIndex];
            if (typeof(product.product) != 'undefined' && typeof(product.invoiceQuantityUom) != 'undefined' && typeof(product.invoiceRateUom) !== 'undefined') {
                if (product.invoiceQuantityUom == null || product.invoiceRateUom == null || typeof(product.invoiceAmount) != 'undefined') {
                    return;
                };
                $scope.getUomConversionFactor(product.product.id, 1, product.invoiceRateUom.id, product.invoiceQuantityUom.id, function (response) {
                	if (product.sapInvoiceAmount) {
	                    product.invoiceAmount = product.sapInvoiceAmount;
                	} else {
	                    product.invoiceAmount = product.invoiceQuantity * (product.invoiceRate / response);
                	}
                    // product.invoiceComputedAmount = product.invoiceAmount;
                    product.difference = parseFloat(product.invoiceAmount) - parseFloat(product.estimatedAmount);
             
                    calculateGrand(formValues);
                    if (product) {
                        calculateProductRecon(product)
                    }
                });
            }
            // recalculatePercentAdditionalCosts(formValues);
        }
        if ($scope.CM.type == 'cost') {

         
            $scope.CM.old_cost = formValues.costDetails[rowIndex];
            if (formValues.costDetails[rowIndex].product) {
	            $scope.CM.old_product = formValues.costDetails[rowIndex].product.id;
            }
            $scope.CM.old_costType = formValues.costDetails[rowIndex].costType;
            if ($scope.CM.old_product == -1) {
                formValues.costDetails[rowIndex].isAllProductsCost = true;
                if (typeof $scope.grid.appScope.fVal().dtMasterSource.applyFor == 'undefined') {
                    $http.post(API.BASE_URL_DATA_INVOICES + '/api/invoice/getApplicableProducts', {
                        "Payload": formValues.orderDetails.order.id
                    }).then(function successCallback(response) {
                        calculate($scope.CM.old_cost, response.data.payload[1].id, $scope.CM.old_costType)
                    });
                } else {
                    if (!$scope.grid.appScope.fVal().dtMasterSource.applyFor[1]) return;
                    calculate($scope.CM.old_cost, $scope.grid.appScope.fVal().dtMasterSource.applyFor[1].id, $scope.CM.old_costType)
                }
            } else {
                calculate($scope.CM.old_cost, $scope.CM.old_product, $scope.CM.old_costType)
            }

            allCostApplyFor = 0;
            $.each($scope.grid.appScope.fVal().dtMasterSource.applyFor, function(k,v){
            	if (v.name != "All") {
		            allCostApplyFor += v.convertedFinalQuantityAmount;
            	}
            })
            $.each($scope.grid.appScope.fVal().dtMasterSource.applyFor, function(k,v){
            	if (v.name == "All") {
            		v.convertedFinalQuantityAmount = allCostApplyFor;
            	}
            })

            function calculate(cost, product, costType) {
                $scope.CM.cost = cost;
                $scope.CM.product = product;
                $scope.CM.costType = costType;
                // calculate extra
                if (!formValues.costDetails[rowIndex].invoiceExtras) {
                    formValues.costDetails[rowIndex].invoiceExtras = 0
                }
                if ($scope.CM.cost.invoiceRateUom) {
                    rateUom = $scope.CM.cost.invoiceRateUom.id
                } else {
                    rateUom = null
                }
                if ($scope.CM.cost.invoiceQuantityUom) {
                    quantityUom = $scope.CM.cost.invoiceQuantityUom.id
                } else {
                    quantityUom = null
                }
				if ($scope.CM.costType.name == 'Percent' || $scope.CM.costType.name == 'Unit') {
                    rateUom = quantityUom;
				}


                if ($scope.CM.costType.name == 'Flat') {
                    formValues.costDetails[rowIndex].invoiceAmount = $scope.CM.cost.invoiceRate;
                    formValues.costDetails[rowIndex].invoiceExtrasAmount = formValues.costDetails[rowIndex].invoiceExtras / 100 * formValues.costDetails[rowIndex].invoiceAmount;
                    formValues.costDetails[rowIndex].invoiceTotalAmount = parseFloat(formValues.costDetails[rowIndex].invoiceExtrasAmount) + parseFloat(formValues.costDetails[rowIndex].invoiceAmount);
                    calculateGrand(formValues);
                    return;
                }
                $scope.getUomConversionFactor($scope.CM.product, 1, quantityUom, rateUom, function(response) {
                    if ($scope.CM.costType) {
                        if ($scope.CM.costType.name == 'Unit') {
                            formValues.costDetails[rowIndex].invoiceAmount = response * $scope.CM.cost.invoiceRate * $scope.CM.cost.invoiceQuantity;
                        }
                        if ($scope.CM.costType.name == 'Percent') {
                //         	sumOfApplicableAmounts = 0
                //         	if (formValues.costDetails[rowIndex].product.id != -1) {
                //         		$.each(formValues.productDetails, function(pk,pv){
                //         			if (pv.deliveryProductId == formValues.costDetails[rowIndex].product.id) {
			             //            	sumOfApplicableAmounts += pv.invoiceAmount;
                //         			}
                //         		})
                //         		$.each(formValues.costDetails, function(ck,cv){
                //         			if (cv.costType.name != "Percent" && cv.product.id == formValues.costDetails[rowIndex].product.id) {
			             //            	sumOfApplicableAmounts += cv.invoiceAmount;
                //         			}
                //         		})
                //         	} else {
                //         		$.each(formValues.productDetails, function(pk,pv){
		              //           	sumOfApplicableAmounts += pv.invoiceAmount;
                //         		})
                //         		$.each(formValues.costDetails, function(ck,cv){
                //         			if (cv.costType.name != "Percent") {
			             //            	sumOfApplicableAmounts += cv.invoiceAmount;
                //         			}
                //         		})                        		                        		
                //         	}
		            		// formValues.costDetails[rowIndex].invoiceAmount = $scope.CM.cost.invoiceRate * sumOfApplicableAmounts / 100 || 0;
                        } else {
                        	// recalculatePercentAdditionalCosts(formValues);
                        }
                
                        formValues.costDetails[rowIndex].invoiceExtrasAmount = formValues.costDetails[rowIndex].invoiceExtras / 100 * formValues.costDetails[rowIndex].invoiceAmount;
                        formValues.costDetails[rowIndex].invoiceTotalAmount = parseFloat(formValues.costDetails[rowIndex].invoiceExtrasAmount) + parseFloat(formValues.costDetails[rowIndex].invoiceAmount);
                        formValues.costDetails[rowIndex].difference = parseFloat(formValues.costDetails[rowIndex].invoiceTotalAmount) - parseFloat(formValues.costDetails[rowIndex].estimatedTotalAmount);

                        formValues.costDetails[rowIndex].deliveryProductId =  formValues.costDetails[rowIndex].product.deliveryProductId ? formValues.costDetails[rowIndex].product.deliveryProductId : formValues.costDetails[rowIndex].deliveryProductId;
                        console.log("-----------------------", formValues.costDetails[rowIndex].deliveryProductId);
                        // calculate grandTotal
                        if ($scope.CM.cost) {
                            calculateCostRecon()
                        }
                        calculateGrand(formValues);
                    }
                });
            }
			
        }

        function recalculatePercentAdditionalCosts(formValues){
    		$.each(formValues.costDetails, function(ck,cv){
    			if (cv.costType.name == "Percent") {
	    			$scope.invoiceConvertUom("cost", ck, formValues, true);	
    			}
    		})
        }

        function calculateCostRecon() {
            if (!$scope.CM.cost.estimatedRate || !$scope.CM.cost.invoiceAmount ) {
                return
            }
            // debugger
            $http.post(API.BASE_URL_DATA_RECON + '/api/recon/invoicecost', {
                payload: $scope.CM.cost
            }).then(function successCallback(response) {
                console.log(response);
                if (response.data == 1) {
                    obj = {
                        id: 1,
                        name: "Matched"
                    }
                } else {
                    obj = {
                        id: 2,
                        name: "Unmatched"
                    }
                }
                formValues.costDetails[rowIndex].reconStatus = obj;
            });
        }

        function calculateProductRecon() {
        	if (!product.invoiceRateCurrency.id || !product.estimatedRateCurrency.id) {
        		return false;
        	}
            $http.post(API.BASE_URL_DATA_RECON + '/api/recon/invoiceproduct', {
                payload: product
            }).then(function successCallback(response) {
                console.log(response);
                if (response.data == 1) {
                    obj = {
                        id: 1,
                        name: "Matched"
                    }
                } else {
                    obj = {
                        id: 2,
                        name: "Unmatched"
                    }
                }
                product.reconStatus = obj;
            });
        }

        function calculateGrand(formValues) {
            if (!formValues.invoiceSummary) {
                formValues.invoiceSummary = {}
            }
            formValues.invoiceSummary.provisionalInvoiceAmount = $scope.calculateprovisionalInvoiceAmount(formValues)
            formValues.invoiceSummary.invoiceAmountGrandTotal = $scope.calculateInvoiceGrandTotal(formValues);
            formValues.invoiceSummary.estimatedAmountGrandTotal = $scope.calculateInvoiceEstimatedGrandTotal(formValues);
            formValues.invoiceSummary.totalDifference = formValues.invoiceSummary.invoiceAmountGrandTotal - formValues.invoiceSummary.estimatedAmountGrandTotal;
            formValues.invoiceSummary.netPayable = formValues.invoiceSummary.invoiceAmountGrandTotal - formValues.invoiceSummary.deductions - formValues.invoiceSummary.provisionalInvoiceAmount;
            $scope.changedFVal = formValues;
        }
    }


    $scope.getComponentTypeOfCost = function(costId) {
        $.each($rootScope.additionalCostsData, function(k, v) {
            if (costId == v.id) {
                costComponentType = v.componentType.id;
            }
        })
        return costComponentType;
    }
    $scope.getCostsProductsAmount = function(formValues) {
        allProductsAmount = 0;
        $.each(formValues.productDetails, function(k, v) {
            allProductsAmount += v.invoiceAmount;
        })
        allCostsAmount = 0;
        $.each(formValues.costDetails, function(k, v) {
            ct = $scope.getComponentTypeOfCost(v.costName.id);
            if (ct == 2) {
                allCostsAmount += parseFloat(v.invoiceAmount);
            }
        })
        return allProductsAmount;
    }
    $scope.getCostsProductsAndCostsAmount = function(formValues) {
        allProductsAmount = 0;
        $.each(formValues.productDetails, function(k, v) {
            allProductsAmount += v.invoiceAmount;
        })
        allCostsAmount = 0;
        $.each(formValues.costDetails, function(k, v) {
            componentType = $scope.getComponentTypeOfCost(v.costName.id);
            if (componentType == 2) {
                allCostsAmount += parseFloat(v.invoiceAmount);
            }
        })
        return allProductsAmount + allCostsAmount;
    }
    $scope.createInvoiceFromEdit = function(invoiceType, isFinal) {
        if (!invoiceType) {
            toastr.error("Please select an invoice type");
            return;
        }
        invoiceType = JSON.parse(invoiceType);
        if (invoiceType.name == "Final Invoice") {
        	$scope.createFinalInvoice();
        	return;
        }

        $rootScope.transportData = $scope.formValues;
        $rootScope.transportData.id = 0;
        $rootScope.transportData.documentType = invoiceType;
        $rootScope.transportData.productDetails = [];
        $rootScope.transportData.costDetails = [];
        $rootScope.transportData.invoiceDetails = null;
        $rootScope.transportData.sellerInvoiceNo = null;
        $rootScope.transportData.receivedDate = null;
        // $rootScope.transportData.dueDate = null;
        $rootScope.transportData.manualDueDate = null;
        // $rootScope.transportData.workingDueDate = null;
        $rootScope.transportData.sellerInvoiceDate = null;
        $rootScope.transportData.sellerDueDate = null;
        $rootScope.transportData.approvedDate = null;
        // $rootScope.transportData.paymentDate = null;
        $rootScope.transportData.invoiceRateCurrency = null;
        $rootScope.transportData.backOfficeComments = null;
        $rootScope.transportData.paymentDetails = null;
        $rootScope.transportData.status = null;
        $rootScope.transportData.invoiceSummary = null;
        $rootScope.transportData.invoiceClaimDetails = null;
        $location.path('invoices/invoice/edit/');
    }
    $scope.createFinalInvoice = function(fv) {
        screenLoader.showLoader();
        invoiceType = {
            "id": 2,
            "name": "FinalInvoice",
            "code": null
        }
        console.log(fv);
        
        formValues = angular.element($('[name="CM.editInstance"]')).scope().formValues;
        Factory_Master.get_master_entity(vm.entity_id, vm.screen_id, vm.app_id, function(callback2) {
            if (callback2) {
                
                tempformValues = callback2;
                $rootScope.transportData = tempformValues;
                if (formValues.documentType.internalName == "ProvisionalInvoice") {
	                // $rootScope.transportData.dueDate = null;
	                // $rootScope.transportData.workingDueDate = null;
	                !$rootScope.transportData.paymentDate ? $rootScope.transportData.paymentDate = $rootScope.transportData.workingDueDate : '';
                }
                
                $rootScope.transportData.id = 0;
                $rootScope.transportData.invoiceDetails = null;
                $rootScope.transportData.documentType = invoiceType;
                $rootScope.transportData.paymentDetails = null;
                $rootScope.transportData.invoiceDetails = null;
                $rootScope.transportData.sellerInvoiceNo = null;
                $rootScope.transportData.invoiceRateCurrency = null;
                $rootScope.transportData.receivedDate = null;
                $rootScope.transportData.manualDueDate = null;
                $rootScope.transportData.sellerInvoiceDate = null;
                $rootScope.transportData.sellerDueDate = null;
                $rootScope.transportData.approvedDate = null;
                $rootScope.transportData.invoiceRateCurrency = null;
                $rootScope.transportData.backOfficeComments = null;
                $rootScope.transportData.invoiceSummary.invoiceAmountGrandTotal = null
                $rootScope.transportData.invoiceSummary.estimatedAmountGrandTotal = null
                $rootScope.transportData.invoiceSummary.totalDifference = null
                $rootScope.transportData.status = null
                $rootScope.transportData.invoiceSummary.provisionalInvoiceNo = vm.entity_id;
                
                $rootScope.transportData.paymentDetails = {};     
                $rootScope.transportData.paymentDetails.paidAmount = $rootScope.transportData.invoiceSummary.provisionalInvoiceAmount;
           
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
                $rootScope.transportData.invoiceSummary.netPayable = invoiceAmountGrandTotal - provisionalInvoiceAmount - deductions;
                $.each($rootScope.transportData.productDetails, function(k, v) {
                    v.id = 0;
                    v.invoiceQuantity = null;
                    // v.invoiceQuantityUom = null;
                    v.invoiceRate = null;
                    // v.invoiceRateUom = null;
                    v.invoiceRateCurrency = null;
                    v.invoiceAmount = null;
                    v.reconStatus = null;
                    v.amountInInvoice = null;
                })
                $.each($rootScope.transportData.costDetails, function(k, v) {
                    v.id = 0;
                })

                var deliveryProductIds = [];
                $.each($rootScope.transportData.productDetails, function(k, v) {
                    deliveryProductIds.push(v.deliveryProductId);
                });

                var payload = {
                    "Payload": {
                        "DeliveryProductIds": deliveryProductIds,
                        "OrderId": $rootScope.transportData.orderDetails.order.id
                    }
                }
                $location.path('invoices/invoice/edit/');
                // Factory_Master.finalInvoiceDuedates(payload, function(callback3) {
                //     screenLoader.hideLoader();
                //     if(callback3) {
                //         $rootScope.transportData.dueDate = callback3.dueDate;
                //         $rootScope.transportData.paymentDate = callback3.paymentDate;
                //         $rootScope.transportData.workingDueDate = callback3.workingDueDate;
                //     }
                // });
            }
        });
    }
    $scope.getAdditionalCostsData = function() {
        data = 0;
        Factory_Master.getAdditionalCosts(data, function(response) {
            if (response) {
                if (response.status == true) {
                    // debugger;
                    $rootScope.additionalCostsData = response.data.payload;
                  
                    return response.data.payload;
                } else {
                    toastr.error("An error has occured!")
                }
            }
        })
    }
    $scope.calculateInvoiceGrandTotal = function(formValues) {
        grandTotal = 0;
        $.each(formValues.productDetails, function(k, v) {
            if (!v.isDeleted && typeof(v.invoiceAmount) != 'undefined') {
                grandTotal += v.invoiceAmount;
            }
        })
        $.each(formValues.costDetails, function(k, v) {
            if (!v.isDeleted) {
                if (typeof(v.invoiceTotalAmount) != 'undefined') {
                    grandTotal += v.invoiceTotalAmount;
                }
            }
        })
        return grandTotal;
    }
    $scope.calculateprovisionalInvoiceAmount = function(formValues) {
        grandTotal = 0;
        $.each(formValues.relatedInvoices, function(k, v) {
            if (!v.isDeleted && typeof(v.invoiceAmount) != 'undefined' && v.invoiceType.name == 'ProvisionalInvoice') {
                grandTotal += v.invoiceAmount;
            }
        })
        return grandTotal;
    }
    $scope.calculateInvoiceEstimatedGrandTotal = function(formValues) {
        grandTotal = 0;
        $.each(formValues.productDetails, function(k, v) {
            if (!v.isDeleted && typeof(v.estimatedAmount) != 'undefined') {
                grandTotal += v.estimatedAmount;
            }
        })
        $.each(formValues.costDetails, function(k, v) {
            if (!v.isDeleted) {
                if (typeof(v.estimatedAmount) != 'undefined') {
                    grandTotal += v.estimatedAmount;
                }
            }
        })
        return grandTotal;
    }
    $scope.getUomConversionFactor = function(ProductId, Quantity, FromUomId, ToUomId, callback) {
        data = {
            "Payload": {
                "ProductId": ProductId,
                "Quantity": Quantity,
                "FromUomId": FromUomId,
                "ToUomId": ToUomId
            }
        }
        if (!ProductId || !ToUomId || !FromUomId  ) {
        	return;
        }
        if ( ToUomId == FromUomId ) {
            callback(1);
            return;
        }
        Factory_Master.getUomConversionFactor(data, function(response) {
            if (response) {
                if (response.status == true) {
                    callback(response.data.payload);
                } else {
                    toastr.error("An error has occured!")
                }
            }
        })
    }
    $scope.checkIfShowPaymentProofButton = function() {
        shouldDisplay = false;
        $.each($rootScope.screenButtons, function(k, v) {
            if (v.label == "UpdatePaymentProofDetails") {
                shouldDisplay = true;
            }
        })
        return shouldDisplay;
    }
    $scope.isPaymentProofEnabled = function() {
        return !$scope.paymentProofEnabled;
    }
    $scope.updatePaymentProofDetails = function() {
        data = '';
        Factory_Master.updatePaymentProofDetails(data, function(response) {
            if (response) {
                if (response.status == true) {
                    // toastr.success("Payment proof details updated");
                    $scope.paymentProofEnabled = true;
                } else {
                    $scope.paymentProofEnabled = false;
                    toastr.error("An error has occured!");
                }
            }
        })
    }
    $scope.filterInvoiceCostTypeDropdown = function() {
        $scope.filterCostTypesByAdditionalCost()
    }

    $scope.computeInvoiceTotalConversion = function(conversionRoe, conversionTo) {
    	if (!conversionRoe || !conversionTo /*|| !$scope.formValues.invoiceSummary*/) {
    		return false;
    	}
    	if (typeof($scope.CM.changedFromCurrency) == 'undefined') {
    		$scope.CM.changedFromCurrency = false;
    	}
    	payloadData = {
		     "Amount" : $scope.formValues.invoiceSummary.invoiceAmountGrandTotal,
		     "CurrencyId": $scope.formValues.invoiceRateCurrency.id,
		     "ROE": conversionRoe,
		     "ToCurrencyId": conversionTo.id,
		     "CompanyId": $scope.formValues.orderDetails.carrierCompany.id,
		     "GetROE":  $scope.CM.changedFromCurrency
		}
	    Factory_Master.invoiceTotalConversion(payloadData, function(callback) {
	        if (callback.status == true) {
	        	if (callback.data.getROE) {
		        	$scope.CM.convertedAmount = callback.data.convertedAmount;
		        	$scope.CM.conversionRoe = callback.data.roe
	        	} else {
	        		if ($scope.CM.changedFromCurrency) {
		        		toastr.warning("There is no conversion rate available for current selection")
	        		} else {
			        	$scope.CM.convertedAmount = callback.data.convertedAmount;
			        	$scope.CM.conversionRoe = callback.data.roe
	        		}
	        	}
	        }
	    });
    	$scope.CM.changedFromCurrency = false
    }

    $scope.getProductTypeById = function(id){
        var prodType = _.filter($scope.listsCache.ProductType, ['id', id]);
        return prodType[0].name;
    }


    $scope.setPageTitle = function(title){
        if(title){
            //tab title
            // var title = "Invoice - " + title;
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            })
        }else{
           // page title
        //    debugger;
           var invoicePageTitles = {};
           invoicePageTitles['claims'] = 'Invoice Claims List';
  
            if(invoicePageTitles[$state.params.screen_id]){
               $state.params.title = invoicePageTitles[$state.params.screen_id];
               $scope.setPageTitle($state.params.title);
            }

        }
    }

    $scope.$on('formValues', function(){
        // debugger;
        if(vm.screen_id == "invoice"){
            //1.if request available, use request id
            if($scope.formValues.requestInfo){
                if($scope.formValues.requestInfo.request){
                    var title = "Invoice - " + $scope.formValues.requestInfo.request.name + " - " + $scope.formValues.requestInfo.vesselName;
                    $scope.setPageTitle(title);
                    return;
                }
            }

            //2. else use order id
            if($scope.formValues.orderDetails){
                if($scope.formValues.orderDetails.order){
                    var invoiceTitle = "Invoice - " + $scope.formValues.orderDetails.order.name + " - " + $scope.formValues.orderDetails.vesselName;
                    $scope.setPageTitle(invoiceTitle);
                    return;
                }
            }

            //3. use invoice name
            if($scope.formValues.id){
                var invoiceTitle = "Invoice - INV" + $scope.formValues.id + " - " + $scope.formValues.orderDetails.vesselName;
                $scope.setPageTitle(invoiceTitle);
            }


            $scope.recalcultateAdditionalCost();

        }

    })


    $scope.setPageTitle = function(title){
        if(title){
            //tab title
            // var title = "Invoice - " + title;
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            })
        }else{
           // page title
        //    debugger;
           var invoicePageTitles = {};
           invoicePageTitles['claims'] = 'Invoice Claims List';
  
            if(invoicePageTitles[$state.params.screen_id]){
               $state.params.title = invoicePageTitles[$state.params.screen_id];
               $scope.setPageTitle($state.params.title);
            }

        }
    }


    $scope.recalcultateAdditionalCost = function(){
  
        // console.log("   ***   $scope.formValues   *** ", $scope.formValues );
        // console.log("   ***   $scope.formValues.costDetails   *** ", $scope.formValues.costDetails );


        // // loop costs and for each cost calculate conversionRate for the product
        // // or all conversion rates if cost is for all products
        // if($scope.formValues.costDetails){

        //     $.each($scope.formValues.costDetails, function(_, cost_val){
    
        //         cost_val.prodConv = []; // new array
        //         if(cost_val.isAllProductsCost){
        //             // single product, make call for that and put at its index (same place as in orderDetails.products )in prodCond
    
        //             $.each($scope.formValues.orderDetails.products, function(prod_key, prod_val){
        //                 if(prod_val.product.id == cost_val.product.id){
    
        //                     // make call
        //                     var converted = setConvertedAddCost(prod_val, cost_val);
        //                     cost_val.prodConv[prod_key] = converted;
        //                 }
        //             });
    
    
        //         }else{
                
        //             // if all products, make whole array with conversion factors, all at their respective indexes
        //             $.each($scope.formValues.orderDetails.products, function(prod_key, prod_val){
    
        //                 // make call
        //                 var converted =  setConvertedAddCost(prod_val, cost_val);
        //                 cost_val.prodConv[prod_key] = converted;
                   
        //             });
        //         }
        //     });
        // }else{
        //     console.log("No cost details");
        // }



        // // after all conversion factors are calculated(retrieved from be) call calculateAdditionalCostAmounts
        // $.each($scope.formValues.costDetails, function(_, cost_val){

        //     // cost_val.estimatedAmount  = "5555";
        //     prod  = calculateAdditionalCostAmounts(cost_val, cost_val.product);
        //     cost_val.estimatedAmount = prod.estimatedAmount;
        //     // console.log("calculated", cost_val.estimatedAmount);
        //     // calculateAdditionalCostAmounts(cost_val, cost_val.product);
        // })

    }
       
         
    function setConvertedAddCost(product, additionalCost, i) {

        // product.id, 1, uom.id, priceUom.id
      
        // cost.product.id
        // cost.invoiceQuantityUom.id
        // cost.invoiceRateCurrency.id

        // data.productId, 1, prod.quantityUom.id, additionalCost.priceUom.id
   

        lookupModel.getConvertedUOM(product.product.id, 1, additionalCost.estimatedRateUom.id, additionalCost.deliveryQuantityUom.id).then(function (server_data) {
            return server_data.payload;
        }).catch(function (e) {
            throw 'Unable to get the uom.';
        });
    }

    function isProductComponent(additionalCost) {
        if (!additionalCost.additionalCost) {
            return false;
        }
        if (vm.additionalCostTypes[additionalCost.costName.id].componentType) {
            additionalCost.isTaxComponent = (vm.additionalCostTypes[additionalCost.costName.id].componentType.id === COMPONENT_TYPE_IDS.TAX_COMPONENT);
            return ctrl.additionalCostTypes[additionalCost.costName.id].componentType.id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT;
        } else { }
        return null;
    }

    function sumProductAmounts() {
        var result = 0;
        for (var i = 0; i < $scope.formValues.orderDetails.products; i++) {
            if (!$scope.formValues.productDetails[i].status) {
                    result += $scope.formValues.orderDetails.productss[i].amount;
            } else {
                if($scope.formValues.productDetails[i].status.id != ctrl.STATUS['Cancelled'].id) {
                    result += $scope.formValues.orderDetails.products[i].amount;
                }
            }             
        }
        return result;
    }

     /**
         * Calculates the amount-related fields of an additional cost, as per FSD p. 210: Amount, Extras Amount, Total Amount.
         */



        function calculateAdditionalCostAmounts(additionalCost, product) {
            var totalAmount, productComponent;
            if (!additionalCost.costType) {
                return additionalCost;
            }
            switch (additionalCost.costType.id) {
                case COST_TYPE_IDS.UNIT:

                    additionalCost.estimatedAmount = 0;

                    if (additionalCost.priceUom && additionalCost.prodConv){
                        for (var i = 0; i < $scope.formValues.orderDetails.products.length; i++) {

                            var prod = $scope.formValues.orderDetails.products[i];
                    
       
                            if (!prod.status) {

                                // product w. no status 
                                confirmedQuantityOrMaxQuantity = prod.confirmedQuantity ? prod.confirmedQuantity : prod.maxQuantity;
                                
                                if (additionalCost.isAllProductsCost){                                        
                                    //estimatedAmount calculation
                                    additionalCost.estimatedAmount = additionalCost.amount + confirmedQuantityOrMaxQuantity * additionalCost.prodConv[i] * additionalCost.price;
                                }
	                            else{
                                    // check if product sent to function for calculation is the same as current product in list.
	                                if (product === prod){
                                        additionalCost.estimatedAmount = confirmedQuantityOrMaxQuantity * additionalCost.prodConv[i] * additionalCost.price;
                                    }
                                }
                            } else {

                                // if status set
	                        	if (prod.status.id != ctrl.STATUS['Cancelled'].id) {
                                    confirmedQuantityOrMaxQuantity = prod.confirmedQuantity ? prod.confirmedQuantity : prod.maxQuantity;
                                    
                                if (additionalCost.isAllProductsCost){

                                    additionalCost.estimatedAmount = additionalCost.estimatedAmount + confirmedQuantityOrMaxQuantity * additionalCost.prodConv[i] * additionalCost.price;
                                }
                                else{

                                    if (product === prod) 
                                        additionalCost.estimatedAmount = confirmedQuantityOrMaxQuantity * additionalCost.prodConv[i] * additionalCost.price;
                                }
	                        	}
                            }
                        }
                    }
                    //else {
                    //    additionalCost.amount = additionalCost.confirmedQuantity * additionalCost.price;
                    //}
                    break;
                case COST_TYPE_IDS.FLAT:
                    additionalCost.estimatedAmount = additionalCost.price || 0;
                    break;
                case COST_TYPE_IDS.PERCENT:
                    productComponent = isProductComponent(additionalCost);
                    if (additionalCost.isAllProductsCost || !productComponent) {
                        totalAmount = sumProductAmounts();
                    } else {
                        totalAmount = product.estimatedAmount;
                    }
                    if (productComponent) {
                        additionalCost.estimatedAmount = totalAmount * additionalCost.price / 100 || 0;
                    } else {
                        totalAmount += sumProductComponentAdditionalCostAmounts();
                        additionalCost.estimatedAmount = totalAmount * additionalCost.price / 100 || 0;
                    }
                    break;
            }
            // if (!product) {
            //     product = ctrl.data.products[0]
            // }
            // additionalCost.quantityUom = parseFloat(additionalCost.confirmedQuantity) ? parseFloat(product.quantityUom) : parseFloat(product.minMaxQuantityUom);
            // additionalCost.confirmedQuantity = parseFloat(additionalCost.confirmedQuantity) ? parseFloat(additionalCost.confirmedQuantity) : parseFloat(product.maxQuantity);
            // additionalCost.extrasAmount = parseFloat(additionalCost.extras) / 100 * parseFloat(additionalCost.amount) || 0;
            // additionalCost.totalAmount = parseFloat(additionalCost.amount) + parseFloat(additionalCost.extrasAmount);
            // additionalCost.rate = parseFloat(additionalCost.totalAmount) / parseFloat(additionalCost.confirmedQuantity);


            // return all additional cost in the end
            return additionalCost;


        }

}]);

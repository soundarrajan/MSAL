/**
 * Contract Management Controller
 */
APP_CONTRACT.controller('Controller_Contract', [ '$scope', '$rootScope', '$Api_Service', '$listsCache', 'Factory_Contract', '$state', '$filter', '$location', '$q', '$compile', 'Factory_Master', '$timeout', '$templateCache', '$uibModal', '$tenantSettings', 'statusColors', 'screenLoader', 'tenantService', function($scope, $rootScope, $Api_Service, $listsCache, Factory_Contract, $state, $filter, $location, $q, $compile, Factory_Master, $timeout, $templateCache, $uibModal, $tenantSettings, statusColors, screenLoader, tenantService) {
    let vm = this;
    // console.log('Controller_Contract',vm);
    let guid = '';
    vm.master_id = $state.params.master_id;
    vm.entity_id = $state.params.entity_id;
    $scope.addedFields = new Object();
    vm.response = '';
    vm.ids = '';
    $scope.tenantCurrency = $tenantSettings.tenantFormats.currency;
    $scope.tenantUom = $tenantSettings.tenantFormats.uom;

    if ($state.params.path) {
        vm.app_id = $state.params.path[0].uisref.split('.')[0];
    }
    if ($scope.screen) {
        vm.screen_id = $scope.screen;
    } else {
        vm.screen_id = $state.params.screen_id;
    }

    tenantService.tenantSettings.then((settings) => {
        ctrl.defaultContractAgreementType = settings.payload.defaultValues.defaultContractAgreementType;
        if(!$scope.formValues.agreementType && !$rootScope.defaultedContractAgreementType) {
        	$rootScope.defaultedContractAgreementType = true;
            $scope.formValues.agreementType = ctrl.defaultContractAgreementType;
	        $scope.triggerChangeFieldsAppSpecific('AgreementType');
        }
    });


    // $scope.CM.get_master_entity(1, "configuration", "admin", function(callback2);
    // if(typeof($scope.CM.adminConfiguration) == 'undefined'){
    //     $scope.CM.adminConfiguration = {};
    //     Factory_Master.get_master_entity(1, "configuration", "admin", function(callback2) {
    //         if (callback2) {
    //             $scope.CM.adminConfiguration = callback2;
    //         }
    //     });
    // }
    vm.contractTree = [];
    vm.contractCatalog = function() {
        vm.contractTree = [
            // Contracts List
            {
                id: 1,
                title: 'Contracts',
                slug: 'contract',
                icon: 'fa fa-folder icon-lg',
                nodes: 1
            },
            // Contract Product Delivery
            {
                id: 2,
                title: 'Contract Product Delivery',
                slug: 'productdelivery',
                icon: 'fa fa-folder icon-lg',
                nodes: 1
            },
            // Contract Planning
            {
                id: 3,
                title: 'Contract Planning',
                slug: 'planning',
                icon: 'fa fa-folder icon-lg',
                nodes: 1
            },
        ];
    };

    $scope.initContractScreen = function() {
        console.log($rootScope.adminConfiguration);
        if (typeof $scope.formValues.status != 'undefined') {
            if ($scope.formValues.status.name) {
                // $state.params.title = "DEL - " + delID + " - " + $scope.formValues.order.name + ' - ' + $scope.formValues.temp.deliverysummary.vesselName;
                // $state.params.title = 'CTRL' + $scope.formValues.name;
                if (!$state.params.status) {
                	$state.params.status = {};
                }
                // $state.params.status.name = $scope.formValues.status.name;
                $state.params.status.name = $scope.formValues.status.displayName;
                $state.params.status.bg = statusColors.getColorCodeFromLabels($scope.formValues.status, $listsCache.ScheduleDashboardLabelConfiguration);
                $state.params.status.color = 'white';
            }
        } else {
            $state.params.status = null;
        }

        if (!$scope.formValues.applyTo) {
        	$scope.formValues.applyTo = { id:3 };
        }
        if ($rootScope.adminConfiguration) {
        	vm.adminConfiguration = $rootScope.adminConfiguration;
        	$scope.adminConfigurationContract = $rootScope.adminConfiguration.contract;
        }
        if ($rootScope.adminConfiguration.contract.agreementTypeDisplay.id != 1) {
        	$.each($scope.formFields['General Contract Information'].children, (k, v) => {
        		if (v.Unique_ID == 'agreementType') {
        			v.Hidden = true;
		    		$scope.formFields['General Contract Information'].children.splice(k, 1);
        		}
            });
        }
    };

    $rootScope.$watch('adminConfiguration', () => {
    	if (typeof $rootScope.adminConfiguration != 'undefined') {
	    	vm.adminConfiguration = $rootScope.adminConfiguration;
	    	$scope.adminConfigurationContract = $rootScope.adminConfiguration.contract;
    	}
    });


    $scope.disableFieldsIfConfirmed = function() {
    	$('.app_contracts_screen_contract').addClass('disableAll');
        var elements = $("input");
        for (let i = 0; i < elements.length; i++) {
            if (!$(elements[i]).parent().hasClass("conversion-table") && $(elements[i]).prop('id') != 'effectiveFrom_dateinput') {
                $(elements[i]).attr('disabled', 'disabled');
            }
        }
        var selects = $("select");
        for (let i = 0; i < selects.length; i++) {
            if (!$(selects[i]).parent().hasClass("conversion-table")) {
                $(selects[i]).attr('disabled', 'disabled');
            }
        }
       
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll textarea').attr('disabled', 'disabled');
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll .btn.date-set').attr('disabled', 'disabled');
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll .date-picker').attr('disabled', 'disabled');
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll .add-product').css('pointer-events', 'none');
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll .input-group-addon').css('pointer-events', 'none');
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll .remove-product').hide();
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll .addData').hide();
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll .fa-minus').parent().hide();
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll table span.insert').hide();
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll table span.remove').hide();
    	$('.dynamic_form_editor.app_contracts_screen_contract.disableAll span.formatted-date').addClass('bg-grey-steel');
    };


    vm.selectContractScreen = function(id, name) {
        $location.path(`/contracts/${ id}`);
        $scope.contract_screen_name = name;
    };
    vm.addProductToContract = function() {
        console.log($scope.formValues);
        let emptyProductObj = {
            id: 0,
            details: [
                {
                    contractualQuantityOption: {
                        id: 1,
                        name: 'TotalContractualQuantity',
                        code: '',
                        collectionName: null
                    },
                    id: 0,
                    uom : $tenantSettings.tenantFormats.uom
                }
            ],
            additionalCosts: [],
            fixedPrice: true,
            mtmFixed:true
        };
        if ($scope.formValues) {
            if (!$scope.formValues.products) {
                $scope.formValues.products = [];
                $scope.formValues.products.push(emptyProductObj);
            } else {
                $scope.formValues.products.push(emptyProductObj);
            }
        } else {
            $scope.formValues = {};
            $scope.formValues.products = [];
            $scope.formValues.products.push(emptyProductObj);
        };
        calculateProductTabWidth();
        setTimeout(() => {
            $('.top-tab-section .products-tabs').animate({ scrollLeft: $('.top-tab-section .products-tabs .product-item').width() * $('.top-tab-section .products-tabs .product-item').length }, 400);
            $('.top-tab-section .products-tabs .product-item').last().click();
        }, 50);
    };

    $scope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
        calculateProductTabWidth();
    });

    $('body').on('mouseover', '.products-tabs-inner .product-item:not(\'.tab-view\')', function(e) {
        $(this).addClass('no-clicks');
    });

    vm.initOnLoad = function() {
        calculateProductTabWidth();
    };

    vm.addNewProduct = function(productIdx) {
        // console.log(productIdx);
        $scope.formValues.products[productIdx].details.push({ id: 0 });
    };

    $scope.triggerChangeFieldsAppSpecific = function(name, id) {
        if (name == 'Seller') {
            vm.getOptions({
                Name: 'primaryContact',
                Type: 'dropdown',
                masterSource: 'primaryContact',
                Filter: [ {
                    ColumnName: 'primaryContact',
                    OperationType: 0,
                    ValueType: 5,
                    Value: 0,
                    ValueFrom: 'seller.id'
                } ],
                Unique_ID: 'primaryContact'
            });
            Factory_Master.get_master_entity($scope.formValues.seller.id, 'counterparty', 'masters', (callback) => {
                if (callback) {
                    if (callback.defaultPaymentTerm != null) {
                        $scope.formValues.paymentTerm = callback.defaultPaymentTerm;
                    }
                }
            });
        }
        if (name == 'AgreementType') {
            Factory_Master.get_master_entity($scope.formValues.agreementType.id, 'agreementtype', 'masters', (callback) => {
                if (callback) {
                    $scope.formValues.incoterm = callback.defaultIncoterm;
                    $scope.formValues.strategy = callback.defaultStrategy;
                }
            });
        }
        if (typeof name == 'undefined') {
            if(id == 'products') {
                if(typeof $scope.formValues.products != 'undefined') {
                    $.each($scope.formValues.products, (key, val) => {
                        if(typeof val != 'undefined') {
                            if(typeof val.product != 'undefined') {
                                $scope.getSpecGroupByProduct(val.product.id);
                            }
                        }
                    });
                }
            }
        }
        if (typeof name == 'undefined') {
            return;
        }
        if (name.indexOf('product_location') != -1) {
            let index = name.split('.')[1];
            $scope.getAdditionalCosts($scope.formValues.products[index].location.id, index);
        }
        // if (name == "Strategy") {
        //     $scope.checkIfFormulaForStrategyAndProduct();
        // }
        if (name == 'Evergreen') {
            $scope.formValues.validTo = null;
        }
        if (name == 'Company') {
        	if (vm.entity_id == 0 || !vm.entity_id) {
        		$scope.formValues.allowedCompanies = [];
        		$.each($scope.CM.listsCache.Company, (k, v) => {
        			if (v.id != $scope.formValues.company.id) {
        				$scope.formValues.allowedCompanies.push(v);
        			}
        		});
        		// console.log(vm.listsCache.Company)
        	}
        }
    };

    vm.getOptions = function(field) {
        // Move this somewhere nice and warm
        var objectByString = function(obj, string) {
            if (string.includes('.')) {
                return objectByString(obj[string.split('.', 1)], string.replace(`${string.split('.', 1) }.`, ''));
            }
            return obj[string];
        };
        if (field) {
            if (field.Filter && typeof $scope.formValues != 'undefined') {
                field.Filter.forEach((entry) => {
                    if (entry.ValueFrom == null) {
                        return;
                    }
                    let temp = 0;
                    try {
                        temp = _.get($scope, "formValues[" +  entry.ValueFrom.split(".").join("][") + "]");
                    } catch (error) {}
                    entry.Value = temp;
                });
            }
            if (!$scope.options) {
                $scope.options = [];
            }
            Factory_Master.get_master_list(vm.app_id, vm.screen_id, field, (callback) => {
                if (callback) {
                    $scope.options[field.Name] = callback;
                    $scope.$watchGroup([ $scope.formValues, $scope.options ], () => {
                        $timeout(() => {
                        	var id;
                            if (field.Type == 'textUOM') {
                                id = `#${ field.Name}`;
                            } else {
                                id = `#${ field.masterSource }${field.Name}`;
                            }
                            if ($(id).data('val')) {
                                $(id).val($(id).data('val'));
                            }
                        }, 50);
                    });
                }
            });
        }
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

    $scope.save_master_changes_controllerSpecific = function(ev, editInstance) {
        vm.editInstance = editInstance;
	    var hasTotalContractualQuantity = false;
	    if (!$scope.formValues.products) {
	    	toastr.error('You must add at least one product in the contract');
	    	return;
        }
        // chech for product location to be obj
        var notValidLocation = false;
        $.each($scope.formValues.products, (key, val) => {
            if(typeof val.location != 'object') {
                var keyno = key + 1;
                toastr.error(`Please select a valid location for product ${ keyno }.`);
                notValidLocation = true;
            } else if (val.isFormula == true && typeof val.formula != 'object' ||
                        val.mtmFixed == false && typeof val.mtmFormula != 'object') {
                var keyno = key + 1;
                toastr.error(`Please select a valid Formula for Product ${ keyno }.`);
                notValidLocation = true;
            }
        });
        if(notValidLocation) {
            vm.editInstance.$valid = false;
            return;
        }
	    if ($scope.formValues.products.length == 0) {
	    	toastr.error('You must add at least one product in the contract');
	    	return;
	    }
	    var minQuyanityValidationError = false;
	    $.each($scope.formValues.details, (k, v) => {
	    	if (typeof v != 'undefined') {
                if(typeof v.contractualQuantityOption != 'undefined') {
    		        if (v.contractualQuantityOption.name == 'TotalContractualQuantity') {
    		            hasTotalContractualQuantity = true;
    		        }
                }
                if (v.minContractQuantity && v.maxContractQuantity) {
                    if (convertDecimalSeparatorStringToNumber(v.minContractQuantity) > convertDecimalSeparatorStringToNumber(v.maxContractQuantity)) {
                        minQuyanityValidationError = true;
                    }
                }
	    	}
	    });
	    if (minQuyanityValidationError) {
            toastr.error('Min Quantity must be smaller that Max Quantity ');
	        vm.editInstance.$valid = false;
	        return;
	    }
	    if (!hasTotalContractualQuantity) {
	        toastr.error('TotalContractualQuantity option is required in Contractual Quantity section');
	        vm.editInstance.$valid = false;
	    }

        // test dates
        var notValid = $scope.testForValidDates();
        if(notValid) {
            vm.editInstance.$valid = false;
            return;
        }

        $scope.formValues.products.forEach((product, index) => {
            let productQtyDetails = product.details;
            let selectedQtyTypes = [];
            if (product.isFormula == true && !product.formula) {
                toastr.error(`Product ${ parseFloat(index + 1) } has an error: Formula type selected but no formula is assigned`);
                vm.editInstance.$valid = false;
            }

            if (product.isMtmFormula == true && !product.mtmFormula || product.isMtmFormula == false && !product.mtmPrice) {
                toastr.error(`Product ${ parseFloat(index + 1) } has an error: Either Price or MTM Formula should be assigned with a valid value`);
                vm.editInstance.$valid = false;
            }

            if ($scope.formValues.productQuantityRequired == true) {
                $scope.formValues.products[index].details.forEach((detail, detailIdx) => {
                    if (parseFloat($scope.formValues.products[index].details[detailIdx].minContractQuantity) > parseFloat($scope.formValues.products[index].details[detailIdx].maxContractQuantity)) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: Min Qty must me smaller than Max Qty on: ${ $scope.formValues.products[index].details[detailIdx].contractualQuantityOption.name}`);
                        vm.editInstance.$valid = false;
                    }
                    if (typeof $scope.formValues.products[index].details[detailIdx].contractualQuantityOption != 'undefined') {
                        selectedQtyTypes.push($scope.formValues.products[index].details[detailIdx].contractualQuantityOption.name);
                    }
                    if (typeof $scope.formValues.products[index].details[detailIdx].contractualQuantityOption != 'undefined') {
                        if ($scope.formValues.products[index].details[detailIdx].contractualQuantityOption.name == 'TotalContractualQuantity') {
                            $($scope.formValues.details).each((contractDetailIdx) => {
                                if (typeof $scope.formValues.details[contractDetailIdx].contractualQuantityOption != 'undefined') {
                                    if ($scope.formValues.details[contractDetailIdx].contractualQuantityOption.name == 'Total') {
                                        if ($scope.formValues.details[contractDetailIdx].maxContractQuantity < $scope.formValues.products[index].details[detailIdx].maxContractQuantity) {
                                            toastr.error(`Product ${ parseFloat(index + 1) }has an error: max Quantity must be smaller that max Quantity from Contract`);
                                            vm.editInstance.$valid = false;
                                        }
                                        if (parseFloat($scope.formValues.details[contractDetailIdx].minContractQuantity) < parseFloat($scope.formValues.products[index].details[detailIdx].minContractQuantity)) {
                                            toastr.error(`Product ${ parseFloat(index + 1) }has an error: min Quantity must be smaller that min Quantity from Contract`);
                                            vm.editInstance.$valid = false;
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
                let isDuplicate = selectedQtyTypes.some((item, idx) => {
                    return selectedQtyTypes.indexOf(item) != idx;
                });
                if (isDuplicate == true) {
                    toastr.error(`Product ${ parseFloat(index + 1) } has an error: One of the quantity types is duplicated`);
                    vm.editInstance.$valid = false;
                } else {
                    var compProductQtyDetails = [];
                    productQtyDetails.forEach((detail, index2) => {
                        if (typeof detail.contractualQuantityOption != 'undefined') {
                            compProductQtyDetails[detail.contractualQuantityOption.name] = [ detail.minContractQuantity, detail.maxContractQuantity ];
                        } else {
                            toastr.error(`Product ${ parseFloat(index + 1) } has an error: Please select Quant. Type`);
                            vm.editInstance.$valid = false;
                        }
                    });
                    // console.log(compProductQtyDetails);
                    /* min qty*/
                    if (compProductQtyDetails.PerLift && compProductQtyDetails.PerDay && parseFloat(compProductQtyDetails.PerLift[0]) > parseFloat(compProductQtyDetails.PerDay[0])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerLift Min Qty is bigger than PerDay`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerLift && compProductQtyDetails.PerWeek && parseFloat(compProductQtyDetails.PerLift[0]) > parseFloat(compProductQtyDetails.PerWeek[0])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerLift Min Qty is bigger than PerWeek`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerLift && compProductQtyDetails.PerMonth && parseFloat(compProductQtyDetails.PerLift[0]) > parseFloat(compProductQtyDetails.PerMonth[0])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerLift Min Qty is bigger than PerMonth`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerLift && compProductQtyDetails.TotalContractualQuantity && parseFloat(compProductQtyDetails.PerLift[0]) > parseFloat(compProductQtyDetails.TotalContractualQuantity[0])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerLift Min Qty is bigger than TotalContractualQuantity`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerDay && compProductQtyDetails.PerWeek && parseFloat(compProductQtyDetails.PerDay[0]) > parseFloat(compProductQtyDetails.PerWeek[0])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerDay Min Qty is bigger than PerWeek`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerDay && compProductQtyDetails.PerMonth && parseFloat(compProductQtyDetails.PerDay[0]) > parseFloat(compProductQtyDetails.PerMonth[0])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerDay Min Qty is bigger than PerMonth`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerDay && compProductQtyDetails.TotalContractualQuantity && parseFloat(compProductQtyDetails.PerDay[0]) > parseFloat(compProductQtyDetails.TotalContractualQuantity[0])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerDay Min Qty is bigger than TotalContractualQuantity`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerWeek && compProductQtyDetails.PerMonth && parseFloat(compProductQtyDetails.PerWeek[0]) > parseFloat(compProductQtyDetails.PerMonth[0])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerWeek Min Qty is bigger than PerMonth`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerWeek && compProductQtyDetails.TotalContractualQuantity && parseFloat(compProductQtyDetails.PerWeek[0]) > parseFloat(compProductQtyDetails.TotalContractualQuantity[0])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerWeek Min Qty is bigger than TotalContractualQuantity`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerMonth && compProductQtyDetails.TotalContractualQuantity && parseFloat(compProductQtyDetails.PerMonth[0]) > parseFloat(compProductQtyDetails.TotalContractualQuantity[0])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerMOnth Min Qty is bigger than TotalContractualQuantity`);
                        vm.editInstance.$valid = false;
                    }

                    /* end min qty*/
                    /* max qty*/
                    if (compProductQtyDetails.PerLift && compProductQtyDetails.PerDay && parseFloat(compProductQtyDetails.PerLift[1]) > parseFloat(compProductQtyDetails.PerDay[1])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerLift Max Qty is bigger than PerDay`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerLift && compProductQtyDetails.PerWeek && parseFloat(compProductQtyDetails.PerLift[1]) > parseFloat(compProductQtyDetails.PerWeek[1])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerLift Max Qty is bigger than PerWeek`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerLift && compProductQtyDetails.PerMonth && parseFloat(compProductQtyDetails.PerLift[1]) > parseFloat(compProductQtyDetails.PerMonth[1])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerLift Max Qty is bigger than PerMonth`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerLift && compProductQtyDetails.TotalContractualQuantity && parseFloat(compProductQtyDetails.PerLift[1]) > parseFloat(compProductQtyDetails.TotalContractualQuantity[1])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerLift Max Qty is bigger than TotalContractualQuantity`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerDay && compProductQtyDetails.PerWeek && parseFloat(compProductQtyDetails.PerDay[1]) > parseFloat(compProductQtyDetails.PerWeek[1])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerDay Max Qty is bigger than PerWeek`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerDay && compProductQtyDetails.PerMonth && parseFloat(compProductQtyDetails.PerDay[1]) > parseFloat(compProductQtyDetails.PerMonth[1])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerDay Max Qty is bigger than PerMonth`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerDay && compProductQtyDetails.TotalContractualQuantity && parseFloat(compProductQtyDetails.PerDay[1]) > parseFloat(compProductQtyDetails.TotalContractualQuantity[1])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerDay Max Qty is bigger than TotalContractualQuantity`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerWeek && compProductQtyDetails.PerMonth && parseFloat(compProductQtyDetails.PerWeek[1]) > parseFloat(compProductQtyDetails.PerMonth[1])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerWeek Max Qty is bigger than PerMonth`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerWeek && compProductQtyDetails.TotalContractualQuantity && parseFloat(compProductQtyDetails.PerWeek[1]) > parseFloat(compProductQtyDetails.TotalContractualQuantity[1])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerWeek Max Qty is bigger than TotalContractualQuantity`);
                        vm.editInstance.$valid = false;
                    }
                    if (compProductQtyDetails.PerMonth && compProductQtyDetails.TotalContractualQuantity && parseFloat(compProductQtyDetails.PerMonth[1]) > parseFloat(compProductQtyDetails.TotalContractualQuantity[1])) {
                        toastr.error(`Product ${ parseFloat(index + 1) } has an error: PerMOnth Max Qty is bigger than TotalContractualQuantity`);
                        vm.editInstance.$valid = false;
                    }

                    /* end max qty*/
                }
            }
        });


        if(!vm.editInstance.$valid) {
            $scope.submitedAction = false;
            vm.invalid_form = true;
            let message = 'Please fill in required fields:';
            let names = [];
            $.each(vm.editInstance.$error.required, (key, val) => {
                if(val.$name == 'incoterm') {
                    message = `${message }${'<br>' + 'Delivery Term'}`;
                    names = `${names }Delivery Term`;
                } else{
                    if (names.indexOf(val.$name) == -1) {
                        message = `${message }<br>${ val.$name}`;
                    }
                    names = names + val.$name;
                }
            });
            var i = 0;
            $.each(vm.editInstance.$error.pattern, (key, val) => {
                i++;
                if (i === 1) {
                    message = `${message }<br>Please check format:`;
                }
                message = `${message }<br>${ val.$name}`;
            });
            toastr.error(message);
            setTimeout(() => {
                $scope.submitedAction = false;
            }, 100);
        }

        return vm.editInstance.$valid;
    };


    $scope.trueOptionVal = function(val, name) {
        if (vm.entity_id > 0) {
            if (!$scope.predefinedVal) {
                $scope.predefinedVal = {};
            }
            $scope.$watch('formValues', () => {
                if (!angular.equals($scope.formValues, {})) {
                    try {
                        $scope.predefinedVal[name] = eval('$scope.' + val);
                    } catch (e) {
                    }
                }
            });
            return $scope.predefinedVal[name];
        }
    };

    $scope.getDefaultCostType = function(productId, costId, itemID) {
        Factory_Master.get_master_entity(itemID.id, 'additionalcost', 'masters', (callback) => {
            if (callback) {
                $scope.formValues.products[productId].additionalCosts[costId].costType = callback.costType;
                setTimeout(() => {
                    $scope.refreshSelect();
                });
            }
        });
    };

    $scope.testForValidLocation = function() {
        var notValidLocation = false;
        $.each($scope.formValues.products, (key, val) => {
            if(typeof val.location != 'object') {
                let keyno = key + 1;
                toastr.error(`Please select a valid location for product ${ keyno }.`);
                notValidLocation = true;
            }
        });
        return notValidLocation;
    };
    $scope.testForValidDates = function() {
        var notValidDates = false;
        if(!$scope.formValues.evergreen) {
            let start = new Date($scope.formValues.validFrom);
            let startDate = start.getTime();
            let end = new Date($scope.formValues.validTo);
            let endDate = end.getTime();

            if (startDate > endDate) {
                toastr.error('Contract Start Date must be lesser than Contract End Date');
                notValidDates = true;
            }
        }
        return notValidDates;
    };
    $scope.checkAvailableProducts = function() {
	   	var availableProducts = 0;
   		$.each($scope.formValues.products, (k, v) => {
   			if(!v.id || v.isDeleted == false) {
   				availableProducts++;
   			}
   		});
   		return availableProducts > 0;
    };

    /* Contract Actions*/
    $scope.confirm_contract = function() {
        var notValid = $scope.testForValidLocation();
        if(notValid) {
            return;
        }
        notValid = $scope.testForValidDates();
        if(notValid) {
            return;
        }
        if (!$scope.checkAvailableProducts()) {
        	toastr.error('Contract must contain at least one product');
        	return false;
        }
        let data = $scope.formValues;
        screenLoader.showLoader();
        Factory_Master.confirm_contract(data, (response) => {
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    toastr.success(response.message);
                    screenLoader.hideLoader();
                    $state.reload();
                } else {
                    $scope.loaded = true;
                    screenLoader.hideLoader();
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.delete_contract = function() {
        let data = $scope.formValues;
        screenLoader.showLoader();
        Factory_Master.delete_contract(data, (response) => {
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    toastr.success(response.message);
                    screenLoader.hideLoader();
                    $state.reload();
                } else {
                    $scope.loaded = true;
                    screenLoader.hideLoader();
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.cancel_contract = function() {
        let data = $scope.formValues;
        Factory_Master.cancel_contract(data, (response) => {
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    toastr.success(response.message);
                    $state.reload();
                } else {
                    $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.extend_contract = function() {
    	var tpl = $templateCache.get('app-contract/views/extendContractModal.html');
        $scope.modalInstance = $uibModal.open({
            template: tpl,
            appendTo: angular.element(document.getElementsByClassName('page-container')),
            windowTopClass: 'fullWidthModal smallModal',
            // windowClass: 'limited-max-height',
            scope: $scope
        });
    };
    $scope.sendExtendContractData = function() {
        let data = $scope.formValues;
        window.actionLevel = 'Extend';
        Factory_Master.extend_contract(data, (response) => {
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    toastr.success(response.message);
                    $state.reload();
                } else {
                    $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.showFormulaHistory = function(productId) {
    	var data = {
    		ContractId :  vm.entity_id,
    		ContractProductId : productId
    	};
    	Factory_Master.getContractFormulas(data, (response) => {
            if (response) {
                $scope.formulaHistoryDataResponse = response.data;
		    	var tpl = $templateCache.get('app-contract/views/formulaHistory.html');
		        $scope.modalInstance = $uibModal.open({
		            template: tpl,
		            appendTo: angular.element(document.getElementsByClassName('page-container')),
		            windowTopClass: 'fullWidthModal',
		            // windowClass: 'limited-max-height',
		            scope: $scope
		        });
            }
        });
    };


    $scope.undo_confirm_contract = function() {
        var notValid = $scope.testForValidLocation();
        if(notValid) {
            return;
        }
        let data = $scope.formValues;
        screenLoader.showLoader();
        Factory_Master.undo_confirm_contract(data, (response) => {
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    toastr.success(response.message);
                    screenLoader.showLoader();
                    $state.reload();
                } else {
                    $scope.loaded = true;
                    screenLoader.hideLoader();
                    toastr.error(response.message);
                }
            }
        });
    };

    /* Contract Actions*/

    $scope.showFormulaHistory = function(productId) {
    	var data = {
    		ContractId :  vm.entity_id,
    		ContractProductId : productId
    	};
    	Factory_Master.getContractFormulas(data, (response) => {
            if (response) {
                $scope.formulaHistoryDataResponse = response.data;
		    	var tpl = $templateCache.get('app-contract/views/formulaHistory.html');
		        $scope.modalInstance = $uibModal.open({
		            template: tpl,
		            appendTo: angular.element(document.getElementsByClassName('page-container')),
		            windowTopClass: 'fullWidthModal',
		            // windowClass: 'limited-max-height',
		            scope: $scope
		        });
            }
        });
    };

    $scope.previewContract = function(templateId, templateName) {
        var data = {
            Filters: [ {
                ColumnName: 'ContractId',
                Value: vm.entity_id
            }, {
                ColumnName: 'TemplateId',
                Value: templateId
            }, {
                ColumnName: 'TemplateName',
                Value: templateName
            } ]
        };
        Factory_Master.contract_preview(data, (response) => {
            if (response) {
                if (response.status == true) {
                    console.log(response.data.content);
                    $rootScope.contractPreviewContent = response.data.content;
                    $rootScope.contractPreviewData = response.data;
                }
            }
        });
    };


    $scope.changeContractEmailTemplate = function(value) {
        $rootScope.currentEmailTemplate = value.id;
        var data = {
            Payload: {
                Filters: [ {
                    ColumnName: 'ContractId',
                    Value: vm.entity_id
                }, {
                    ColumnName: 'TemplateId',
                    Value: value.id
                }, {
                    ColumnName: 'TemplateName',
                    Value: value.name
                } ]
            }
        };
        Factory_Master.contract_preview_email(data, (response) => {
            if (response) {
                if (response.status == true) {
                    $scope.$emit('previewEmail', response.data);
                } else {
                    $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        });
    };

    $scope.setConfirmContract = function(value) {
        let object = $filter('filter')($scope.emailTemplates, { name: 'ContractConfirmationEmailTemplate' })[0];
        $scope.CM.ContractEmailTemplate = object;
        $scope.changeContractEmailTemplate(object);
    };


    $scope.saveContractEmail = function() {
        var data = {
            Payload: {
                Id: $rootScope.previewEmail.comment.id,
                Name: $rootScope.previewEmail.comment.name,
                EmailTemplate: {
                    Id: $rootScope.currentEmailTemplate
                },
                BusinessId: $scope.formValues.seller.id
            }
        };
        Factory_Master.save_email_contract(data, (response) => {
            if (response) {
                if (response.status == true) {
                    toastr.success('Email Preview Saved!');
                    $state.reload();
                } else {
                    $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        });
    };

    $scope.getAdditionalCosts = function(locationId, index) {
        Factory_Master.get_master_entity(locationId, 'location', 'masters', (callback) => {
            if (callback) {
                /* de mapat campurile care vin din locatie*/
                $scope.formValues.products[index].additionalCosts = callback.additionalCosts;
                $.each($scope.formValues.products[index].additionalCosts, (key, value) => {
                    $scope.formValues.products[index].additionalCosts[key].id = 0;
                    $scope.formValues.products[index].additionalCosts[key].extras = callback.additionalCosts[key].extrasPercentage;
                    $scope.formValues.products[index].additionalCosts[key].uom = callback.additionalCosts[key].priceUom;
                });
            }
        });
    };


    $scope.checkIfFormulaForStrategyAndProduct = function() {
        // console.log($scope.formValues);
        // if (typeof($scope['formValues']['strategy']) != 'undefined') {
        //     strategyId = $scope['formValues']['strategy']['id'];
        // } else {
        //     return
        // };
        // console.log(strategyId);
        // products = $scope.formValues.products;
        // $.each(products, function(key, value) {
        //     if (typeof(value.product) == 'undefined') {
        //         return
        //     };
        //     console.log(value.product.id);
        //     data = {
        //         "Payload": {
        //             "Filters": [{
        //                 "ColumnName": "StrategyId",
        //                 "Value": strategyId
        //             }, {
        //                 "ColumnName": "ProductId",
        //                 "Value": value.product.id
        //             }]
        //         }
        //     }
        //     Factory_Master.getByStrategyAndProduct(data, function(callback) {
        //         if (callback) {
        //             console.log(callback);
        //             if (callback.status == true && callback.data.id) {
        //                 value.isMtmFormula = true;
        //                 value.mtmFixed = false;
        //                 value.mtmformula = callback.data;
        //             }
        //         }
        //     });
        // })
    };
    $scope.changeContractLayout = function(param) {
        if (!param) {
            var newSidebarHeight = $('.group_contractualQuantity').offset().top - 173;
            $('.group_ContractSummary').height(newSidebarHeight);
            $('.group_contractualQuantity, .group_ProductDetails,.group_Penalty ').addClass('col-md-12');
            $scope.CM.equalizeColumnsHeightGrouped('.group_ContractSummary', '.group_General_Contract, .group_contact');
        } else {
            $('.group_ContractSummary').height('calc(100% - 5px)');
            $('.group_contractualQuantity, .group_ProductDetails,.group_Penalty ').removeClass('col-md-12');
            $scope.CM.equalizeColumnsHeightGrouped('.group_ContractSummary', '.group_General_Contract, .group_contact, .group_contractualQuantity, .group_ProductDetails, .group_AdditionalCosts, .group_Penalty');
        }
        $scope.gridApi.core.handleWindowResize();
    };


    /* ContractDelivery*/
    $scope.triggerContractDeliveryModal = function(type) {
        tpl = $templateCache.get('app-general-components/views/modal_contractDelivery.html');
        $scope.triggerContractDeliveryModalType = type;
        $scope.selectedRowData = $('#flat_contractproductdeliveries').jqGrid.Ascensys.selectedRowData;
        if (!$scope.selectedRowData) {
            toastr.error('Please select a delivery!');
            return;
        }
        if (type == 'price') {
            if (!$scope.selectedRowData.priceFormulaId) {
                toastr.error('This delivery doesn\'t have a price formula!');
                return;
            }
        }
        if (type == 'mtm') {
            if (!$scope.selectedRowData.mtmFormulaId) {
                toastr.error('This delivery doesn\'t have a MTM formula!');
                return;
            }
        }
        if (type == 'exposure') {
            if (!$scope.selectedRowData.priceFormulaId && !$scope.selectedRowData.mtmFormulaId && $scope.selectedRowData != 0 && $scope.selectedRowData != null) {
                toastr.error('This delivery doesn\'t have a formula!');
                return;
            }
        }
        $scope.modalInstance = $uibModal.open({
            template: tpl,
            appendTo: angular.element(document.getElementsByClassName('page-container')),
            windowTopClass: 'fullWidthModal',
            windowClass: 'limited-max-height',
            scope: $scope
        });
    };
    $scope.getContractProductDeliveryPriceModalData = function(selectedRowData, currentPage) {
        $scope.entries = 5;
        var skip = $scope.entries * (currentPage - 1);
        var data = {
            Payload: {
                Filters: [ {
                    ColumnName: 'FormulaId',
                    Value: selectedRowData.priceFormulaId
                }, {
                    ColumnName: 'ProductId',
                    Value: selectedRowData.plannedProductId
                }, {
                    ColumnName: 'ContractId',
                    Value: selectedRowData.contractId
                }, {
                    ColumnName: 'DeliveryId',
                    Value: selectedRowData.deliveryId
                }, {
                    ColumnName: 'OrderId',
                    Value: selectedRowData.orderId
                }, {
                    ColumnName: 'Quantity',
                    Value: selectedRowData.deliveryId == 0 || selectedRowData.deliveryId == null ? selectedRowData.plannedQuantity : selectedRowData.actualQuantity
                }, {
                    ColumnName: 'PlannedDeliveryId',
                    Value: selectedRowData.plannedDeliveryId
                }, {
                    ColumnName: 'PlannedQuantityUomId',
                    Value: selectedRowData.plannedQuantityUomId
                }, {
                    ColumnName: 'ContractProductId',
                    Value: vm.entity_id
                } ],
                Pagination: {
                    Take: $scope.entries,
                    Skip: skip
                }
            }
        };
		var type = 'price';
        $scope.contractProductDeliveryActions(data, type);
        $scope.currentPage = currentPage;
    };
    $scope.getContractProductDeliveryMtmModalData = function(selectedRowData, currentPage) {
        $scope.entries = 10;
        var skip = $scope.entries * (currentPage - 1);
        var data = {
            Payload: {
                Filters: [ {
                    ColumnName: 'FormulaId',
                    Value: selectedRowData.mtmFormulaId
                }, {
                    ColumnName: 'ProductId',
                    Value: selectedRowData.plannedProductId
                }, {
                    ColumnName: 'ContractId',
                    Value: selectedRowData.contractId
                }, {
                    ColumnName: 'DeliveryId',
                    Value: selectedRowData.deliveryId
                }, {
                    ColumnName: 'OrderId',
                    Value: selectedRowData.orderId
                }, {
                    ColumnName: 'Quantity',
                    Value: selectedRowData.deliveryId == 0 || selectedRowData.deliveryId == null ? selectedRowData.plannedQuantity : selectedRowData.actualQuantity
                }, {
                    ColumnName: 'PlannedDeliveryId',
                    Value: selectedRowData.plannedDeliveryId
                }, {
                    ColumnName: 'PlannedQuantityUomId',
                    Value: selectedRowData.plannedQuantityUomId
                }, {
                    ColumnName: 'ContractProductId',
                    Value: vm.entity_id
                } ],
                Pagination: {
                    Take: $scope.entries,
                    Skip: skip
                }
            }
        };
        let type = 'mtm';
        $scope.contractProductDeliveryActions(data, type);
        $scope.currentPage = currentPage;
    };
    $scope.getContractProductDeliveryExposureModalData = function(selectedRowData, currentPage) {
        $scope.entries = 10;
        var skip = $scope.entries * (currentPage - 1);
        var data = {
            Payload: {
                Filters: [ {
                    ColumnName: 'FormulaId',
                    Value: selectedRowData.priceFormulaId
                }, {
                    ColumnName: 'ProductId',
                    Value: selectedRowData.plannedProductId
                }, {
                    ColumnName: 'ContractId',
                    Value: selectedRowData.contractId
                }, {
                    ColumnName: 'DeliveryId',
                    Value: selectedRowData.deliveryId
                }, {
                    ColumnName: 'OrderId',
                    Value: selectedRowData.orderId
                }, {
                    ColumnName: 'Quantity',
                    Value: selectedRowData.deliveryId == 0 || selectedRowData.deliveryId == null ? selectedRowData.plannedQuantity : selectedRowData.actualQuantity
                }, {
                    ColumnName: 'PlannedDeliveryId',
                    Value: selectedRowData.plannedDeliveryId
                }, {
                    ColumnName: 'PlannedQuantityUomId',
                    Value: selectedRowData.plannedQuantityUomId
                }, ],
                Pagination: {
                    Take: $scope.entries,
                    Skip: skip
                }
            }
        };
        var type = 'exposure';
        $scope.contractProductDeliveryActions(data, type);
        $scope.currentPage = currentPage;
    };
    $scope.contractProductDeliveryActions = function(data, type) {
        Factory_Master.contractProductDeliveryActions(data, type, (callback) => {
            if (callback) {
                if (callback.status == true) {
                    console.log(callback);
                    if (type == 'price') {
                        $scope.contractProductDeliveryPriceModalData = callback.data;
                        $.each($scope.contractProductDeliveryPriceModalData.schedule, (key, value) => {
                            value.initialQty = value.quantity.splittedQuantity;
                        });
                        $scope.contractProductDeliveryPriceModalData.initialtotalQuantity = $scope.contractProductDeliveryPriceModalData.totalQuantity;
                        $scope.contractProductDeliveryPriceModalData.initialtotalDealValue = $scope.contractProductDeliveryPriceModalData.totalDealValue;
                    }
                    if (type == 'mtm') {
                        $scope.contractProductDeliveryMtmModalData = callback.data;
                        $.each($scope.contractProductDeliveryMtmModalData.schedule, (key, value) => {
                            value.initialQty = value.quantity.splittedQuantity;
                        });
                        $scope.contractProductDeliveryMtmModalData.initialtotalQuantity = $scope.contractProductDeliveryMtmModalData.totalQuantity;
                        $scope.contractProductDeliveryMtmModalData.initialtotalDealValue = $scope.contractProductDeliveryMtmModalData.totalDealValue;
                    }
                    if (type == 'exposure') {
                        $scope.contractProductDeliveryExposureModalData = callback.data;
                        $scope.modelExposureContractDelivery($scope.contractProductDeliveryExposureModalData);
                    }
                    $scope.maxPages = Math.ceil(callback.data.totalCount / $scope.entries);
                } else {
                    toastr.error(callback.message);
                    $scope.prettyCloseModal();
                }
            }
        });
    };
    $scope.convertProductDeliveryQuantities = function(type, systemInstrument) {
        if (type == 'price') {
            $.each($scope.contractProductDeliveryPriceModalData.schedule, (key, value) => {
                value.quantity.splittedQuantity = value.initialQty * systemInstrument.conversionFactor;
                value.quantity.uom = systemInstrument.uom;
            });
            $scope.contractProductDeliveryPriceModalData.totalQuantity = $scope.contractProductDeliveryPriceModalData.initialtotalQuantity * systemInstrument.conversionFactor;
            $scope.contractProductDeliveryPriceModalData.totalDealValue = $scope.contractProductDeliveryPriceModalData.initialtotalDealValue * systemInstrument.conversionFactor;
        }
        if (type == 'mtm') {
            $.each($scope.contractProductDeliveryMtmModalData.schedule, (key, value) => {
                value.quantity.splittedQuantity = value.initialQty * systemInstrument.conversionFactor;
                value.quantity.uom = systemInstrument.uom;
            });
            $scope.contractProductDeliveryMtmModalData.totalQuantity = $scope.contractProductDeliveryMtmModalData.initialtotalQuantity * systemInstrument.conversionFactor;
            $scope.contractProductDeliveryMtmModalData.totalDealValue = $scope.contractProductDeliveryMtmModalData.initialtotalDealValue * systemInstrument.conversionFactor;
        }
    };
    $scope.saveContractDeliveryModal = function(type) {
        if (type == 1) {
            type = 'price';
            data = $scope.contractProductDeliveryPriceModalData;
        };
        if (type == 2) {
            type = 'mtm';
            data = $scope.contractProductDeliveryMtmModalData;
        };
        Factory_Master.saveContractDeliveryModal(data, type, (callback) => {
            if (callback) {
                if (callback.status == true) {
                    console.log(callback);
                    toastr.success('Saved succesfully');
                    $scope.prettyCloseModal();
                } else {
                	var message;
                    if (callback.message) {
                        message = callback.message;
                    } else {
                        message = 'An error has occured!';
                    }
                    toastr.error(message);
                }
            }
        });
    };
    $scope.modelExposureContractDelivery = function(object) {
        console.log(object);
        $scope.exposureMtmQuantitiesSystemInstruments = {};
        $scope.exposurePriceQuantitiesSystemInstruments = {};
        $.each(object.exposure, (key, value) => {
            value.newMtmQuantities = {};
            value.newPriceQuantities = {};
            value.priceTotal = 0;
            value.mtmTotal = 0;
            value.uom = null;
            $.each(value.mtmQuantities, (k, v) => {
                value.newMtmQuantities[v.systemInstrumentName] = v;
                $scope.exposureMtmQuantitiesSystemInstruments[v.systemInstrumentName] = true;
                value.mtmTotal = value.mtmTotal + v.quantity;
                if (typeof v.uom != 'undefined') {
                    value.uom = v.uom;
                }
            });
            $.each(value.priceQuantities, (k, v) => {
                value.newPriceQuantities[v.systemInstrumentName] = v;
                $scope.exposurePriceQuantitiesSystemInstruments[v.systemInstrumentName] = true;
                value.priceTotal = value.priceTotal + v.quantity;
                if (typeof v.uom != 'undefined') {
                    value.uom = v.uom;
                }
            });
        });
    };


    $scope.getContractFormulaList = function() {
        var data = {
            Payload: {
                PageFilters: {
                    Filters: []
                },
                Filters: [ {
                    ColumnName: 'ContractId',
                    Value: vm.entity_id ? vm.entity_id : null
                } ],
                SearchText: null,
                Pagination: {
                    Skip: 0,
                    Take: 999
                }
            }
        };
        Factory_Master.getContractFormulaList(data, (response) => {
            if (response) {
                if (response.status == true) {
                    $scope.contractFormulaList = response.data;
                } else {
                    toastr.error('An error has occured!');
                }
            }
        });
    };

    $scope.$on('formValues', () => {
        // console.log($scope.formValues);
        let title = `Contract - ${ $scope.formValues.name}`;
        if($scope.formValues.name) {
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            });
        }
    });
} ]);

function calculateProductTabWidth() {
    setTimeout(() => {
        $('.products-tabs-inner .product-item').css('width', () => {
            console.log($('.products-tabs-inner .product-item').parents('.products-tabs').width() / 3);
            return $('.products-tabs-inner .product-item').parents('.products-tabs').width() / 3;
        });
        $('.products-tabs-inner .product-item').css('opacity', 1);
        $('.products-tabs-inner .product-item').css('transform', 'scale(1)');
    }, 1);
}
Number(function($) {
    $(window).on('resize', () => {
        calculateProductTabWidth();
    });
}(jQuery));

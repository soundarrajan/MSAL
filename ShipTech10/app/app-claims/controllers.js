/**
 * CLaims Controller
 */
APP_CLAIMS.controller('Controller_Claims', [
    '$scope',
    '$filter',
    '$rootScope',
    '$Api_Service',
    'Factory_Claims',
    '$state',
    '$location',
    '$q',
    '$compile',
    '$timeout',
    'Factory_Master',
    '$listsCache',
    '$tenantSettings',
    'screenLoader',
    '$http',
    'API',
    function($scope, $filter, $rootScope, $Api_Service, Factory_Claims, $state, $location, $q, $compile, $timeout, Factory_Master, $listsCache, $tenantSettings, screenLoader, $http, API) {
        let vm = this;
        let guid = '';
        vm.screen_id = 'claims';
        if ($state.params.path) {
            vm.app_id = $state.params.path[0].uisref.split('.')[0];
        }
        vm.listsCache = $listsCache;
        vm.entity_id = $state.params.entity_id;
        $scope.addedFields = new Object();
        $scope.tenantCurrency = $tenantSettings.tenantFormats.currency;
        vm.response = '';
        vm.ids = '';
        $rootScope.$on('formFields', (event, data) => {
            $scope.formFields = data;
        });
        $rootScope.$on('formValues', (event, data) => {
            $scope.formValues = data;
            if ($scope.formValues.claimDetails) {
                if ($scope.formValues.claimDetails.status.name != 'New') {
                    if ($scope.formFields['Order Details'] && $scope.formFields['Order Details'].children) {
                        $.each($scope.formFields['Order Details'].children, (k, v) => {
                            if (v.Name == 'DeliveryDate') {
                                v.Disabled = true;
                            }
                        });
                    }
                    if ($scope.formFields.deliveryDate) {
                        $scope.formFields.deliveryDate.Disabled = true;
                    }
                }
            }
        });
        $rootScope.$on('editInstance', (value) => {
            vm.editInstance = value;
        });
        vm.compiles = function() {
            $.each($('.group_Order_Details input,.group_Order_Details .uom_group select, #CreatedBy'), function(i, str) {
                $(this).attr('disabled', 'disabled');
                $(this).attr('readonly', 'true');
            });
            $('.group_Order_Details .date-picker').datepicker('remove');
            $scope.$watch('formFields', () => {
                setTimeout(() => {
                    if ($('#ClaimTypeClaimType').val() == 1) {
                        $('.edit_form_fields_Quantity.Shortage_claims').show();
                    } else {
                        $('.edit_form_fields_Quantity.Shortage_claims').hide();
                    }
                    // $('.group_debunkerDetails .form-control').attr('ng-if', 'formValues.claimType.claimType.id == 4');
                    // $compile($('.group_debunkerDetails .form-control'))($scope);
                    if ($('#ClaimTypeClaimType').val() == 4) {
                        $('.group_debunkerDetails')
                            .removeClass('hiddenGroup')
                            .show();
                    } else {
                        $('.group_debunkerDetails')
                            .addClass('hiddenGroup')
                            .hide();
                    }
                    $('#ClaimTypeClaimType').change(function() {
                        if ($(this).val() == 4) {
                            $('.group_debunkerDetails')
                                .removeClass('hiddenGroup')
                                .show();
                        } else {
                            $('.group_debunkerDetails')
                                .addClass('hiddenGroup')
                                .hide();
                        }
                    });
                    $('#ActualSettlementAmount, #CompromisedAmount, #NoClaimAmmount').attr('disabled', true);
                    $('#EstimatedSettlementAmount').change(function() {
                        $('#ActualSettlementAmount, #CompromisedAmount, #NoClaimAmmount')
                            .val($(this).val())
                            .change();
                    });
                }, 10);
            });
        };

        vm.getRelatedClaims = function(id) {
            console.log($scope.formValues);
            Factory_Claims.getRelatedClaims(id, (callback) => {
                if (callback) {
                    if (callback.status == true) {
                        vm.relatedClaims = callback.data;
                        $scope.relatedClaims = callback.data;
                    }
                }
            });
        };
        vm.deleteClaim = function(claimId) {
            Factory_Claims.deleteClaim(claimId, (callback) => {
                if (callback) {
                    if (callback.status == true) {
                        toastr.success('Claim was deleted successfully');
                        for (let i = $scope.relatedClaims.length - 1; i >= 0; i--) {
                            claim = $scope.relatedClaims[i];
                            if (claim.id == claimId) {
                                $scope.relatedClaims.splice[i, 1];
                            }
                        }
                        if (vm.entity_id == claimId) {
                            $location.path(`/claims/claim/edit/${ $scope.relatedClaims[0].id}`);
                        } else {
                            $state.reload();
                        }
                    } else {
                        toastr.error(callback.message);
                    }
                }
            });
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
                            temp = $scope.formValues[entry.ValueFrom];
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
                        if (field.Name === 'Product') {
                            if ($scope.options.Product && $scope.options.Product.length > 0) {
                                $.each($scope.formValues.temp.tempProductforType, (k, v) => {
                                    $.each($scope.options.Product, (k1, v1) => {
                                        if (v.product.id && v1.id === v.product.id) {
                                            v.physicalSupplier = v1.payload.orderDetails.physicalSupplier;
                                        }
                                    });
                                });
                                if ($scope.formValues.orderDetails.product) {
                                	$scope.formValues.orderDetails.product = _.find($scope.options.Product, { id:$scope.formValues.orderDetails.product.id });
                                }
                                $scope.triggerChangeFieldsAppSpecific('Product');
                                $rootScope.$broadcast('changeCurrencyValues', 'EstimatedSettlementAmount');
                                $rootScope.$broadcast('changeCurrencyValues', 'OrderPrice');
                            }
                        }
                        $scope.$watchGroup([ $scope.formValues, $scope.options ], () => {
                            $timeout(() => {
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
        function getIndexAndCount(object) {
            let index = false;
            let lengthFalse = 0;
            let countIsFalse = 0;
            if (typeof object != 'undefined' && object) {
                if (object.length > 0) {
                    object.forEach((obj, key) => {
                        if (obj.isDeleted !== true) {
                            lengthFalse = lengthFalse + 1;
                            if (index == false) {
                                index = key;
                            }
                        } else if(obj.isDeleted === false) {
                            countIsFalse = countIsFalse + 1;
                        }
                    });
                }
            }

            if (index == false) {
                index = 0;
            }

            return {
                index: index,
                lengthFalse: lengthFalse,
                countIsFalse: countIsFalse

            };
        }


        $scope.checkClaimType = function() {
            $('#ActualSettlementAmount').attr('disabled', 'disabled');
            $('#CompromisedAmount').attr('disabled', 'disabled');
            $('#NoClaimAmmount').attr('disabled', 'disabled');
            $('#EstimatedSettlementAmount').on('change', function() {
                $('#ActualSettlementAmount').val($(this).val());
                $('#CompromisedAmount').val($(this).val());
                $('#NoClaimAmmount').val($(this).val());
            });
            if ($scope.formValues && $scope.formValues.claimType && $scope.formValues.claimType.claimType.name) {
                let type = $scope.formValues.claimType.claimType.name;
                if (type.toLowerCase() == 'debunker') {
                    $('.group_debunkerDetails').show();
                } else {
                    $('.group_debunkerDetails').hide();
                }
                // $scope.formValues.complianceSubtypes = [];
                // $scope.formValues.densitySubtypes = [];
                // $scope.formValues.qualitySubtypes = [];
                // $scope.formValues.quantitySubtypes = [];
                if (type.toLowerCase() == 'debunker' && (!$scope.formValues.claimDetails.estimatedSettlementAmount || !$scope.formValues.claimDetails.isEstimatedSettlementAmountManual)) {
                    if (!$scope.formValues.claimDebunkerDetails || typeof $scope.formValues.claimDebunkerDetails == 'undefined') {
                        $scope.formValues.claimDebunkerDetails = {};
                    }
                    $scope.formValues.claimDetails.estimatedSettlementAmount = $scope.formValues.claimDebunkerDetails.debunkerAmount - $scope.formValues.claimDebunkerDetails.resaleAmount;
                } else if(type != 'Quantity' && !$scope.formValues.claimDetails.isEstimatedSettlementAmountManual) {
                    $scope.formValues.claimDetails.estimatedSettlementAmount = null;
                    return;
                } else if (type == 'Quantity' && /* !$scope.formValues.claimDetails.estimatedSettlementAmount &&*/ $scope.formValues.quantitySubtypes) {
                    if (!$scope.formValues.quantitySubtypes) {
                        $scope.formValues.quantitySubtypes = [];
                    }
                    let object = getIndexAndCount($scope.formValues.quantitySubtypes);
                    if ($scope.formValues.quantitySubtypes.length > 0) {
                        $timeout(() => {
                            $scope.formValues.claimType.quantityShortageUom = $scope.formValues.quantitySubtypes[object.index].quantityUom;
                            if($scope.formValues.quantitySubtypes[object.index].quantityUom != null) {
                                $('[name=\'claimType.quantityShortage Option\']').val($scope.formValues.quantitySubtypes[object.index].quantityUom.id);
                            }
                        });
                    }

                    if (object.lengthFalse && !$scope.formValues.claimDetails.isEstimatedSettlementAmountManual) {
                        // $scope.formValues.claimDetails.estimatedSettlementAmount = ($scope.formValues.quantitySubtypes[object.index].sellerQuantity - $scope.formValues.quantitySubtypes[object.index].buyerQuantity) * $scope.formValues.orderDetails.orderPrice;

                    }
                }
            }
            $scope.getQuantityShortage();
            $rootScope.EstimatedSettlementAmountManualChange = false;
        };
        vm.formFieldSearch = function(formFields, Unique_ID) {
            for (let key in formFields) {
                if (typeof formFields[key] == 'string') {
                    if (key == 'Unique_ID' && formFields[key] == Unique_ID) {
                        return formFields;
                    }
                    continue;
                }
                let aux = vm.formFieldSearch(formFields[key], Unique_ID);
                if (aux) {
                    return aux;
                }
            }
            return false;
        };
        $scope.triggerChangeFieldsAppSpecific = function(name, id) {
            // if (!$rootScope.createDebunkerFromClaim && vm.entity_id < 1) {
            //     $.each($listsCache.ClaimType, function(k, v) {
            //         if (typeof v != "undefined") {
            //             if (v.name == "Debunker") {
            //                 $listsCache.ClaimType.splice(k, 1);
            //             }
            //         }
            //     });
            // }
            if (vm.app_id == 'claims' && vm.screen_id == 'claims') {
                if(name == 'EstimatedSettlementAmount') {
                    if($scope.formValues.claimDetails.estimatedSettlementAmount < 0) {
                        $.each($scope.options.SettlementType, (k, v) => {
                            if(v.name === 'Receive') {
                                $scope.formValues.claimDetails.settlementType = v;
                                $scope.formValues.claimDetails.estimatedSettlementAmount *= -1;
                                toastr.info('The estimated settlement amount cannot be negative. The settlement type has been set to "Receive" and the amount is positive.');
                            }
                        });
                    }
                }
                // else if($scope.formValues.claimDetails.estimatedSettlementAmount > 0) {
                //   $.each($scope.options.SettlementType, function(k, v) {
                //     if(v.name === 'Pay') {
                //       $scope.formValues.claimDetails.settlementType = v;
                //     }
                //   });
                // }
            }
            if (name == 'OrderID') {
                // suprascriem niste date
                Factory_Master.get_master_entity($scope.formValues.orderDetails.order.id, 'orders', 'orders', (response) => {
                    if (response) {
                    	$scope.formValues.orderDetails.orderPrice = $scope.formValues.initialOrderPrice;
                        if (response.orderDate) {
                            $scope.formValues.orderDetails.orderDate = response.orderDate;
                        }
                        if (response.status) {
                            // $scope.formValues.orderDetails.orderStatusName = response.status.name;
                            $scope.formValues.orderDetails.orderStatusName = response.status.displayName;
                        }
                        if (response.deliveryDate && (!$('#OrderOrderID').hasClass('ng-pristine') || window.location.href.indexOf('?orderId') != -1)) {
                            $timeout(() => {
                                if (!$scope.formValues.deliveryDate || !$scope.formValues.orderDetails.deliveryNo) {
                                    $scope.triggerChangeFieldsAppSpecific('deliveryNumber', 'orderDetails.deliveryNo');
                                }
                                $scope.formValues.deliveryDate = response.deliveryDate;
                            });
                            if (window.location.href.indexOf('?orderId') != -1) {
				            	params = window.location.href.split('?')[1];
				            	params = params.split('&');
				            	objParams = {};
				            	$.each(params, (k, v) => {
				            		key = v.split('=')[0];
				            		val = parseFloat(v.split('=')[1]);
				            		objParams[key] = val;
				            	});
				            	$.each(response.products, (k, v) => {
				            		if (v.id == objParams.orderProductId) {
				            			$scope.formValues.orderDetails.product = v.product;
				            			$scope.formValues.orderDetails.orderProductId = v.id;
				            			// $scope.triggerChangeFieldsAppSpecific("Product");
				            		}
				            	});

				            	quantityClaimType = _.find(vm.listsCache.ClaimType, { name : 'Quantity' });
				            	if (!$scope.formValues.claimType) {
				            		$scope.formValues.claimType = {
						            	claimType : quantityClaimType
				            		};
				            	}
				            	// $scope.formValues.claimType.claimType = quantityClaimType;

                            	newUrl = window.location.href.split('#')[1];
                            	newUrl = newUrl.split('?')[0];
                            	// window.location.replace(window.location.href.split("?")[0]);
                            	// window.history.pushState({}, document.title, "#" + newUrl);
                            }
                            // $scope.formValues.deliveryDate = response.deliveryDate;
                        }
                        if (response.vessel) {
                            $scope.formValues.orderDetails.vessel = response.vessel.name;
                        }
                        if (response.location) {
                            $scope.formValues.orderDetails.port = response.location.name;
                        }
                        if (response.seller) {
                            $scope.formValues.orderDetails.counterparty = response.seller.name;
                        }
                        if (response.paymentCompany) {
                            $scope.formValues.orderDetails.company = response.paymentCompany.name;
                        }
                        if (response.products && response.products.length > 0) {
                            $scope.formValues.temp = { tempProductforType: response.products };
                            if ($scope.formValues.orderDetails.product) {
                                $.each($scope.formValues.temp.tempProductforType, (k, v) => {
                                    if (v.product.id && v.product.id == $scope.formValues.orderDetails.product.id) {
                                        $scope.formValues.orderDetails.productType = v.productType.name;
                                        // $scope.formValues.claimDetails.physicalSupplier = v.physicalSupplier;
                                    }
                                });
                            }
                        }
                        // retrigger de dropdowns delivery, labs, products
                        if (!$scope.formValues.claimDetails.estimatedSettlementAmountCurrency) {
                            $scope.formValues.claimDetails.estimatedSettlementAmountCurrency = $scope.tenantCurrency;
                        }
                        let field2;
                        field2 = vm.formFieldSearch($scope.formFields, 'orderDetails.deliveryNo');
                        if (field2) {
                            vm.getOptions(field2);
                        }
                        field2 = vm.formFieldSearch($scope.formFields, 'orderDetails.labResult');
                        if (field2) {
                            vm.getOptions(field2);
                        }
                        field2 = vm.formFieldSearch($scope.formFields, 'orderDetails.product');
                        if (field2) {
                            vm.getOptions(field2);
                        }
                        delete field2;
                    }
                });
            }
            if (name == 'deliveryNumber') {
                if ($scope.formValues.orderDetails.deliveryNo) {
                    if ($scope.formValues.orderDetails.deliveryProductId === null) {
                        $scope.formValues.orderDetails.deliveryProductId = '';
                    }
                    var id = $scope.formValues.orderDetails.deliveryNo.id;
                    angular.merge($scope.formValues, $scope.formValues.orderDetails.deliveryNo.payload);
                    var field;
                    field = vm.formFieldSearch($scope.formFields, 'orderDetails.labResult');
                    if (field) {
                        vm.getOptions(field);
                    }
                    field = vm.formFieldSearch($scope.formFields, 'orderDetails.product');
                    $scope.options.Product = [];
                    deliveryDateFromDelivery = _.find($scope.options.deliveryNumber, { id:$scope.formValues.orderDetails.deliveryNo.id }).payload.orderDetails.deliveryDate;

                    if (deliveryDateFromDelivery) {
                        $timeout(() => {
                            $scope.formValues.deliveryDate = deliveryDateFromDelivery;
                        });
                        $scope.formValues.deliveryDate = deliveryDateFromDelivery;
                    }
                    // $scope.formValues.deliveryDate = deliveryDateFromDelivery ? deliveryDateFromDelivery : $scope.formValues.deliveryDate;

                    if (field) {
                        vm.getOptions(field);
                    }
                    delete $scope.formValues.orderDetails.deliveryNo.payload;
                    delete field;
                    if ($scope.formValues.claimDetails.physicalSupplier) {
                        $scope.formValues.claimDetails.physicalSupplier = null;
                    }
                }
            }
            if (name == 'labResultID') {
                if ($scope.formValues.orderDetails.labResult) {
                    if ($scope.formValues.orderDetails.deliveryProductId === null) {
                        $scope.formValues.orderDetails.deliveryProductId = '';
                    }
                    var id = $scope.formValues.orderDetails.labResult.id;
                    angular.merge($scope.formValues, $scope.formValues.orderDetails.labResult.payload);
                    var field;
                    field = vm.formFieldSearch($scope.formFields, 'orderDetails.product');
                    if (field) {
                        vm.getOptions(field);
                    }
                    delete $scope.formValues.orderDetails.labResult.payload;
                    delete field;
                }
            }
            if (name == 'Product') {
                if ($scope.formValues.orderDetails.product) {
                    var id = $scope.formValues.orderDetails.product.id;
                    angular.merge($scope.formValues.orderDetails, $scope.formValues.orderDetails.product.payload.orderDetails);
                    delete $scope.formValues.initialOrderPrice;
                    delete $scope.formValues.orderDetails.product.payload;
                    $scope.formValues.claimDetails.estimatedSettlementAmountCurrency = $scope.formValues.orderDetails.currency;
                    $.each($scope.formValues.temp.tempProductforType, (k, v) => {
                        if (v.product.id && v.product.id == $scope.formValues.orderDetails.product.id) {
                            $scope.formValues.orderDetails.productType = v.productType.name;
                            $scope.formValues.claimDetails.physicalSupplier = v.physicalSupplier;
                        }
                    });
                    $.each($scope.options.Product, (k, v) => {
                        if (v.id === id) {
                            $scope.formValues.orderDetails.deliveryProductId = v.payload.orderDetails.deliveryProductId;
                        }
                    });
                    $timeout(() => {
                        $('#EstimatedSettlementAmount').trigger('change');
                        $('#OrderPrice').trigger('change');
                    }, 10);
                    // $rootScope.$broadcast("changeCurrencyValues", "OrderPrice");
                    if (typeof $scope.formValues.claimType != 'undefined') {
                        oldClaimType = angular.copy($scope.formValues.claimType.claimType);
                        $scope.formValues.claimType.claimType = null;
                        $timeout(() => {
                            $scope.formValues.claimType.claimType = oldClaimType;
                            if ($scope.formValues.densitySubtypes.length) {
                                $scope.formValues.densitySubtypes = [];
                            }
                            if ($scope.formValues.quantitySubtypes.length) {
                                $scope.formValues.quantitySubtypes = [];
                            }
                            if ($scope.formValues.qualitySubtypes.length) {
                                $scope.formValues.qualitySubtypes = [];
                            }
                            $scope.formValues.claimType.quantityShortage = null;
                            $scope.formValues.claimType.quantityShortageUom = null;
                        }, 100);
                        $scope.checkClaimType();
                    }
                }
            }
            if (name == 'ClaimType') {
                // $.each($scope.formValues.quantitySubtypes, function(k, v) {
                //   v.isDeleted = true;
                // });
                // $.each($scope.formValues.qualitySubtypes, function(k, v) {
                //   v.isDeleted = true;
                // });
                // $.each($scope.formValues.densitySubtypes, function(k, v) {
                //   v.isDeleted = true;
                // });
                // $.each($scope.formValues.complianceSubtypes, function(k, v) {
                //   v.isDeleted = true;
                // });
                $scope.checkClaimType();
            }
            if (name == 'DebunkerQuantitywithUOM') {
                if ($scope.formValues.orderDetails) {
                    $scope.formValues.claimDebunkerDetails.debunkerAmount = $scope.formValues.orderDetails.orderPrice * $scope.formValues.claimDebunkerDetails.debunkerQuantity;
                    $scope.formValues.claimDebunkerDetails.debunkerAmountCurrency = $scope.formValues.orderDetails.currency;
                }
                $scope.formValues.claimDebunkerDetails.resaleAmount = $scope.formValues.claimDebunkerDetails.debunkerQuantity * $scope.formValues.claimDebunkerDetails.salePrice;
                $scope.formValues.claimDebunkerDetails.resaleAmountCurrency = $scope.formValues.claimDebunkerDetails.salePriceCurrency;
                $scope.refreshSelect();
            }
            if (name == 'SalePricewithCurrency') {
                $scope.formValues.claimDebunkerDetails.resaleAmount = $scope.formValues.claimDebunkerDetails.debunkerQuantity * $scope.formValues.claimDebunkerDetails.salePrice;
                $scope.formValues.claimDebunkerDetails.resaleAmountCurrency = $scope.formValues.claimDebunkerDetails.salePriceCurrency;
                if ($scope.formValues.orderDetails && $scope.formValues.claimDebunkerDetails.salePriceCurrency) {
                    salePriceConverted = $scope.convertCurrency($scope.formValues.claimDebunkerDetails.salePriceCurrency.id, $scope.formValues.orderDetails.currency.id, null, $scope.formValues.claimDebunkerDetails.salePrice, (response) => {
                        salePriceConverted = response;
                        if (salePriceConverted > $scope.formValues.orderDetails.orderPrice) {
                            toastr.error('Debunker Sale Price should not exceed Order Price!');
                        }
                    });
                }
                $scope.refreshSelect();
            }
            if (name != 'EstimatedSettlementAmount') {
                // $scope.checkClaimType();
            } else {
                $rootScope.EstimatedSettlementAmountManualChange = true;
            }
            if (name == 'ClaimDate') {
                $rootScope.$broadcast('changeCurrencyValues', 'EstimatedSettlementAmount');
                $rootScope.$broadcast('changeCurrencyValues', 'OrderPrice');
            }
        };
        $scope.cancel_claim = function() {
            vm.fields = angular.toJson($scope.formValues.id);
            Factory_Master.cancel_claim(vm.app_id, vm.screen_id, vm.fields, (callback) => {
                if (callback.status == true) {
                    toastr.success(callback.message);
                    $scope.loaded = true;
                    $state.reload();
                } else {
                    toastr.error(callback.message);
                }
            });
        };
        $scope.complete_claim = function() {
            vm.fields = angular.toJson($scope.formValues.id);
            angular.forEach(vm.editInstance, (input, key) => {
                if (input) {
                    if (typeof input == 'object' && input.$name) {
                        if (input.$dirty && input.$name != 'NoClaimAmmount' && input.$touched) {
                            $scope.changedFields++;
                        }
                    }
                }
            });

            if ($scope.changedFields <= 0) {
                Factory_Master.complete_claim(vm.app_id, vm.screen_id, vm.fields, (callback) => {
                    if (callback.status == true) {
                        $state.reload();
                        toastr.success(callback.message);
                        $scope.loaded = true;
                    } else {
                        toastr.error(callback.message);
                    }
                });
            } else {
                toastr.error('You must save the claim first');
            }
        };
        $scope.calculateAvailableSubtypesLength = function() {
            if (typeof availableSubtypesLength == 'undefined') {
                availableSubtypesLength = {};
            }

            subTypeObjects = [ 'quantitySubtypes', 'densitySubtypes', 'qualitySubtypes', 'complianceSubtypes' ];
            $.each(subTypeObjects, (stk, stv) => {
                availableSubtypesLength[stv] = 0;
                if ($scope.formValues[stv]) {
                    for (let i = $scope.formValues[stv].length - 1; i >= 0; i--) {
                        if (!$scope.formValues[stv][i].isDeleted) {
                            availableSubtypesLength[stv] += 1;
                        }
                    }
                }
            });
            return availableSubtypesLength;
        };
        $scope.setQuantitySub = function() {
            $scope.IsQuantitySubtype = $('#quantity_Parameter option:checked').data('opt');
            $scope.formValues.claimType.quantityShortage = null;
            $scope.formValues.claimType.quantityShortageUom = null;
            //   $timeout(function(){
            // if (!$scope.formValues.claimDetails.isEstimatedSettlementAmountManual) {
            //  $scope.formValues.claimDetails.estimatedSettlementAmount = null;
            // }
            //   },500)
        };
        $scope.$watchGroup([ 'formValues.claimDetails.estimatedSettlementAmount' ], () => {
            if ($('#EstimatedSettlementAmountCurrency').length > 0) {
                if (!$('#EstimatedSettlementAmountCurrency').hasClass('ng-pristine')) {
                    if ($scope.formValues.claimDetails) {
                        $scope.formValues.claimDetails.isEstimatedSettlementAmountManual = true;
                    }
                }
            }
        });
        $scope.$watchGroup([ 'formValues.claimDetails.estimatedSettlementAmountCurrency' ], () => {
            if ($scope.formValues.claimDetails) {
                if ($scope.formValues.claimDetails.estimatedSettlementAmountCurrency) {
                    $scope.formValues.claimDetails.actualSettlementAmountCurrency = $scope.formValues.claimDetails.estimatedSettlementAmountCurrency;
                    $scope.formValues.claimDetails.compromisedAmountCurrency = $scope.formValues.claimDetails.estimatedSettlementAmountCurrency;
                    $scope.formValues.claimDetails.noClaimAmountCurrency = $scope.formValues.claimDetails.estimatedSettlementAmountCurrency;
                }
            }
        });
        $scope.$watchGroup([ 'formValues.claimType.claimType' ], () => {
        	if (typeof $scope.formValues.claimType != 'undefined') {
        		if ($scope.formValues.claimType.claimType.name.toLowerCase() == 'debunker') {
        			if (!$scope.formValues.claimType.claimType.displayName) {
        				$scope.formValues.claimType.claimType.displayName = $scope.formValues.claimType.claimType.name;
        			}
        			if ($scope.options) {
			        	$scope.options.ClaimType.push($scope.formValues.claimType.claimType);
        			}
		        	$('.group_debunkerDetails').show();
        		}
        	}
        });
        $scope.disabledCreateDebunker = function() {
            let object = $filter('filter')(vm.listsCache.ClaimType, { name: 'Debunker' })[0];
            if (typeof object != 'undefined') {
                return false;
            }
            return true;
        };
        $scope.checkSubtype = function() {
            if (vm.entity_id > 0) {
                $scope.$watchGroup('formValues', () => {
                    if ($scope.formValues.densitySubtypes[0]) {
                        $scope.IsQuantitySubtype = false;
                    } else if ($scope.formValues.quantitySubtypes[0]) {
                        $scope.IsQuantitySubtype = true;
                    }
                    return $scope.IsQuantitySubtype;
                });
            }
        };
        $scope.createDebunker = function() {
            screenLoader.showLoader();
            Factory_Master.createDebunker(vm.entity_id, (response) => {
                if (response) {
                    if (response.status == true) {
                        $scope.loaded = true;
                        toastr.success(response.message);
                        $rootScope.transportData = response.data;
                        $rootScope.createDebunkerFromClaim = true;
                        $location.path('claims/claim/edit/');
                        screenLoader.hideLoader();
                    } else {
                        $scope.loaded = true;
                        toastr.error(response.message);
                    }
                }
            });
        };
        $scope.changeClaimEmailTemplate = function(value, sendEmailBool) {
            $rootScope.currentEmailTemplate = value.id;
            $rootScope.currentEmailTemplateName = value.name;
            if (value.name == 'ClaimQuantityEmail') {
                data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: 'ClaimId',
                                Value: vm.entity_id
                            },
                            {
                                ColumnName: 'ClaimTypeName',
                                Value: 'Quantity'
                            }
                        ]
                    }
                };
            }
            if (value.name == 'ClaimDensityEmail') {
                data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: 'ClaimId',
                                Value: vm.entity_id
                            },
                            {
                                ColumnName: 'ClaimTypeName',
                                Value: 'Quantity'
                            },
                            {
                                ColumnName: 'ClaimSubtypeName',
                                Value: 'Density'
                            }
                        ]
                    }
                };
            }
            if (value.name == 'ClaimComplianceEmail') {
                data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: 'ClaimId',
                                Value: vm.entity_id
                            },
                            {
                                ColumnName: 'ClaimTypeName',
                                Value: 'Compliance'
                            }
                        ]
                    }
                };
            }
            specParameters = [];
            $.each($rootScope.formValues.qualitySubtypes, (key, value2) => {
                specParameters.push(value2.specParameter.id);
            });
            specParameters = specParameters.toString();
            if (value.name == 'ClaimQualityEmail') {
                data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: 'ClaimId',
                                Value: vm.entity_id
                            },
                            {
                                ColumnName: 'SpecParameterId',
                                Value: specParameters
                            },
                            {
                                ColumnName: 'ClaimTypeName',
                                Value: 'Quality'
                            }
                        ]
                    }
                };
            }
            console.log($rootScope.formValues.qualitySubtypes);
            if (data) {
                Factory_Master.claim_preview_email(data, (response) => {
                    if (response) {
                        if (response.status == true) {
                            $scope.$emit('previewEmail', response.data);
                            if (sendEmailBool) {
                                $rootScope.previewEmail = response.data;
                                $scope.sendEmailPreviewActionCall();
                            }
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                });
            } else {
                toastr.error('An error has occured!');
            }
        };
        // $scope.discardSavedPreview = function() {
        //     data = {
        //         "Payload": {
        //             "EmailTemplateId": $rootScope.currentEmailTemplate,
        //             "BusinessId": vm.entity_id,
        //         }
        //     };
        //     Factory_Master.discardSavedPreview(data, function(response) {
        //         if (response) {
        //             if (response.status == true) {
        //                 toastr.success("Email Preview Saved!");
        //                 $rootScope.previewEmail = null
        //                 $state.reload();
        //             } else {
        //                 $scope.loaded = true;
        //                 toastr.error(response.message);
        //             }
        //         }
        //     })
        // }
        // $scope.saveClaimEmail = function() {
        //     data = {
        //         "Payload": {
        //             "Id": $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
        //             "Name": $rootScope.previewEmail.comment.name,
        //             "Content": $rootScope.previewEmail.content,
        //             "EmailTemplate": {
        //                 "Id": $rootScope.currentEmailTemplate
        //             },
        //             "BusinessId": vm.entity_id,
        //             "To": $rootScope.previewEmail.to,
        //             "Cc": $rootScope.previewEmail.cc,
        //             "ToOthers": $rootScope.previewEmail.toOthers,
        //             "CcOthers": $rootScope.previewEmail.ccOthers,
        //             "From": $rootScope.previewEmail.from,
        //         }
        //     };
        //     Factory_Master.save_email_contract(data, function(response) {
        //         if (response) {
        //             if (response.status == true) {
        //                 toastr.success("Email Preview Saved!");
        //                 $rootScope.previewEmail = null
        //                 $state.reload();
        //             } else {
        //                 $scope.loaded = true;
        //                 toastr.error(response.message);
        //             }
        //         }
        //     })
        // }
        // $scope.sendClaimPreviewEmail = function() {
        //     saveData = {
        //         "Payload": {
        //             "Id": $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
        //             "Name": $rootScope.previewEmail.comment.name,
        //             "Content": $rootScope.previewEmail.content,
        //             "EmailTemplateId": $rootScope.currentEmailTemplate,
        //             "BusinessId": vm.entity_id,
        //             "To": $rootScope.previewEmail.to,
        //             "Cc": $rootScope.previewEmail.cc,
        //             "ToOthers": $rootScope.previewEmail.toOthers,
        //             "CcOthers": $rootScope.previewEmail.ccOthers,
        //             "From": $rootScope.previewEmail.from,
        //         }
        //     };
        //     Factory_Master.send_email_preview(saveData, function(response) {
        //         if (response) {
        //             if (response.status == true) {
        //                 $scope.loaded = true;
        //                 toastr.success("Email Preview was sent!");
        //                 var url = $state.$current.url.prefix + $state.params.screen_id + '/edit/' + $state.params.entity_id;
        //                 $location.path(url);
        //             } else {
        //                 $scope.loaded = true;
        //                 toastr.error(response.message);
        //             }
        //         }
        //     })
        //     // Factory_Master.save_email_contract(saveData, function(response) {
        //     //     if (response) {
        //     //         if (response.status == true) {
        //     //             template = {
        //     //                 "id": $rootScope.currentEmailTemplate,
        //     //                 "name": $rootScope.currentEmailTemplateName
        //     //             };
        //     //             $scope.changeClaimEmailTemplate(template, true);
        //     //             return;
        //     //             if (data.warningMessage) {
        //     //                 confirmAction = window.confirm(data.warningMessage);
        //     //                 if (confirmAction) {
        //     //                     $scope.sendEmailPreviewActionCall()
        //     //                 }
        //     //             } else {
        //     //                 $scope.sendEmailPreviewActionCall()
        //     //             }
        //     //         } else {
        //     //             $scope.loaded = true;
        //     //             toastr.error(response.message);
        //     //         }
        //     //     }
        //     // })
        // }
        $scope.sendEmailPreviewActionCall = function() {
            Factory_Master.send_email_preview($rootScope.previewEmail, (response) => {
                if (response) {
                    if (response.status == true) {
                        $scope.loaded = true;
                        toastr.success('Email Preview was sent!');
                        let url = `${$state.$current.url.prefix + $state.params.screen_id }/edit/${ $state.params.entity_id}`;
                        $location.path(url);
                    } else {
                        $scope.loaded = true;
                        toastr.error(response.message);
                    }
                }
            });
        };
        $scope.downloadClaimAttachment = function(attachmentId) {
            Factory_Master.get_document_file(
                {
                    Payload: attachmentId
                },
                (file, mime) => {
                    if (file.data) {
                        if (file.status == 200) {
                            let blob = new Blob([ file.data ], {
                                type: mime
                            });
                            let a = document.createElement('a');
                            a.style = 'display: none';
                            document.body.appendChild(a);
                            // Create a DOMString representing the blob and point the link element towards it
                            let url = window.URL.createObjectURL(blob);
                            a.href = url;
                            a.download = docName;
                            // programatically click the link to trigger the download
                            a.click();
                            // release the reference to the file by revoking the Object URL
                            window.URL.revokeObjectURL(url);
                        } else {
                            toastr.error(file.statusText);
                        }
                    } else {
                        toastr.error(file.statusText);
                    }
                }
            );
        };
        $scope.claims_create_credit_note = function(id) {
            let data = {
                claimId: vm.entity_id,
                InvoiceTypeName: 'CreditNote'
            };
            if (id == 1) {
                data.IsResale = true;
            }
            if (id == 2) {
                data.IsDebunker = true;
            }
            Factory_Master.claims_create_credit_note(data, (response) => {
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
            });
        };
        // $timeout(vm.compiles(), 100);

        $scope.computeDensityDifference = function(rowIdx, fval) {
            if (fval.densitySubtypes[rowIdx].bdnDensity && fval.densitySubtypes[rowIdx].labDensity) {
                fval.densitySubtypes[rowIdx].densityDifference = convertDecimalSeparatorStringToNumber(fval.densitySubtypes[rowIdx].bdnDensity) - convertDecimalSeparatorStringToNumber(fval.densitySubtypes[rowIdx].labDensity);
            } else {
                fval.densitySubtypes[rowIdx].densityDifference = '';
            }
            if (fval.densitySubtypes[rowIdx].bdnDensity == '') {
                fval.densitySubtypes[rowIdx].bdnDensity = null;
            }
            if (fval.densitySubtypes[rowIdx].labDensity == '') {
                fval.densitySubtypes[rowIdx].labDensity = null;
            }
            quantityShortageScope = angular.element($('[name=\'claimType.quantityShortage\']')).scope();
            quantityShortageScope.getQuantityShortage();
        };

        $scope.clearTestValueNull = function(rowIdx, fval) {
            if (fval.qualitySubtypes && fval.qualitySubtypes[rowIdx]) {
                if (fval.qualitySubtypes[rowIdx].testValue == '') {
                    fval.qualitySubtypes[rowIdx].testValue = null;
                }
            }
            if (fval.complianceSubtypes && fval.complianceSubtypes[rowIdx]) {
                if (fval.complianceSubtypes[rowIdx].testValue == '') {
                    fval.complianceSubtypes[rowIdx].testValue = null;
                }
            }
        };


        $scope.getQuantityShortage = function() {
            if (typeof $scope.formValues.orderDetails == 'undefined') {
                return;
            }
            if (typeof $scope.formValues.orderDetails.product == 'undefined') {
                return;
            }
            if ($scope.formValues.claimType) {
                $scope.formValues.claimType.quantityShortage = null;
            }

            isQuantitySubtype = false;

            productId = $scope.formValues.orderDetails.product.id;
            isDensitySubtype = false;
            specParameterUomConversionFactor = null;
            BDNQuantity = null;
            BDNQuantityUom = null;
            ConfirmedQuantity = null;
            ConfirmedQuantityUom = null;
            sellerQuantity = null;
            buyerQuantity = null;
            quantityUom = null;
            densityDifference = null;
            specParameterId = null;

            let quantity = getIndexAndCount($scope.formValues.quantitySubtypes);
            let density = getIndexAndCount($scope.formValues.densitySubtypes);

            if ($scope.formValues.quantitySubtypes) {
                if (quantity.lengthFalse) {
                    sellerQuantity = $scope.formValues.quantitySubtypes[quantity.index].sellerQuantity;
                    buyerQuantity = $scope.formValues.quantitySubtypes[quantity.index].buyerQuantity;
                    quantityUom = $scope.formValues.quantitySubtypes[quantity.index].quantityUom;
                    isQuantitySubtype = true;
                    if (quantity.countIsFalse) {
                        $scope.formValues.densitySubtypes = [];
                    }
                }
            }

            if ($scope.formValues.densitySubtypes) {
                if (density.lengthFalse == 1) {
                    isDensitySubtype = true;
                    if (density.countIsFalse) {
                        $scope.formValues.quantitySubtypes = [];
                    }
                } else if (!isQuantitySubtype) {
                    return;
                }
            }

            if (isDensitySubtype && !$scope.formValues.claimDetails.isEstimatedSettlementAmountManual) {
                $scope.formValues.claimDetails.estimatedSettlementAmount = null;
            }
            if (isDensitySubtype) {
                BDNQuantityUom = $scope.formValues.densitySubtypes[density.index].bdnQuantityUom;
                BDNQuantity = $scope.formValues.densitySubtypes[density.index].bdnQuantity;
                ConfirmedQuantity = $scope.formValues.densitySubtypes[density.index].confirmedQuantity;
                ConfirmedQuantityUom = $scope.formValues.densitySubtypes[density.index].confirmedQuantityUom;
                specParameterUomConversionFactor = $scope.formValues.densitySubtypes[density.index].specParameterUomConversionFactor;
                densityDifference = $scope.formValues.densitySubtypes[density.index].densityDifference;
                if ($scope.formValues.densitySubtypes[density.index].specParameter) {
                    specParameterId = $scope.formValues.densitySubtypes[density.index].specParameter.id;
                }
                $scope.formValues.claimType.quantityShortageUom = $scope.formValues.densitySubtypes[density.index].bdnQuantityUom;
            }

            payload = {
                Payload: {
                    productId : productId,
                    isDensitySubtype : isDensitySubtype,
                    // specParameterUomConversionFactor : specParameterUomConversionFactor,
                    BdnQuantity : BDNQuantity,
                    BdnQuantityUom : BDNQuantityUom,
                    confirmedQuantity : ConfirmedQuantity,
                    confirmedQuantityUom : ConfirmedQuantityUom,
                    densityDifference : densityDifference,
                    sellerQuantity : sellerQuantity,
                    buyerQuantity : buyerQuantity,
                    quantityUom : quantityUom,
                    specParameterId : specParameterId
                }
            };
            $http.post(`${API.BASE_URL_DATA_CLAIMS }/api/claims/getQuantityShortage`, payload).then((response) => {
                console.log(response);
                if (response.data.payload != 'null') {
                    $scope.formValues.claimType.quantityShortage = response.data.payload;
                    if (!$scope.formValues.claimDetails.isEstimatedSettlementAmountManual) {
                    	let newEstimatedSettlementAmount = response.data.payload * $scope.formValues.orderDetails.orderPrice;
                        if (newEstimatedSettlementAmount * -1 != $scope.formValues.claimDetails.estimatedSettlementAmount) {
	                        $scope.formValues.claimDetails.estimatedSettlementAmount = newEstimatedSettlementAmount;
                        }
                        if($scope.formValues.claimDetails.estimatedSettlementAmount < 0) {
                            $.each($scope.options.SettlementType, (k, v) => {
	                            if(v.name === 'Receive') {
                                    $scope.formValues.claimDetails.settlementType = v;
                                    $scope.formValues.claimDetails.estimatedSettlementAmount *= -1;
                                    toastr.info('The estimated settlement amount cannot be negative. The settlement type has been set to "Receive" and the amount is positive.');
                                }
                            });
                        }
                    }
                }
                // calculate(vm.old_cost, response.data.payload[1].id, vm.old_costType)
            });
        };


        function convertDecimalSeparatorStringToNumber(number) {
            numberToReturn = number;
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

        $scope.setPageTitle = function(claim, vessel) {
            // tab title
            let title = `Claims - ${ claim } - ${ vessel}`;
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            });
        };
        $scope.$on('formValues', () => {
            console.log($scope.formValues);
            if(vm.screen_id == 'claims') {
                if($scope.formValues.name) {
                    // 1. if order  with request, set request name
                    if($scope.formValues.orderDetails) {
                        if($scope.formValues.orderDetails.requestInfo) {
                            if($scope.formValues.orderDetails.requestInfo.request) {
                                $scope.setPageTitle($scope.formValues.orderDetails.requestInfo.request.name, $scope.formValues.orderDetails.requestInfo.vesselName);
                                return;
                            }
                        }
                    }
                    // 2. if order without requesr, set order name
                    if($scope.formValues.orderDetails) {
                        if($scope.formValues.orderDetails.order) {
                            if($scope.formValues.orderDetails.order) {
                                $scope.setPageTitle($scope.formValues.orderDetails.order.name, $scope.formValues.orderDetails.vessel);
                                return;
                            }
                        }
                    }
                    // 3. else set claim name
                    if($scope.formValues.orderDetails) {
                        $scope.setPageTitle($scope.formValues.name, $scope.formValues.orderDetails.vessel);
                    }
                }
            }
        });
    }
]);

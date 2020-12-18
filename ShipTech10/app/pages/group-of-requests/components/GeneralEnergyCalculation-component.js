angular.module('shiptech.components')
    .controller('GeneralEnergyCalculation', [ '$scope', '$rootScope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService',
        function($scope, $rootScope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService) {
	        let ctrl = this;
            $rootScope.shouldRefreshGroup = false;

	        tenantService.tenantSettings.then((settings) => {
	            ctrl.numberPrecision = settings.payload.defaultValues;
	            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
	            ctrl.quantityPrecision = settings.payload.defaultValues.quantityPrecision;
	        });

            ctrl.$onInit = function() {
                console.log(ctrl.energyCalculationBladePayload);

                var payload = ctrl.energyCalculationBladePayload.payload;
                ctrl.energyCalculationBladeData = {
                    product:  ctrl.energyCalculationBladePayload.currentProduct.product
                };
                ctrl.getEnergyBladeContentByProduct(payload, () => {
                    ctrl.normalizeOffSpecParamsMinMax();
                    ctrl.computeMinPricePerLocations();
                });
            };

            ctrl.getEnergyBladeContentByProduct = function(payload, callback) {
                groupOfRequestsModel.getEnergyBladeContentByProduct(payload).then((data) => {
                    if (data) {
                        ctrl.energyCalculationBladeData.data = data.payload;
                        ctrl.priceDifference();
                        if (callback) {
                            callback();
                        }
                    }
	            });
            };

            ctrl.priceDifference = function() {
                $.each(ctrl.energyCalculationBladeData.data, (k, loc) => {
                    $.each(loc.counterparties, (k2, counterparty) => {
                        var priceGap = counterparty.energyParameterValues.priceGap;
                        if (priceGap == 0) {
                            counterparty.energyParameterValues.priceGap = counterparty.energyParameterValues.priceGap.toString();
                        }
                    });
                });
            }
            ctrl.computeDiffBasedOnSpecificEnergy = function() {
                $.each(ctrl.energyCalculationBladeData.data, (k, loc) => {
                    $.each(loc.counterparties, (k2, counterparty) => {
                        var specificEnergy = counterparty.energyParameterValues.specificEnergy;
                        var specificEnergy6Months = counterparty.energyParameterValues.specificEnergy6Months;
                        var pricePerSpecificEnergy = parseFloat(counterparty.energyParameterValues.pricePerSpecificEnergy);
                        counterparty.energyParameterValues.diffBasedOnSpecificEnergy = specificEnergy * specificEnergy6Months * pricePerSpecificEnergy;
                    });
                });
            };

            ctrl.computeMinPricePerLocations = function() {
                var allPrices = [];
                $.each(ctrl.energyCalculationBladeData.data, (k, loc) => {
                    $.each(loc.counterparties, (k2, counterparty) => {
                        allPrices.push(counterparty.energyParameterValues.totalComputedPrice);
                    });
                });
                var minPriceFound = _.minBy(allPrices);
                $.each(ctrl.energyCalculationBladeData.data, (k, loc) => {
                    $.each(loc.counterparties, (k2, counterparty) => {
                        counterparty.isMinPrice = false;
                        if (parseFloat(counterparty.energyParameterValues.totalComputedPrice) == parseFloat(minPriceFound)) {
                            counterparty.isMinPrice = true;
                        }
                    });
                });
            };

            ctrl.normalizeOffSpecParamsMinMax = function() {
                $.each(ctrl.energyCalculationBladeData.data, (k, loc) => {
                    $.each(loc.counterparties, (k2, counterparty) => {
                        counterparty.minMaxSpecs = {
                            viscosity : _.find(counterparty.specParameters, (obj) => {
                                return obj.energyParameterName == 'Viscosity';
                            }),
                            sulphur : _.find(counterparty.specParameters, (obj) => {
                                return obj.energyParameterName == 'Sulphur';
                            }),
                            density : _.find(counterparty.specParameters, (obj) => {
                                return obj.energyParameterName == 'Density';
                            }),
                            ash : _.find(counterparty.specParameters, (obj) => {
                                return obj.energyParameterName == 'Ash';
                            }),
                            water : _.find(counterparty.specParameters, (obj) => {
                                return obj.energyParameterName == 'Water';
                            })
                        };
                    });
                });
                console.log(ctrl.energyCalculationBladeData.data);
            };

            ctrl.updateEnergySpecValuesByProduct = function() {
                var hasInvalidPrice = false;
                $.each(ctrl.energyCalculationBladeData.data, (k, loc) => {
                    let allowZeroPricing = loc.allowZeroPricing;
                    $.each(loc.counterparties, (k2, counterparty) => {
                        if (counterparty.price && (!allowZeroPricing && counterparty.price <= 0)) {
                            hasInvalidPrice = true;
                        }
                    });
                });
                if (hasInvalidPrice) {
                    toastr.error('Please check price fields');
                    ctrl.isSaveBlade = false;
                    return;
                }

                if (!ctrl.energyCalculationBladeData.data) {
                    return false;
                }
                let updatePayload = angular.copy(ctrl.energyCalculationBladeData.data);
                ctrl.energyCalculationBladeData.data = null;
                groupOfRequestsModel.updateEnergySpecValuesByProduct(updatePayload).then((data) => {
            		$rootScope.shouldRefreshGroup = true;
            		if (!ctrl.savedFromBladeClose) {
	                	ctrl.getEnergyBladeContentByProduct(ctrl.energyCalculationBladePayload.payload, () => {
	                		ctrl.normalizeOffSpecParamsMinMax();
	                		ctrl.computeMinPricePerLocations();
	                	});
            		}
            		if (ctrl.isSaveBlade) {
		            	$('.bladeEntity').removeClass('open');
			            $('body').css('overflow-y', 'auto');
				            setTimeout(() => {
				                $rootScope.bladeTemplateUrl = '';
				                if($rootScope.refreshPending) {
				                    $state.reload();
				                  // window.location.reload();
				            	}
				            	$rootScope.$broadcast('counterpartyBladeClosed', true);
				                setTimeout(() => {
				                    $rootScope.$broadcast('initScreenAfterSendOrSkipRfq', true);
				                }, 100);
				                $rootScope.overrideCloseNavigation = false;
				            }, 500);
            		}
                	console.log(data);
                });
            };

            $rootScope.$on('updateEnergySpecValuesByProduct', () => {
                ctrl.isSaveBlade = true;
                ctrl.savedFromBladeClose = true;
                ctrl.updateEnergySpecValuesByProduct();
            });

            ctrl.checkIfIsOffspec = function(value, specParam) {
                if (!specParam || !value) {
                    return false;
                }
                let min = specParam.min;
                let max = specParam.max;
                if (min && max) {
                    if (value > max || value < min) {
                        return true;
                    }
                }
                if (min) {
                    if (value < min) {
                        return true;
                    }
                }
                if (max) {
                    if (value > max) {
                        return true;
                    }
                }
                return false;
            };

            ctrl.priceChanged = function() {
                ctrl.computeMinPricePerLocations();
            };
            ctrl.deletePrice = function(counterparty) {
                $rootScope.$broadcast('isPhysicalSupplierMandatory', counterparty);
            };
        }
    ]
    );

angular.module('shiptech.components').component('generalEnergyCalculation', {
    templateUrl: 'components/blade/templates/gor-energyCalculation.html',
    controller: 'GeneralEnergyCalculation',
    bindings: {
        args: '<',
    	energyCalculationBladeData : '<',
    	energyCalculationBladePayload : '<',
        onDelink: '&'
    }
});

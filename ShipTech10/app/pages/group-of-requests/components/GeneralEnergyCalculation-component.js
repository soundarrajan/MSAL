angular.module('shiptech.components')
    .controller('GeneralEnergyCalculation', ['$scope', '$rootScope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService',  
        function($scope, $rootScope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService) {

	        var ctrl = this;
			$rootScope.shouldRefreshGroup = false;
	        
	        tenantService.tenantSettings.then(function (settings) {
	            ctrl.numberPrecision = settings.payload.defaultValues;
	            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
	            ctrl.quantityPrecision = settings.payload.defaultValues.quantityPrecision;
	        });

			ctrl.$onInit = function() {
				console.log(ctrl.energyCalculationBladePayload);
				
				payload = ctrl.energyCalculationBladePayload.payload	  
				ctrl.energyCalculationBladeData = {
					"product":  ctrl.energyCalculationBladePayload.currentProduct.product
				};
				ctrl.getEnergyBladeContentByProduct(payload, function(){
					ctrl.normalizeOffSpecParamsMinMax();   
					ctrl.computeMinPricePerLocations(); 
				})
				
			}

			ctrl.getEnergyBladeContentByProduct = function(payload, callback) {
				groupOfRequestsModel.getEnergyBladeContentByProduct(payload).then(function (data) {
					if (data) {
						ctrl.energyCalculationBladeData.data = data.payload;
						if (callback) {
							callback();
						}
					}
	            });					
			}

			ctrl.computeDiffBasedOnSpecificEnergy = function() {
				$.each(ctrl.energyCalculationBladeData.data, function(k,loc){
					$.each(loc.counterparties, function(k2, counterparty){
						specificEnergy = counterparty.energyParameterValues.specificEnergy;
						specificEnergy6Months = counterparty.energyParameterValues.specificEnergy6Months;
						pricePerSpecificEnergy = parseFloat(counterparty.energyParameterValues.pricePerSpecificEnergy);
						counterparty.energyParameterValues.diffBasedOnSpecificEnergy = (specificEnergy * specificEnergy6Months) * pricePerSpecificEnergy;
					})
				})
			}

			ctrl.computeMinPricePerLocations = function() {
				$.each(ctrl.energyCalculationBladeData.data, function(k,loc){
					loc.minPriceCounterpartyIndex = _.minBy(loc.counterparties, function(el){
						return el.price;
					})
					if (!loc.minPriceCounterpartyIndex) {
						return;
					}
					console.log(loc.minPriceCounterpartyIndex);
					$.each(loc.counterparties, function(k2, counterparty){
						counterparty.isMinPrice = false;
						if (parseFloat(counterparty.price) == parseFloat(loc.minPriceCounterpartyIndex.price) ) {
							counterparty.isMinPrice = true;
						}
					})
				})	

			}

			ctrl.normalizeOffSpecParamsMinMax = function() {
				$.each(ctrl.energyCalculationBladeData.data, function(k,loc){
					$.each(loc.counterparties, function(k2, counterparty){
						counterparty.minMaxSpecs = {
							"viscosity" : _.find(counterparty.specParameters, function(obj){return obj.energyParameterName == "Viscosity";}),
							"sulphur" : _.find(counterparty.specParameters, function(obj){return obj.energyParameterName == "Sulphur";}),
							"density" : _.find(counterparty.specParameters, function(obj){return obj.energyParameterName == "Density";}),
							"ash" : _.find(counterparty.specParameters, function(obj){return obj.energyParameterName == "Ash";}),
							"water" : _.find(counterparty.specParameters, function(obj){return obj.energyParameterName == "Water";})
						}					
					})
				})
				console.log(ctrl.energyCalculationBladeData.data);
			}

			ctrl.updateEnergySpecValuesByProduct = function() {

				hasInvalidPrice = false;
				$.each(ctrl.energyCalculationBladeData.data, function(k,loc) {
					var allowZeroPricing = loc.allowZeroPricing;
					$.each(loc.counterparties, function(k2, counterparty){
						if (!counterparty.price || (!allowZeroPricing && counterparty.price <= 0) ) {
							hasInvalidPrice = true;
						}
					})
				})
				if (hasInvalidPrice) {
					toastr.error("Please check price fields");
					return;
				}

                groupOfRequestsModel.updateEnergySpecValuesByProduct(ctrl.energyCalculationBladeData.data).then(function (data) {
            		// $rootScope.$broadcast("initScreenAfterSendOrSkipRfq", true);  
            		$rootScope.shouldRefreshGroup = true;
                	ctrl.getEnergyBladeContentByProduct(ctrl.energyCalculationBladePayload.payload, function(){
                		ctrl.normalizeOffSpecParamsMinMax();
                		ctrl.computeMinPricePerLocations();
                	})
                	console.log(data);	
                });

			}

			ctrl.checkIfIsOffspec = function(value, specParam) {
				if (!specParam || !value) {
					return false;
				}
				var min = specParam.min;
				var max = specParam.max;
				if (min && max) {
					if (value > max || value < min) {
						return true
					}
				}
				if (min) {
					if (value < min) {
						return true
					}
				}
				if (max) {
					if (value < max) {
						return true
					}
				}				
				return false
			}	

			ctrl.priceChanged = function() {
				ctrl.computeMinPricePerLocations();
			}

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
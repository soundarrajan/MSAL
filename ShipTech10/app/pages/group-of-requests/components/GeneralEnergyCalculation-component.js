angular.module('shiptech.components')
    .controller('GeneralEnergyCalculation', ['$scope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService',  
        function($scope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService) {

	        var ctrl = this;
		
	        tenantService.tenantSettings.then(function (settings) {
	            ctrl.numberPrecision = settings.payload.defaultValues;
	            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
	        });

			ctrl.$onInit = function() {
				console.log(ctrl.energyCalculationBladePayload);
				
				payload = ctrl.energyCalculationBladePayload.payload	  
				ctrl.energyCalculationBladeData = {
					"product":  ctrl.energyCalculationBladePayload.currentProduct.product
				};
				ctrl.getEnergyBladeContentByProduct(payload, function(){
					ctrl.computeDiffBasedOnSpecificEnergy();  
					ctrl.normalizeOffSpecParamsMinMax();    
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
						return el.energyParameterValues.pricePerSpecificEnergy;
					})
					console.log(loc.minPriceCounterpartyIndex);
					$.each(loc.counterparties, function(k2, counterparty){
						counterparty.isMinPrice = false;
						if (parseFloat(counterparty.energyParameterValues.pricePerSpecificEnergy) == parseFloat(loc.minPriceCounterpartyIndex.energyParameterValues.pricePerSpecificEnergy) ) {
							counterparty.isMinPrice = true;
						}
					})
				})	

			}

			ctrl.normalizeOffSpecParamsMinMax = function() {
				$.each(ctrl.energyCalculationBladeData.data, function(k,loc){
					$.each(loc.counterparties, function(k2, counterparty){
						counterparty.minMaxSpecs = {
							"viscosity" : _.find(counterparty.specParameters, function(obj){return obj.specParameter.name == "Viscosity @ 50 degC";}),
							"sulphur" : _.find(counterparty.specParameters, function(obj){return obj.specParameter.name == "Sulphur content";}),
							"density" : _.find(counterparty.specParameters, function(obj){return obj.specParameter.name == "Density @ 15 degC";}),
							"ash" : _.find(counterparty.specParameters, function(obj){return obj.specParameter.name == "Ash content";}),
							"water" : _.find(counterparty.specParameters, function(obj){return obj.specParameter.name == "Water content";})
						}					
					})
				})
				console.log(ctrl.energyCalculationBladeData.data);
			}

			ctrl.updateEnergySpecValuesByProduct = function() {

                groupOfRequestsModel.updateEnergySpecValuesByProduct(ctrl.energyCalculationBladeData.data).then(function (data) {
                	ctrl.getEnergyBladeContentByProduct(ctrl.energyCalculationBladePayload.payload, function(){
                		ctrl.normalizeOffSpecParamsMinMax();
                		ctrl.computeDiffBasedOnSpecificEnergy();
                		ctrl.computeMinPricePerLocations();
                	})
                	console.log(data);	
                });

			}

			ctrl.checkIfIsOffspec = function(value, specParam) {
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
				ctrl.computeDiffBasedOnSpecificEnergy();
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
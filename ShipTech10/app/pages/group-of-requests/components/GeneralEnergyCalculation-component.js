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
					"product":  ctrl.energyCalculationBladePayload.currentProduct
				};
				ctrl.getEnergyBladeContentByProduct(payload)
				
			}

			ctrl.getEnergyBladeContentByProduct = function(payload) {
				groupOfRequestsModel.getEnergyBladeContentByProduct(payload).then(function (data) {
					if (data) {
						ctrl.energyCalculationBladeData.data = data.payload;
						ctrl.computeDiffBasedOnSpecificEnergy();      
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

			ctrl.updateEnergySpecValuesByProduct = function() {

                groupOfRequestsModel.updateEnergySpecValuesByProduct(ctrl.energyCalculationBladeData.data).then(function (data) {
                	ctrl.getEnergyBladeContentByProduct(ctrl.energyCalculationBladePayload.payload)
                	console.log(data);	
                });

			}	

			ctrl.priceChanged = function() {
				ctrl.computeDiffBasedOnSpecificEnergy();
				ctrl.computeMinPricePerLocations()
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
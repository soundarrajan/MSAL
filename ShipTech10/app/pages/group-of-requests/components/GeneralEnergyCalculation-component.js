angular.module('shiptech.components')
    .controller('GeneralEnergyCalculation', ['$scope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state',  
        function($scope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state) {
	        var ctrl = this;
			$scope.$watch('ctrl.energyCalculationBladeData', function(newValue, oldValue) {
			});
		
			ctrl.$onInit = function() {
				console.log(ctrl.energyCalculationBladeData);	  
				ctrl.computeDiffBasedOnSpecificEnergy();      
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
        onDelink: '&'
    }
});
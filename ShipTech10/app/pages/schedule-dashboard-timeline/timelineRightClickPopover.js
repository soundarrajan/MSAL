angular.module('shiptech.components')
    .controller('timelineRightClickPopover', ['$scope', '$rootScope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService', '$tenantSettings', 'API', '$http',
        function($scope, $rootScope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService, $tenantSettings, API, $http) {

	        var ctrl = this;
		
	        tenantService.tenantSettings.then(function (settings) {
	            ctrl.numberPrecision = settings.payload.defaultValues;
	            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
	        });

		    ctrl.$onChanges = function (changes) {
		    	$scope.test = new Date();
		    	$scope.rightClickPopoverData = changes.rightClickPopoverData.currentValue;
		    };

			ctrl.$onInit = function() {
			};

	        $scope.confirmCancelBunkerStrategy = function(bunkerPlan, vsVal) {
				$(".cancelStrategyModal").modal();
				$(".cancelStrategyModal").removeClass("hide");
				$scope.cancelStrategyModalData = {};
				$scope.cancelStrategyModalData.vesselName = vsVal.request.vesselName;
				$scope.cancelStrategyModalData.portCode = vsVal.locationCode;
				$scope.cancelStrategyModalData.eta = vsVal.eta;
				$scope.cancelStrategyModalData.fuelType = bunkerPlan.productType;
				$scope.cancelStrategyModalData.quantity = bunkerPlan.supplyQuantity;
				$scope.cancelStrategyModalData.uom = bunkerPlan.supplyUomName;
				$scope.cancelStrategyModalData.bunkerPlanId = bunkerPlan.id;
			}


	        ctrl.cancelStrategy = function(bunkerPlanId){
				var url = API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/cancelStrategy";
				payload = {
					payload : bunkerPlanId
				}
				var currentBunkerPlanId = bunkerPlanId;
	            $http.post(url, payload).then(function success(response) {
	                if (response.status == 200) {
	                	$state.reload();
	                } else {
	                    console.log("Error cancelStrategy");
	                }
	            });
	            $scope.cancelStrategyModalData = null;
			}
		}
	]	
);

angular.module('shiptech.components').component('timelineRightClickPopover', {
    templateUrl: 'pages/schedule-dashboard-timeline/views/right-click-popover-timeline.html',
    controller: 'timelineRightClickPopover',
    bindings: {
    	rightClickPopoverData : '<',
    }
});
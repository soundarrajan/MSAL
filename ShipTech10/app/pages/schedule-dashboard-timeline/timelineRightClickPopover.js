angular.module('shiptech.components')
    .controller('timelineRightClickPopover', ['$scope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService', '$tenantSettings',  
        function($scope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService, $tenantSettings) {

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
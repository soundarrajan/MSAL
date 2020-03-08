angular.module('shiptech.components')
    .controller('morePortsPopover', [ '$scope', '$rootScope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService', '$tenantSettings', 'API', '$http',
        function($scope, $rootScope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService, $tenantSettings, API, $http) {
	        let ctrl = this;
            $scope.tenantSettings = $tenantSettings;

	        // tenantService.tenantSettings.then(function (settings) {
	        //     ctrl.numberPrecision = settings.payload.defaultValues;
	        //     ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	        //     ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
	        // });

	        console.log($scope.tenantSettings.tenantFormats.dateFormat.name);

		    ctrl.$onChanges = function(changes) {
		    	$scope.morePortsPopoverData = changes.morePortsPopoverData.currentValue.data;
		    	$scope.morePortsPopoverOffsetTop = changes.morePortsPopoverData.currentValue.offsetTop;
		    	$scope.morePortsPopoverOffsetLeft = changes.morePortsPopoverData.currentValue.offsetLeft;
		    	ctrl.morePortsPopoverDataDisplay = true;
		    };

            ctrl.$onInit = function() {
            };
        }
    ]
    );

angular.module('shiptech.components').component('morePortsPopover', {
    templateUrl: 'pages/schedule-dashboard-timeline/views/more-ports-popover-timeline.html',
    controller: 'morePortsPopover',
    bindings: {
    	morePortsPopoverData : '<',
    }
});

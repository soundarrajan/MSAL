angular.module('shiptech.components')
    .controller('timelineRightClickVesselPopover', [ '$scope', '$rootScope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService', '$tenantSettings', 'API', '$http', '$listsCache', 'statusColors',
        function($scope, $rootScope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService, $tenantSettings, API, $http, $listsCache, statusColors) {
	        let ctrl = this;

	        tenantService.tenantSettings.then((settings) => {
	            ctrl.numberPrecision = settings.payload.defaultValues;
	            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
	            ctrl.dateFormat = $scope.formatDateToMomentFormat(settings.payload.tenantFormats.dateFormat.name);
	        });

		    ctrl.$onChanges = function(changes) {
		    	$scope.test = new Date();
                console.log("IOANA");
                $timeout(() => {
		    	             $scope.rightClickVesselPopoverData = changes.rightClickVesselPopoverData.currentValue;
                });
		    };
		  
	        ctrl.addVoyageToContractPlanning = function(voyageStop) {
                var vesselsWithoutProduct = '';
	            $rootScope.scheduleDashboardVesselVoyages = [ ctrl.groupedVoyagesDetails[voyageStop][0] ];
                for (var i = 0 ; i < $rootScope.scheduleDashboardVesselVoyages.length; i++) {
                      if (!$rootScope.scheduleDashboardVesselVoyages[i].DefaultDistillate  &&  !$rootScope.scheduleDashboardVesselVoyages[i].DefaultFuel) {
                        vesselsWithoutProduct = `${vesselsWithoutProduct }${$rootScope.scheduleDashboardVesselVoyages[i].VesselName }, `;
                    }
                }
                if (vesselsWithoutProduct.length > 0) {
                    toastr.error(`For the selected Vessels : ${ vesselsWithoutProduct } there  is no product defined. Please define at least one Product into Vessel master.`);
                    return;
                }
	            localStorage.setItem('scheduleDashboardVesselVoyages', JSON.stringify($rootScope.scheduleDashboardVesselVoyages));
	            // $rootScope.activeBreadcrumbFilters = [];
	            $('.contextmenu a.close').click();
	            window.open('/#/contract-planning/', '_blank');
	        };

            ctrl.$onInit = function() {
            };

        }
    ]
    );

angular.module('shiptech.components').component('timelineRightClickVesselPopover', {
    templateUrl: 'pages/schedule-dashboard-timeline/views/right-click-vessel-popover-timeline.html',
    controller: 'timelineRightClickVesselPopover',
    bindings: {
    	rightClickVesselPopoverData : '<',
    }
});

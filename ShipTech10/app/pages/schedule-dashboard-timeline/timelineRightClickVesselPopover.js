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
                $scope.rightClickVesselPopoverData = changes.rightClickVesselPopoverData.currentValue;
                $timeout(() => {
                    groupVoyages($scope.rightClickVesselPopoverData);
                });
                ctrl.vesselName = changes.rightClickVesselPopoverData.currentValue[0].VesselName;
		    };


            var groupVoyages = function(voyages) {
                var groupedVoyagesRequest = _.filter(voyages, function(object) {
                    return object.voyageDetail.request.id != 0 && object.voyageDetail.request.requestDetail.Id
                });
                groupedVoyagesRequest = _.orderBy(groupedVoyagesRequest, "voyageDetail.request.id");

                var groupedVoyagesOrder = _.filter(voyages, function(object) {
                    return object.voyageDetail.request.requestDetail.orderId;
                });
                groupedVoyagesOrder =  _.orderBy(groupedVoyagesOrder, "voyageDetail.request.requestDetail.orderId");

                var groupedVoyagesNoScheduleRequest =  _.filter(voyages, function(object) {
                    return object.voyageDetail.isDeleted && object.voyageDetail.request.id != 0 && object.voyageDetail.request.requestDetail.Id;
                });
                groupedVoyagesNoScheduleRequest = _.orderBy(groupedVoyagesNoScheduleRequest, "voyageDetail.request.id");

                var groupedVoyagesNoScheduleOrder =  _.filter(voyages, function(object) {
                    return object.voyageDetail.isDeleted && object.voyageDetail.request.requestDetail.orderId;
                });
                groupedVoyagesNoScheduleOrder =  _.orderBy(groupedVoyagesNoScheduleOrder, "voyageDetail.request.requestDetail.orderId");


                console.log(groupedVoyagesRequest);
                console.log(groupedVoyagesOrder);
                console.log(groupedVoyagesNoScheduleRequest);
                console.log(groupedVoyagesNoScheduleOrder);


                ctrl.groupedVoyages = {
                    groupedVoyagesRequest : groupedVoyagesRequest,
                    groupedVoyagesOrder : groupedVoyagesOrder,
                    groupedVoyagesNoScheduleRequest: groupedVoyagesNoScheduleRequest,
                    groupedVoyagesNoScheduleOrder: groupedVoyagesNoScheduleOrder
                };
            };

            ctrl.getWidth = function() {
                var string = "310px";
                ctrl.changeWidth = "33.33333% !important";
                var array = [ctrl.groupedVoyages.groupedVoyagesRequest.length, ctrl.groupedVoyages.groupedVoyagesOrder.length, 
                             ctrl.groupedVoyages.groupedVoyagesNoScheduleRequest.length + ctrl.groupedVoyages.groupedVoyagesNoScheduleOrder.length];
                var max = _.max(array);
                console.log(max);
                if (max == 2) {
                    ctrl.changeWidth = "50% !important";
                    return "250px";
                } else if (max == 1) {
                    return "230px";
                }
                return string;
            }

		  
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

angular.module('shiptech').controller('BreadcrumbsController', ['$rootScope', '$timeout', '$scope', '$state', '$filter', 'STATE', 'CUSTOM_EVENTS', 'VIEW_TYPES',
    'scheduleDashboardCalendarModel', 'statusColors', '$listsCache',
    function($rootScope, $timeout, $scope, $state, $filter, STATE, CUSTOM_EVENTS, VIEW_TYPES, scheduleDashboardCalendarModel, statusColors, $listsCache) {

        $scope.state = $state;
        $scope.STATE = STATE;

        $scope.setStateParamsPath = function(toParams) {
            var pathMap = {
                'deliveriestobeverified': 'Deliveries to be Verified',
                'ordersdelivery': 'Orders Delivery List',
                'deliveries': 'Transactions to be Invoiced List',
                'claims': 'Invoice Claims List',
                'invoice': 'Invoices List',
                'complete_view': 'Complete View List',
                'treasuryreport':  'Treasury Report',
                'users': 'User',
                'role': 'Roles',
                'sellerrating': 'Seller Rating',
                'configuration': 'Configuration'

            }

            if(pathMap[toParams.screen_id]){
                // change path in breadcrumb
                $scope.state.params.path[toParams.path.length - 1].label = pathMap[toParams.screen_id];
            }   
        }


        $scope.statusColorMap = ["info", "warning", "danger", "green-dark", "default", "green-light"];

        $scope.$on('$includeContentLoaded', function() {
        });

        $scope.statusList = [];

        $scope.toggle = function() {
            //     QuickSidebar.init()
            $("body").toggleClass("page-quick-sidebar-open");
        };
        // Closes the quick sidebar on route change. Leaving it open is confusing and can create the awkward situation
        // when it cannot be closed, if the view changes to one that does not display de sidebar toggler.
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            $('body').removeClass('page-quick-sidebar-open');
            $rootScope.activeBreadcrumbFilters = null;
        });

        $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
            $scope.setStateParamsPath(toParams);
        })

        $scope.$on("sdDataLoaded", function (event) {
                scheduleDashboardCalendarModel.getStatuses().then(function(data){
                    if (data !== null) {
                        // $scope.statusList = [];
                        $scope.getCalendarStatus();
                    }
                });
        });

        /**
        * Broadcast an event with a certain status so pages know to react and filter
        * @param {String} status - status for broadcast
        */
        $scope.breadcrumbsFilter = function(status, no) {
            var packedFilter = {
                "column": {
                    "columnRoute": "schedule-dashboard-calendar",
                    "columnName": "Port Status",
                    "columnValue": "VoyageDetail_PortStatus_DisplayName",
                    "sortColumnValue": null,
                    "columnType": "Text",
                    "displayName": "Port Status",
                },
                "condition": {
                    "conditionName": "Is equal",
                    "conditionValue": "=",
                    "conditionApplicable": "Text",
                    "conditionNrOfValues": 1
                },
                "value": [status]
            }
            $rootScope.$broadcast("breadcrumbs-filter-applied", packedFilter);        	
            // $rootScope.$broadcast(CUSTOM_EVENTS.BREADCRUMB_FILTER_STATUS, status, no);
        };

        /**
        * Broadcast an event to reload the page data
        */
        $scope.broadcastRefreshData = function () {
        	$state.reload();
        	return;
            $rootScope.$broadcast(CUSTOM_EVENTS.BREADCRUMB_REFRESH_PAGE, status);
        };

        /**
        * Create an inline style for a breadcrumb depending on received hex color code
        * @param {String} colorCode - color code required in the style
        */
        function createStyle(colorCode) {
            return {
                "border-color": colorCode,
                "background-color": colorCode
            };
        }

        /**
        * Updates displayed statuses from a list taken from the data or from the layout
        * @param {String} list - list of statuses to update from
        */
        function updateStatusList(list) {
            var listObjects, status;
            if (list) {

                for (var i = 0 ; i < list.length; i++) {
                    status = {};
                    //check statuses from retrieving data
                    if (list[i].statusName) {
                        listObjects = $filter("filter")($scope.statusList, {name: list[i].statusName}, true);
                        //if already added, only update count
                        if (listObjects.length > 0) {
                            listObjects[0].count = list[i].count;
                        } else {
                            status = {
                                style : null,
                                count : list[i].count,
                                name : list[i].statusName,
                                statusDisplayName : list[i].statusDisplayName,
                                label: null,
                                display: false
                            };
                            $scope.statusList.push(status);
                        }
                    //check statuses from received layout
                    } else if (list[i].status){
                        listObjects = $filter("filter")($scope.statusList, { name : list[i].status.name}, true);
                        //if already added, only update name and color
                        if (listObjects.length > 0) {
                            listObjects[0].style = createStyle(list[i].colorCode);
                            listObjects[0].name = list[i].status.name;
                            listObjects[0].statusDisplayName = list[i].status.displayName;
                            listObjects[0].display = list[i].displayInDashboard;
                        } else {
                            status = {
                                style : createStyle(list[i].colorCode),
                                count : 0,
                                name : list[i].status.name,
                                statusDisplayName : list[i].status.displayName,
                                label : list[i].label,
                                display : list[i].displayInDashboard
                            };
                            $scope.statusList.push(status);
                        }
                    }
                }
            }
        }

        /**
        * Retrieve the breadcrumb request status list to be displayed on current page
        * @return {Array} statusList - list of request statuses for current page
        */
        $scope.getCalendarStatus = function () {
        	var model = scheduleDashboardCalendarModel.getLatestVersion();
        	if (model) {
                if (!model.payload) return;
                $scope.calendarStatuses = model.payload.scheduleDashboardStatus;
                if ($scope.calendarStatusesInScheduleTable) {
		            $scope.calendarStatuses = $scope.calendarStatusesInScheduleTable;
                }
                if ($scope.calendarStatusesInScheduleCalendar) {
		            $scope.calendarStatuses = $scope.calendarStatusesInScheduleCalendar;
                }                
                // if ($scope.adminDashboardStatuses) {
                // 	createStatusFilters();
                // }
	        	console.log(new Date())
	            if($state.current.name == STATE.DASHBOARD_TABLE || $state.current.name == STATE.DASHBOARD_CALENDAR || $state.current.name == STATE.DASHBOARD_TIMELINE || $state.current.name == STATE.HOME) { 

			    	if (window.scheduleDashboardConfiguration) {

		            	$scope.adminDashboardStatuses = $filter("filter")(window.scheduleDashboardConfiguration.payload.labels, { displayInDashboard : true}, true);
		                if ($scope.calendarStatuses) {
		                	$scope.statusList = $scope.createStatusFilters()
		                }

			    		// $scope.adminDashboardStatuses = $filter("filter")(data.labels, { displayInDashboard : true}, true);
				     //    statusList = ctrl.dashboardConfiguration.labels;
			      //       selectTimeScale($stateParams.timescale);
			    	}
			    		// clearInterval($scope.scheduleDashboardConfigurationInterval);
		       //  $scope.scheduleDashboardConfigurationInterval = setInterval(function(){
		       //  },500)


	                // scheduleDashboardCalendarModel.getStatuses().then(function(data){
	                //     if (data !== null) {
	                //     	$scope.adminDashboardStatuses = $filter("filter")(data.labels, { displayInDashboard : true}, true);
			              //   if ($scope.calendarStatuses) {
			              //   	$scope.createStatusFilters()
			              //   }
	                //         // updateStatusList(data.labels);
	                //     }
	                // });
	            }                
                // updateStatusList(model.payload.scheduleDashboardStatus);
            }
        	 return $scope.statusList;
        };

        // $timeout(function() {
        //     // if($state.is(STATE.DASHBOARD_TABLE) || $state.is(STATE.DASHBOARD_CALENDAR)) {
        //     if($state.current.name == STATE.DASHBOARD_TABLE || $state.current.name == STATE.DASHBOARD_CALENDAR || $state.current.name == STATE.HOME) { 
        //         scheduleDashboardCalendarModel.getStatuses().then(function(data){
        //             if (data !== null) {
        //             	$scope.adminDashboardStatuses = $filter("filter")(data.labels, { displayInDashboard : true}, true);
		      //           if ($scope.calendarStatuses) {
		      //           	$scope.createStatusFilters()
		      //           }
        //                 // updateStatusList(data.labels);
        //             }
        //         });
        //     }
        // });

        $scope.createStatusFilters = function () {
            $scope.statusList = [];
            $.each($scope.adminDashboardStatuses, function (adsk, adsv) {

                var transactionTypeId = null;
                if (adsv.transactionType) {
                    transactionTypeId = adsv.transactionType.id;
                }
                if(adsv.status.transactionTypeId) {
                    transactionTypeId = adsv.status.transactionTypeId;
                }

                var statusId = null;
                if(adsv.status) {
                    statusId = adsv.status.id;
                }

                var statusObj = {
                    id: statusId,
                    transactionTypeId: transactionTypeId,
                    name: adsv.status.name,
                }

                var colorCode = statusColors.getColorCodeFromLabels(statusObj, $listsCache.ScheduleDashboardLabelConfiguration);

                var status = {}
                status.style = createStyle(colorCode);
                status.count = 0;
                status.name = adsv.status.name;
                status.statusDisplayName = adsv.status.displayName;
                status.label = adsv.label;
                status.display = true;
                $.each($scope.calendarStatuses,
                    function(csk, csv) {

                        if (csv.status.displayName == adsv.status.displayName) {
                            status.style = createStyle(colorCode);
                            status.count = csv.count;
                            status.name = adsv.status.name;
                            status.statusDisplayName = adsv.status.displayName;
                            status.label = adsv.label;
                            status.display = true;
                        }
                    });
                statusIsAlreadyAdded = false;
                $.each($scope.statusList, function (k, v) {
                    if (v.name == adsv.status.name) {
                        statusIsAlreadyAdded = true;
                    }
                })
                if (!statusIsAlreadyAdded) {
                    $scope.statusList.push(status);
                }
            })
            return $scope.statusList;
        }


        $scope.visibleSidebarToggle = function () {
            return VIEW_TYPES.LIST.indexOf($state.current.name) >= 0;
        };

        $scope.calculateStatusesCount = function() {
        	return $filter('filter')($scope.statusList, {display : true}).length
        }

        $rootScope.$on("scheduleDashboardCalendarGetResponse", function(ev, data){
			// $scope.adminDashboardStatuses = data.payload.scheduleDashboardStatus;
			$scope.calendarStatusesInScheduleTable = null;
			$scope.calendarStatusesInScheduleCalendar = data.payload.scheduleDashboardStatus;
			$scope.getCalendarStatus();
        	// console.log(data);
        });
        $rootScope.$on("scheduleDashboardTableGetResponse", function(ev, data){
        	if (typeof(data) != 'undefined') {
	        	if (typeof(data.payload.scheduleDashboardStatus) != 'undefined') {
					$scope.calendarStatusesInScheduleCalendar = null;
					$scope.calendarStatusesInScheduleTable = data.payload.scheduleDashboardStatus;
					$scope.getCalendarStatus();
	        	}
        	}
        	// console.log(data);
        });        

        $scope.isContractInFormulaScreen = function(){
        	if ($(".formulaMaster").length > 0) {
	        	if (angular.element($(".formulaMaster")).scope().formValues.contractId) {
	        		return angular.element($(".formulaMaster")).scope().formValues.contractId
	        	}
        	}
        	return false;
        }

    }
]);

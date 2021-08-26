angular.module('shiptech').controller('BreadcrumbsController', [ '$rootScope', '$timeout', '$scope', '$state', '$location', '$filter', 'STATE', 'CUSTOM_EVENTS', 'VIEW_TYPES',
    'scheduleDashboardCalendarModel', 'statusColors', '$listsCache', '$tenantConfiguration',
    function($rootScope, $timeout, $scope, $state, $location, $filter, STATE, CUSTOM_EVENTS, VIEW_TYPES, scheduleDashboardCalendarModel, statusColors, $listsCache, $tenantConfiguration) {
        $scope.state = $state;
        $scope.STATE = STATE;
        window.scheduleDashboardConfiguration = { payload: $tenantConfiguration.scheduleDashboardConfiguration };

        $scope.listsCache = $listsCache;
        $scope.productTypeView = $rootScope.productTypeView ? $rootScope.productTypeView : angular.copy($scope.listsCache.ProductView[0]);
        $rootScope.productTypeView =  $rootScope.productTypeView ? $rootScope.productTypeView : angular.copy($scope.listsCache.ProductView[0]);
        
        $rootScope.$on('$productTypeView', (event, pageData) => {
            let productTypeViewId = (pageData?.productTypeView?.id) ? pageData.productTypeView.id : angular.copy($scope.listsCache.ProductView[0].id);
            let findProductViewIndexFromListCache = _.findIndex($scope.listsCache.ProductView, function(obj) {
                return obj.id == productTypeViewId;
            });
            if (findProductViewIndexFromListCache != -1) {
                $rootScope.productTypeView = angular.copy($scope.listsCache.ProductView[findProductViewIndexFromListCache]);
                $rootScope.DefaultLandingPageView = angular.copy($rootScope.productTypeView);
                $scope.productTypeView = angular.copy($rootScope.productTypeView);
            }
        });

        $scope.$on('filters-removed', function (event, payload) {
            console.log(payload);
            $scope.productTypeView = angular.copy($scope.listsCache.ProductView[0]);
            $rootScope.productTypeView = angular.copy($scope.listsCache.ProductView[0]);
            $scope.$apply();
            $scope.$digest();

        });

        $scope.getPropertyValue = function(val, property) {
            return val[property];
        }

        $scope.setStateParamsPath = function(toParams) {
            let pathMap = {
                deliveriestobeverified: 'Deliveries to be Verified',
                ordersdelivery: 'Orders Delivery List',
                deliveries: 'Transactions to be Invoiced List',
                claims: 'Invoice Claims List',
                invoice: 'Invoices List',
                complete_view: 'Complete View List',
                treasuryreport:  'Treasury Report',
                users: 'User',
                role: 'Roles',
                sellerrating: 'Seller Rating',
                configuration: 'Configuration'

            };

            if(pathMap[toParams.screen_id]) {
                // change path in breadcrumb
                $scope.state.params.path[toParams.path.length - 1].label = pathMap[toParams.screen_id];
            }
        };


        $scope.statusColorMap = [ 'info', 'warning', 'danger', 'green-dark', 'default', 'green-light' ];

        $scope.$on('$includeContentLoaded', () => {
        });

        $scope.statusList = [];

        $scope.toggle = function() {
            //     QuickSidebar.init()
            $('body').toggleClass('page-quick-sidebar-open');
        };
        // Closes the quick sidebar on route change. Leaving it open is confusing and can create the awkward situation
        // when it cannot be closed, if the view changes to one that does not display de sidebar toggler.
        $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
            $('body').removeClass('page-quick-sidebar-open');
            $rootScope.activeBreadcrumbFilters = null;
        });

        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            $scope.setStateParamsPath(toParams);
        });

        $scope.$on('$locationChangeStart', function(e, next, prev) {
            let currentPath = $location.path();
            // Check and reset to default view as bunker view on nav to any page except logo link
            if(currentPath == "" || currentPath == "/") {
                $rootScope.productTypeView = angular.copy($rootScope.DefaultLandingPageView);
                $scope.productTypeView = angular.copy($rootScope.DefaultLandingPageView);
            } else if((prev.indexOf('schedule-dashboard-timeline') == -1 && prev.indexOf('schedule-dashboard-table')==-1) && (next.indexOf('schedule-dashboard-timeline') > -1 || next.indexOf('schedule-dashboard-table') > -1)) {
                $rootScope.productTypeView = angular.copy($scope.listsCache.ProductView[0]);
                $scope.productTypeView = angular.copy($rootScope.productTypeView);
            } else if(next.indexOf('schedule-dashboard-timeline') == -1 && next.indexOf('schedule-dashboard-table') == -1) {
                $rootScope.productTypeView = angular.copy($scope.listsCache.ProductView[0]);
                $scope.productTypeView = angular.copy($rootScope.productTypeView);
            }
        });

        $scope.$on('sdDataLoaded', (event) => {
            scheduleDashboardCalendarModel.getStatuses().then((data) => {
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
        $scope.breadcrumbsFilter = function(status, no, productTypeView) {
            if (productTypeView && ['Bunker View', 'Residue View', 'Additive View'].indexOf(productTypeView.name) != -1) {
                console.log('user select product type view');
                $scope.productTypeView = angular.copy(productTypeView);
                $rootScope.productTypeView  = angular.copy(productTypeView);
                $rootScope.$broadcast('set-product-type-view-for-table', $rootScope.productTypeView);
                $rootScope.$broadcast('breadcrumbs-filter-applied', null, productTypeView);
            } else {
                let packedFilter = {
                    column: {
                        columnRoute: 'schedule-dashboard-calendar',
                        columnName: 'Port Status',
                        columnValue: 'VoyageDetail_PortStatus_DisplayName',
                        sortColumnValue: null,
                        columnType: 'Text',
                        displayName: 'Port Status',
                    },
                    condition: {
                        conditionName: 'Is equal',
                        conditionValue: '=',
                        conditionApplicable: 'Text',
                        conditionNrOfValues: 1
                    },
                    value: [ status ]
                };
                $rootScope.$broadcast('breadcrumbs-filter-applied', packedFilter);
                // $rootScope.$broadcast(CUSTOM_EVENTS.BREADCRUMB_FILTER_STATUS, status, no);
            }
        };

        /**
        * Broadcast an event to reload the page data
        */
        $scope.broadcastRefreshData = function() {
            if (typeof $rootScope.isDefaultConfig != 'undefined' && $rootScope.isDefaultConfig != null) {
                if ($rootScope.isDefaultConfig.isDefault) {
                    if ($rootScope.saveFiltersTimeline) {
                        $rootScope.saveFiltersDefaultTimeline = $rootScope.saveFiltersTimeline;
                        $rootScope.saveFiltersTimeline = null;
                    }
                } else {
                    $rootScope.saveFiltersDefaultTimeline = null;
                }
            }
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
                'border-color': colorCode,
                'background-color': colorCode
            };
        }

        /**
        * Updates displayed statuses from a list taken from the data or from the layout
        * @param {String} list - list of statuses to update from
        */
        function updateStatusList(list) {
            let listObjects, status;
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    status = {};
                    // check statuses from retrieving data
                    if (list[i].statusName) {
                        listObjects = $filter('filter')($scope.statusList, { name: list[i].statusName }, true);
                        // if already added, only update count
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
                    // check statuses from received layout
                    } else if (list[i].status) {
                        listObjects = $filter('filter')($scope.statusList, { name : list[i].status.name }, true);
                        // if already added, only update name and color
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
        * @returns {Array} statusList - list of request statuses for current page
        */
        $scope.getCalendarStatus = function() {
        	let model = scheduleDashboardCalendarModel.getLatestVersion();
        	if (model) {
                if (!model.payload) {
                    return;
                }
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
	        	console.log(new Date());
	            if($state.current.name == STATE.DASHBOARD_TABLE || $state.current.name == STATE.DASHBOARD_CALENDAR || $state.current.name == STATE.DASHBOARD_TIMELINE || $state.current.name == STATE.HOME) {
			    	if (window.scheduleDashboardConfiguration) {
                        if (window.scheduleDashboardConfiguration.payload.labels) {
                            let sortedLabelsByDisplayOrder = _.orderBy(window.scheduleDashboardConfiguration.payload.labels, function(obj) {                
                                return obj.displayOrder;          
                            }, 'asc');
                            window.scheduleDashboardConfiguration.payload.labels = sortedLabelsByDisplayOrder;
                        }
                        
		            	$scope.adminDashboardStatuses = $filter('filter')(window.scheduleDashboardConfiguration.payload.labels, { displayInDashboard : true }, true);
		                if ($scope.calendarStatuses) {
		                	$scope.statusList = $scope.createStatusFilters();
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

        $scope.createStatusFilters = function() {
            $scope.statusList = [];
            $.each($scope.adminDashboardStatuses, (adsk, adsv) => {
                let transactionTypeId = null;
                if (adsv.transactionType) {
                    transactionTypeId = adsv.transactionType.id;
                }
                if(adsv.status.transactionTypeId) {
                    transactionTypeId = adsv.status.transactionTypeId;
                }

                let statusId = null;
                if(adsv.status) {
                    statusId = adsv.status.id;
                }

                let statusObj = {
                    id: statusId,
                    transactionTypeId: transactionTypeId,
                    name: adsv.status.name,
                };

                let colorCode = statusColors.getColorCodeFromLabels(statusObj, $listsCache.ScheduleDashboardLabelConfiguration);

                let status = {};
                status.style = createStyle(colorCode);
                status.count = 0;
                status.name = adsv.status.name;
                status.statusDisplayName = adsv.status.displayName;
                status.label = adsv.label;
                status.display = true;
                $.each($scope.calendarStatuses,
                    (csk, csv) => {
                        if (csv.status.displayName == adsv.status.displayName) {
                            status.style = createStyle(colorCode);
                            status.count = csv.count;
                            status.name = adsv.status.name;
                            status.statusDisplayName = adsv.status.displayName;
                            status.label = adsv.label;
                            status.display = true;
                        }
                    });
                var statusIsAlreadyAdded = false;
                $.each($scope.statusList, (k, v) => {
                    if (v.name == adsv.status.name) {
                        statusIsAlreadyAdded = true;
                    }
                });
                if (!statusIsAlreadyAdded) {
                    let skipStatus = false;
                    if ($scope.productTypeView && $scope.productTypeView.name == 'Bunker View') {
                        if (status.label == 'Additive Strategy' || status.label == 'Residue Strategy') {
                            skipStatus = true;
                        }
                    }
                    if ($scope.productTypeView && $scope.productTypeView.name == 'Residue View') {
                        if (status.label == 'Additive Strategy' || status.label == 'Bunker Strategy') {
                            skipStatus = true;
                        }
                    }
                    if ($scope.productTypeView && $scope.productTypeView.name == 'Additive View') {
                        if (status.label == 'Residue Strategy' || status.label == 'Bunker Strategy') {
                            skipStatus = true;
                        }
                    }
                    if (!skipStatus) {
                        $scope.statusList.push(status);
                    }
                }
            });
            return $scope.statusList;
        };


        $scope.visibleSidebarToggle = function() {
            return VIEW_TYPES.LIST.indexOf($state.current.name) >= 0;
        };

        $scope.calculateStatusesCount = function() {
        	return $filter('filter')($scope.statusList, { display : true }).length;
        };

        $rootScope.$on('scheduleDashboardCalendarGetResponse', (ev, data) => {
            // $scope.adminDashboardStatuses = data.payload.scheduleDashboardStatus;
            $scope.calendarStatusesInScheduleTable = null;
            $scope.calendarStatusesInScheduleCalendar = data.payload.scheduleDashboardStatus;
            $scope.getCalendarStatus();
        	// console.log(data);
        });
        $rootScope.$on('scheduleDashboardTableGetResponse', (ev, data) => {
        	if (typeof data != 'undefined') {
	        	if (typeof data.payload.scheduleDashboardStatus != 'undefined') {
                    $scope.calendarStatusesInScheduleCalendar = null;
                    $scope.calendarStatusesInScheduleTable = data.payload.scheduleDashboardStatus;
                    $scope.getCalendarStatus();
	        	}
        	}
        	// console.log(data);
        });

        $scope.isContractInFormulaScreen = function() {
        	if ($('.formulaMaster').length > 0) {
	        	if (angular.element($('.formulaMaster')).scope().formValues.contractId) {
	        		return angular.element($('.formulaMaster')).scope().formValues.contractId;
	        	}
        	}
        	return false;
        };
    }
]);

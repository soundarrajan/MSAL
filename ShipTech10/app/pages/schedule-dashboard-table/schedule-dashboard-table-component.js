angular.module('shiptech.pages').controller('ScheduleTableController', [
    '$rootScope',
    '$scope',
    '$listsCache',
    '$tenantSettings',
    'tenantService',
    '$element',
    '$attrs',
    '$timeout',
    '$filter',
    '$state',
    '$window',
    'scheduleDashboardCalendarModel',
    'uiApiModel',
    'newRequestModel',
    'SCREEN_LAYOUTS',
    'groupOfRequestsModel',
    'STATE',
    'CUSTOM_EVENTS',
    'screenLoader',
    function($rootScope, $scope, $listsCache, $tenantSettings, tenantService, $element, $attrs, $timeout, $filter, $state, $window, scheduleDashboardCalendarModel, uiApiModel, newRequestModel, SCREEN_LAYOUTS, groupOfRequestsModel, STATE, CUSTOM_EVENTS, screenLoader) {
        let ctrl = this;
        let settings, statusList;
        ctrl.selectedRequests = {};
        ctrl.STATE = STATE;
        ctrl.breadcrumbsFilter = null;
        ctrl.buttonsDisabled = false;
        ctrl.tableOptions = {};
        let tableSelector = '#schedule_dashboard_table';
        ctrl.tableOptions.order = [ [ 3, 'asc' ] ];
        $scope.Math = window.Math;
        ctrl.tableOptions.pageLength = 25;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;
        ctrl.tableOptions.searchTerm = null;
        ctrl.startDate = null;
        ctrl.endDate = null;
        ctrl.tenantSettings = $tenantSettings;
        window.tenantFormatsDateFormat = ctrl.tenantSettings.tenantFormats.dateFormat.name;

        ctrl.listsCache = $listsCache;
        ctrl.productTypeView = angular.copy(ctrl.listsCache.ProductView[0]);
        $rootScope.productTypeView = angular.copy(ctrl.listsCache.ProductView[0]);
        $rootScope.$broadcast('breadscrumbs-reset', $rootScope.productTypeView);
        //    tenantService.scheduleDashboardConfiguration.then(function(settings){
        //    		ctrl.scheduleDashboardConfiguration = settings.payload;
        //    })
        uiApiModel.get(SCREEN_LAYOUTS.SCHEDULE_DASHBOARD).then((data) => {
            ctrl.ui = data;
        });
        if (localStorage.getItem('scheduleDates')) {
        	if (JSON.parse(localStorage.getItem('scheduleDates')).start) {
	            ctrl.startDate = moment.unix(JSON.parse(localStorage.getItem('scheduleDates')).start.timestamp)
	                .utc('dd')
	                .startOf('day')
	                .toISOString();
        	}
        	if (JSON.parse(localStorage.getItem('scheduleDates')).end) {
	            ctrl.endDate = moment.unix(JSON.parse(localStorage.getItem('scheduleDates')).end.timestamp)
	                .utc('dd')
	                .startOf('day')
	                .toISOString();
        	}
            if (localStorage.getItem('scheduleDatesTable')) {
                localStorage.removeItem('scheduleDatesTable');
            }
            localStorage.setItem('scheduleDatesTable', JSON.stringify({
                start: ctrl.startDate,
                end: ctrl.endDate
            }));
        }
        ctrl.tableData = {};
        // handler for filtering on request status
        $scope.$on(CUSTOM_EVENTS.BREADCRUMB_FILTER_STATUS, (event, filter, no) => {
            console.log(filter, no);
            if (ctrl.breadcrumbsFilter == filter) {
                var filterPayload = [];

                ctrl.breadcrumbsFilter = null;
                $rootScope.activeBreadcrumbFilters = null;
            } else {
                ctrl.breadcrumbsFilter = filter;
                $rootScope.activeBreadcrumbFilters = filter;
                filterPayload = [
                    {
                        ColumnValue: 'VoyageDetail_PortStatus_DisplayName',
                        ColumnType: 'Text',
                        ConditionValue: '=',
                        Values: [ filter ]
                    }
                ];
            }
            $rootScope.$broadcast('filters-applied', filterPayload);
        });
        // $scope.$on('filters-applied', function(event, payload) {
        //     // destroyDataTable(false);
        //     // scheduleDashboardCalendarModel.getTable(ctrl.startDate, ctrl.endDate, null, null, payload).then(showTable);
        //     $state.params.filters = payload;
        // });
        $scope.initBreadcrumbsFilter = function() {
            if ($rootScope.activeBreadcrumbFilters) {
                ctrl.breadcrumbsFilter = $rootScope.activeBreadcrumbFilters;
            }
        };

        scheduleDashboardCalendarModel.getStatuses().then((data) => {
            ctrl.dashboardConfiguration = data;
            ctrl.startDate = moment.utc().startOf('day').subtract(ctrl.dashboardConfiguration.startsBefore, 'd').startOf('day').toISOString();
            ctrl.endDate = moment.utc().startOf('day').add(ctrl.dashboardConfiguration.endsAfter + 1, 'd').startOf('day').toISOString();
            if (localStorage.getItem('scheduleDatesTable')) {
                localStorage.removeItem('scheduleDatesTable');
            }
            localStorage.setItem('scheduleDatesTable', JSON.stringify({
                start: ctrl.startDate,
                end: ctrl.endDate
            }));
            $rootScope.$broadcast('sdDataLoaded');
        });
        scheduleDashboardCalendarModel.getTable(ctrl.startDate, ctrl.endDate, null, null, null, null, ctrl.productTypeView).then(() => {
            if (!ctrl.startDate || !ctrl.endDate) {
                scheduleDashboardCalendarModel.getStatuses().then((data) => {
                    // ctrl.dashboardConfiguration = data;
                    // ctrl.startDate = moment.utc().startOf('day').subtract(ctrl.dashboardConfiguration.startsBefore, 'd').startOf("day").toISOString();
                    // ctrl.endDate = moment.utc().startOf('day').add(ctrl.dashboardConfiguration.endsAfter, 'd').startOf("day").toISOString();
                    // if (localStorage.getItem('scheduleDatesTable')) {
                    //     localStorage.removeItem('scheduleDatesTable');
                    // }
                    // localStorage.setItem('scheduleDatesTable', JSON.stringify({
                    //     start: ctrl.startDate,
                    //     end: ctrl.endDate
                    // }));
                    $rootScope.$broadcast('sdDataLoaded');
                });
            } else {
                $rootScope.$broadcast('sdDataLoaded');
            }
        });

        // });
        $rootScope.$on(CUSTOM_EVENTS.BREADCRUMB_REFRESH_PAGE, (event, args) => {
            $rootScope.$broadcast('filters-applied', []);
        });

        // check if selected requests are already part of a group
        ctrl.isSelectionGrouped = function() {
            let request;
            let isGrouped = false;
            // if ($rootScope.selectedScheduleTableRows) {
            //     Object.keys($rootScope.selectedScheduleTableRows).map(function(key, value) {
            //         if ($rootScope.selectedScheduleTableRows[key]) {
            //             request = $filter("filter")(ctrl.tableData.tableData.rows, {
            //                 requestId: key
            //             })[0];
            //             if (request && (request.requestGroupId !== null && typeof(request.requestGroupId) !== 'undefined' )) {
            //                 isGrouped = true;
            //             }
            //         }
            //     });
            // }

            if (!$rootScope.selectedScheduleTableRows) {
            	return true;
            }
            if ($rootScope.selectedScheduleTableRows.length == 0) {
            	return true;
            }
            $.each($rootScope.selectedScheduleTableRows, (k, v) => {
            	if (v.voyageDetail.request) {
	            	if (v.voyageDetail.request.id != 0 && v.voyageDetail.request.requestGroupId) {
	            		isGrouped = true;
	            	}
	            	if (v.voyageDetail.request.id == 0) {
	            		isGrouped = true;
	            	}
            	}
            	if (!v.voyageDetail.request) {
            		isGrouped = true;
            	}
            });

            return isGrouped;
        };
        ctrl.groupRequests = function() {
            let selectedRequestIds = [];
            $.each($rootScope.selectedScheduleTableRows, (k, v) => {
            	if (v.voyageDetail.request) {
	            	if (v.voyageDetail.request.id != 0 && !v.voyageDetail.request.requestGroupId) {
			            selectedRequestIds.push(v.voyageDetail.request.id);
	            	}
            	}
            });
            if (selectedRequestIds.length === 0) {
                return false;
            }
            ctrl.buttonsDisabled = true;
            groupOfRequestsModel.groupRequests(selectedRequestIds).then(
                (data) => {
                    ctrl.buttonsDisabled = false;
                    // TODO: change way we get groupID
                    var requestGroupId = data.payload[0].requestGroup.id;
                    $state.go(STATE.GROUP_OF_REQUESTS, {
                        groupId: requestGroupId
                    });
                },
                () => {
                    ctrl.buttonsDisabled = false;
                }
            );
        };
        ctrl.editRequest = function(requestId) {
            let url = $state.href(
                STATE.EDIT_REQUEST,
                {
                    requestId: requestId
                },
                {
                    absolute: false
                }
            );
            $window.open(url, '_self');
        };
        $scope.$on('copyProcurementEntity', (ev, id) => {
            if (id > 0) {
                ctrl.editRequest(id);
            }
        });
        ctrl.copyRequest = function(requestId) {
            newRequestModel.getRequest(requestId).then((newRequestData) => {
                $state.go(STATE.COPY_REQUEST, {
                    copyFrom: newRequestData.payload
                });
            });
        };
        ctrl.newRequest = function(voyageId) {
            let href = $state.href(STATE.NEW_REQUEST_VIEWS, {
                voyageId: voyageId,
                productView: $rootScope.productTypeView.id
            });
            $window.open(href, '_blank');
        };

        ctrl.gotoNewRequest = function() {
            if (typeof $rootScope.selectedScheduleTableRows == 'undefined' || $rootScope.selectedScheduleTableRows.length != 1) {
                toastr.error('You have to select one row to proceed to request');
                return;
            }
        	ctrl.newRequest($rootScope.selectedScheduleTableRows[0].voyageDetail.id);
        	return;
            let href = $state.href(STATE.NEW_REQUEST);
            $window.open(href, '_blank');
        };
        ctrl.contractPrePlanSelectionAction = function() {
            ctrl.contractPrePlanSelectionDisabled = true;
            $.each(ctrl.selectedRequestsRows, (k, v) => {
                if (typeof v.requestId != 'number') {
                    ctrl.contractPrePlanSelectionDisabled = false;
                    ctrl.contractPrePlanSelection = true;
                }
            });
        };
        ctrl.addToContractPrePlanning = function() {
            console.log(ctrl.selectedRequestsRows);
            $rootScope.scheduleDashboardVesselVoyages = [];
            var vesselsWithoutProduct = '';
            for (let key in ctrl.selectedRequestsRows) {
                if (ctrl.selectedRequestsRows.hasOwnProperty(key)) {
                    $rootScope.scheduleDashboardVesselVoyages.push(ctrl.selectedRequestsRows[key]);
                    if (ctrl.selectedRequestsRows[key].defaultDistillate == null && ctrl.selectedRequestsRows[key].defaultFuel == null) {
                        vesselsWithoutProduct = `${vesselsWithoutProduct }${ctrl.selectedRequestsRows[key].vesselName }, `;
                    }
                }
            }
            if (vesselsWithoutProduct.length > 0) {
                toastr.error(`For the selected Vessels : ${ vesselsWithoutProduct } there  is no product defined. Please define at least one Product into Vessel master.`);
                return;
            }
            console.log($rootScope.scheduleDashboardVesselVoyages);
            localStorage.setItem('scheduleDashboardVesselVoyages', JSON.stringify($rootScope.scheduleDashboardVesselVoyages));
            $rootScope.activeBreadcrumbFilters = [];
            window.location.href = '/#/contract-planning/';
        };

        $scope.$on('tableLoaded', (e, payload) => {
            screenLoader.hideLoader();
            // console.log(payload)
            ctrl.tableData = payload;
            $(`#${ ctrl.tableData.table}`).click((e) => {
                var selected = $(`#${ ctrl.tableData.table}`).jqGrid('getGridParam').selarrrow;
                var clicked = $(`#${ ctrl.tableData.table}`).jqGrid('getGridParam').selrow;
                var tableRowIndex = $(e.target)
                    .parents('tr')
                    .attr('id');
                var clickedRowData = ctrl.tableData.tableData.rows[tableRowIndex - 1];
                if (!$(e.target).is('input[type=checkbox]')) {
                    return;
                }
                if (!selected) {
                    return;
                }
                console.log($(e.target).prop('checked'));

                if (typeof ctrl.selectedRequests == 'undefined') {
                    ctrl.selectedRequests = [];
                }

                for (let i = selected.length - 1; i >= 0; i--) {
                    var sv = selected[i];
                    if (!$(e.target).prop('checked') && (ctrl.tableData.tableData.rows[Number(sv) - 1].requestId == clickedRowData.requestId)) {
                        selected.splice(i, 1);
                    }
                }

                $scope.$apply(() => {
                    ctrl.selectedRequestsRows = [];
                    ctrl.selectedRequestsRows = ctrl.checkSelected(selected, clicked);
                    if (ctrl.selectedRequestsRows) {
                        ctrl.selectedRequests = createRequestIdsModel(ctrl.selectedRequestsRows);
                    }
                    ctrl.contractPrePlanSelectionAction();
                });
                $rootScope.selectedScheduleTableRows = angular.copy(ctrl.selectedRequestsRows);
                // console.log(ctrl.selectedRequestsRows);
            });
        });
        ctrl.checkSelected = function(selected, clicked) {
            var selectedRequests = [];
            $(`#${ ctrl.tableData.table}`).jqGrid('resetSelection');
            $(`#${ ctrl.tableData.table } tr[aria-selected='true'] input`).removeAttr('checked');
            $(`#${ ctrl.tableData.table } tr`).attr('aria-selected', 'false');
            $(`#${ ctrl.tableData.table } tr`).removeClass('ui-state-highlight');
            // setTimeout(function(){
            $.each(selected, (sk, sv) => {
                let obj = ctrl.tableData.tableData.rows[Number(sv) - 1];
                obj.requestId =
                    obj.requestId > 0 ?
                        obj.requestId :
                        Math.random()
                            .toString(36)
                            .substr(2, 5);
                selectedRequests.push(obj);
            });
            let lastSelectedType = typeof selectedRequests[selectedRequests.length - 1].requestId;
            console.log(lastSelectedType);
            var all = [];
            $.each(ctrl.tableData.tableData.rows, (k, v) => {
                if (
                    _.findIndex(selectedRequests, (o) => {
                        return o.requestId == v.requestId && typeof v.requestId == lastSelectedType;
                    }) >= 0
                ) {
                    $(`#${ ctrl.tableData.table}`).jqGrid('setSelection', k + 1);
                    // if (typeof v.requestId != "number") {
                    //     v.requestId = 0;
                    // }
                    all.push(v);
                }
            });
            return all;
            // },200)
        };


        function createRequestIdsModel(data) {
            let result = {};
            for (let i = 0; i < data.length; i++) {
                result[data[i].requestId] = true;
            }
            return result;
        }


        ctrl.checkProductTypeView = function(productTypeView) {
            if (productTypeView) {
                if ([1].indexOf(productTypeView.id) != -1) {
                    return true;
                } 
            }
            return false;
        }

        $scope.$on('set-product-type-view-for-table', function (event, payload) {
            console.log(payload);
            ctrl.productTypeView = angular.copy(payload);
            $scope.$apply();
            $scope.$digest();

        });
    }
]);
angular.module('shiptech.pages').component('scheduleDashboardTable', {
    templateUrl: 'pages/schedule-dashboard-table/views/schedule-dashboard-table-component.html',
    controller: 'ScheduleTableController'
});

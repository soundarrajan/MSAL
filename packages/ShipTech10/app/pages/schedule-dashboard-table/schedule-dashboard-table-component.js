angular.module("shiptech.pages").controller("ScheduleTableController", [
    "$rootScope",
    "$scope",
    "$tenantSettings",
    "tenantService",
    "$element",
    "$attrs",
    "$timeout",
    "$filter",
    "$state",
    "$window",
    "scheduleDashboardCalendarModel",
    "uiApiModel",
    "newRequestModel",
    "SCREEN_LAYOUTS",
    "groupOfRequestsModel",
    "STATE",
    "CUSTOM_EVENTS",
    'screenLoader',
    function($rootScope, $scope, $tenantSettings, tenantService, $element, $attrs, $timeout, $filter, $state, $window, scheduleDashboardCalendarModel, uiApiModel, newRequestModel, SCREEN_LAYOUTS, groupOfRequestsModel, STATE, CUSTOM_EVENTS, screenLoader) {
        var ctrl = this;
        var settings, statusList;
        ctrl.selectedRequests = {};
        ctrl.STATE = STATE;
        ctrl.breadcrumbsFilter = null;
        ctrl.buttonsDisabled = false;
        ctrl.tableOptions = {};
        var tableSelector = "#schedule_dashboard_table";
        ctrl.tableOptions.order = [[3, "asc"]];
        $scope.Math = window.Math;
        ctrl.tableOptions.pageLength = 25;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;
        ctrl.tableOptions.searchTerm = null;
        ctrl.startDate = null;
        ctrl.endDate = null;
        ctrl.tenantSettings = $tenantSettings;

        //    tenantService.scheduleDashboardConfiguration.then(function(settings){
        //    		ctrl.scheduleDashboardConfiguration = settings.payload;
        //    })
        ctrl.tableData = {};
        //handler for filtering on request status
        $scope.$on(CUSTOM_EVENTS.BREADCRUMB_FILTER_STATUS, function(event, filter, no) {
            console.log(filter, no);
            if (ctrl.breadcrumbsFilter == filter) {
                filterPayload = [];

                ctrl.breadcrumbsFilter = null;
                $rootScope.activeBreadcrumbFilters = null;
            } else {
                ctrl.breadcrumbsFilter = filter;
                $rootScope.activeBreadcrumbFilters = filter;
                filterPayload = [
                    {
                        ColumnValue: "VoyageDetail_PortStatus_DisplayName",
                        ColumnType: "Text",
                        ConditionValue: "=",
                        Values: [filter]
                    }
                ];
            }
            $rootScope.$broadcast("filters-applied", filterPayload);
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

        scheduleDashboardCalendarModel.getStatuses().then(function(data) {
            screenLoader.showLoader();
            console.log(data);
            if (data) {
                statusList = data.labels;
            }
            scheduleDashboardCalendarModel.getTable(ctrl.startDate, ctrl.endDate).then(showTable);
            // handleTableEvents();
            $rootScope.$broadcast("sdDataLoaded");
        });
        
        // });
        $rootScope.$on(CUSTOM_EVENTS.BREADCRUMB_REFRESH_PAGE, function(event, args) {
            $rootScope.$broadcast("filters-applied", []);
        });

       

        //check if selected requests are already part of a group
        ctrl.isSelectionGrouped = function() {
            var request;
            var isGrouped = false;
            if (ctrl.selectedRequests) {
                Object.keys(ctrl.selectedRequests).forEach(function(key) {
                    if (ctrl.selectedRequests[key]) {
                        request = $filter("filter")(ctrl.tableData.tableData.rows, {
                            requestId: key
                        })[0];
                        if (request && request.requestGroupId !== null) {
                            isGrouped = true;
                        }
                    }
                });
            }
            return isGrouped;
        };
        ctrl.groupRequests = function() {
            var selectedRequestIds = [];
            Object.keys(ctrl.selectedRequests).forEach(function(key) {
                if (ctrl.selectedRequests[key]) {
                    selectedRequestIds.push(key);
                }
            });
            if (selectedRequestIds.length === 0) {
                return false;
            }
            ctrl.buttonsDisabled = true;
            groupOfRequestsModel.groupRequests(selectedRequestIds).then(
                function(data) {
                    ctrl.buttonsDisabled = false;
                    //TODO: change way we get groupID
                    requestGroupId = data.payload[0].requestGroup.id;
                    $state.go(STATE.GROUP_OF_REQUESTS, {
                        groupId: requestGroupId
                    });
                },
                function() {
                    ctrl.buttonsDisabled = false;
                }
            );
        };
        ctrl.editRequest = function(requestId) {
            var url = $state.href(
                STATE.EDIT_REQUEST,
                {
                    requestId: requestId
                },
                {
                    absolute: false
                }
            );
            $window.open(url, "_self");
        };
        $scope.$on("copyProcurementEntity", function(ev, id) {
            if (id > 0) {
                ctrl.editRequest(id);
            }
        });
        ctrl.copyRequest = function(requestId) {
            newRequestModel.getRequest(requestId).then(function(newRequestData) {
                $state.go(STATE.COPY_REQUEST, {
                    copyFrom: newRequestData.payload
                });
            });
        };
        ctrl.newRequest = function(voyageId) {
            $state.go(STATE.NEW_REQUEST, {
                voyageId: voyageId
            });
        };

        ctrl.gotoNewRequest = function() {
            var href = $state.href(STATE.NEW_REQUEST);
            $window.open(href, "_blank");
        };
        ctrl.contractPrePlanSelectionAction = function() {
            ctrl.contractPrePlanSelectionDisabled = true;
            $.each(ctrl.selectedRequestsRows, function(k, v) {
                if (typeof v.requestId != "number") {
                    ctrl.contractPrePlanSelectionDisabled = false;
                    ctrl.contractPrePlanSelection = true;
                }
            });
        };
        ctrl.addToContractPrePlanning = function() {
            console.log(ctrl.selectedRequestsRows);
            $rootScope.scheduleDashboardVesselVoyages = [];
            vesselsWithoutProduct = "";
            for (var key in ctrl.selectedRequestsRows) {
                if (ctrl.selectedRequestsRows.hasOwnProperty(key)) {
                    $rootScope.scheduleDashboardVesselVoyages.push(ctrl.selectedRequestsRows[key]);
                    if (ctrl.selectedRequestsRows[key].defaultDistillate == null && ctrl.selectedRequestsRows[key].defaultFuel == null) {
                        vesselsWithoutProduct += ctrl.selectedRequestsRows[key].vessel + ", ";
                    }
                }
            }
            if (vesselsWithoutProduct.length > 0) {
                toastr.error("For the selected Vessels : " + vesselsWithoutProduct + " there  is no product defined. Please define at least one Product into Vessel master.");
                return;
            }
            console.log($rootScope.scheduleDashboardVesselVoyages);
			localStorage.setItem('scheduleDashboardVesselVoyages', JSON.stringify($rootScope.scheduleDashboardVesselVoyages));
            window.location.href = "/#/contract-planning/";
        };

        $scope.$on("tableLoaded", function(e, payload) {
            screenLoader.hideLoader();
            // console.log(payload)
            ctrl.tableData = payload;
            $("#" + ctrl.tableData.table).click(function(e) {
                selected = $("#" + ctrl.tableData.table).jqGrid("getGridParam").selarrrow;
                clicked = $("#" + ctrl.tableData.table).jqGrid("getGridParam").selrow;
                tableRowIndex = $(e.target)
                    .parents("tr")
                    .attr("id");
                clickedRowData = ctrl.tableData.tableData.rows[tableRowIndex - 1];
                if (!$(e.target).is("input[type=checkbox]")) return;
                if (!selected) return;
                console.log($(e.target).prop("checked"));

                if (typeof ctrl.selectedRequests == "undefined") {
                    ctrl.selectedRequests = [];
                }

                for (var i = selected.length - 1; i >= 0; i--) {
                    sv = selected[i];
                    if ($(e.target).prop("checked")) {
                    } else {
                        if (ctrl.tableData.tableData.rows[Number(sv) - 1].requestId == clickedRowData.requestId) {
                            selected.splice(i, 1);
                        }
                    }
                }

                $scope.$apply(function() {
                    ctrl.selectedRequestsRows = [];
                    ctrl.selectedRequestsRows = ctrl.checkSelected(selected, clicked);
                    if (ctrl.selectedRequestsRows) {
                        ctrl.selectedRequests = createRequestIdsModel(ctrl.selectedRequestsRows);
                    }
                    ctrl.contractPrePlanSelectionAction();
                });
                console.log(ctrl.selectedRequestsRows);
            });
        });
        ctrl.checkSelected = function(selected, clicked) {
            selectedRequests = [];
            $("#" + ctrl.tableData.table).jqGrid("resetSelection");
            $("#" + ctrl.tableData.table + " tr[aria-selected='true'] input").removeAttr("checked");
            $("#" + ctrl.tableData.table + " tr").attr("aria-selected", "false");
            $("#" + ctrl.tableData.table + " tr").removeClass("ui-state-highlight");
            // setTimeout(function(){
            $.each(selected, function(sk, sv) {
                var obj = ctrl.tableData.tableData.rows[Number(sv) - 1];
                obj.requestId =
                    obj.requestId > 0
                        ? obj.requestId
                        : Math.random()
                              .toString(36)
                              .substr(2, 5);
                selectedRequests.push(obj);
            });
            var lastSelectedType = typeof selectedRequests[selectedRequests.length - 1].requestId;
            console.log(lastSelectedType);
            all = [];
            $.each(ctrl.tableData.tableData.rows, function(k, v) {
                if (
                    _.findIndex(selectedRequests, function(o) {
                        return o.requestId == v.requestId && typeof v.requestId == lastSelectedType;
                    }) >= 0
                ) {
                    $("#" + ctrl.tableData.table).jqGrid("setSelection", k + 1);
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
            var result = {};
            for (var i = 0; i < data.length; i++) {
                result[data[i].requestId] = true;
            }
            return result;
        }
    }
]);
angular.module("shiptech.pages").component("scheduleDashboardTable", {
    templateUrl: "pages/schedule-dashboard-table/views/schedule-dashboard-table-component.html",
    controller: "ScheduleTableController"
});

angular.module("shiptech.pages").controller("ScheduleCalendarController", ["$rootScope", "$scope", "$element", "$attrs", "$timeout", "$state", "$stateParams", "$filter", "$filtersData", "STATE", "TIMESCALE", "CUSTOM_EVENTS", "scheduleDashboardCalendarModel", "uiApiModel", 'SCREEN_LAYOUTS', '$tenantSettings', 'tenantService', '$interval', 'statusColors', '$listsCache', 'screenLoader','$compile',
    function ($rootScope, $scope, $element, $attrs, $timeout, $state, $stateParams, $filter, $filtersData, STATE, TIMESCALE, CUSTOM_EVENTS, scheduleDashboardCalendarModel, uiApiModel, SCREEN_LAYOUTS, $tenantSettings, tenantService, $interval, statusColors, $listsCache, screenLoader,$compile) {
        /*******************************
         *   INITIALIZATION
         *******************************/
        // Cache 'this' in 'ctrl' to avoid scope issues and improve code legibility.
        var ctrl = this;
        var statusList = [];
        ctrl.state = $state;
        ctrl.STATE = STATE;
        ctrl.breadcrumbsFilter = null;
        $rootScope.clc_loaded = true;
        ctrl.calendarDataRows = [];
        ctrl.tableOptions = {};
        if ($state.params.path) {
            $scope.app_id = $state.params.path[0].uisref.split('.')[0];
        }
        if ($scope.screen) {
            $scope.screen_id = $scope.screen;
        } else {
            $scope.screen_id = $state.params.screen_id;
        }
        jQuery(document).ready(function () {
            $('body').addClass($scope.app_id + '-' + $scope.screen_id);
        })
        $scope.Math = window.Math;
        ctrl.tableOptions.order = [
            [0, 'asc']
        ];
        tenantService.scheduleDashboardConfiguration.then(function (settings) {
            ctrl.scheduleDashboardConfiguration = settings.payload;
            ctrl.hiddenCalendarColumns = 0;
            if (ctrl.scheduleDashboardConfiguration.scheduleBuyerDisplay) {
                if (ctrl.scheduleDashboardConfiguration.scheduleBuyerDisplay.name == "No") {
                    ctrl.hiddenCalendarColumns++;
                }
            }
            if (ctrl.scheduleDashboardConfiguration.scheduleCompanyDisplay) {
                if (ctrl.scheduleDashboardConfiguration.scheduleCompanyDisplay.name == "No") {
                    ctrl.hiddenCalendarColumns++;
                }
            }
        })
        // ctrl.scheduleDashboardConfiguration = tenantService.getScheduleDashboardConfiguration();

        $scope.numberPrecision = $tenantSettings.defaultValues;
        $scope.tenantSettings = $tenantSettings;
        $scope.zoomLevel = 1;
        $scope.zoomLevels = [
            {
                'value': 0.5,
                'name': '50%',
            },
            {
                'value': 0.75,
                'name': '75%',
            },
            {
                'value': 1,
                'name': '100%',
            },
        ];
        console.log($scope.numberPrecision)
        ctrl.tableOptions.pageLength = 9999;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;
        ctrl.tableOptions.searchTerm = null;
        $state.params.title = 'Schedule Dashboard Calendar';
        // Load the popover table markup template.
        ctrl.popoverTemplate = angular.element('#popover_template').html();
        ctrl.dashboardConfiguration = null;
        // Define scroll directions constants.
        ctrl.SCROLL_DIRECTIONS = {
            left: 'left',
            right: 'right'
        };
        ctrl.TIMESCALE = TIMESCALE;
        ctrl.requestColors = {
            "Request Validated": "info",
            "Inquired": "warning",
            "Stemmed": "danger",
            "Partially Quoted": "green-dark",
            "Redelivery": "default",
            "Prerequest Created": "green-light",
            "Cancelled": "info"
        };
        ctrl.startDate = null;
        ctrl.endDate = null;
        if (localStorage.getItem('scheduleDates')) {
            ctrl.startDate = JSON.parse(localStorage.getItem('scheduleDates'))['start'];
            ctrl.endDate = JSON.parse(localStorage.getItem('scheduleDates'))['end'];
            localStorage.removeItem('scheduleDates')
        }
        removePopups();
        ctrl.rowHasStatus = function (statusList) {
            return !ctrl.breadcrumbsFilter || statusList.indexOf(ctrl.breadcrumbsFilter) != -1;
        };
        $scope.$on('filters-applied', function (event, payload) {
            scheduleDashboardCalendarModel.get(ctrl.startDate, ctrl.endDate, payload)
                // Promise fulfilled:
                .then(function (response) {
                    showData(response);
                });
                var conditions = $filtersData.filterConditions;
                console.log(conditions);

                for(var i = 0; i < payload.length; i++) {
                    for(var j = 0; j < conditions.length; j++) {
                        if(payload[i].ColumnType === conditions[j].conditionApplicable && payload[i].ConditionValue === conditions[j].conditionValue) {
                            payload[i]['conditionName'] = conditions[j].conditionName;
                            switch(payload[i].columnValue) {
                                case 'BuyerName':
                                    payload[i]['displayName'] = 'Buyer';
                                    break;
                                case 'VesselName':
                                    payload[i]['displayName'] = 'Vessel name';
                                    break;
                                case 'ServiceName':
                                    payload[i]['displayName'] = 'Service';
                                    break;
                                case 'VoyageDetail_ETA':
                                    payload[i]['displayName'] = 'ETA';
                                    break;
                                case 'VoyageDetail_ETB':
                                    payload[i]['displayName'] = 'ETB';
                                    break;
                            }
                        }
                    }
                }
                $scope.appFilters = payload;
                console.log($scope.appFilters);
        })
        // $rootScope.$on('filters-applied', function (event, payload) {
        //     console.log('Got filters-applied');
        // });
        //handler for filtering on request status
        $scope.$on(CUSTOM_EVENTS.BREADCRUMB_FILTER_STATUS, function (event, filter, no) {
            if (ctrl.breadcrumbsFilter == filter) {
                filterPayload = [];
                scheduleDashboardCalendarModel.get(ctrl.startDate, ctrl.endDate, filterPayload).then(function (response) {
                    showData(response)
                });
                ctrl.breadcrumbsFilter = null;
                $rootScope.activeBreadcrumbFilters = null;
            } else {
                ctrl.breadcrumbsFilter = filter;
                $rootScope.activeBreadcrumbFilters = filter;
                filterPayload = [{
                    "ColumnValue": "VoyageDetail_PortStatus_DisplayName",
                    "ColumnType": "Text",
                    "ConditionValue": "=",
                    "Values": [filter]
                }];
                scheduleDashboardCalendarModel.get(ctrl.startDate, ctrl.endDate, filterPayload).then(function (response) {
                    showData(response)
                });
            }
        });
        $scope.initBreadcrumbsFilter = function () {
            if ($rootScope.activeBreadcrumbFilters) {
                ctrl.breadcrumbsFilter = $rootScope.activeBreadcrumbFilters;
            }
        }
        $scope.$on(CUSTOM_EVENTS.BREADCRUMB_REFRESH_PAGE, function (event) {
            loadData(ctrl.startDate, ctrl.endDate);
        });
        // Get UI settings from server. When complete, get business data from server.
        uiApiModel.get(SCREEN_LAYOUTS.SCHEDULE_DASHBOARD).
            then(function (data) {
                ctrl.ui = data;
                // Cache the columns array part of scheduleDashboardTable, purely for better code legibility.
                ctrl.scheduleDashboardCalendarColumns = ctrl.ui.tables.scheduleDashboardCalendar.columns;
                // Initialize the calendar dates array.
                // IMPORTANT! DO THIS ONLY ONCE TO PRESERVE ANGULAR BINDING WITH THE VIEW.
                ctrl.calendarDates = [];
                // JSON-normalize server data to get the DataTable settings format.
                ctrl.settings = normalizeJSONDataTables(ctrl.ui.tables);
                //get status map before getting data
                scheduleDashboardCalendarModel.getStatuses().then(function (data) {
                    ctrl.dashboardConfiguration = data;
                    // Initialize everything according to timescale.
                    selectTimeScale($stateParams.timescale);
                    statusList = data.labels;
                    loadData(ctrl.startDate, ctrl.endDate);
                    $rootScope.$broadcast('sdDataLoaded');
                });
            });
        /*******************************
         *   END INITIALIZATION
         *******************************/
        ctrl.setPage = function (page, search) {
            if (page < 1 || page > ctrl.tableOptions.totalRows / ctrl.tableOptions.pageLength + 1) {
                return false;
            }
            var tablePagination = {};
            filterPayload = null;
            if ($rootScope.activeBreadcrumbFilters) {
                filterPayload = [{
                    "ColumnValue": "VoyageDetail_PortStatus",
                    "ColumnType": "Text",
                    "ConditionValue": "=",
                    "Values": [$rootScope.activeBreadcrumbFilters]
                }];
            }
            tablePagination.start = (page - 1) * ctrl.tableOptions.pageLength;
            tablePagination.length = ctrl.tableOptions.pageLength;
            setTableVars(tablePagination.length, tablePagination.start);
            search = search ? search : ctrl.tableOptions.searchTerm;
            scheduleDashboardCalendarModel.get(ctrl.startDate, ctrl.endDate, filterPayload, tablePagination, search).then(function (response) {
                showData(response)
            });
        };

        function setTableVars(length, start) {
            if (typeof length != 'undefined' && length !== null) {
                ctrl.tableOptions.pageLength = length;
            }
            if (typeof start != 'undefined' && start !== null) {
                ctrl.tableOptions.paginationStart = start;
            }
            ctrl.tableOptions.currentPage = ctrl.tableOptions.paginationStart / ctrl.tableOptions.pageLength + 1;
        }
        /*******************************
         *   SPECIFIC FUNCTIONALITY
         *******************************/
        function showData(data) {
            // Unbind datatable before altering the underlying HTML.
            // //clear existing data 
            console.warn("showData -1:", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
            hidePopovers()
            delete ctrl.calendarDataRows;
            destroyDataTable();
            ctrl.calendarData = data.payload;
            ctrl.lastShownData = data;
            /*ctrl.tempData = normalizeCalendarData(ctrl.calendarData.scheduleDashboardView, ctrl.calendarDates, ctrl.dateScroller.calendarUnit); 
            ctrl.tempData1 = [];
            for (i = 0; i < 5; i ++)
                ctrl.tempData1.push(ctrl.tempData[i]); */
            //ctrl.calendarDataRows = ctrl.tempData1; 
            ctrl.calendarDataRows =  normalizeCalendarData(ctrl.calendarData.scheduleDashboardView, ctrl.calendarDates, ctrl.dateScroller.calendarUnit);
			if (ctrl.currentColSort) {
				ctrl.calendarDataRows = $filter('orderBy')(ctrl.calendarDataRows, ctrl.currentColSort);
			}
            console.warn("showData 0:", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
            //console.log(ctrl.calendarDataRows); 
            
            $timeout(function () 
            {
            	console.warn("showData 1:", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
                ctrl.calendar = initDataTable('#schedule_calendar_table', ctrl.settings.scheduleDashboardCalendar);
                initPopovers();
                ctrl.tableOptions.totalRows = ctrl.calendarDataRows.length; // data.matchedCount;
                handleTableEvents(); 
                //ctrl.calendarDataRows = ctrl.tempData; //s.push(ctrl.tempData[100]);
            	console.warn("showData 2:", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
				screenLoader.hideLoader();
            }
            ,10);  
            console.warn("showData 4:", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
        }

        function handleTableEvents() {
            var table = $('#schedule_calendar_table');
            table.on('length.dt', function (e, settings, len) {
                var info = ctrl.calendar.page.info();
                var tablePagination = {};
                tablePagination.start = info.start;
                tablePagination.length = len;
                ctrl.tableOptions.pageLength = len;
                console.log(len)
                setTableVars(tablePagination.length, tablePagination.start);
                scheduleDashboardCalendarModel.get(ctrl.startDate, ctrl.endDate, $rootScope.activeBreadcrumbFilters, tablePagination).then(function (response) {
                    showData(response);
                });
            });
        }

        function destroyDataTable(clearHtml) {
            if (ctrl.calendar) {
                ctrl.calendar.off('order.dt');
                ctrl.calendar.off('length.dt');
                if (clearHtml) {
                    ctrl.calendar.destroy(true);
                } else {
                    ctrl.calendar.destroy();
                }
                console.warn("destroyDataTable:", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
                ctrl.calendar = null;
            }
            // $('#schedule_calendar_table').DataTable().fnAdjustColumnSizing()
        }

        function loadData(startDate, endDate) {
            // Begin async request for data

            screenLoader.showLoader();
            scheduleDashboardCalendarModel.get(startDate, endDate)
                // Promise fulfilled:
                .then(function (response) {
                    // console.log(response)
                    screenLoader.hideLoader();
                    window.scheduleDashboardCalendarModelGetEndTime = (new Date()).getTime()
	            	console.warn("scheduleDashboardCalendarModel.get done", window.scheduleDashboardCalendarModelGetEndTime);
                    showData(response)
                });
        }
        /**
         * Selects the calendar timescale by setting relevant global vars.
         * This resets the entire calendar view.
         * @param {String} timeScale - The timescale to select and use.
         */
        function selectTimeScale(timeScale) {
            // Set the global timescale var.
            // TODO: read this initial value from the saved UI settings.
            ctrl.timeScale = timeScale;
            // Get the dateScroller from the UI settings, by timescale.
            // TODO: get this from the server instead of a mockup.
            ctrl.dateScroller = ctrl.ui.tables.scheduleDashboardCalendar.dateScroller[ctrl.timeScale];
            if (ctrl.timeScale === TIMESCALE.DEFAULT) {
                ctrl.dateScroller.startDate = ctrl.dashboardConfiguration.startsBefore;
                ctrl.dateScroller.dayCount = ctrl.dashboardConfiguration.startsBefore + ctrl.dashboardConfiguration.endsAfter + 1;
                ctrl.dateScroller.visibleColCount = ctrl.dashboardConfiguration.startsBefore + ctrl.dashboardConfiguration.endsAfter + 1;
                ctrl.dateScroller.timeframeDelta = ctrl.dashboardConfiguration.traverseBy;
            }
            // Convert startDate string to a real datetime value.
            ctrl.dateScroller.startDate = interpretStartDate(ctrl.dateScroller.startDate);
            // Set timeframe selector <TH> column span to match the variable calendar day count.
            ctrl.timeframeSelectorColspan = ctrl.dateScroller.dayCount + 1;
            // Define the calendar scroller part of the calendar table.
            // By changing 'hiddenColsLeftCount' and 'hiddenColsRightCount'
            // by an amount equal to 'step', the table columns appear to
            // scroll within the table.
            ctrl.tableScroller = {
                "firstColIndex": 4, // Index of first column (in the full table) that belongs to the scroller. This is, in fact, a constant.
                "totalColCount": ctrl.dateScroller.dayCount, // Total number of columns in table scroller.
                "visibleColCount": ctrl.dateScroller.visibleColCount, // Number of visible columns in table scroller.
                "hiddenColsLeftCount": ctrl.dateScroller.defaultHiddenColsLeft, // Number of columns hidden on the left-hand side.
                "hiddenColsRightCount": ctrl.dateScroller.defaultHiddenColsRight, // Number of columns hidden on the right-hand side. The sum of these last three shoul be equal to  totalColCount.
                "step": 1 // Amount to "slide" the visible columns by, left or right.
            };
            // Initialize the calendar.
            initializeCalendar(ctrl.timeScale);
        }
        /**
         * Initializes the calendar data according to given timescale.
         * @param {String} timeScale - The desired timescale.
         * @param {Date} [startDate = ctrl.dateScroller.startDate] - Start date for the calendar.
         */
        function initializeCalendar(timeScale, startDate) {
            if (!startDate) {
                startDate = ctrl.dateScroller.startDate;
            }
            ctrl.calendarDates.length = 0;
            initializeCalendarDefault(startDate, ctrl.dateScroller.dayCount);
            var unit = 'd';
            if (timeScale == TIMESCALE.DAY) {
                unit = 'h';
            }
            initializeCalendarDefault(startDate, ctrl.dateScroller.dayCount, unit);
            // switch (timeScale) {
            //     case TIMESCALE.DEFAULT:
            //         initializeCalendarDefault(startDate, ctrl.dateScroller.dayCount);
            //         break;
            //     case TIMESCALE.WEEK:
            //         initializeCalendarWeek(startDate, ctrl.dateScroller.dayCount);
            //         break;
            //     case TIMESCALE.DAY:
            //         initializeCalendarDay(startDate, ctrl.dateScroller.dayCount);
            //         break;
            // }
        }
        ctrl.convertDate = function (date) {
            return moment(date).utc().format('DD/MM/YYYY HH:mm')
        }
        /**
        //  * Setup the calendar dates part of the entire table, with the DAY timescale.
        //  * The resulting array is used in the template to actually output the column headings.
        //  * @param {Integer} startDate - A Unix timestamp representing the start date of the displayed dates.
        //  * @param {Integer} hourCount - The number of hours to display.
        //  */
        // function initializeCalendarDay(startDate, hourCount) {
        //     // IMPORTANT!
        //     // Must use angular.merge (instead of simple attribution) in order to preserve
        //     // the original ctrl.calendarDates array, as initially  bound in the template.
        //     // Failing to preserve the reference will break the automatic updating of the table columns,
        //     // since Angular loses the bound array.
        //     angular.merge(ctrl.calendarDates, generateCalendarDates(startDate, hourCount, 'h'));
        //     //Set up start and end dates of the timeframe. Get them from the generated array of dates.
        //     ctrl.startDate = ctrl.calendarDates[0];
        //     ctrl.startDateString = moment.unix(ctrl.startDate.timestamp).format('DD-MMM-YYYY'); // Solely for printing in the timeframe selector (template).
        //     ctrl.endDate = ctrl.calendarDates[ctrl.calendarDates.length - 1];
        //     ctrl.endDateString = moment.unix(ctrl.endDate.timestamp).format('DD-MMM-YYYY'); // Idem.
        // }
        // /**
        //  * Setup the calendar dates part of the entire table, with the WEEK timescale.
        //  * The resulting array is used in the template to actually output the column headings.
        //  * @param {Integer} startDate - A Unix timestamp representing the start date of the displayed dates.
        //  * @param {Integer} dayCount - The number of days to display.
        //  */
        // function initializeCalendarWeek(startDate, dayCount) {
        //     // IMPORTANT!
        //     // Must use angular.merge (instead of simple attribution) in order to preserve
        //     // the original ctrl.calendarDates array, as initially  bound in the template.
        //     // Failing to preserve the reference will break the automatic updating of the table columns,
        //     // since Angular loses the bound array.
        //     angular.merge(ctrl.calendarDates, generateCalendarDates(startDate, dayCount, 'd'));
        //     //Set up start and end dates of the timeframe. Get them from the generated array of dates.
        //     ctrl.startDate = ctrl.calendarDates[0];
        //     ctrl.startDateString = moment.unix(ctrl.startDate.timestamp).utc('DD-MMM-YYYY'); // Solely for printing in the timeframe selector (template).
        //     ctrl.endDate = ctrl.calendarDates[ctrl.calendarDates.length - 1];
        //     ctrl.endDateString = moment.unix(ctrl.endDate.timestamp).utc('DD-MMM-YYYY'); // Idem.
        // }
        //     /**
        //      * Setup the calendar dates part of the entire table, with the DEFAULT timescale.
        //      * The resulting array is used in the template to actually output the column headings.
        //      * @param {Integer} startDate - A Unix timestamp representing the start date of the displayed dates.
        //      * @param {Integer} dayCount - The number of days to display.
        //      */
        function initializeCalendarDefault(startDate, dayCount, unit) {
            // IMPORTANT!
            // Must use angular.merge (instead of simple attribution) in order to preserve
            // the original ctrl.calendarDates array, as initially  bound in the template.
            // Failing to preserve the reference will break the automatic updating of the table columns,
            // since Angular loses the bound array.
            angular.merge(ctrl.calendarDates, generateCalendarDates(startDate, dayCount, unit));
            //Set up start and end dates of the timeframe. Get them from the generated array of dates.
            ctrl.startDate = ctrl.calendarDates[0];
            ctrl.startDateString = moment.unix(ctrl.startDate.timestamp).format('DD-MMM-YYYY'); // Solely for printing in the timeframe selector (template).
            ctrl.endDate = ctrl.calendarDates[ctrl.calendarDates.length - 1];
            ctrl.endDateString = moment.unix(ctrl.endDate.timestamp).format('DD-MMM-YYYY'); // Idem.
        }
        /**
         * Generates an array of dates, given a starting date and a day count.
         * Moment.js functionality ensures correct dates succession.
         * @param {Integer} startDate - The start date as a UNIX timestamp.
         * @param {Integer} count - The number of dates to generate.
         * @param {Integer} calendarUnit - The distinction between generated dates (d (days) or h (hours)).
         * @return {Array} An array of dates as custom objects. Includes the start date.
         */
        function generateCalendarDates(startDate, count, calendarUnit) {
            var result = [],
            day = moment.unix(startDate);
            for (var i = 0; i < count; i++) {
                result.push({
                    timestamp: day.format('X'),
                    formatted: day.format('MMM DD YYYY'),
                    month: day.format('MMM'),
                    day: day.format('DD'),
                    weekday: day.format('ddd'),
                    hour: day.format('ha'),
                    isWeekend: [6, 7].indexOf(day.isoWeekday()) >= 0,
                    isNow: day.isSame(moment(), calendarUnit)
                });
                day = day.add(1, calendarUnit);
            }
            return result;
        }
        /**
         * Transform a calendar model into datatable row data.
         * @param {Array} calendarData - The calendar model data.
         * @param {Array} calendarDates - The calendar table columns.
         * @param {String} calendarUnit - The calendar comparison unit for the generated columns (Moment.js compatible)
         * @param {String} statusFilter - The filter used on port status of request
         * @return {Object} A JS object normalized to be sent to the datatable.
         */
        function normalizeCalendarData(calendarData, calendarDates, calendarUnit, statusFilter) {
            if (typeof(ctrl.calendarData.scheduleDashboardView) == "string")
                return normalizeCalendarDataFlat(calendarData, calendarDates, calendarUnit, statusFilter);
            console.warn("normalizeCalendarData start :", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
            console.log(ctrl.calendarData)
            data = angular.copy(ctrl.calendarData.scheduleDashboardView);
            dates = angular.copy(calendarDates);
            var result = [],
                dataRow,
                resultRow,
                voyageStop,
                item,
                day;
            // go through all received rows

            for (var i = 0; i < dates.length; i ++)
            {
                dates[i].eta_intts = parseInt(moment(dates[i].timestamp, 'X').utc().format("X"));
            }              

            for(var i1 = 0; i1 < data.length; i1++)
            {
                v = data[i1];
                for (var i = 0; i < v.voyageDetail.length; i ++)
                {
                    v.voyageDetail[i].eta_intts = parseInt(moment(v.voyageDetail[i].eta, 'YYYY-MM-DDThh:mm:ssZ').utc().format("X"));
                }                
                // sort all voyage detail databased on timestamp;
                v.voyageDetail.sort(function(a, b){return a.eta_intts - b.eta_intts});
            //$.each(data, function (k, v) {
                //console.warn("normalizeCalendarData start - 3", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
                resultRow = {
                    serviceName: v.serviceName,
                    vesselName: v.vesselName,
                    buyerName: v.buyerName,
                    companyName: v.companyName,
                    defaultDistillate: v.defaultDistillate,
                    defaultFuel: v.defaultFuel,
                    calendar: [],
                    statusList: []
                };
                var v_index = 0;
                for (var i2 = 0; i2 < dates.length; i2 ++)
                {
                    v1 = dates[i2];
                //$.each(dates, function (k1, v1) {
                    //day = moment(v1.timestamp, 'X').utc();
                    portDetails = null;
                    portData = [];
                    originalData = [];
                    if ((v_index < v.voyageDetail.length) )
                    {
                        while (((i2 < dates.length - 1) && (v.voyageDetail[v_index].eta_intts < dates[i2 +1].eta_intts))||
                        (i2 == (dates.length - 1)))
                        {
                            portDetails = {
                                "day": i2,
                                "id": v.voyageDetail[v_index].id,
                                "portCode": v.voyageDetail[v_index].locationCode,
                                "status": v.voyageDetail[v_index].portStatus,
                                "request": v.voyageDetail[v_index].request,
                                "eta": v.voyageDetail[v_index].eta,
                                "style": v.voyageDetail[v_index].portStatus ? getButtonStyle(v.voyageDetail[v_index].portStatus) : null,
                                "request": v.voyageDetail[v_index].request,
                            };
                            //add status to vessel row
                            if (resultRow.statusList.indexOf(v.voyageDetail[v_index].portStatus) == -1) {
                                resultRow.statusList.push(v.voyageDetail[v_index].portStatus);
                            }
                            portData.push(portDetails);
                            //portData.push(portDetails);
                            // break;                        
                            v_index ++;
                            if ((v_index == v.voyageDetail.length))
                                break;
                        }
                    }
                    /*
                    for (var i3 = 0; i3 < v.voyageDetail.length; i3 ++)
                    {
                        v2 = v.voyageDetail[i3];
                    //$.each(v.voyageDetail, function (k2, v2) {
                        var eta = v2.eta;
                        day2 = moment(v2.eta, 'YYYY-MM-DDThh:mm:ssZ').utc();
                        if (day.isSame(eta, calendarUnit)) {
                            portDetails = {
                                "day": i2,
                                "id": v2.id,
                                "portCode": v2.locationCode,
                                "status": v2.portStatus,
                                "request": v2.request,
                                "eta": v2.eta,
                                "style": v2.portStatus ? getButtonStyle(v2.portStatus) : null,
                                "request": v2.request,
                            };
                            //add status to vessel row
                            if (resultRow.statusList.indexOf(v2.portStatus) == -1) {
                                resultRow.statusList.push(v2.portStatus);
                            }
                            portData.push(portDetails);
                            // break;
                        }
                        
                        // console.log(calendarData)
                    }
                    //)
                    */
                    resultRow.calendar.push(portData);
                }
                //)
                result.push(resultRow);
            }
            //)
            console.warn("normalizeCalendarData end :", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
            return result;
        } 



        function normalizeCalendarDataFlat(calendarData, calendarDates, calendarUnit, statusFilter) {
        	console.warn("normalizeCalendarDataFlat start :", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
            //console.log(ctrl.calendarData)
            data = (angular.copy(ctrl.calendarData.scheduleDashboardView));
            dataJSON = JSON.parse('{ "vessels": [' + data + "]}");
            dates = angular.copy(calendarDates);
            var result = [],
                dataRow,
                resultRow,
                voyageStop,
                item,
                day;

            // apply hierarchiy
            var vessels = Array();
            for (i = 0; i < dataJSON.vessels.length; i ++)
            {
                if (typeof(vessels[dataJSON.vessels[i].ServiceName + "_" + dataJSON.vessels[i].VesselName + "_" + dataJSON.vessels[i].BuyerName]) == "undefined")
                {
                    vessels[dataJSON.vessels[i].ServiceName + "_" + dataJSON.vessels[i].VesselName + "_" + dataJSON.vessels[i].BuyerName] = Array();
                    vessels[dataJSON.vessels[i].ServiceName + "_" + dataJSON.vessels[i].VesselName + "_" + dataJSON.vessels[i].BuyerName].voyage = Array();
                    vessels[dataJSON.vessels[i].ServiceName + "_" + dataJSON.vessels[i].VesselName + "_" + dataJSON.vessels[i].BuyerName].service = dataJSON.vessels[i].ServiceName;
                    vessels[dataJSON.vessels[i].ServiceName + "_" + dataJSON.vessels[i].VesselName + "_" + dataJSON.vessels[i].BuyerName].vessel = dataJSON.vessels[i].VesselName;
                    vessels[dataJSON.vessels[i].ServiceName + "_" + dataJSON.vessels[i].VesselName + "_" + dataJSON.vessels[i].BuyerName].buyer = dataJSON.vessels[i].BuyerName;
                }
                vessels[dataJSON.vessels[i].ServiceName + "_" + dataJSON.vessels[i].VesselName + "_" + dataJSON.vessels[i].BuyerName].voyage.push(i);
            }
            
            // go through all received rows
            for (var i = 0; i < dates.length; i ++)
            {
                dates[i].eta_intts = parseInt(moment(dates[i].timestamp, 'X').utc().format("X"));
            }              

            i1 = 0;
            //for(var i1 = 0; i1 < data.length; i1++)
            for(key in vessels)
            { 
                v = vessels[key];
                for (var i = 0; i < v.voyage.length; i ++)
                {
                    dataJSON.vessels[v.voyage[i]].voyageDetail.eta_intts = parseInt(moment(dataJSON.vessels[v.voyage[i]].voyageDetail.eta, 'YYYY-MM-DDThh:mm:ssZ').utc().format("X"));
                    //v.voyageDetail[i].eta_intts = parseInt(moment(v.voyageDetail[i].eta, 'YYYY-MM-DDThh:mm:ssZ').utc().format("X"));
                }                
                // sort all voyage detail databased on timestamp;
                v.voyage.sort(function(a, b){return dataJSON.vessels[a].voyageDetail.eta_intts - dataJSON.vessels[b].voyageDetail.eta_intts});
                resultRow = {
                    serviceName: v.service,
                    vesselName: v.vessel,
                    buyerName: v.buyer,
                    companyName: dataJSON.vessels[v.voyage[0]].CompanyName,
                    defaultDistillate: dataJSON.vessels[v.voyage[0]].DefaultDistillate,
                    defaultFuel: dataJSON.vessels[v.voyage[0]].DefaultFuel,
                    calendar: [],
                    statusList: []
                };
                var v_index = 0;
                for (var i2 = 0; i2 < dates.length; i2 ++)
                {
                    v1 = dates[i2];
                //$.each(dates, function (k1, v1) {
                    //day = moment(v1.timestamp, 'X').utc();
                    portDetails = null;
                    portData = [];
                    originalData = [];
                    if ((v_index < v.voyage.length) )
                    {
                        index = 0;
                        
                        if (((i2 < dates.length - 1) && (dataJSON.vessels[v.voyage[v_index]].voyageDetail.eta_intts < dates[i2 +1].eta_intts))||
                        (i2 == (dates.length - 1)))
                        {
                            event = dataJSON.vessels[v.voyage[v_index]];
                            //add status to vessel row
                            if (resultRow.statusList.indexOf(event.voyageDetail.portStatus) == -1) {
                                resultRow.statusList.push(event.voyageDetail.portStatus);
                            }
                            portDetails = {
                                "day": i2,
                                "id": event.voyageDetail.id,
                                "portCode": event.voyageDetail.locationCode,
                                "status": event.voyageDetail.portStatus,
                                "request": event.voyageDetail.request,
                                "eta": event.voyageDetail.eta,
                                "style": event.voyageDetail.portStatus ? getButtonStyle(event.voyageDetail.portStatus) : null,
                                "request": event.voyageDetail.request,
                            };
                            if (portDetails.request.id > 0)
                                portDetails.request.id = portDetails.request.id;
                            /*
                            if (typeof(portDetails.request.requestName))
                                */
                            requestDetail = []; 
                            
                            while (((i2 < dates.length - 1) && (dataJSON.vessels[v.voyage[v_index]].voyageDetail.eta_intts < dates[i2 +1].eta_intts))||
                            (i2 == (dates.length - 1)))
                            {
                                // break; 
                                event = dataJSON.vessels[v.voyage[v_index]];                       
                                v_index ++;
                                
                                requestDetail.push(event.voyageDetail.request.requestDetail);
                                if ((v_index == v.voyage.length))
                                    break;
                                index ++;
                                if (index > 1)
                                    index = index;
                            }
                            portDetails.request.requestDetail = requestDetail;
                            portData.push(portDetails);

                        }
                    }
                    
                    resultRow.calendar.push(portData);
                }

                result.push(resultRow);
                i1 ++;
            }
            
        	console.warn("normalizeCalendarDataFlat end :", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
            return result;
        }
        /**
         * Initializes the Schedule Dashboard CalendarDataTable.
         * @param {String} selector - A valid jQuery DOM element selector to identify the <TABLE> element.
         * @param {JSON} settings - The settings to use for DataTable initialization.
         *                          Must be JSON-normalized to the DataTables settings format!
         * @return {Object} - The resulting DataTable object.
         */
		$( window ).resize(function() {
			$("#schedule_calendar_table").width(function(){
				return $("#schedule_calendar_table").parent().css("width");
			})
			$("#schedule_calendar_table thead").width(function(){
				return $("#schedule_calendar_table").parent().css("width");
			})
			$("#schedule_calendar_table tbody").width(function(){
				return $("#schedule_calendar_table").parent().css("width");
			})	
		})
        function initDataTable(selector, settings) {
            // Actually bind and initialize the DataTable.

			$(document).ready(function() {
				$("#schedule_calendar_table").width(function(){
					return $("#schedule_calendar_table").parent().css("width");
				})
				$("#schedule_calendar_table thead").width(function(){
					return $("#schedule_calendar_table").parent().css("width");
				})
				$("#schedule_calendar_table tbody").width(function(){
					return $("#schedule_calendar_table").parent().css("width");
				})	

			  $('tbody').scroll(function(e) { //detect a scroll event on the tbody
			  	// console.log($('tbody').scrollTop(), $('tbody').height(), $('tbody').height() - $('tbody').scrollTop() );
			    $('thead').css("left", -$("tbody").scrollLeft()); //fix the thead relative to the body scrolling
			    $('thead th:nth-child(1)').css("left", $("tbody").scrollLeft()); //fix the first cell of the header
			    $('tbody td:nth-child(1)').css("left", $("tbody").scrollLeft()); //fix the first column of tdbody
			  });
			});

        
            // var table = ScheduleDashboardCalendarDataTable.init({
            //     selector: selector,
            //     columnDefs: settings.columnDefs,
            //     colvisColumns: settings.colvisColumns,
            //     dom: 'Bflrt',
            //     pageLength: ctrl.tableOptions.pageLength,
            //     order: ctrl.tableOptions.order,
            //     hiddenColumns: ctrl.hiddenCalendarColumns
            // });
            // Attach the visible columns selector (the DataTables Buttons extension).
            //table.buttons(0, null).container().appendTo('#column_selector_container');
            // Re-place (move) the datatable searchbox in the main content menu, as per spec.
            //replaceDataTableSearchBox('#schedule_calendar_table_filter');
            // return table;
        }
        ctrl.calculateFixedColumnsWidth = function() {
        	if (!ctrl.scheduleDashboardConfiguration) {return}
        	mainWidth = 228;
        	if (ctrl.scheduleDashboardConfiguration.scheduleBuyerDisplay.name != 'No') {
	        	mainWidth += 90;
        	}
        	if (ctrl.scheduleDashboardConfiguration.scheduleCompanyDisplay.name != 'No') {
	        	mainWidth += 90;
        	}
        	mainWidth += 5;
        	ctrl.fixedColumnsWidth = mainWidth + 'px'
        }
        $scope.search = function (value) {
            ctrl.tableOptions.searchTerm = value;
            ctrl.setPage(1, ctrl.tableOptions.searchTerm);
        }
        /**
         * Displays the calendar columns within the calendar table.
         * Given the amount of columns to hide on the left and right side,
         * respectively, performs the necessary calculations and hides/shows
         * the appropriate columns.
         * @param {Integer} hiddenLeftCount - Number of columns to hide on the left-hand side.
         * @param {Integer} hiddenRightCount - Number of columns to hide on the right-hand side.
         */
        function displayTableCalendar(hiddenLeftCount, hiddenRightCount) {
            var lastHiddenLeftIndex = ctrl.tableScroller.firstColIndex + hiddenLeftCount,
                firstHiddenRightIndex = lastHiddenLeftIndex + ctrl.tableScroller.visibleColCount,
                lastHiddenRightIndex = firstHiddenRightIndex + hiddenRightCount,
                i;
            // Hide left-hand side columns.
            for (i = ctrl.tableScroller.firstColIndex; i < lastHiddenLeftIndex; i++) {
                if (typeof (ctrl.calendar.columns(i)) != 'undefined') {
                    ctrl.calendar.columns(i).visible(false);
                }
            }
            // Show columns in the middle.
            for (i = lastHiddenLeftIndex; i < firstHiddenRightIndex; i++) {
                if (typeof (ctrl.calendar.columns(i)) != 'undefined') {
                    ctrl.calendar.columns(i).visible(true);
                }
            }
            // Hide right-hand side columns.
            for (i = firstHiddenRightIndex; i < lastHiddenRightIndex; i++) {
                if (typeof (ctrl.calendar.columns(i)) != 'undefined') {
                    ctrl.calendar.columns(i).visible(false);
                }
            }
        }
        /**
         * "Scrolls" the calendar date columns within the calendar table by manipulating the
         * 'hiddenColsLeftCount' and 'hiddenColsRightCount' of the global ctrl.tableScroller.
         * It performs all the necessary calculations and corrections for a valid "scroll" behavior.
         *
         * @param {String} direction - The direction in which to scroll. Accepted values are 'left' and 'right'.
         * @return {Object} An object containing the current numbers of columns to hide, left and right.
         */
        function scrollTableCalendar(direction, step) {
            if (direction === ctrl.SCROLL_DIRECTIONS.left) {
                if (ctrl.tableScroller.hiddenColsLeftCount - step > 0) {
                    ctrl.tableScroller.hiddenColsLeftCount -= step;
                    ctrl.tableScroller.hiddenColsRightCount += step;
                } else {
                    ctrl.tableScroller.hiddenColsRightCount = ctrl.dateScroller.defaultHiddenColsLeft + ctrl.dateScroller.defaultHiddenColsRight;
                    ctrl.tableScroller.hiddenColsLeftCount = 0;
                }
            } else if (direction === ctrl.SCROLL_DIRECTIONS.right) {
                if (ctrl.tableScroller.hiddenColsRightCount - step > 0) {
                    ctrl.tableScroller.hiddenColsLeftCount += step;
                    ctrl.tableScroller.hiddenColsRightCount -= step;
                } else {
                    ctrl.tableScroller.hiddenColsLeftCount = ctrl.dateScroller.defaultHiddenColsLeft + ctrl.dateScroller.defaultHiddenColsRight;
                    ctrl.tableScroller.hiddenColsRightCount = 0;
                }
            }
            return {
                left: ctrl.tableScroller.hiddenColsLeftCount,
                right: ctrl.tableScroller.hiddenColsRightCount
            };
        }
        /**
         * Performs a timeframe "scroll".
         * @param {String} direction - A scroll direction constant. See ctrl.SCROLL_DIRECTIONS.
         */
        function scrollTimeframe(direction) {
            var day = moment.unix(ctrl.startDate.timestamp);
            if (direction === ctrl.SCROLL_DIRECTIONS.left) {
                day.subtract(ctrl.dateScroller.timeframeDelta, 'days');
            } else if (direction === ctrl.SCROLL_DIRECTIONS.right) {
                day.add(ctrl.dateScroller.timeframeDelta, 'days');
            }
            resetTableCalendarScroll();
            console.log(day.format('X'))
            initializeCalendar(ctrl.timeScale, day.format('X'));
            ctrl.setPage(1)
        }
        /**
         * Resets the calendar scroll to default, i.e. scrolls it to the initial, default position.
         */
        function resetTableCalendarScroll() {
            ctrl.tableScroller.hiddenColsLeftCount = ctrl.dateScroller.defaultHiddenColsLeft;
            ctrl.tableScroller.hiddenColsRightCount = ctrl.dateScroller.defaultHiddenColsRight;
        }

        function initContextMenus() {
            // (Re-)Bind oncontextmenu event via jQuery, since Angular does
            // not provide it, and the custom directive is not working
            // for some reason.
            // $('TD[id^="voyageStop_"]').off('contextmenu');
            // $('TD[id^="voyageStop_"]').on('contextmenu', function(event) {
            //     ctrl.showContextMenu(event);
            // });
        }
        /**
         * Initializes popover functionality by binding popover to certain datatable cells.
         * Must be called each time after data gets added to the table.
         */
        function initPopovers() {
            $(function () {
                $('TD span[data-toggle="popover"]').popover({
                    container: 'body',
                    trigger: 'hover',
                    placement: 'bottom',
                    html: true,
                    template: '<div class="popover" role="tooltip"><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                }).
                    on('show.bs.popover', function (event) {
                        hideContextMenus();
                    });
            });
        }
        /**
         * Hides all popovers.
         */
        function hidePopovers() {
            $('TD span[data-toggle="popover"]').popover('hide');
            console.warn("hidePopovers:", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
        }
        /**
         * Hides all contextmenus.
         */
        function hideContextMenus() {
            $('[id^=contextmenu_').hide();
        }
        /**
         * Interprets certain special strings into valid datetime values. This is needed because we cannot
         * use dynamic values in JSON.
         * @param {String} dateString - The string to interpret.
         * @param {Datetime} The resulting date.
         */
        function interpretStartDate(dateString) {
            var result;
            switch (dateString) {
                case 'week_start':
                    result = moment().startOf('isoWeek').format('X');
                    break;
                case 'day_start':
                    result = moment().startOf('day').format('X');
                    break;
                default:
                    result = moment().startOf('day').subtract(dateString, 'd').format('X');
                    break;
            }
            return result;
        }
        /**
         * Gets the opposite direction of the given direction.
         * @param {string} direction - The direction to get the opposite of.
         * @return {string} The opposite direction
         */
        function getOppositeDirection(direction) {
            var opposite;
            switch (direction) {
                case ctrl.SCROLL_DIRECTIONS.left:
                    opposite = ctrl.SCROLL_DIRECTIONS.right;
                    break;
                case ctrl.SCROLL_DIRECTIONS.right:
                    opposite = ctrl.SCROLL_DIRECTIONS.left;
                    break;
            }
            return opposite;
        }
        /**
         * Get status style of button according to status name
         * @param {string} statusName - The status name to search the status list
         * @return {string} status style (colors mostly)
         */
        function getButtonStyle(status) {
            // if(status.displayName === 'BunkerStrategy') {
            //   debugger;
            // }
            var statuses = $filter("filter")(statusList, {
                displayInDashboard: true,
                status: {
                    displayName: status.displayName,
                }
            }, true);
            if (statuses.length > 0) {
                var statusColor = statusColors.getColorCodeFromLabels(status, $listsCache.ScheduleDashboardLabelConfiguration);
                return {
                    "background-color": statusColor
                };
            }
            return null;
        }
        /*******************************
         *   END SPECIFIC FUNCTIONALITY
         *******************************/
        /*******************************
         *   ANGULAR DOM EVENT HANDLERS
         *******************************/
        /**
         * Handle click on the calendar table scroll arrows.
         * @param {String} direction - A scroll direction constant. See ctrl.SCROLL_DIRECTIONS.
         */
        ctrl.scrollClick = function (direction) {
            // We needed to check if, in certain scenarios, the calendar scroller has just reached the end
            // (then DON'T jump to the next timeframe), OR it actually IS at the end and we DO need to move
            // to the next timeframe. We employ oldHiddenColsLeft and oldHiddenColsRight for that purpose.
            var oldHiddenColsLeft = ctrl.tableScroller.hiddenColsLeftCount,
                oldHiddenColsRight = ctrl.tableScroller.hiddenColsRightCount,
                hiddenColCounts = scrollTableCalendar(direction, ctrl.tableScroller.step);
            if (hiddenColCounts.left === 0 && oldHiddenColsLeft === 0 && direction === ctrl.SCROLL_DIRECTIONS.left) {
                scrollTimeframe(ctrl.SCROLL_DIRECTIONS.left);
                // Scroll the dates in the opposite direction to achieve the effect of dates continuity by
                // placing the next date at the far right  of the calendar.
                scrollTableCalendar(ctrl.SCROLL_DIRECTIONS.right, ctrl.tableScroller.defaultHiddenColsRight);
                return;
            }
            if (hiddenColCounts.right === 0 && oldHiddenColsRight === 0 && direction === ctrl.SCROLL_DIRECTIONS.right) {
                scrollTimeframe(ctrl.SCROLL_DIRECTIONS.right);
                // Scroll the dates in the opposite direction to achieve the effect of dates continuity by
                // placing the next date at the far left  of the calendar.
                scrollTableCalendar(ctrl.SCROLL_DIRECTIONS.left, ctrl.tableScroller.defaultHiddenColsLeft);
                return;
            }
            displayTableCalendar(hiddenColCounts.left, hiddenColCounts.right);
            // $timeout(function() {
            //     initContextMenus();
            // });
        };
        /**
         * Handle click on the timeframe scroll arrows.
         * @param {String} direction - A scroll direction constant. See ctrl.SCROLL_DIRECTIONS.
         */
        ctrl.timeframeScrollClick = function (direction) {
            scrollTimeframe(direction);
            // Scroll the dates in the opposite direction to achieve the effect of dates continuity by
            // placing the next date at the far edge of the calendar.
            scrollTableCalendar(getOppositeDirection(direction), ctrl.tableScroller.defaultHiddenColsLeft);
        };
        /**
         * Creates an id attribute value for a calendar popover.
         * @param {Integer} rowId - The row (record) id in the normalized data rows.
         * @param {Integer} voyageStopId - The voyageStop id.
         * @param {Integer} voyageStopDay - The voyageStop day.
         * @return {String} A string representing the new id.
         */
        ctrl.makePopoverId = function (rowId, voyageStopId, voyageStopDay) {
            return 'popover_' + rowId + '_' + voyageStopId + '_' + voyageStopDay;
        };
        /**
         * Creates an id attribute value for a calendar contex tmenu.
         * @param {Integer} rowId - The row (record) id in the normalized data rows.
         * @param {Integer} voyageStopId - The voyageStop id.
         * @param {Integer} voyageStopDay - The voyageStop day.
         * @return {String} A string representing the new id.
         */
        // ctrl.makeContextmenuId = function(rowId, voyageStopId, voyageStopDay) {
        //     return 'contextmenu_' + rowId + '_' + voyageStopId + '_' + voyageStopDay;
        // };
        /**
         * Retrieves the popover markup for a given record and voyage stop.
         * Used for filling the data-content attribute of the corresponding cell.
         * @param {Integer} rowId - The row (record) id in the normalized data rows.
         * @param {Integer} voyageStopId - The voyageStop id.
         * @param {Integer} voyageStopDay - The voyageStop day.
         * @return {String} The HTML markup that makes the popover.
         */
        ctrl.getPopoverMarkup = function (rowId, voyageStopId, voyageStopDay, voyageStop) {
            if (!voyageStopId /*&& !voyageStop.request*/) {
                return '';
            }
            var popoverId = ctrl.makePopoverId(rowId, voyageStopId, voyageStopDay);
            html = '<table class="table table-striped table-hover table-bordered table-condensed"> <thead> <th>Request ID</th> <th>Vessel</th> <th>Port</th> <th>Product</th> <th>UOM</th> <th>Min. Quantity</th> <th>Max. Quantity</th> <th>Agreement Type</th> <th>Product Status</th> </thead> <tbody>';
            if (voyageStop.request && voyageStop.request.id != 0) {
                $.each(voyageStop.request.requestDetail, function (k, row) {
                    html += '<tr><td>' + voyageStop.request.requestName + '</td> <td>' + voyageStop.request.vesselName + '</td> <td >' + row.location + '</td> <td>' + row.fuelOilOfRequest + '</td> <td>' + row.uom + '</td> <td>' + $filter('number')(row.fuelMinQuantity, $scope.numberPrecision.amountPrecision) + '</td> <td>' + $filter('number')(row.fuelMaxQuantity, $scope.numberPrecision.amountPrecision) + '</td> <td>' + row.agreementType + '</td> <td>' + row.statusCode + '</td></tr>';
                })
            } else {
                html += '<tr> <td colspan="9" class="text-center"> <i>No request data.</i> </td> </tr>';
            }
            html += '</tbody> </table>';
            return html;
        };
        /**
         * Displays a context menu on right click.
         */
        ctrl.showContextMenu = function ($event, object, vsVal) {
            console.log(123)
            $("body > .contextmenu").remove();
            currentElem = $($event.currentTarget);
            html = '<div class="contextmenu alert alert-info fade in"> <a href="#" class="close" aria-label="close"> &times; </a> <div class="content">';
            $.each(object, function (k, value) {
                html += '<span> <a class="contextAction" data-index="' + k + '">';
                if (value.request == null || value.request.id == 0) {
                    html += '<span> Create Pre-request (' + value.portCode + ') </span>';
                } else {
                    html += '<span> Edit request (' + value.portCode + ') - ' + value.request.requestName + ' </span> '
                }
                html += '</a> <br/> </span>'
            })
            html += '</div> </div>';
            if (vsVal) {
                $('body').append(html);
                $('.contextmenu').css("left", $(currentElem).offset().left);
                $('.contextmenu').css("top", $(currentElem).offset().top);
                $('.contextmenu').removeClass("hidden");
            }
            $('.contextAction').click(function () {
                index = $(this).attr('data-index');
                contextAction(object[index]);
                removePopups()
            })
            $('.contextmenu .close').click(function (e) {
                e.preventDefault()
                $(this).hide();
                $("body > .contextmenu").remove();
            })

            function contextAction(voyageStop) {
                var href;
                if (!voyageStop) {
                    return;
                }
                if (voyageStop.request && voyageStop.request.id != 0) {
                    href = $state.href(STATE.EDIT_REQUEST, {
                        requestId: voyageStop.request.id
                    }, {
                            absolute: false
                        });
                } else {
                    href = $state.href(STATE.NEW_REQUEST, {
                        voyageId: voyageStop.id
                    }, {
                            absolute: false
                        });
                }
                window.open(href, '_blank');
            };
        };
        /**
         * Capture timescale select change event.
         */
        ctrl.changeTimeScale = function (timeScale) {
            $state.go(STATE.DASHBOARD_CALENDAR, {
                timescale: timeScale
            }, {
                    reload: true
                });
        };
        $scope.setZoomLevel = function (zoom) {
            if(zoom !== $scope.zoomLevel.value) {
                $('#schedule_calendar_table_wrapper').css('zoom', zoom);
                if(zoom != 1) {
                    $('.DTFC_LeftBodyLiner').css(
                        {
                            'overflow': 'hidden',
                            'height': '429px',
                        }
                    );
                } else {
                    $('.DTFC_LeftBodyLiner').css(
                        {
                            'overflow-y': 'scroll',
                            'height': '433px',
                        }
                    );
                }
            }
        }
        /*******************************
         *   END ANGULAR DOM EVENT HANDLERS
         *******************************/
        ctrl.showMorePortsPopup = function ($event, object) {
            hidePopovers()
            // alert($event.currentTarget);
            $("body > .morePortsPopup").remove();
            currentElem = $($event.currentTarget);
            // popup = $($event.currentTarget).children(".morePortsPopup");
            // newPopup = popup.clone();
            html = '<div class="morePortsPopup hidden" ng-click="$ctrl.closeMorePortsPopup()"> <a class="close" aria-label="close"> &times; </a> <table> <tr> <th> ETA </th> <th> CODE </th> </tr>';
            $.each(object, function (k, v) {
                html += '<tr> <td>' + ctrl.convertDate(v.eta) + ' <td class="styler"> ' + v.portCode + '</td> </tr> '
                if ((!ctrl.breadcrumbsFilter || v.status == ctrl.breadcrumbsFilter) && v.style) {
                    setTimeout(function () {
                        $('.styler').css('background-color', v.style['background-color'].replace('#', ''));
                    }, 10);
                }
            })
            html += '</table> </div>';
            $('body').append(html);
            $('.morePortsPopup').css("left", $(currentElem).offset().left);
            $('.morePortsPopup').css("top", $(currentElem).offset().top);
            $('.morePortsPopup').removeClass("hidden");
        }
        $(document).on("click", "body > .morePortsPopup .close", function () {
            $("body > .morePortsPopup").remove();
        })
        ctrl.checkIfIsWeekend = function (date) {
            theDate = new Date(date);
            day = theDate.getDay();
            isWeekend = false
            if (day == 6 || day == 0) {
                isWeekend = true
            }
            return isWeekend;
        }


		ctrl.setCurrentColSort = function(columnName) {
			screenLoader.showLoader();
			if (ctrl.currentColSort == columnName) {
				ctrl.currentColSort = "-"+columnName
			} else {
				ctrl.currentColSort = columnName;
			}
			ctrl.calendarDataRows =  normalizeCalendarData(ctrl.calendarData.scheduleDashboardView, ctrl.calendarDates, ctrl.dateScroller.calendarUnit);
			showData(ctrl.lastShownData);

			// $compile($("#schedule_calendar_table"))($scope)
		}
 

        function removePopups() {
            $("body > .morePortsPopup").remove();
            $("body > .contextmenu").remove();
        }
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (localStorage.getItem('scheduleDates')) {
                localStorage.removeItem('scheduleDates')
            }
            localStorage.setItem('scheduleDates', JSON.stringify({
                start: ctrl.startDate,
                end: ctrl.endDate
            }));
            removePopups();
            if (ctrl.calendar) {
                
                ctrl.calendar.destroy();
            }
        })
    }
]);
angular.module('shiptech.pages').component('scheduleDashboardCalendar', {
    templateUrl: 'pages/schedule-dashboard-calendar/views/schedule-dashboard-calendar-component.html',
    controller: "ScheduleCalendarController"
});

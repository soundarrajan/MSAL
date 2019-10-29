angular.module("shiptech.pages").controller("ScheduleTimelineController", ["$scope", "$rootScope", "$listsCache", "scheduleDashboardTimelineModel", "statusColors", "$filter", 'tenantService', '$tenantSettings', 'CUSTOM_EVENTS', '$filtersData', '$compile', '$templateCache', '$state', '$timeout', 'STATE',
    function ($scope, $rootScope, $listsCache, scheduleDashboardTimelineModel, statusColors, $filter, tenantService, $tenantSettings, CUSTOM_EVENTS, $filtersData, $compile, $templateCache, $state, $timeout, STATE) {

        var ctrl = this;
        $scope.numberPrecision = $tenantSettings.defaultValues;
        $scope.tenantSettings = $tenantSettings;
        ctrl.bunkerDetails = [];

        
        ctrl.startDate = null;
        ctrl.endDate = null;

        var DEBUG = false;
        if (window.location.hostname == 'localhost') {
            // DEBUG = true;
        }

        var scheduleOptions = {
            'displayBuyer': true,
            'displayCompany': true,
        };

        var timelineStatusList = [];
        var timelineStatuses = [];
        var timelineAdminDashboardStatuses = [];

        groups = [];
        timeline = null;
        groupsIndex = 1;

        $scope.searchTimeline = function(searchText) {
            scheduleDashboardTimelineModel.get(ctrl.startDate, ctrl.endDate, $scope.filtersAppliedPayload, {}, searchText).then(function (response) {
                if (timeline) {
                    updateTimeline(response);
                } else {
                    buildTimeline(response);
                }
            });
        };

        var createStyle = function(colorCode) {
            return {
                "border-color": colorCode,
                "background-color": colorCode
            };
        };

        var createFilters = function() {
            var model = scheduleDashboardTimelineModel.getLatestVersion();
            if (model) {
                if (!model.payload) return;
                var statusList = model.payload.scheduleDashboardStatus;
                scheduleDashboardTimelineModel.getStatuses().then(function(data){
                    if (data !== null) {
                        timelineAdminDashboardStatuses = $filter("filter")(data.labels, {displayInDashboard : true}, true);
                        if (statusList) {
                            var sts = null;
                            for (var i = 0; i < timelineAdminDashboardStatuses.length; i++) {
                                sts = timelineAdminDashboardStatuses[i];

                                var transactionTypeId = null;
                                if (sts.transactionType) {
                                    transactionTypeId = sts.transactionType.id;
                                }
                                if(sts.status.transactionTypeId) {
                                    transactionTypeId = sts.status.transactionTypeId;
                                }

                                var statusId = null;
                                if(sts.status) {
                                    statusId = sts.status.id;
                                }

                                var statusObj = {
                                    id: statusId,
                                    transactionTypeId: transactionTypeId,
                                    name: sts.status.name,
                                };

                                var colorCode = statusColors.getColorCodeFromLabels(statusObj, $listsCache.ScheduleDashboardLabelConfiguration);

                                var status = {};

                                status.style = createStyle(colorCode);
                                status.count = 0;
                                status.name = sts.status.name;
                                status.statusDisplayName = sts.status.displayName;
                                status.label = sts.label;
                                status.display = true;

                                var sts1 = null;
                                for (var j = 0; j < statusList.length; j++) {
                                    sts1 = statusList[j];
                                    if (sts1.status.displayName == sts.status.displayName) {
                                        status.style = createStyle(colorCode);
                                        status.count = sts1.count;
                                        status.name = sts.status.name;
                                        status.statusDisplayName = sts.status.displayName;
                                        status.label = sts.label;
                                        status.display = true;
                                    }
                                }
                                sts1 = null;

                                statusIsAlreadyAdded = false;

                                var sts2 = null;
                                for (var k = 0; k < timelineStatuses.length; k++) {
                                    sts2 = timelineStatuses[k];
                                    if (sts2.name == sts.status.name) {
                                        statusIsAlreadyAdded = true;
                                    }
                                }
                                sts2 = null;

                                if (!statusIsAlreadyAdded) {
                                    timelineStatusList.push(status);
                                }
                            }
                            sts = null;
                            resolve(timelineStatusList);
                        }
                    }
                });
            }
        };

        var computeData = function(data) {
            var vessels = JSON.parse('{ "vessels": [' + data.payload.scheduleDashboardView + "]}").vessels;
            ctrl.voyageData = angular.copy(vessels);
            vessels = _.uniqBy(vessels, "voyageDetail.id");

            var groups = [];
            var voyages = [];
            var groupStrings = [];

            for (var i = 0; i < vessels.length; i++) {

                if (!vessels[i]) {
                    continue;
                }

                if (typeof (ctrl.bunkerDetails[vessels[i].voyageDetail.id]) == "undefined") { ctrl.bunkerDetails[vessels[i].voyageDetail.id] = [] }
                ctrl.bunkerDetails[vessels[i].voyageDetail.id].push(angular.copy(vessels[i].voyageDetail.bunkerPlan));
                // Create voyage object
                var statusColor = statusColors.getColorCodeFromLabels(vessels[i].voyageDetail.portStatus, $listsCache.ScheduleDashboardLabelConfiguration); 

                var voyageContent = '';


                var cls = "vis-voyage-content";
                if (vessels[i].voyageDetail.hasStrategy) {
                    cls += " vis-voyage-content-sap";
                }

                voyageContent += '<span class="' + cls + '" oncontextmenu="return false;" voyage-detail-id="' + vessels[i].voyageDetail.id + '"> ' + vessels[i].voyageDetail.locationCode + ' </span>';

                var startDate, endDate;

                if (vessels[i].voyageDetail.deliveryFrom && vessels[i].voyageDetail.deliveryTo) {
                    startDate = moment.utc(vessels[i].voyageDetail.deliveryFrom).format('YYYY-MM-DD HH:mm');
                    endDate = moment.utc(vessels[i].voyageDetail.deliveryTo).format('YYYY-MM-DD HH:mm');
                } else {
                    startDate = moment.utc(vessels[i].voyageDetail.eta).format('YYYY-MM-DD HH:mm');
                    if (vessels[i].voyageDetail.etd) {
                    	EtaEtdDiff = moment(vessels[i].voyageDetail.etd) - moment(vessels[i].voyageDetail.eta);
                        endDate = moment.utc(vessels[i].voyageDetail.etd).format('YYYY-MM-DD HH:mm');
                    	if (EtaEtdDiff < 86400000) {
	                        endDate = moment.utc(vessels[i].voyageDetail.eta).add('days', 1).format('YYYY-MM-DD HH:mm');
                    	}
                    } else {
                        endDate = moment.utc(vessels[i].voyageDetail.eta).add('days', 1).format('YYYY-MM-DD HH:mm');
                    }
                }

                var voyage = {
                    id: i,
                    content: voyageContent,
                    start: startDate,
                    end: endDate,
                    style: 'background-color: ' + statusColor
                };

                if (ctrl.bunkerDetails.length > 0 && ctrl.bunkerDetails[vessels[i].voyageDetail.id].length > 0) {
                    if (ctrl.bunkerDetails[vessels[i].voyageDetail.id][0]) {
                        ctrl.bunkerDetails[vessels[i].voyageDetail.id][0].voyage = voyage;
                    }
                }

                var groupId = 0;

                // Create unique group string to be used to find the group
                var groupString = vessels[i].ServiceName + ' <> ' + vessels[i].BuyerName + ' <> ' +  vessels[i].VesselName + ' <> ' + vessels[i].CompanyName;

                // If group exists, find group id
                if (groupStrings.indexOf(groupString) > -1) {
                    for (var j = 0; j < groups.length; j++) {
                        if (groups[j].content == groupString)  {
                            groupId = groups[j].id;
                            break;
                        }
                    }
                // If group does not exist, create group and set group id
                } else {
                    // Add group string to groupStrings
                    groupStrings.push(groupString);
                    
                    // Create new group
                    var group = {
                        id: groups.length + 1,
                        serviceName: vessels[i].ServiceName,
                        buyerName: vessels[i].BuyerName,
                        serviceBuyerName: vessels[i].ServiceBuyerName,
                        vesselName: vessels[i].VesselName,
                        companyName: vessels[i].CompanyName,
                        defaultFuel: vessels[i].DefaultFuel,
                        defaultDistillate: vessels[i].DefaultDistillate,
                        // contentTemplate: 
                        content: groupString
                    };

                    // Add group to groups
                    groups.push(group);

                    // Set groupId
                    groupId = group.id;
                }

                // Set group id
                voyage.group = groupId;

                // Add voyage
                voyages.push(voyage);
            }
            ctrl.vessels = vessels;
            return {
                'groups': groups,
                'voyages': voyages
            };
        };

        var getTimelineOptions = function() {
            return {
                'verticalScroll': true,
                // 'moveable': false,
                // Disable red line
                'showCurrentTime': false,
                'stack': false,
                'maxHeight': Math.max(570, $(window).height() - 167),
                'orientation': 'top',
                'start': ctrl.startDate.format('YYYY-MM-DD'),
                'min': ctrl.startDate.subtract('days', 7).format('YYYY-MM-DD'),
                'end': ctrl.endDate.format('YYYY-MM-DD'),
                'max': ctrl.endDate.add('days', 7).format('YYYY-MM-DD'),
                'zoomMin': 129600000,
                'zoomMax': 1814400000,
                groupTemplate: function (group) {
                    var serviceName = group.serviceName;
                    var vesselName = group.vesselName;
                    var buyerName = group.buyerName;
                    var companyName = group.companyName;
                    var serviceBuyerName = group.serviceBuyerName;

                    if (serviceName && serviceName.length > 18) {
                        serviceName = serviceName.substr(0, 13) + ' ... ';
                    }

                    if (vesselName && vesselName.length > 18) {
                        vesselName = vesselName.substr(0, 13) + ' ... ';
                    }

                    if (buyerName && buyerName.length > 18) {
                        buyerName = buyerName.substr(0, 13) + ' ... ';
                    }
                    if (serviceBuyerName && serviceBuyerName.length > 18) {
                        serviceBuyerName = serviceBuyerName.substr(0, 13) + ' ... ';
                    }                    

                    if (companyName && companyName.length > 18) {
                        companyName = companyName.substr(0, 13) + ' ... ';
                    }

                    var tpl = '<div class="vis-custom-group">';
                    tpl += `<span class="vis-custom-group-column" tooltip title="${group.vesselName} : ${group.defaultFuel} : ${group.defaultDistillate}"><span class="vis-custom-group-column-content"> ${vesselName} </span></span>`;
                    if ($scope.displayedColumns["Service"]) {
                    	tpl += `<span class="vis-custom-group-column" tooltip title="${group.serviceName}"> <span class="vis-custom-group-column-content">${group.serviceName} </span></span>`;
                    }
                    if ($scope.displayedColumns["Buyer of the Vessel"]) {
	                    tpl += `<span class="vis-custom-group-column" tooltip title="${group.buyerName}"> <span class="vis-custom-group-column-content"> ${group.buyerName} </span></span>`;
                    }
                    if ($scope.displayedColumns["Buyer of the Service"]) {
                        tpl += `<span class="vis-custom-group-column" tooltip title="${group.serviceBuyerName}" ><span class="vis-custom-group-column-content"> ${group.serviceBuyerName} </span></span>`;
                    }                    
                    if ($scope.displayedColumns["Company"]) {
                        tpl += `<span class="vis-custom-group-column last" tooltip title="${group.companyName}"> <span class="vis-custom-group-column-content"> ${group.companyName} </span></span>`;
                    }
                    tpl += '</div>';
                    return tpl;
                },
            };
        }

        var buildTimeline = function(data) {

            var timelineData = computeData(data);
            var groups = new vis.DataSet(timelineData.groups);
            var voyages = new vis.DataSet(timelineData.voyages);

            var container = document.getElementById('timeline');

            // Create a Timeline
            timeline = new vis.Timeline(container, null, getTimelineOptions());  
            timeline.setGroups(groups);
            timeline.setItems(voyages);

            $scope.timelineItems = groups.length;

            setLayoutAfterTimelineLoad();
            $rootScope.clc_loaded = true;
        };

        var updateTimeline = function(data) {
            var timelineData = computeData(data);
            var groups = new vis.DataSet(timelineData.groups);
            var voyages = new vis.DataSet(timelineData.voyages);
            timeline.setOptions(getTimelineOptions());
            timeline.setGroups(groups);
            timeline.setItems(voyages);
            // $scope.$digest();
            $timeout(function() {
                $scope.timelineItems = groups.length;
                setLayoutAfterTimelineLoad();
            })
        };

        var setLayoutAfterTimelineLoad = function() {
            // Add group columns header
            $('#vis-custom-group-columns').remove();
            if ($('.vis-left').width() > 0) {
            	var groupColumnsTitleElement = '<div class="vis-custom-group" id="vis-custom-group-columns">';
                groupColumnsTitleElement += '<span class="vis-custom-group-column"> Vessel </span>';
                if ($scope.displayedColumns["Service"]) {
	                groupColumnsTitleElement += '<span class="vis-custom-group-column"> Service </span>';
                }
                if ($scope.displayedColumns["Buyer of the Vessel"]) {
                    groupColumnsTitleElement += '<span class="vis-custom-group-column"> Buyer of the Vessel </span>';
                }
                if ($scope.displayedColumns["Buyer of the Service"]) {
                    groupColumnsTitleElement += '<span class="vis-custom-group-column"> Buyer of the Service </span>';
                }                
                if ($scope.displayedColumns["Company"]) {
                    groupColumnsTitleElement += '<span class="vis-custom-group-column last"> Company </span></div>';
                }
                groupColumnsTitleElement += '</div>';

                $('.vis-timeline').first().prepend(groupColumnsTitleElement);
                $('#vis-custom-group-columns').width($('.vis-left').width());
                $('#vis-custom-group-columns').height($('.vis-time-axis.vis-foreground').height());
                $('#vis-custom-group-columns').css('padding-left', ($('.vis-left')[0].offsetWidth - $('.vis-left')[0].clientWidth) + 'px');
            }

            $scope.timelineLoaded = true;
        };

        $scope.selectTimeFrame = function(direction) {
            var daysDifference = ctrl.scheduleDashboardConfiguration.startsBefore + ctrl.scheduleDashboardConfiguration.endsAfter;

            if (direction === 'backwards') {
                ctrl.startDate = ctrl.startDate.subtract('days', daysDifference);
                ctrl.endDate = ctrl.endDate.subtract('days', daysDifference);
            }
            if (direction === 'forwards') {
                ctrl.startDate = ctrl.startDate.add('days', daysDifference);
                ctrl.endDate = ctrl.endDate.add('days', daysDifference);
            }

            $scope.startDateDisplay = ctrl.startDate.format('DD-MM-YYYY');
            $scope.endDateDisplay = ctrl.endDate.format('DD-MM-YYYY');

            getData($scope.filtersAppliedPayload).then(function(response) {
                updateTimeline(response);
            });
        };

        async function getConfiguration() {
            return await new Promise(resolve => {
                tenantService.scheduleDashboardConfiguration.then(function (settings) {
                    ctrl.scheduleDashboardConfiguration = settings.payload;
                    buildVisibleColumns();
                    if (ctrl.scheduleDashboardConfiguration.scheduleBuyerDisplay) {
                        if (ctrl.scheduleDashboardConfiguration.scheduleBuyerDisplay.name == "No") {
                            scheduleOptions.displayBuyer = false;
                        }
                    }
                    if (ctrl.scheduleDashboardConfiguration.scheduleCompanyDisplay) {
                        if (ctrl.scheduleDashboardConfiguration.scheduleCompanyDisplay.name == "No") {
                            scheduleOptions.displayCompany = false;
                        }
                    }
                    // Create startDate and endDate base on startsBefore and endsAfter
                    ctrl.startDate = moment().add('days', -ctrl.scheduleDashboardConfiguration.startsBefore);
                    ctrl.endDate = moment().add('days', ctrl.scheduleDashboardConfiguration.endsAfter);
                    $scope.startDateDisplay = ctrl.startDate.format('DD-MM-YYYY');
                    $scope.endDateDisplay = ctrl.endDate.format('DD-MM-YYYY');
    
                    //DEBUG
                    // ctrl.startDate = moment().add('days', -60);
                    // ctrl.endDate = moment().add('days', 60);
                    resolve(ctrl.scheduleDashboardConfiguration);
                });
            });
        };

        async function getStatuses() {
            return await new Promise(resolve => {
                scheduleDashboardTimelineModel.getStatuses().then(function (data) {
                    statusList = data.labels;
                    resolve($filter("filter")(statusList, {
                        displayInDashboard: true,
                        status: {
                            displayName: status.displayName,
                        }
                    }, true));
                });
            })
        };

        async function getData(payload) {
            return await new Promise(resolve => {
                scheduleDashboardTimelineModel.get(ctrl.startDate, ctrl.endDate, payload).then(function (response) {
                    resolve(response);
                });
            });
        }

        // Get data and initialize timeline
        async function doTimeline() {
            Promise.all([getStatuses(), getConfiguration()]).then(function(res) {
                getData().then(function(data) {
                    createFilters();
                    $rootScope.timelineStatusList = timelineStatusList;
                    buildTimeline(data);
                });
            });
        }
        doTimeline();

        buildVisibleColumns = function() {
        	$scope.displayedColumns = {}; 
        	$.each(ctrl.scheduleDashboardConfiguration.hiddenFields, function(k,v) {
        		$scope.displayedColumns[v.option.name] = !v.hidden ;
        	})
        	console.log($scope.displayedColumns);
        }

        $rootScope.$on('filters-applied', function (event, payload, isBreadcrumbFilter) {

            if (!timeline) {
                return;
            }

            $scope.filtersAppliedPayload = payload;
            
            getConfiguration().then(function(settings) {
                getData(payload).then(function(response) {
                    updateTimeline(response);
                });
            });

            var conditions = $filtersData.filterConditions;

            for(var i = 0; i < payload.length; i++) {
                for(var j = 0; j < conditions.length; j++) {
                    if(payload[i].ColumnType === conditions[j].conditionApplicable && payload[i].ConditionValue === conditions[j].conditionValue) {
                        payload[i]['conditionName'] = conditions[j].conditionName;
                        switch(payload[i].columnValue) {
                        	case 'ServiceBuyerName':
                                payload[i]['displayName'] = 'Buyer of the Service';
                                break;
                            case 'BuyerName':
                                payload[i]['displayName'] = 'Buyer of the Vessel';
                                break;
                            case 'VesselName':
                                payload[i]['displayName'] = 'Vessel name';
                                break;
                            case 'ServiceName':
                                payload[i]['displayName'] = 'Service';
                                break;
                            case 'VoyageDetail_Eta':
                                payload[i]['displayName'] = 'ETA';
                                break;
                            case 'VoyageDetail_Etb':
                                payload[i]['displayName'] = 'ETB';
                                break;
                            case 'VoyageDetail_Etd':
                                payload[i]['displayName'] = 'ETD';
                                break;
                            case 'VoyageDetail_PortStatus_DisplayName':
                                payload[i]['displayName'] = 'Port Status';
                                break;
                            case 'VoyageDetail_LocationName':
                                payload[i]['displayName'] = 'Location';
                                break;
                            case 'CompanyName':
                                payload[i]['displayName'] = 'Company'; 
                                break;
                        }
                        if (payload[i].ColumnValue && payload[i].ColumnValue == 'VoyageDetail_PortStatus_DisplayName') {
                            payload[i].displayName = 'Port Status';
                        }
                        if (payload[i].displayName) {
                            if ($scope.tenantSettings.companyDisplayName == "Pool") {
                                payload[i].displayName = payload[i].displayName.replace("Carrier", $scope.tenantSettings.companyDisplayName.name);
                            }
                            payload[i].displayName = payload[i].displayName.replace("Company", $scope.tenantSettings.companyDisplayName.name);
                            payload[i].displayName = payload[i].displayName.replace("Service", $scope.tenantSettings.serviceDisplayName.name);                            
                        }
                    }
                }
            }

            if (isBreadcrumbFilter) {
                if ($scope.appFilters) {
                    for (var i = 0; i < $scope.appFilters.length; i++) {
                        if ($scope.appFilters[i].columnValue === "VoyageDetail_PortStatus_DisplayName" ||
                            $scope.appFilters[i].ColumnValue === "VoyageDetail_PortStatus_DisplayName") {
                                $scope.appFilters.splice(i, 1);
                        }
                    }
                }
                if (payload.length === 0) {
                } else {
                    if (!$scope.appFilters) {
                        $scope.appFilters = [];
                    }
                    for (var i = 0; i < payload.length; i++) {
                        if (payload[i].ColumnValue === 'VoyageDetail_PortStatus_DisplayName') {
                            if ($rootScope.activeBreadcrumbFilters === payload[i].Values[0]) {
                            }
                        } else {
                            $scope.appFilters.push(payload[i]);
                        }
                    }
                }
                return;
            } else {
                $scope.appFilters = payload;
            }
        });

        $rootScope.$on(CUSTOM_EVENTS.BREADCRUMB_FILTER_STATUS, function (event, filter, no) {
            if (ctrl.breadcrumbsFilter == filter) {
                filterPayload = [];
                getData(filterPayload).then(function(response) {
                    updateTimeline(response);
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
                $rootScope.$broadcast("filters-applied", filterPayload, true);
            }
        });

        $rootScope.initBreadcrumbsFilter = function () {
            if ($rootScope.activeBreadcrumbFilters) {
                ctrl.breadcrumbsFilter = $rootScope.activeBreadcrumbFilters;
            }
        };

        $scope.$on(CUSTOM_EVENTS.BREADCRUMB_REFRESH_PAGE, function (event) {
            $rootScope.$broadcast("clearUnsavedFilters");
        });

        document.addEventListener('contextmenu', function(e) {
	        if ($(event.target).hasClass("vis-voyage-content") || $(event.target).parents('.vis-voyage-content').length || $(event.target).hasClass('screen-loader')) {
            	e.preventDefault();
            }
        });

        $(document).on("click", function(event) {
	        if ((!$(event.target).hasClass("contextmenu") && !$(event.target).parents('.contextmenu').length) || $(event.target).hasClass("close")) {
	        	$scope.rightClickPopoverData = null;
	        	$scope.$digest();
	        }
        });

        $(document).on("mousedown", "span[voyage-detail-id]", function(event){
            event.preventDefault();
            if (event.which == 3) {
                voyageDetailId = $(this).attr("voyage-detail-id");

                object = _.filter(ctrl.voyageData, function(el){
                    return el.voyageDetail.id == voyageDetailId;
                }); 
                object = _.uniqBy(object, 'voyageDetail.request.id');

                removePopups();

                currentElem = $(event.currentTarget);
                html = '<div class="contextmenu alert alert-info fade in"> <a href="#" class="close" aria-label="close"> &times; </a> <div class="content">';
                var hasRequest = false; 
                var hasBunkerPlan = false; 
                $.each(object, function (k, value) {
                    html += '<span> <a class="contextAction" data-index="' + k + '">';
                    if (value.voyageDetail.request == null || value.voyageDetail.request.id == 0) {
                        html += '<span> Create Pre-request (' + value.voyageDetail.locationCode + ') </span>';
                    } else {
                        html += '<span> Edit request (' + value.voyageDetail.locationCode + ') - ' + value.voyageDetail.request.requestName + ' </span> ';
                        // hasRequest = true;
                    }

                    if (value.voyageDetail.bunkerPlan) {
                        hasBunkerPlan = true;
                    }

                    html += '</a> <br/> </span>';

                    if ((value.voyageDetail.request == null || value.voyageDetail.request.id == 0) && moment.utc(value.voyageDetail.eta) >= moment()) {
                        html += '<span> <a class="contextActionContractPlanning" data-index="' + k + '">';
                        html += '<span> Add to Contract Planning (' + value.voyageDetail.locationCode + ') </span>';
                        html += '</a> <br/> </span>';
                    } 

                    if (k < object.length - 1) {
                        html +=  '</br>';
                    }
                });
                html += '</div> </div>';
                var rightClickPopoverData = {
                    'object': _.map(object, 'voyageDetail'),
                    'vsVal': _.map(object, 'voyageDetail')[0]
                };
                try {
                    rightClickPopoverData.vsVal.style = ctrl.bunkerDetails[voyageDetailId][0].voyage.style;
                } catch (TypeError) {
                    rightClickPopoverData.vsVal.style = '';
                }
                if (!hasRequest && hasBunkerPlan) { 
                    groupedByVoyageDetailId = {};
                    groupedByVoyageDetailIdVoyageStops = {};
                    $.each(object, function(k,v){
                        if (typeof(groupedByVoyageDetailId[v.voyageDetail.id]) == 'undefined') {
                            groupedByVoyageDetailId[v.voyageDetail.id] = [];
                        }
                        var item = angular.copy(ctrl.bunkerDetails[v.voyageDetail.id]);
                        if (typeof(item) == 'undefined') {
                            item = v.voyageDetail;
                        }
                        groupedByVoyageDetailId[v.voyageDetail.id] = item;
                        _.uniqBy(groupedByVoyageDetailId[v.voyageDetail.id], 'id');
                        if ((v.voyageDetail.request == null || v.voyageDetail.request.id == 0) && moment.utc(v.voyageDetail.eta) >= moment()) {
                            groupedByVoyageDetailIdVoyageStops[v.voyageDetail.id] = v.voyageDetail; 
                        }
                    });
                    rightClickPopoverData.bunkerPlansGroupedByVoaygeDetailId = groupedByVoyageDetailId;
                    rightClickPopoverData.groupedByVoyageDetailIdVoyageStops = groupedByVoyageDetailIdVoyageStops;
                    $scope.rightClickPopoverData = rightClickPopoverData;
                } else {
                    $scope.rightClickPopoverData = null;
                }
                $scope.$apply();
                if (!hasBunkerPlan) {
                    $('schedule-dashboard-timeline').append(html);
                    $compile($('schedule-dashboard-timeline > .contextmenu'))($scope);
                }
                if (window.innerWidth / 2 > $(currentElem).offset().left) {
                    $('.contextmenu').css("left", $(currentElem).offset().left);
                } else {
                    $('.contextmenu').css("right", window.innerWidth - $(currentElem).offset().left - 45);
                }
                $('.contextmenu').css("top", $(currentElem).offset().top - 15);
                $('.contextmenu').removeClass("hidden");
                $('.contextAction').click(function () {
                    index = $(this).attr('data-index');
                    contextAction(object[index]);
                    removePopups();
                });
                $('.contextActionContractPlanning').click(function () {
                    index = $(this).attr('data-index');
                    contextActionContractPlanning(object[index]);
                    removePopups();
                });
                $('.contextmenu .close').click(function (e) {
                    e.preventDefault();
                    $(this).hide();
                    removePopups();
                    // $("schedule-dashboard-timeline > .contextmenu").remove();
                });

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
                            voyageId: voyageStop.voyageDetail.id
                        }, {
                                absolute: false
                            });
                    }
                    $('.contextmenu a.close').click();
                    window.open(href, '_blank');
                };
                function contextActionContractPlanning(voyageStop) {
                    $rootScope.scheduleDashboardVesselVoyages = [voyageStop];
                    localStorage.setItem('scheduleDashboardVesselVoyages', JSON.stringify($rootScope.scheduleDashboardVesselVoyages));
                    $('.contextmenu a.close').click();
                    window.open("/#/contract-planning/", "_blank");
                };
            }

        });

        function removePopups() {
            $("schedule-dashboard-timeline > .morePortsPopup").remove();
            $("schedule-dashboard-timeline > .contextmenu").remove();
        }

        $scope.formatDateToMomentFormat = function( dateFormat ){
            dbFormat = dateFormat;
            hasDayOfWeek = false;
            currentFormat = angular.copy(dateFormat);
            if (currentFormat.startsWith("DDD ")) {
                hasDayOfWeek = true;
                currentFormat = currentFormat.split("DDD ")[1];
            }           
            currentFormat = currentFormat.replace(/d/g, "D");
            currentFormat = currentFormat.replace(/y/g, "Y");
            if (hasDayOfWeek) {
                currentFormat = "ddd " + currentFormat;
            }
            return currentFormat;
        };
        $scope.dateFormat = $scope.formatDateToMomentFormat($scope.tenantSettings.tenantFormats.dateFormat.name);

        /*build hover popover*/
        $(document).on("mouseover", "span[voyage-detail-id]", function(){
            voyageDetailId = $(this).attr("voyage-detail-id");
            if (voyageDetailId) {
                html = buildHoverPopoverMarkup(voyageDetailId);
                $(this).attr("data-content", html);
                $(this).popover({
                    container: 'body',
                    trigger: 'hover',
                    placement: 'auto bottom',
                    html: true,
                    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body timeline-popover-hover">'+html+'</div></div>'
                }).
                on('show.bs.popover', function (event) {
                });
                $(this).popover('toggle');
            }
        });

        var buildHoverPopoverMarkup = function(voyageDetailId) {
            var hasRequest = false;
            voyageStop = _.filter(ctrl.voyageData, function(el){
                return el.voyageDetail.id == voyageDetailId;
            }); 
            voyageStop = _.uniqBy(voyageStop, 'voyageDetail.request.requestDetail.Id')

            html = "";
            html += '<table class="table table-striped table-hover table-bordered table-condensed"> <thead> <th>Request ID</th> <th>Vessel</th> <th>Port</th> <th>Product</th> <th>UOM</th> <th>Min. Quantity</th> <th>Max. Quantity</th> <th>Agreement Type</th> <th>Product Status</th> </thead> <tbody>';
            $.each(voyageStop, function(k,v){
                var voyage = v.voyageDetail;
                if (voyage.request && voyage.request.id != 0) {
                    hasRequest = true;
                    row_requestName = voyage.request.requestName || '-';
                    row_vesselName = voyage.request.vesselName || '-';
                    row_location = voyage.request.requestDetail.location || '-';
                    row_fuelOilOfRequest = voyage.request.requestDetail.fuelOilOfRequest || '-';
                    row_uom = voyage.request.requestDetail.uom || '-';
                    row_fuelMinQuantity = $filter('number')(voyage.request.requestDetail.fuelMinQuantity, $scope.numberPrecision.amountPrecision) || '-';
                    row_fuelMaxQuantity = $filter('number')(voyage.request.requestDetail.fuelMaxQuantity, $scope.numberPrecision.amountPrecision) || '-';
                    row_agreementType = voyage.request.requestDetail.agreementType || '-';
                    row_statusCode = voyage.request.requestDetail.statusCode || '-';
                    if (voyage.request.requestDetail.fuelOilOfRequest) {
                        html += '<tr><td>' + row_requestName + '</td> <td>' + row_vesselName + '</td> <td >' + row_location + '</td> <td>' + row_fuelOilOfRequest + '</td> <td>' + row_uom + '</td> <td>' + row_fuelMinQuantity + '</td> <td>' + row_fuelMaxQuantity + '</td> <td>' + row_agreementType + '</td> <td>' + row_statusCode + '</td></tr>';
                    }
                }
            });
            html += '</tbody> </table>';
            if (voyageStop.length == 0 || !hasRequest) {
                html = "";
            } else {
                preHtml = "<p><b>";
                preHtml += voyageStop[0].voyageDetail.request.requestDetail.location + " - ";
                preHtml += " ETA : " + moment(voyageStop[0].voyageDetail.eta).format($scope.dateFormat) + " - ";
                if (voyageStop[0].voyageDetail.etd) {
                    preHtml += " ETD : " + moment(voyageStop[0].voyageDetail.etd).format($scope.dateFormat) + " - ";
                }
                if (voyageStop[0].voyageDetail.deliveryFrom && voyageStop[0].voyageDetail.deliveryTo) {
                    preHtml += " Delivery Window : " + moment(voyageStop[0].voyageDetail.deliveryFrom).format($scope.dateFormat) + " - " + moment(voyageStop[0].voyageDetail.deliveryTo).format($scope.dateFormat);
                }               
                preHtml += "</b></p>";
                html = preHtml + html;              
            }
            return html;
        };

    }
]);
angular.module('shiptech.pages').component('scheduleDashboardTimeline', {
    templateUrl: 'pages/schedule-dashboard-timeline/views/schedule-dashboard-timeline.html',
    controller: "ScheduleTimelineController"
});


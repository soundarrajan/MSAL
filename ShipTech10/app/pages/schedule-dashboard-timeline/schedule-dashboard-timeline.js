angular.module("shiptech.pages").controller("ScheduleTimelineController", ["$scope", "$rootScope", "$listsCache",  "scheduleDashboardTimelineModel", "statusColors", "$filter",   "filterConfigurationModel", 'tenantService', '$tenantSettings', 'CUSTOM_EVENTS', '$filtersData', '$compile', '$templateCache', '$state', '$timeout', 'STATE',
    function ($scope, $rootScope, $listsCache, scheduleDashboardTimelineModel,  statusColors, $filter, filterConfigurationModel, tenantService, $tenantSettings, CUSTOM_EVENTS, $filtersData, $compile, $templateCache, $state, $timeout, STATE) {

        var ctrl = this;
        $scope.numberPrecision = $tenantSettings.defaultValues;
        $scope.tenantSettings = $tenantSettings;
        ctrl.bunkerDetails = [];
        
        ctrl.startDate = null;
        ctrl.endDate = null;

        var DEBUG = false;
        var minDate = null;
        var maxDate = null;
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

        var groups = [];
        var timeline = null;
        var groupsIndex = 1;

        var searchTextFilters = null;
        var pagination = null;
        ctrl.vesselWithPbBucket = [];
        //var filtersDefault = null;

        $scope.searchTimeline = function(searchText) {
            searchTextFilters = searchText;
            scheduleDashboardTimelineModel.get(ctrl.startDate, ctrl.endDate, $scope.filtersAppliedPayload, {}, searchText).then(function (response) {
                if (timeline) {
                    updateTimeline(response);
                    $scope.getTimelineStatus();
                } else {
                    buildTimeline(response);
                }
            });
        };

        var createStyle = function(colorCode) {
        	if (!colorCode) {
        		return null;
        	}
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

                                var statusIsAlreadyAdded = false;

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
            var startComputeData = Date.now();
        	console.log(Date.now());
            var vessels = JSON.parse('{ "vessels": [' + data.payload.scheduleDashboardView + "]}").vessels;
            var bunkerPlans = JSON.parse('{ "bunkerPlans": [' + data.payload.bunkerPlans + "]}").bunkerPlans;
        	console.log(Date.now());
            var vesselDetails = data.payload.vesselDetails;
            ctrl.voyageData = angular.copy(vessels);
            // vessels = _.orderBy(vessels, "voyageDetail.eta");
            var groupVoyageId = _.groupBy(vessels, "voyageDetail.id");
            var arrayHighestPriority = [];
            $.each(groupVoyageId, function(k, v) {
                var highestPriority = _.maxBy(v, "voyageDetail.portStatusPriority");
                if (highestPriority) {
	                arrayHighestPriority[v[0].voyageDetail.id] = highestPriority
                    // arrayHighestPriority.push(highestPriority);
                }
            })

            if (data.payload.bunkerPlans) {
	            ctrl.bunkerPlansGroupedByVoyage = _.groupBy(bunkerPlans, "voyageDetailId");
            } else {
            	ctrl.bunkerPlansGroupedByVoyage = [];
            }

            var displayScheduleBasedOn = _.get(ctrl, 'scheduleDashboardConfiguration.displayScheduleBasedOn.name');

            var arrayWithIndex = [];
            var findElementInInterval = [];

            vessels = _.orderBy(vessels, function(obj){
	            if (displayScheduleBasedOn === 'Delivery Date') {
	            	return obj.voyageDetail.deliveryFrom;
	            } else {
	            	return obj.voyageDetail.eta;
	            }
            }, 'asc');
            $scope.stopsGroupedByDayAndGroup = _.uniqBy(vessels, "voyageDetail.id");
            $scope.stopsGroupedByDayAndGroup = _.groupBy($scope.stopsGroupedByDayAndGroup, function(obj, key){
            	if (obj != null) {
                    var objGroupString = obj.ServiceName + ' <> ' + obj.BuyerName + ' <> ' +  obj.VesselName + ' <> ' + obj.CompanyName;
                    if (displayScheduleBasedOn === 'Delivery Date' && obj.voyageDetail.deliveryFrom) {
                        return obj.voyageDetail.deliveryFrom.split("T")[0] + ' <> ' + objGroupString;  
                    } else {
                        return obj.voyageDetail.eta.split("T")[0] + ' <> ' + objGroupString;
                    }
                }

            });

            var voyageDaysWithSludge = [];
            var vesselWithHasUsdRestrictions = [];
            ctrl.vesselWithPbBucket = [];
			$.each(vessels, function(k,detail){
				if (detail) {
                    var hasUsdRestrictions = false;
                    var hasOpsValidation =  true;
                    var hasSellerConfirmationDocument = true; 
                    var noSchedule = false;
					var hasSludge = false;
					var voyageDetailId = detail.voyageDetail.id;
					if (detail.voyageDetail.request.requestDetail.isSludgeProduct) {
						hasSludge = true;
					}
					if (typeof(voyageDaysWithSludge[voyageDetailId]) == "undefined" || !voyageDaysWithSludge[voyageDetailId]) {
						voyageDaysWithSludge[voyageDetailId] = hasSludge;		
					}

                    if (detail.voyageDetail.hasUsdRestrictions && !detail.voyageDetail.isDeleted) {
                        var today =  moment.utc(new Date()).startOf('day').format('YYYY-MM-DD HH:mm');
                        if (detail.voyageDetail.eta >= today) {
                            hasUsdRestrictions = true;
                        }
                    }

                    if (detail.voyageDetail.request.hasOpsValidation == false) 
                    {
                        hasOpsValidation = false;
                    }

                    if (detail.voyageDetail.request.requestDetail.hasSellerConfirmationDocument == false) {
                        hasSellerConfirmationDocument = false;
                    }
                    if (detail.voyageDetail.isDeleted) {
                        noSchedule = true;
                    }

                    if (typeof(vesselWithHasUsdRestrictions[detail.VesselId]) == "undefined" || !vesselWithHasUsdRestrictions[detail.VesselId]) {
                        vesselWithHasUsdRestrictions[detail.VesselId] = hasUsdRestrictions;       
                    }


                    if (typeof(ctrl.vesselWithPbBucket[detail.VesselId]) == "undefined" || !ctrl.vesselWithPbBucket[detail.VesselId])  {
                        if (!hasOpsValidation  || !hasSellerConfirmationDocument || noSchedule) {
                            ctrl.vesselWithPbBucket[detail.VesselId] = true;
                        }

                    }
				}
			})

            console.log(vesselWithHasUsdRestrictions);
            console.log(ctrl.vesselWithPbBucket);

            if (!$scope.stopsGroupedByDayAndGroup["undefined"]) {
                $.each($scope.stopsGroupedByDayAndGroup, function(k, v) {
                    var minVoyageEta =  _.minBy(v, function(item) {
                            if (typeof (item.voyageDetail) != "undefined") {
                                var timestamp = moment(item.voyageDetail.eta).format('X');
                                return timestamp;
                            }
                    });
                    var index = _.indexOf(v, minVoyageEta);
                    v[index] = v[0];
                    v[0] = minVoyageEta;
                });

            }



            var groups = [];
            var voyages = [];
            var groupStrings = [];
            var numberVessels = vessels.length;
            var performanceLog = [];
            for (var i = 0; i < vessels.length; i++) {
            	if (i%10 == 0) {
	            	performanceLog.push(Date.now() - startComputeData )
            	}
                if (!vessels[i]) {
                    continue;
                }

                if (typeof (ctrl.bunkerDetails[vessels[i].voyageDetail.id]) == "undefined") { ctrl.bunkerDetails[vessels[i].voyageDetail.id] = [] }
                ctrl.bunkerDetails[vessels[i].voyageDetail.id].push(angular.copy(vessels[i].voyageDetail.bunkerPlan));
                // Create voyage object
                var statusColor = statusColors.getColorCodeFromLabels(vessels[i].voyageDetail.portStatus, $listsCache.ScheduleDashboardLabelConfiguration); 

                var findHighestPriority = arrayHighestPriority[vessels[i].voyageDetail.id];
                if (findHighestPriority) {
                    statusColor = statusColors.getColorCodeFromLabels(findHighestPriority.voyageDetail.portStatus, $listsCache.ScheduleDashboardLabelConfiguration); 
                } 

                if (findHighestPriority) {
					var statusObj = findHighestPriority.voyageDetail.portStatus;
                } else {
					var statusObj = vessels[i].voyageDetail.portStatus;
                } 
				$.each(window.scheduleDashboardConfiguration.payload.labels, function(sk,sv){
					if (sv.status.id == statusObj.id && sv.transactionType.id == statusObj.transactionTypeId && !sv.displayInDashboard ) {
						statusColor = '#ffffff';
					}
				})                
                var voyageContent = '';
                var voyageContentDotted = '';
                var initialEtaDotted = '';

                var cls = "vis-voyage-content";
                var clsDotted ="vis-voyage-dotted";

				vessels[i].voyageDetail.hasStrategy = false;
                if (ctrl.bunkerPlansGroupedByVoyage[vessels[i].voyageDetail.id]) {
	                if (ctrl.bunkerPlansGroupedByVoyage[vessels[i].voyageDetail.id].length > 0) {
						vessels[i].voyageDetail.hasStrategy  = ctrl.bunkerPlansGroupedByVoyage[vessels[i].voyageDetail.id][0].hasStrategy;
	                }
                }

        

                if (vessels[i].voyageDetail.hasStrategy) {
                    cls += " vis-voyage-content-sap";
                }

                if (vessels[i].voyageDetail.request.requestDetail.isSludgeProduct || voyageDaysWithSludge[vessels[i].voyageDetail.id]) {
                    cls += " vis-voyage-sludge-product";
                }
                // if (!vessels[i].voyageDetail.portStatus.id) {
                //     cls += " no-request";
                // }
                if (vessels[i].voyageDetail.originalEta) {
                    initialEtaDotted =  vessels[i].voyageDetail.originalEta;
                    //voyageContent += '<span class="' + clsDotted + '" oncontextmenu="return false;" voyage-detail-id="' + vessels[i].voyageDetail.id + '"  style="background-color: blue"> ' + originalEtaDotted + ' </span>';

                }
                if (initialEtaDotted != '') {
                    voyageContentDotted = '<span class="'+ clsDotted + '"> </span>';
                } 


                var startDate, endDate;

                var displayScheduleBasedOn = _.get(ctrl, 'scheduleDashboardConfiguration.displayScheduleBasedOn.name');
              
                if (displayScheduleBasedOn === 'Delivery Date') {
                    if (vessels[i].voyageDetail.deliveryFrom && vessels[i].voyageDetail.deliveryTo) {
                        startDate = moment.utc(vessels[i].voyageDetail.deliveryFrom).format('YYYY-MM-DD HH:mm');
                        endDate = moment.utc(vessels[i].voyageDetail.deliveryTo).format('YYYY-MM-DD HH:mm');
                    } else {
                        startDate = moment.utc(vessels[i].voyageDetail.eta).format('YYYY-MM-DD HH:mm');
                        if (vessels[i].voyageDetail.etd) {
                            endDate = moment.utc(vessels[i].voyageDetail.etd).format('YYYY-MM-DD HH:mm');
                        } else {
                            endDate = moment.utc(vessels[i].voyageDetail.eta).endOf('day').format('YYYY-MM-DD HH:mm');
                        }
                    }
                } else  {
                    startDate = moment.utc(vessels[i].voyageDetail.eta).format('YYYY-MM-DD HH:mm');
                    if (vessels[i].voyageDetail.etd) {
                        endDate = moment.utc(vessels[i].voyageDetail.etd).format('YYYY-MM-DD HH:mm');
                    } else {
                        endDate = moment.utc(vessels[i].voyageDetail.eta).endOf('day').format('YYYY-MM-DD HH:mm');
                    }
                }

                var startEndDiff = moment(endDate) - moment(startDate);
                if (startEndDiff < 86400000) {
                    endDate = moment.utc(startDate).add('hours', 24).format('YYYY-MM-DD HH:mm');
                }
                if (initialEtaDotted != '') {
                    var updatedEta = moment.utc(vessels[i].voyageDetail.eta).format('YYYY-MM-DD HH:mm');
                    var etd = moment.utc(vessels[i].voyageDetail.etd).format('YYYY-MM-DD HH:mm');
                    initialEtaDotted = moment.utc(initialEtaDotted).format('YYYY-MM-DD HH:mm');
                    var updatedEtaInitialEtaDiff = moment(updatedEta) - moment(initialEtaDotted);
                    var etdIntialEtaDiff = moment(etd) - moment(initialEtaDotted);
                    var displayDottedLine = true;
                    if (updatedEtaInitialEtaDiff < 0) {
                        displayDottedLine = false;
                    }
                }
                // Create unique group string to be used to find the group
                var groupString = vessels[i].ServiceName + ' <> ' + vessels[i].BuyerName + ' <> ' +  vessels[i].VesselName + ' <> ' + vessels[i].CompanyName;
               
                var uniqueCellIdentifier = startDate.split(" ")[0] + ' <> ' +  groupString;
                voyageContent += '<span class="' + cls + '" cell-identifier="'+uniqueCellIdentifier+'" oncontextmenu="return false;" voyage-detail-id="' + vessels[i].voyageDetail.id + '"> ' + vessels[i].voyageDetail.locationCode;
                voyageContent += ' </span>';

                var voyage = {
                    id: i,
                    voyageId: vessels[i].voyageDetail.id,
                    locationCode: vessels[i].voyageDetail.locationCode,
                    content: voyageContent,
                    start: startDate,
                    end: endDate,
                    style: 'z-index:'+ i + '; background-color: ' + statusColor +"; color:" + getContrastYIQ(statusColor) + ( !vessels[i].voyageDetail.portStatus.id ? "; " : " "  ),
                    isDeleted: vessels[i].voyageDetail.isDeleted
                };
                

                if (initialEtaDotted != '' && displayDottedLine == true) {
                    var voyage1 = {
                        id: numberVessels,
                        content: voyageContentDotted,
                        start: initialEtaDotted,
                        end: startDate,
                        className: 'earliestEtaDashed',
                        style: 'border-width: 1.8px; border-style: dashed; pointer-events:none; border-right-style: none; box-shadow: none; border-color: #97b0f8; '
                    };
                    numberVessels += 1;
                }
                if (ctrl.bunkerDetails.length > 0 && ctrl.bunkerDetails[vessels[i].voyageDetail.id].length > 0) {
                    if (ctrl.bunkerDetails[vessels[i].voyageDetail.id][0]) {
                        ctrl.bunkerDetails[vessels[i].voyageDetail.id][0].voyage = voyage;
                    }
                }


                var groupId = 0;

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
                        vesselId: vessels[i].VesselId,
                        portCode: vessels[i].VesselId,
                        serviceName: vessels[i].ServiceName,
                        buyerName: vessels[i].BuyerName,
                        serviceBuyerName: vessels[i].ServiceBuyerName,
                        vesselName: vessels[i].VesselName,
                        companyName: vessels[i].CompanyName,
                        defaultFuel: vessels[i].DefaultFuel,
                        defaultDistillate: vessels[i].DefaultDistillate,
                        // contentTemplate: 
                        content: groupString,
                        isNew: false,
                        hasUsdRestrictions: vesselWithHasUsdRestrictions[vessels[i].VesselId],
                        hasPbBucket: ctrl.vesselWithPbBucket[vessels[i].VesselId],
                        isDeleted: vessels[i].voyageDetail.isDeleted

                    };

                    // Add group to groups
                    groups.push(group);

                    // Set groupId
                    groupId = group.id;
                }

                // Set group id
                voyage.group = groupId;

                // Add voyage
                var hasMultipleStops = false;
                // $scope.stopsGroupedByDayAndGroup[startDate.split(" ")[0] + ' <> ' +  groupString]
                var objStart;
                var firstStopToday = _.find($scope.stopsGroupedByDayAndGroup[startDate.split(" ")[0] + ' <> ' +  groupString], function(obj){
					if (displayScheduleBasedOn === 'Delivery Date'){
						objStart = obj.voyageDetail.deliveryFrom
					} else {
						objStart = obj.voyageDetail.eta
					}
                    return obj.voyageDetail.id != voyage.voyageId;
                });
                var isExtraStop = false;
                if ($scope.stopsGroupedByDayAndGroup[startDate.split(" ")[0] + ' <> ' +  groupString]) {
	                if ($scope.stopsGroupedByDayAndGroup[startDate.split(" ")[0] + ' <> ' +  groupString].length > 1) {
	                	uniqueCellIdentifier = startDate.split(" ")[0] + ' <> ' +  groupString;
                        if (voyageDaysWithSludge[voyage.voyageId]) {
                            var idFirstStop = $scope.stopsGroupedByDayAndGroup[startDate.split(" ")[0] + ' <> ' +  groupString][0].voyageDetail.id;
                            var poz = _.findIndex(voyages, function(obj) {
                                return obj.voyageId == idFirstStop;
                                   
                            });
                            if (poz != -1) {
                                var cls1 = cls;
                                var contentChange = voyages[poz].content.split("cell-identifier");
                                voyages[poz].content= '<span class="' + cls1 + '" cell-identifier' + contentChange[1] + '" cell-identifier' + contentChange[2];

                            }
                
                        }
	                	if ($scope.stopsGroupedByDayAndGroup[startDate.split(" ")[0] + ' <> ' +  groupString][0].voyageDetail.id == voyage.voyageId) {
			                voyage.content += '<span class="expand-voyages" cell-identifier="'+uniqueCellIdentifier+'" group="'+voyage.group+'"  eta="'+voyage.start+'">+</span>';
			                voyage.additionalStops = $scope.stopsGroupedByDayAndGroup[startDate.split(" ")[0] + ' <> ' +  groupString];
		                } else {
			                isExtraStop = true;
		                }
	                } 
                }
                // if (firstStopToday) {
	               //  if (!firstStopToday.hasMultipleStops) {
		              //   firstStopToday.content += '<span class="expand-voyages" group="'+voyage.group+'"  eta="'+voyage.start+'">+</span>'
	               //  }
                // 	hasMultipleStops = true;
	               //  firstStopToday.hasMultipleStops = true;
	               //  if (!firstStopToday.additionalStops) {
	               //  	firstStopToday.additionalStops = [];
	               //  }
                // }               
                // if (firstStopToday && firstStopToday.hasMultipleStops) {
	               //  if (!_.find(firstStopToday.additionalStops, {'voyageId' : voyage.voyageId})) {
		              //   firstStopToday.additionalStops.push(voyage);
	               //  }
                // }               

                if (!_.find(voyages, {'voyageId' : vessels[i].voyageDetail.id}) && !isExtraStop) {
	                voyages.push(voyage);
                }
                 if (initialEtaDotted != '' && displayDottedLine == true) {
                    voyage1.group = groupId;
                    voyages.push(voyage1);
                }
               
            }
            console.log("***");
            console.log(vessels.length);
            console.log(performanceLog);
            console.log("***");

            $.each(groups, function(k,v){
            	var currentGroupRedelivery = _.find(vesselDetails, {"id":v.vesselId});
            	if (currentGroupRedelivery) {
            		var earliestRedelivery = currentGroupRedelivery.earliestRedelivery;
            		var latestRedelivery = currentGroupRedelivery.latestRedelivery;
            		if (moment.utc(currentGroupRedelivery.earliestRedelivery) < ctrl.startDate) {
            			// earliestRedelivery = moment.utc(ctrl.startDate).startOf('day');
            		}            		
            		if (moment.utc(currentGroupRedelivery.latestRedelivery) < ctrl.endDate) {
            			// latestRedelivery = moment.utc(ctrl.endDate).endOf('day');
            		}
	            	if (currentGroupRedelivery.earliestRedelivery && currentGroupRedelivery.latestRedelivery && currentGroupRedelivery.estimatedRedelivery) {
		                var redeliveryPeriod = {
		                    group: v.id,
		                    isRedelivery: true,
		                    start:  moment.utc(earliestRedelivery).format('YYYY-MM-DD HH:mm'),
		                    end:  moment.utc(currentGroupRedelivery.latestRedelivery).format('YYYY-MM-DD HH:mm'),
		                    style: 'background-color: none; border:2px solid red; pointer-events:none; z-index:9999',
		                    className: 'redeliveryPeriod'
		                };
		                var estimatedRedeliveryStart = moment.utc(currentGroupRedelivery.estimatedRedelivery).format('YYYY-MM-DD') + " 12:00";
		                var estimatedRedeliveryEnd = moment.utc(currentGroupRedelivery.estimatedRedelivery).format('YYYY-MM-DD') + " 12:00";
		                if (currentGroupRedelivery.estimatedRedelivery == earliestRedelivery || currentGroupRedelivery.estimatedRedelivery == latestRedelivery) {
		                	estimatedRedeliveryStart = moment.utc(currentGroupRedelivery.estimatedRedelivery).format('YYYY-MM-DD') + " 00:00";
		                	estimatedRedeliveryEnd = moment.utc(currentGroupRedelivery.estimatedRedelivery).format('YYYY-MM-DD') + " 00:00:01";
		                }
		                var estimatedRedelivery = {
		                    group: v.id,
		                    isRedelivery: true,
		                    start:  estimatedRedeliveryStart,
		                    end:  estimatedRedeliveryEnd,
		                    style: 'background-color: none; border:1px solid #b70000; pointer-events:none; z-index:51',
		                    className: 'estimatedRedeliveryDot'
		                };  
		                voyages.push(redeliveryPeriod);            
		                voyages.push(estimatedRedelivery);              	
	            	}
                    var isNew = currentGroupRedelivery.isNew;
                    v.isNew = isNew;
                    
            	}
                
            })
            ctrl.vessels = vessels;
            ctrl.voyages = voyages;
            return {
                'groups': groups,
                'voyages': voyages
            };
        };

        var getTimelineOptions = function() {
            var computedEndDate, computedStartDate;
        	if (ctrl.scheduleDashboardConfiguration.startsBefore >= 15) {
	        	computedStartDate = moment.utc().subtract(15, "days").format("YYYY-MM-DD");
	        	computedEndDate = angular.copy(moment.utc(computedStartDate).add(25,"days").format("YYYY-MM-DD"));
        		// if ( (ctrl.scheduleDashboardConfiguration.startsBefore + ctrl.scheduleDashboardConfiguration.endsAfter) % 2 == 1) {
		        // 	computedEndDate = angular.copy(moment.utc(ctrl.startDate).add(25,"days").format("YYYY-MM-DD"));
        		// } else {
		        // 	computedEndDate = angular.copy(moment.utc(ctrl.endDate).format("YYYY-MM-DD"));
        		// }
        	} else {
	        	computedStartDate = angular.copy(moment.utc(ctrl.startDate).format("YYYY-MM-DD"));
	        	computedEndDate = angular.copy(moment.utc(ctrl.startDate).add(25,"days").format("YYYY-MM-DD"));
        	}



            options =  {
                'verticalScroll': true,
                // 'moveable': false,
                // Disable red line
                'showCurrentTime': false,
                'margin': {'axis':0,'item':{'horizontal':0,'vertical':1}},
                'stack': false,
                'maxHeight': Math.max(570, $(window).height() - 167),
                'orientation': 'both',
                'start': ctrl.lastStartDate ? ctrl.lastStartDate : computedStartDate,
                'min': angular.copy(moment(ctrl.startDate).format("YYYY-MM-DD")),
                'end': ctrl.lastEndDate ? ctrl.lastEndDate : computedEndDate,
                'max': angular.copy(moment(moment(ctrl.endDate).format("YYYY-MM-DD")).endOf("day")),
                'zoomMin': 2.592e+8,
                'zoomMax': 2.16e+9,
                // 'preferZoom': true,
                'zoomKey': 'altKey', 
                groupTemplate: function (group) {
                    var serviceName = group.serviceName;
                    var vesselName = group.vesselName;
                    var buyerName = group.buyerName;
                    var companyName = group.companyName;
                    var serviceBuyerName = group.serviceBuyerName;
                    var isNew = group.isNew;
                    var hasUsdRestrictions = group.hasUsdRestrictions;
                    var hasPbBucket = group.hasPbBucket;
                    var colorVessel;
                    if (hasPbBucket && ctrl.scheduleDashboardConfiguration.displayPendingActions.name == "Yes") {
                        colorVessel = "orange";
                    }

                    var tpl = '<div class="vis-custom-group">';
                    if (isNew){
                        if (hasUsdRestrictions) {
                            tpl += `<span class="vis-custom-group-column vis-vessel"  oncontextmenu="return false;" vessel-detail-id="${group.vesselId}" tooltip title="${group.vesselName} : ${group.defaultFuel} : ${group.defaultDistillate}"><span class="newVessel"> N </span> <span tooltip title="Vessel Approaching USD restricted port" style="width: 10px">  <i  class="fa fa-ban usdRestrictionsFlag"></i> <i class="fa fa-dollar usdRestrictionsDollar" ></i> </span> <span class="vis-custom-group-column-content vesselName" style="color: ${colorVessel}"> ${vesselName} </span></span>`;
                        } else {
                            tpl += `<span class="vis-custom-group-column vis-vessel"  oncontextmenu="return false;" vessel-detail-id="${group.vesselId}" tooltip title="${group.vesselName} : ${group.defaultFuel} : ${group.defaultDistillate}"><span class="newVessel"> N </span> <span class="vis-custom-group-column-content vesselName" style="color: ${colorVessel}"> ${vesselName} </span></span>`;
                        }
                    } else {
                        if (hasUsdRestrictions) {
                            tpl += `<span class="vis-custom-group-column vis-vessel"   oncontextmenu="return false;" vessel-detail-id="${group.vesselId}" tooltip title="${group.vesselName} : ${group.defaultFuel} : ${group.defaultDistillate}"> <span tooltip title="Vessel Approaching USD restricted port" style="width: 10px">  <i  class="fa fa-ban usdRestrictionsFlag"></i> <i class="fa fa-dollar usdRestrictionsDollar" ></i> </span> <span class="vis-custom-group-column-content vesselName" style="color: ${colorVessel}"> ${vesselName} </span></span>`;
                        } else {
                            tpl += `<span class="vis-custom-group-column vis-vessel"   oncontextmenu="return false;" vessel-detail-id="${group.vesselId}" tooltip title="${group.vesselName} : ${group.defaultFuel} : ${group.defaultDistillate}"> <span class="vis-custom-group-column-content" style="color: ${colorVessel}"> ${vesselName} </span></span>`;

                        }
                    }
                    if ($scope.displayedColumns["Service"]) {
                    	tpl += `<span class="vis-custom-group-column vis-service" tooltip title="${group.serviceName}"> <span class="vis-custom-group-column-content">${serviceName} </span></span>`;
                    }
                    if ($scope.displayedColumns["Buyer of the Vessel"]) {
	                    tpl += `<span class="vis-custom-group-column vis-buyer-of-vessel" tooltip title="${group.buyerName}"> <span class="vis-custom-group-column-content"> ${buyerName} </span></span>`;
                    }
                    if ($scope.displayedColumns["Buyer of the Service"]) {
                        tpl += `<span class="vis-custom-group-column vis-buyer-of-service" tooltip title="${group.serviceBuyerName}" ><span class="vis-custom-group-column-content"> ${serviceBuyerName} </span></span>`;
                    }                    
                    if ($scope.displayedColumns["Company"]) {
                        tpl += `<span class="vis-custom-group-column last vis-company" tooltip title="${group.companyName}"> <span class="vis-custom-group-column-content"> ${companyName} </span></span>`;
                    }
                    tpl += '</div>';
                    return tpl;
                },
            };

            return options;
        }

        var buildTimeline = function(data) {
            var cls = "vis-voyage-content vis-voyage-content-sap";
            var voyagesArray = [];
            if (data.payload.scheduleDashboardView) {
                var timelineData = computeData(data);

                for (var i = 0; i < timelineData.voyages.length; i++) {
                    voyagesArray.push(timelineData.voyages[i]);
                    var hasStrategy = _.find(timelineData.voyages[i].additionalStops, function(obj) {
                                                return obj.voyageDetail.hasStrategy == true;
                                            });
                    if (hasStrategy) {
                        var contentChange = timelineData.voyages[i].content.split("cell-identifier");
                        var newContent = '<span class="' + cls + '" cell-identifier' + contentChange[1] + '" cell-identifier' + contentChange[2];
                        timelineData.voyages[i].content = newContent;
                        
                    }
                }

                var timelineVoyages = _.filter(timelineData.voyages, function(object) {
                    return !object.isDeleted;
                });
                
                var groups = new vis.DataSet(timelineData.groups);
                var voyages = new vis.DataSet(timelineVoyages);
                var startDateObject = { 'start': ctrl.startDate.format('YYYY-MM-DD'), 'end': ctrl.endDate.format('YYYY-MM-DD')};
                voyagesArray.push(startDateObject);
                var timestamp;
                minDate = _.minBy(voyagesArray, function(item) {
                    timestamp = moment(item.start).format('X');
                    if (!item.isRedelivery) {
                        return timestamp;
                    }
                });
                maxDate =  _.maxBy(voyagesArray, function(item) {
                    timestamp = moment(item.end).format('X');
                    if (!item.isRedelivery) {
                        return timestamp;
                    }
                });
                minDate.start = moment(minDate.start).startOf('day');
                maxDate.end = moment(maxDate.end).endOf('day');
                var container = document.getElementById('timeline');

                // Create a Timeline
                timeline = new vis.Timeline(container, null, getTimelineOptions());  
                window.mytimeline = timeline;
                timeline.setGroups(groups);
                timeline.setItems(voyages);


                ctrl.lastStartDate = false;
                ctrl.lastEndDate = false;
                timeline.on("rangechange", function(){

                	if ($(".vis-panel.vis-left.vis-vertical-scroll").length > 0) {
                		if ($(".vis-panel.vis-left.vis-vertical-scroll").height() - $(".vis-panel.vis-left.vis-vertical-scroll").height() <= 2) {
                			$(".vis-panel.vis-left.vis-vertical-scroll").removeClass("vis-vertical-scroll");
                		}
                	}

                    ctrl.lastStartDate = moment(timeline.range.start);
                    ctrl.lastEndDate = moment(timeline.range.end);
                    var diff = ctrl.lastEndDate -  ctrl.lastStartDate;
                    if (diff == 2.592e+9) {
                        $(".st-btn-icon-zoom-in a").css("color", "#555555");
                         $(".st-btn-icon-zoom-out a").css("color", "#C1C1C1");
                    } else if (diff == 2.592e+8) {
                        $(".st-btn-icon-zoom-in a").css("color", "#C1C1C1");
                        $(".st-btn-icon-zoom-out a").css("color", "#555555");
                    } else {
                        $(".st-btn-icon-zoom-in a").css("color", "#555555");
                        $(".st-btn-icon-zoom-out a").css("color", "#555555");
                    }
                });

                timeline.on("changed", function(){
            		isAtTimelineBottom = checkIfIsAtTimelineBottom();
            		if(isAtTimelineBottom) {
            			var scrollFixVal = $(".vis-vertical-scroll").scrollTop() - 1;
            			if (scrollFixVal > 0) {
	            			$(".vis-vertical-scroll").scrollTop(scrollFixVal) 
	            			console.log("xxxxxxxxxxx: " + scrollFixVal);
            			}
            			 $(window).scrollTop($(window).scrollTop()+120);
	                    // console.log("xxxxxxxxxx rangechange")
	                    // console.log($(".vis-vertical-scroll").scrollTop())
            			return false;
            		}                    
                });


                redrawOutOfRangeElements = function(){
                	setTimeout(function(){
						Object.keys(window.mytimeline.itemSet.items).forEach(function (item) {
							visibleGroups = window.mytimeline.getVisibleGroups();
							// console.log(item);
							if (visibleGroups.indexOf(window.mytimeline.itemSet.items[item].data.group.toString()) != -1) {
								if (window.mytimeline.itemSet.items[item].data.className == "redeliveryPeriod") {
									itemDataStart = moment(window.mytimeline.itemSet.items[item].data.start);
									itemDataEnd = moment(window.mytimeline.itemSet.items[item].data.end);
									currentWindowStart = moment(window.mytimeline.getWindow().start);
									currentWindowEnd = moment(window.mytimeline.getWindow().end);
									if (
										(itemDataStart.diff(currentWindowStart) >= 0  && currentWindowEnd.diff(itemDataStart) >= 0) ||
										(currentWindowStart.diff(itemDataStart) >= 0  && itemDataEnd.diff(currentWindowEnd) >= 0) 
										) {
											window.mytimeline.itemSet.items[item].show();
											window.mytimeline.itemSet.items[item].repositionX();
									}
								}
							}
						});
                	},300);
                }


                checkIfIsAtTimelineBottom = function() {
                	if(
                		$(".vis-vertical-scroll").scrollTop() + $(".vis-vertical-scroll").height() - $(".vis-vertical-scroll .vis-content").height() >= -2 ||
                		$(".vis-vertical-scroll .vis-content").height() - $(".vis-vertical-scroll").scrollTop() + $(".vis-vertical-scroll").height() <= 2 
            		) {
                		isAtTimelineBottom = true;
                	} else {
                		isAtTimelineBottom = false;
                	}    
                	return isAtTimelineBottom;            	
                }
      //       	$('.vis-foreground, #timeline *').bind('mousewheel', function(e){
      //       		isAtTimelineBottom = checkIfIsAtTimelineBottom();
      //       		if(e.originalEvent.wheelDelta < 0 && isAtTimelineBottom) {
      //       			$(".vis-vertical-scroll").scrollTop($(".vis-vertical-scroll").scrollTop() - 1) 
						// $(window).scrollTop($(window).scrollTop()+120);
      //       			return false;
      //       		}
      //       	});				   

                /*
                    Redraw long voyages that exceed the timeline width
                    Fixed performance issue when scrolling groups vertically
                */
                
                $(".vis-vertical-scroll").on("scroll", function(){
                    redrawOutOfRangeElements();
                    leftOffset = (parseFloat($(".vis-panel.vis-center").css("left")) - 28) + "px";
                    $(".vis-panel.vis-center").css("padding-left", leftOffset);
                    $(".vis-panel.vis-center").css("margin-left", "-" + leftOffset);
                    $(".vis-left").css("pointer-events", "none");
					window.lastScrollingTime = moment();
					// console.log("scrolling...")
					setTimeout(function(){
	                    var timeFromLastScroll = moment().diff( moment(window.lastScrollingTime) )
	                    if (timeFromLastScroll > 1000) {
							// console.log("STOPPED scrolling")
	                        $(".vis-left").css("pointer-events", "initial");
	                    }
					},1000)
                });

                $scope.timelineItems = groups.length;
                setLayoutAfterTimelineLoad();

        }

       

        // timeline.on('select', function (properties) {
        //      alert('selected items: ' + properties.nodes);
        // });
       
        $rootScope.clc_loaded = true;
        if (data.payload.scheduleDashboardView == null) {
            $("#timeline > .vis-timeline").css("display", "none"); 
            $(".vis-timeline-zoom-container").css("display", "none");
            $(".schedule-dashboard-timeline-footer").css("display","none");
            toastr.error("No Voyages available for the selected period");
            $("#timeline").append('<div class="noDataFound"> No Results Found</div>');
        } else {
            $(".schedule-dashboard-timeline-footer").css("display", "block");
            $(".vis-timeline-zoom-container").css("display", "block");
        }
        };

        var updateTimeline = function(data) {
            $('#timeline').html(''); 
            buildTimeline(data);

            /*
            var timelineData = computeData(data);
            var groups = new vis.DataSet(timelineData.groups);
            var voyages = new vis.DataSet(timelineData.voyages);

            if (!voyages || voyages.length === 0) {
                $('#timeline').hide();
                return;
            } else {
                $('#timeline').show();
            }

            timeline.setOptions(getTimelineOptions());
            timeline.setGroups(groups);
            timeline.setItems(voyages);
            // $scope.$digest();
            $timeout(function() {
                $scope.timelineItems = groups.length;
                setLayoutAfterTimelineLoad();
            })
            */
        };

        var setLayoutAfterTimelineLoad = function() {
            // Add group columns header
            $('#vis-custom-group-columns').remove();
            $('.vis-panel.vis-bottom').remove();
            timeline._setScrollTop(0);
            if ($('.vis-left').width() > 0) {
            	var groupColumnsTitleElement = '<div class="vis-custom-group" id="vis-custom-group-columns">';
                groupColumnsTitleElement += '<span class="vis-custom-group-column-header vis-vessel" timeline-order-column="vesselName"> Vessel </span>';
                if ($scope.displayedColumns["Service"]) {
	                groupColumnsTitleElement += '<span class="vis-custom-group-column-header vis-service" timeline-order-column="serviceName"> Service </span>';
                }
                if ($scope.displayedColumns["Buyer of the Vessel"]) {
                    groupColumnsTitleElement += '<span class="vis-custom-group-column-header vis-buyer-of-vessel" timeline-order-column="buyerName"> Buyer of the Vessel </span>';
                }
                if ($scope.displayedColumns["Buyer of the Service"]) {
                    groupColumnsTitleElement += '<span class="vis-custom-group-column-header vis-buyer-of-service" timeline-order-column="serviceBuyerName"> Buyer of the Service </span>';
                }                
                if ($scope.displayedColumns["Company"]) { 
                    if ($scope.tenantSettings.companyDisplayName.name == "Company") {
                        groupColumnsTitleElement += '<span class="vis-custom-group-column-header last vis-company" timeline-order-column="companyName"> Company </span></div>';
                    } else {
                        groupColumnsTitleElement += '<span class="vis-custom-group-column-header last vis-company" timeline-order-column="companyName"> Pool </span></div>';
                    }
                } 
                groupColumnsTitleElement += '</div>';

                $('.vis-timeline').first().prepend(groupColumnsTitleElement);
                $('#vis-custom-group-columns').height($('.vis-time-axis.vis-foreground').height());
                setTimeout(function() {
                    var elem = $('.vis-left.vis-vertical-scroll');
                    $('#vis-custom-group-columns').width($('.vis-left').width());
                    if (elem.length) {
                        $('#vis-custom-group-columns').css('padding-left', ($('.vis-left')[0].offsetWidth - $('.vis-left')[0].clientWidth) + 'px');
                    }
                });
            }
            applyCurrentSort();
            $scope.timelineLoaded = true;


        };

        applyCurrentSort = function() {
			if (window.timelineCurrentSort && window.timelineCurrentSortDirection) {
        		window.timelineGroupOrdering[window.timelineCurrentSort] = _.orderBy(window.mytimeline.groupsData._data._data, [window.timelineCurrentSort], ['asc']);
    			for (var i = window.timelineGroupOrdering[window.timelineCurrentSort].length - 1; i >= 0; i--) {
					Object.keys(window.mytimeline.groupsData._data._data).forEach(function(key) {

        				if (window.timelineGroupOrdering[window.timelineCurrentSort][i].id == window.mytimeline.groupsData._data._data[key].id) {
	        				window.mytimeline.groupsData._data._data[key]["sortIndex-" + window.timelineCurrentSort] = i;
        				}

					});        				
    			}
				$("span[timeline-order-column]").removeClass("asc").removeClass("desc");
				$('[timeline-order-column="'+window.timelineCurrentSort+'"]').addClass(window.timelineCurrentSortDirection);
				options = {
					"groupOrder" : function (a, b) {
						if (window.timelineCurrentSortDirection == 'asc') {
							return a["sortIndex-" + window.timelineCurrentSort] - b["sortIndex-" + window.timelineCurrentSort];
						} else {
							return b["sortIndex-" + window.timelineCurrentSort] - a["sortIndex-" + window.timelineCurrentSort];
						}
					}
				}
				window.mytimeline.setOptions(options);
                setTimeout(function() {
                	if ($(".vis-vertical-scroll").scrollTop() < 50) {
	                    timeline._setScrollTop(0);
                	}
                });				
			}
        }

        $scope.changeZoomLevel = function(direction) {
        	if (direction === 0) {
        		timeline.zoomOut(0.2);
        	}
        	if (direction === 1) {
        		timeline.zoomIn(0.2);
        	}
        }

        $scope.selectTimeFrame = function(direction) {
            var daysDifference = ctrl.scheduleDashboardConfiguration.traverseBy;

            if (direction === 'backwards') {
                ctrl.startDate = ctrl.startDate.subtract('days', daysDifference);
                ctrl.endDate = ctrl.endDate.subtract('days', daysDifference);
            }
            if (direction === 'forwards') {
                ctrl.startDate = ctrl.startDate.add('days', daysDifference);
                ctrl.endDate = ctrl.endDate.add('days', daysDifference);
            }

            var date = $scope.dateFormat.split(" ");
            var dateFormat = "";
            for (var i=0; i < date.length - 1; i++) {
                dateFormat += " " + date[i];
            }

            $scope.startDateDisplay = moment.unix(moment(ctrl.startDate).format('X')).format(dateFormat);
            $scope.endDateDisplay = moment.unix(moment(ctrl.endDate).format('X')).format(dateFormat);

            getData($scope.filtersAppliedPayload).then(function(response) {
                console.log(window.timelineCurrentSort);


                updateTimeline(response);
                window.selectFrame = true;
                $("span[timeline-order-column=" + window.timelineCurrentSort + "]").click();
                $timeout(function() {
                    $scope.getTimelineStatus();
                })
            });
        };

        async function getConfiguration() {
            return await new Promise(resolve => {
                tenantService.scheduleDashboardConfiguration.then(function (settings) {
                    var hasDayOfWeek;
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
                    ctrl.startDate = moment.utc().add('days', -ctrl.scheduleDashboardConfiguration.startsBefore);
                    ctrl.endDate = moment.utc().add('days', ctrl.scheduleDashboardConfiguration.endsAfter);
                    
                    var currentFormat = angular.copy($scope.dateFormat);
                    if (currentFormat.startsWith("ddd ")) {
	                    hasDayOfWeek = true
	                    currentFormat = currentFormat.split("ddd ")[1];
	                    currentFormat = "ddd " + currentFormat.split(" ")[0];
	                } else {
	                    currentFormat = currentFormat.split(" ")[0];
	                }

                    $scope.startDateDisplay = moment.utc(ctrl.startDate).format(currentFormat);
                    $scope.endDateDisplay =moment.utc(ctrl.endDate).format(currentFormat);
    
                    //DEBUG
                    // ctrl.startDate = moment().add('days', -60);
                    // ctrl.endDate = moment().add('days', 60);
                    resolve(ctrl.scheduleDashboardConfiguration);
                });
            });
        };

        async function getStatuses() {
            return await new Promise(resolve => {
                var statusList;
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

         async function getDefaultFiltersConfiguration(fromSave) {
            return await new Promise(resolve => { 
                if (localStorage.getItem("persistentGlobalFilters") || (!fromSave && $scope.defaultConfiguration)) {
                    return;
                }
                if ($rootScope.deleteTimelineConfiguration) {
                    $rootScope.deleteTimelineConfiguration = false;
                    resolve(null);
                    return;
                }

                $rootScope.isTimelineFiltersDefault = true;
                var data = "schedule-dashboard-calendar";
                $scope.defaultConfiguration = null;
                filterConfigurationModel
                    .getDefaultFiltersConfiguration(data)
                    .then(function(response) {
                        console.log("----");
                        console.log("Filters timeline");
                        $rootScope.isRefresh = true;
                        $scope.defaultConfiguration = response.payload;
                        if (!response.payload && !fromSave) {
                            $rootScope.$broadcast("filters-applied", []);
                        } 
                        if ($scope.defaultConfiguration != null) {
                            $rootScope.clearDefaultFilters = true;
                            $rootScope.$broadcast("applyDefaultConfiguration", $scope.defaultConfiguration, true);
                            $rootScope.savedDefaultFilters = $scope.defaultConfiguration.filters;
                            $scope.selectedConfig = $scope.defaultConfiguration;
                            $rootScope.isDefaultConfig = $scope.selectedConfig;
                            if ($state.current.name == "default.dashboard-timeline" || $state.current.name == "default.home") {
                                $rootScope.saveFiltersDefaultTimeline = $scope.defaultConfiguration.filtersList;
                            }
                            $rootScope.$broadcast("enableDisableDeleteLayout", $scope.selectedConfig);
                            //selected != default
                            //but if default exists, set as selected initially
                        } else {
                            // $scope.selectedConfig = {
                            //     id: 0
                            // };
                            $scope.noDefault = true;
                        }
                        resolve($rootScope.saveFiltersDefaultTimeline);

                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            });
        };




        async function getData(payload) {
            return await new Promise(resolve => {
                var isDefault = true;
                if (typeof $rootScope.saveFiltersDefaultTimeline != "undefined" && $rootScope.saveFiltersDefaultTimeline != null) {
                    if ($rootScope.saveFiltersDefaultTimeline.length != 0) {
                        payload = $rootScope.saveFiltersDefaultTimeline;
                    } else {
                        isDefault = false;
                    }
                } else {
                    isDefault = false;
                }
                scheduleDashboardTimelineModel.get(ctrl.startDate, ctrl.endDate, payload, {}, searchTextFilters).then(function (response) {
                    resolve(response);
                    if (typeof $rootScope.timelineSaved != "undefined" && $rootScope.timelineSaved != null && isDefault) {
                        $scope.getDefaultFilters($rootScope.timelineSaved, false);
                    }
                });  
            });
        }

        // Get data and initialize timeline
        async function doTimeline() {
            Promise.all([getStatuses(), getConfiguration(), getDefaultFiltersConfiguration()]).then(function(res) {
                getData().then(function(data) {
                    createFilters();
                    $rootScope.timelineStatusList = timelineStatusList;
                    buildTimeline(data);
                });
            });
        }
        doTimeline();

        var buildVisibleColumns = function() {
        	$scope.displayedColumns = {}; 
        	$.each(ctrl.scheduleDashboardConfiguration.hiddenFields, function(k,v) {
        		$scope.displayedColumns[v.option.name] = !v.hidden ;
        	})
        	console.log($scope.displayedColumns);
        }
        $scope.getDefaultFilters = function(payload, isBreadcrumbFilter) {
            $scope.filtersAppliedPayload = payload;

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
                if (payload.length !== 0) {
                    if (!$scope.appFilters) {
                        $scope.appFilters = [];
                    }
                    for (var i = 0; i < payload.length; i++) {
                        if (payload[i].ColumnValue !== 'VoyageDetail_PortStatus_DisplayName') {
                            $scope.appFilters.push(payload[i]);
                        }
                    }
                }
                return;
            } else {
                $scope.appFilters = payload;
            }
        }

        $scope.$on('filters-applied', function (event, payload, isBreadcrumbFilter) {


            if (!timeline) {
                return;
            }

            $scope.filtersAppliedPayload = payload;
            $rootScope.saveFiltersDefaultTimeline = [];

            getData(payload).then(function(response) {
                updateTimeline(response);
                $timeout(function() {
                    $scope.getTimelineStatus();
                })
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
                if (payload.length !== 0) {
                    if (!$scope.appFilters) {
                        $scope.appFilters = [];
                    }
                    for (var i = 0; i < payload.length; i++) {
                        if (payload[i].ColumnValue !== 'VoyageDetail_PortStatus_DisplayName') {
                            $scope.appFilters.push(payload[i]);
                        }
                    }
                }
                return;
            } else {
                $scope.appFilters = payload;
            }
        });

        $scope.$on(CUSTOM_EVENTS.BREADCRUMB_FILTER_STATUS, function (event, filter, no) {
            var filterPayload;
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
	        if ($(event.target).hasClass("vis-vessel")  || $(event.target).hasClass("vis-voyage-content") || $(event.target).parents('.vis-voyage-content').length || $(event.target).hasClass('screen-loader')) {
            	e.preventDefault();
            }
        });

        $(document).on("click", function(event) {
	        if ((!$(event.target).hasClass("contextmenu") && !$(event.target).parents('.contextmenu').length) || $(event.target).hasClass("close")) {
	        	$scope.rightClickPopoverData = null;
                $scope.rightClickVesselPopoverData = null;
	        	$scope.$digest();
	        }      
	        if ($(event.target).hasClass("expand-voyages")) {
	        	$timeout(function(){
		        	ctrl.additionalVoyages = null;
	        	},100)
	        	var currentGroup = $(event.target).attr("group");
	        	var currentEta = $(event.target).attr("eta");
	        	var currentCellIdentifier = $(event.target).attr("cell-identifier");
	        	var additionalVoyages = $scope.stopsGroupedByDayAndGroup[currentCellIdentifier];

	        	// $.each(ctrl.voyages, function(key,obj){
	        	// 	if (obj.additionalStops) {
	        	// 		$.each(obj.additionalStops, function(key2,obj2){
	        	// 			if (parseFloat(obj2.group) == parseFloat(currentGroup) && obj2.start == currentEta) {
	        	// 				additionalVoyages = obj.additionalStops;		
			       //  			additionalVoyages.push(obj);
	        	// 			}
	        	// 		})
	        	// 	}
	        	// })
	        	// additionalVoyages = _.uniqBy(additionalVoyages, "voyageId");
	        	additionalVoyages = _.orderBy(additionalVoyages, "voyageDetail.eta");
	        	$.each(additionalVoyages, function(k,v){
	        		v.voyageDetail.formattedEta = moment(v.voyageDetail.eta).format($scope.dateFormat)
	        	})
	        	$timeout(function(){
		        	ctrl.additionalVoyages = {
		        		data : additionalVoyages,
		        		offsetTop: event.clientY,
		        		offsetLeft: event.clientX
		        	}
	        	},200)
	        }
	        if ( !$(event.target).hasClass("contextmenu") && !$(event.target).parents('.contextmenu').length) {
	        	$(".contextmenu").remove();
	        }
	        if ( !$(event.target).hasClass("morePortsPopupTimeline ") && !$(event.target).parents('.morePortsPopupTimeline ').length) {
	        	$(".morePortsPopupTimeline ").remove();
	        }

        });

        $(document).on("mousedown", "span.vis-vessel", function(event){
            //event.preventDefault();
            $("#timeline").click();
            if (event.which == 3 && ctrl.scheduleDashboardConfiguration.displayPendingActions.name == "Yes") {
                console.log("RIGHT CLICK");
                var vesselId =  $(this).attr("vessel-detail-id");
                if (!ctrl.vesselWithPbBucket[vesselId]) {
                    return;
                }
                $(".contextmenu").css("display", "block");

                var voyageStop;
                voyageStop = _.filter(ctrl.voyageData, function(el){
                    return el.VesselId == parseFloat(vesselId) && (el.voyageDetail.request.hasOpsValidation == false || el.voyageDetail.request.requestDetail.hasSellerConfirmationDocument == false || el.voyageDetail.isDeleted);
                }); 
                console.log(voyageStop);           
                
                var currentElem = $(event.currentTarget);
                removePopups();
                var rightClickVesselPopoverData = {};
                $scope.rightClickVesselPopoverData = voyageStop;
                $scope.$apply();
                $compile($('schedule-dashboard-timeline > .contextmenu'))($scope);
                $('.contextmenu').css("opacity", "0");
                $timeout(function() {
                    $('.contextmenu').css("opacity", "1");
                    $('.contextmenu').css("left", "initial");
                    $('.contextmenu').css("right", "initial");
                    if (window.innerWidth / 2 > $(currentElem).offset().left) {
                        $('.contextmenu').css("left", $(currentElem).offset().left + 50);
                    } else {
                        $('.contextmenu').css("right", window.innerWidth - $(currentElem).offset().left - 45);
                    }
                    $('.contextmenu').css("top", $(currentElem).offset().top - 15);
                    $('.contextmenu').removeClass("hidden");

                    $('.contextmenu .close').click(function (e) {
                        e.preventDefault();
                        removePopups();
                    });
                });
            }
        });


        $(document).on("mousedown", "span[voyage-detail-id]", function(event){
            event.preventDefault();
            $("#timeline").click();
            if (event.which == 3) {
                var voyageDetailId = $(this).attr("voyage-detail-id");
                removePopups();
                $(".contextmenu").css("display", "block");
	            
	            var allStops = [parseFloat(voyageDetailId)];
	            $.each(ctrl.voyages, function(k,v){
	            	if (v.voyageId == voyageDetailId) {
	            		if (v.additionalStops) {
		            		$.each(v.additionalStops, function(k2,v2){
			            		allStops.push(v2.voyageDetail.id)
		            		})
	            		}
	            	}
	            })
	            var object = _.filter(ctrl.voyageData, function(el){
	                return el && allStops.indexOf(el.voyageDetail.id) != -1;
	            }); 


                // object = _.filter(ctrl.voyageData, function(el){
                //     return el.voyageDetail.id == voyageDetailId;
                // }); 
                // object = _.uniqBy(object, 'voyageDetail.request.id');

                removePopups();

                var currentElem = $(event.currentTarget);
                var html = '<div class="contextmenu alert alert-info fade in"> <span class="close" aria-label="close"> &times; </span> <div class="content">';
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
                    'vsVal': _.map(object, 'voyageDetail')[0] ? _.map(object, 'voyageDetail')[0] : {}
                };
                try {
                    rightClickPopoverData.vsVal.style = ctrl.bunkerDetails[voyageDetailId][0].voyage.style;
                } catch (TypeError) {
                    rightClickPopoverData.vsVal.style = '';
                }

                // groupedByVoyageDetailId = {};
                // groupedByVoyageDetailIdVoyageStops = {};
                // $.each(object, function(k,v){
                //     if (typeof(groupedByVoyageDetailId[v.voyageDetail.id]) == 'undefined') {
                //         groupedByVoyageDetailId[v.voyageDetail.id] = [];
                //     }
                //     var item = angular.copy(ctrl.bunkerDetails[v.voyageDetail.id]);
                //     if (typeof(item) == 'undefined') {
                //         item = v.voyageDetail;
                //     }
                //     groupedByVoyageDetailId[v.voyageDetail.id] = item;
                //     _.uniqBy(groupedByVoyageDetailId[v.voyageDetail.id], 'id');
                //     if ((v.voyageDetail.request == null || v.voyageDetail.request.id == 0) && moment.utc(v.voyageDetail.eta) >= moment()) {
                //         groupedByVoyageDetailIdVoyageStops[v.voyageDetail.id] = v.voyageDetail; 
                //     }
                // });
                // rightClickPopoverData.bunkerPlansGroupedByVoaygeDetailId = groupedByVoyageDetailId;
                // rightClickPopoverData.groupedByVoyageDetailIdVoyageStops = groupedByVoyageDetailIdVoyageStops;
                var todaysBunkerDetails = [];
                $.each(allStops, function(k,v){
                	if (ctrl.bunkerPlansGroupedByVoyage[v]) {
                		$.each(ctrl.bunkerPlansGroupedByVoyage[v], function(k2,v2){
		                	todaysBunkerDetails.push(v2);
                		})
                	}
                })
                rightClickPopoverData = {};
                rightClickPopoverData.todayVoyages = object;
                rightClickPopoverData.bunkerDetails = todaysBunkerDetails;
                $scope.rightClickPopoverData = rightClickPopoverData;
                $scope.$apply();

                // if (!hasBunkerPlan) {
                //     $('schedule-dashboard-timeline').append(html);
                //     $compile($('schedule-dashboard-timeline > .contextmenu'))($scope);
                // }
                $('.contextmenu').css("left", "initial");
                $('.contextmenu').css("right", "initial");
                if (window.innerWidth / 2 > $(currentElem).offset().left) {
                    $('.contextmenu').css("left", $(currentElem).offset().left);
                } else {
                    $('.contextmenu').css("right", window.innerWidth - $(currentElem).offset().left - 45);
                }

                $('.contextmenu').css("top", "-400px");
                setTimeout(function() {
                    var heightElement = $('.contextmenu').height();
                    var scrollTop  = $(window).scrollTop();
                    var timelineScrollTop = $(".vis-vertical-scroll").scrollTop();
                    elementOffset = $(currentElem).offset().top;
                    distance  = (elementOffset - scrollTop - timelineScrollTop);

                    console.log(heightElement);

                    if ($(currentElem).offset().top - $("#timeline").height() < 0){
                        $('.contextmenu').css("top", $(currentElem).offset().top - 15);
                    } else {
                        $('.contextmenu').css("top", $(currentElem).offset().top - heightElement - 36);
                    }


               }, 50)


                $('.contextmenu').removeClass("hidden");
                var index;
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
                    removePopups();
                });

                function contextAction(voyageStop) {
                    var href;
                    if (!voyageStop || !voyageStop.voyageDetail) {
                        return;
                    }
                    if (voyageStop.voyageDetail.request && voyageStop.voyageDetail.request.id != 0) {
                        href = $state.href(STATE.EDIT_REQUEST, {
                            requestId: voyageStop.voyageDetail.request.id
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
                    window.open(href, '_blank');
                };
                function contextActionContractPlanning(voyageStop) {
                    $rootScope.scheduleDashboardVesselVoyages = [voyageStop];
                    localStorage.setItem('scheduleDashboardVesselVoyages', JSON.stringify($rootScope.scheduleDashboardVesselVoyages));
                    window.open("/#/contract-planning/", "_blank");
                };
            }

        });

        function removePopups() {
            $('.popover').remove();
            $("schedule-dashboard-timeline > .contextmenu").remove();
            $scope.$digest();

        }

        ctrl.onPopoverClose = function(results) {
            if (results) {
                removePopups();
                $scope.rightClickPopoverData = null;
                $scope.rightClickVesselPopoverData = null;
                $scope.$digest();
            }
        };

        $scope.formatDateToMomentFormat = function( dateFormat ){
            var dbFormat = dateFormat;
            var hasDayOfWeek = false;
            var currentFormat = angular.copy(dateFormat);
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
        ctrl.convertDate = function (date) {
            return moment(date).format('DD/MM/YYYY HH:mm');
        };

        /*build hover popover*/
        $(document).on("mouseover", "span[voyage-detail-id]", function(){
            var voyageDetailId = $(this).attr("voyage-detail-id");
            if (voyageDetailId) {
                var html = buildHoverPopoverMarkup(voyageDetailId);
                $(this).attr("data-content", html);
                $(this).popover({
                    container: 'body',
                    trigger: 'hover',
                    placement: 'auto bottom',
                    html: true,
                    template: '<div class="popover" style="z-index: 9999999" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body timeline-popover-hover">'+html+'</div></div>'
                }).
                on('show.bs.popover', function (event) {
					$scope.rightClickPopoverData = null;
					$scope.$apply();
                    var lengthVoyageStops = getLengthPopoverMarkup(voyageDetailId);
                    if (lengthVoyageStops > 3) {
                        $('.breadcrumbs-container').css('z-index', '0');
                        $('.page-header.navbar').addClass("hoverOnPortCode");
                    } 
                 
                });
                $(this).popover('toggle');
              
            }
        });
        $(document).on("mouseout", "span[voyage-detail-id]", function() {       
            $('.breadcrumbs-container').css('z-index', '10000');
            $('.page-header.navbar').removeClass("hoverOnPortCode");
        });

        var getLengthPopoverMarkup = function(voyageDetailId) {
            var number = 0;
            var allStops = [parseFloat(voyageDetailId)];

            var currentCellIdentifier = $("span[voyage-detail-id='"+voyageDetailId+"']").attr("cell-identifier");
            var voyagesToday = $scope.stopsGroupedByDayAndGroup[currentCellIdentifier];
            var voyageStopsToday = []
            $.each(voyagesToday, function(k,v){
                voyageStopsToday.push(v.voyageDetail.id)
            })

            
            var voyageStop;
            voyageStop = _.filter(ctrl.voyageData, function(el){
                return el && voyageStopsToday.indexOf(el.voyageDetail.id) != -1;
            });            
            voyageStop = _.uniqBy(voyageStop, 'voyageDetail.request.requestDetail.Id')
            var voyageStopGroup = _.groupBy(voyageStop, "voyageDetail.id" );
            $.each(voyageStopGroup, function(k1,v1) {
                number += 1;
            });
            return number;

        }

        var buildHoverPopoverMarkup = function(voyageDetailId) {
            var hasNoRequest = false;
            var allStops = [parseFloat(voyageDetailId)];

            var currentCellIdentifier = $("span[voyage-detail-id='"+voyageDetailId+"']").attr("cell-identifier");
			var voyagesToday = $scope.stopsGroupedByDayAndGroup[currentCellIdentifier];
			var voyageStopsToday = []
			$.each(voyagesToday, function(k,v){
				voyageStopsToday.push(v.voyageDetail.id)
			})

			
            var voyageStop;
            voyageStop = _.filter(ctrl.voyageData, function(el){
                return el && voyageStopsToday.indexOf(el.voyageDetail.id) != -1;
            });            
            voyageStop = _.uniqBy(voyageStop, 'voyageDetail.request.requestDetail.Id')
     
            var voyageStopGroup = _.groupBy(voyageStop, "voyageDetail.id" );
            var html = "";
            $.each(voyageStopGroup, function(k1,v1){
                var hasRequest = false;
                $.each(v1, function(k,v) {
                    var voyage = v.voyageDetail;
                    if (voyage.request && voyage.request.id != 0) {
                        hasRequest = true;
                    }
                });
                if (hasRequest) {
                    var preHtml;
                    preHtml = "<div class='request-section'>";
                    preHtml += "<p class='stop-details'><b>";
                    preHtml += v1[0].voyageDetail.request.requestDetail.location + " - ";
                    var eta =  $scope.formatDateUtc(v1[0].voyageDetail.eta);
                    preHtml += " ETA : " + eta + " - ";
                    if (v1[0].voyageDetail.etd) {
                        var etd = $scope.formatDateUtc(v1[0].voyageDetail.etd);
                        preHtml += " ETD : " + etd;
                    }
                    if (v1[0].voyageDetail.deliveryFrom && v1[0].voyageDetail.deliveryTo) {
                        var deliveryFrom = $scope.formatDateUtc(v1[0].voyageDetail.deliveryFrom);
                        var deliveryTo = $scope.formatDateUtc(v1[0].voyageDetail.deliveryTo);
                        preHtml += "- Delivery Window : " + deliveryFrom + " - " + deliveryTo;
                    }               
                    preHtml += "</b></p>";
                    html =  html + preHtml;
                    if (ctrl.scheduleDashboardConfiguration.productTypeInSchedule.name == "Yes") {
                        html += '<table class="table table-striped table-hover table-bordered table-condensed"> <thead> <th>Request ID</th> <th>Vessel</th> <th>Product</th> <th> Product Type </th> <th>UOM</th> <th>Min. Quantity</th> <th>Max. Quantity</th> <th>Agreement Type</th> <th>Product Status</th> </thead> <tbody>';

                    } else {
                        html += '<table class="table table-striped table-hover table-bordered table-condensed"> <thead> <th>Request ID</th> <th>Vessel</th> <th>Product</th> <th>UOM</th> <th>Min. Quantity</th> <th>Max. Quantity</th> <th>Agreement Type</th> <th>Product Status</th> </thead> <tbody>';

                    }

	                $.each(v1, function(k,v) {
	                    var voyage = v.voyageDetail;
	                    if (voyage.request && voyage.request.id != 0) {
	                        hasNoRequest = true;
	                        var row_requestName = voyage.request.requestName || '-';
	                        var row_vesselName = voyage.request.vesselName || '-';
	                        //row_location = voyage.request.requestDetail.location || '-';
	                        var row_fuelOilOfRequest = voyage.request.requestDetail.fuelOilOfRequest || '-';
                            var row_productType = voyage.request.requestDetail.fuelOilOfRequestType.name;
	                        var row_uom = voyage.request.requestDetail.uom || '-';
	                        var row_fuelMinQuantity = $filter('number')(voyage.request.requestDetail.fuelMinQuantity, $scope.numberPrecision.amountPrecision) || '-';
	                        var row_fuelMaxQuantity = $filter('number')(voyage.request.requestDetail.fuelMaxQuantity, $scope.numberPrecision.amountPrecision) || '-';
	                        var row_agreementType = voyage.request.requestDetail.agreementType || '-';
	                        var row_statusCode = voyage.request.requestDetail.statusCode || '-';
	                        if (voyage.request.requestDetail.fuelOilOfRequest) {
                                if (ctrl.scheduleDashboardConfiguration.productTypeInSchedule.name == "Yes") {
                                    html += '<tr><td>' + row_requestName + '</td> <td>' + row_vesselName + '</td> <td>' + row_fuelOilOfRequest + '</td> <td>' + row_productType + '</td> <td>' + row_uom + '</td> <td>' + row_fuelMinQuantity + '</td> <td>' + row_fuelMaxQuantity + '</td> <td>' + row_agreementType + '</td> <td>' + row_statusCode + '</td></tr>';
                                } else {
                                    html += '<tr><td>' + row_requestName + '</td> <td>' + row_vesselName + '</td> <td>' + row_fuelOilOfRequest + '</td> <td>' + row_uom + '</td> <td>' + row_fuelMinQuantity + '</td> <td>' + row_fuelMaxQuantity + '</td> <td>' + row_agreementType + '</td> <td>' + row_statusCode + '</td></tr>';

                                }
	                        }
	                    }
	                });
	                html += '</tbody> </table>';
	                html += '</div>';
                }
            });

            if (voyageStop.length == 0 || !hasNoRequest) {
                html = "";
            }
            return html;
        };
        $scope.formatDateUtc = function (cellValue) {
            var dateFormat = $scope.dateFormat;
            var hasDayOfWeek = false;                  
            dateFormat = dateFormat.replace(/D/g, "d").replace(/Y/g, "y");
            var formattedDate = moment(cellValue).format($scope.dateFormat);
            if (formattedDate) {
                var array = formattedDate.split(" ");
                var format = [];
                $.each(array, function(k,v) {
                    if (array[k] != "00:00") {
                        format = format + array[k] + " ";
                    }
                });
                formattedDate = format;
            }
     
            if (formattedDate) {
                if (formattedDate.indexOf("0001") != -1) {
                    formattedDate = "";
                }
            }
            if (cellValue != null) {
                return formattedDate;
            }
            return "";
        }


        $scope.getTimelineStatus = function () {
            var model = scheduleDashboardTimelineModel.getLatestVersion();
            if (model) {
                if (!model.payload) return;
                $scope.timelineStatuses = model.payload.scheduleDashboardStatus;
                console.log(new Date())
                if($state.current.name == STATE.DASHBOARD_TIMELINE || $state.current.name == STATE.HOME) { 

                    if (window.scheduleDashboardConfiguration) {

                        $scope.timelineAdminDashboardStatuses = $filter("filter")(window.scheduleDashboardConfiguration.payload.labels, { displayInDashboard : true}, true);
                        if ($scope.timelineStatuses) {
                            $rootScope.timelineStatusList = $scope.createStatusFilters();
                        }
                    }
                }                
        
            }
            return $rootScope.timelineStatusList;
        };

        $scope.createStatusFilters = function () {
            $rootScope.timelineStatusList = [];
            $.each($scope.timelineAdminDashboardStatuses, function (adsk, adsv) {

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
                $.each($scope.timelineStatuses,
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
                var statusIsAlreadyAdded = false;
                $.each($rootScope.timelineStatusList, function (k, v) {
                    if (v.name == adsv.status.name) {
                        statusIsAlreadyAdded = true;
                    }
                })
                if (!statusIsAlreadyAdded) {
                    $rootScope.timelineStatusList.push(status);
                }
            })
            return $rootScope.timelineStatusList;
        }


		$rootScope.$on('allStrategiesAreCancelled', function(event, voyageDetailId){
			$("span[voyage-detail-id="+voyageDetailId+"]").removeClass("vis-voyage-content-sap");
		});     
           
        document.addEventListener("contextmenu", function(e){
            e.preventDefault();
        }, false);

        document.addEventListener('scroll', function (e) {
           if (!$(e.target).hasClass("vis-item") && $(e.target).parents(".vis-item").length == 0) {
                $(".contextmenu").css("display", "none");

            }   
        }, true);

		jQuery(document).ready(function(){

        	$(document).on("click", "span[timeline-order-column]", function(e){
				// Prevent multiple clicks
				if (window.lastSortingTime) {
					if (moment().diff(window.lastSortingTime) < 1000) {
						return;
					}
				}
				window.lastSortingTime = moment();

        		var currentSort = $(e.target).attr("timeline-order-column");
        		window.timelineGroupOrdering = [];
        		if(!window.timelineGroupOrdering[currentSort]) {
	        		window.timelineGroupOrdering[currentSort] = _.orderBy(window.mytimeline.groupsData._data._data, [currentSort], ['asc']);
        			for (var i = window.timelineGroupOrdering[currentSort].length - 1; i >= 0; i--) {
						Object.keys(window.mytimeline.groupsData._data._data).forEach(function(key) {

	        				if (window.timelineGroupOrdering[currentSort][i].id == window.mytimeline.groupsData._data._data[key].id) {
		        				window.mytimeline.groupsData._data._data[key]["sortIndex-" + currentSort] = i;
	        				}

						});        				
        			}
        		}
                if (!window.selectFrame) {
                    if (window.timelineCurrentSort == currentSort) {
                        if (!window.selectFrame) {
                            if (window.timelineCurrentSortDirection == 'asc') {
                                window.timelineCurrentSortDirection = 'desc';
                            } else {
                                window.timelineCurrentSortDirection = 'asc';
                            }
                        }
                        
                    } else {
                        window.timelineCurrentSortDirection = 'asc';
                    }
                } else {
                    window.selectFrame = false;
                }
				
				$("span[timeline-order-column]").removeClass("asc").removeClass("desc");
				$(e.target).addClass(window.timelineCurrentSortDirection);
				options = {
					'groupOrder' : function (a, b) {
						if (window.timelineCurrentSortDirection == 'asc') {
							return a["sortIndex-" + currentSort] - b["sortIndex-" + currentSort];
						} else {
							return b["sortIndex-" + currentSort] - a["sortIndex-" + currentSort];
						}
					}
				}
        		window.timelineCurrentSort = currentSort;
				window.mytimeline.setOptions(options);
				window.mytimeline.redraw();
                setTimeout(function() {
                	if ($(".vis-vertical-scroll").scrollTop() < 50) {
	                    timeline._setScrollTop(0);
                	}
                });

        	})
        })
		

		function getContrastYIQ(hexcolor){
			if (!hexcolor) { return "black"; }
		    hexcolor = hexcolor.replace("#", "");
		    var r = parseInt(hexcolor.substr(0,2),16);
		    var g = parseInt(hexcolor.substr(2,2), 16);
		    var b = parseInt(hexcolor.substr(4,2),16);
		    var yiq = ((r*299)+(g*587)+(b*114))/1000;
		    return (yiq >= 128) ? 'black' : 'white';
		}


    }
]);
angular.module('shiptech.pages').component('scheduleDashboardTimeline', {
    templateUrl: 'pages/schedule-dashboard-timeline/views/schedule-dashboard-timeline.html',
    controller: "ScheduleTimelineController"
});


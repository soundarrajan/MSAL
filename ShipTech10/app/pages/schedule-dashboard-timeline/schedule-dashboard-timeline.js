angular.module("shiptech.pages").controller("ScheduvarimelineController", ["$scope", "$rootScope", "$listsCache", "scheduleDashboardTimelineModel", "statusColors", "$filter", 'tenantService',
    function ($scope, $rootScope, $listsCache, scheduleDashboardTimelineModel, statusColors, $filter, tenantService) {

        var STATUSES = null;

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
            scheduleDashboardTimelineModel.get(null, null, [], {}, searchText).then(function (response) {
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

        /*
        $rootScope.calculateTimelineStatusesCount = function() {
            return $filter('filter')(timelineStatusList, {display : true}).length;
        };
        */

        var getConfiguration = new Promise(function(resolve, reject) {
            tenantService.scheduleDashboardConfiguration.then(function (settings) {
                this.scheduleDashboardConfiguration = settings.payload;
                if (this.scheduleDashboardConfiguration.scheduleBuyerDisplay) {
                    if (this.scheduleDashboardConfiguration.scheduleBuyerDisplay.name == "No") {
                        scheduleOptions.displayBuyer = false;
                    }
                }
                if (this.scheduleDashboardConfiguration.scheduleCompanyDisplay) {
                    if (this.scheduleDashboardConfiguration.scheduleCompanyDisplay.name == "No") {
                        scheduleOptions.displayCompany = false;
                    }
                }
                resolve(this.scheduleDashboardConfiguration);
            });
        });

        var getStatuses = new Promise(function(resolve, reject) {
            scheduleDashboardTimelineModel.getStatuses().then(function (data) {
                statusList = data.labels;
                resolve($filter("filter")(statusList, {
                    displayInDashboard: true,
                    status: {
                        displayName: status.displayName,
                    }
                }, true));
            });
        });

        var getTimelineStatuses = function () {

            /* Live code */
            /*************/

            /*
            var model = scheduleDashboardTimelineModel.getLatestVersion();
            if (model) {
                if (!model.payload) return;
                timelineStatuses = model.payload.scheduleDashboardStatus;
                scheduleDashboardTimelineModel.getStatuses().then(function(data){
                    if (data !== null) {
                        timelineAdminDashboardStatuses = $filter("filter")(data.labels, {displayInDashboard : true}, true);
                        if (timelineStatuses) {
                            return createStatusFilters();
                        }
                    }
                });
            }
            */

            /* Debug code */
            /**************/

            // timelineStatuses = STATUSES;
            // return createStatusFilters();
        };

        var getData = new Promise(function(resolve, reject) {
            if (DEBUG) {
                if (localStorage.getItem('debugTimelineData')) {
                    resolve(JSON.parse(localStorage.getItem('debugTimelineData')));
                } else {
                    scheduleDashboardTimelineModel.get(null, null).then(function (response) {
                        localStorage.setItem('debugTimelineData', JSON.stringify(response));
                        resolve(response);
                    });
                }
            } else {
                scheduleDashboardTimelineModel.get(null, null).then(function (response) {
                    resolve(response);
                });
            }
        });

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
                                for (var j = 0; j < timelineStatuses.length; j++) {
                                    sts1 = timelineStatuses[j];
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

            var groups = [];
            var voyages = [];
            var groupStrings = [];

            for (var i = 0; i < vessels.length; i++) {
                // DEBUG: Stop at n groups 
                if (i > 200) {
                    break;
                }
                // Create voyage object
                var statusColor = statusColors.getColorCodeFromLabels(vessels[i].voyageDetail.portStatus, $listsCache.ScheduleDashboardLabelConfiguration); 

                var voyageContent = '';

                if (vessels[i].voyageDetail.hasStrategy) {
                    voyageContent += '<span class="vis-item-addon"> SAP </span>';
                }

                voyageContent += '<span> ' + vessels[i].voyageDetail.locationCode + ' </span>';

                var voyage = {
                    id: i,
                    content: voyageContent,
                    start: moment(vessels[i].voyageDetail.eta).format('YYYY-MM-DD HH:mm'),
                    end: moment(vessels[i].voyageDetail.eta).add('days', 1).format('YYYY-MM-DD HH:mm'),
                    style: 'background-color: ' + statusColor
                };

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
                        vesselName: vessels[i].VesselName,
                        companyName: vessels[i].CompanyName,
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
            return {
                'groups': groups,
                'voyages': voyages
            };
        };

        var buildTimeline = function(data) {

            var timelineData = computeData(data);
            var groups = new vis.DataSet(timelineData.groups);
            var voyages = new vis.DataSet(timelineData.voyages);

            var container = document.getElementById('timeline');

            // Configuration for the Timeline
            var options = {
                'verticalScroll': true,
                // 'moveable': false,
                // Disable red line
                'showCurrentTime': false,
                'stack': true,
                'maxHeight': 700,
                'orientation': 'top',
                'start': new Date(2019, 4, 3),
                'end': new Date(2019, 6, 9),
                // 3 days in milliseconds
                'zoomMin': 259200000,
                // 4 weeks in milliseconds
                'zoomMax': 2419200000,
                groupTemplate: function (group) {
                    var tpl = '<div class="vis-custom-group"><span class="vis-custom-group-column"> ' + group.serviceName + '</span>';
                    if (scheduleOptions.displayBuyer) {
                        tpl += '<span class="vis-custom-group-column"> ' + group.buyerName + '</span>';
                    }
                    tpl += '<span class="vis-custom-group-column"> ' + group.vesselName + '</span>';
                    if (scheduleOptions.displayCompany) {
                        tpl += '<span class="vis-custom-group-column last"> ' + (group.companyName || '-') + '</span></div>';
                    }
                    return tpl;
                },
            };

            // Create a Timeline
            timeline = new vis.Timeline(container, null, options);  
            timeline.setGroups(groups);
            timeline.setItems(voyages);

        };

        var updateTimeline = function(data) {
            var timelineData = computeData(data);
            var groups = new vis.DataSet(timelineData.groups);
            var voyages = new vis.DataSet(timelineData.voyages);
            timeline.setGroups(groups);
            timeline.setItems(voyages);
        };

        // Get data and initialize timeline
        Promise.all([getStatuses, getData, getConfiguration]).then(function(values) {
            STATUSES = values[0];
            createFilters();
            $rootScope.timelineStatusList = timelineStatusList;
            buildTimeline(values[1]);
        });
    }
]);
angular.module('shiptech.pages').component('scheduleDashboardTimeline', {
    templateUrl: 'pages/schedule-dashboard-timeline/views/schedule-dashboard-timeline.html',
    controller: "ScheduvarimelineController"
});

angular.module("shiptech.pages").controller("ScheduleTimelineController", ["$scope",  "scheduleDashboardTimelineModel",
    function ($scope, scheduleDashboardTimelineModel) {

        var DEBUG = true;

        groups = [];
        timeline = null;
        groupsIndex = 1;
        scrolledToBottom = false;

        // localStorage.removeItem('debugTimelineData');
        var getData = new Promise(function(resolve, reject) {
            if (DEBUG) {
                if (localStorage.getItem('debugTimelineData')) {
                    setTimeout(function() {
                        resolve(JSON.parse(localStorage.getItem('debugTimelineData')));
                    }, 0);
                } else {
                    scheduleDashboardTimelineModel.get(null, null).then(function (response) {
                        localStorage.setItem('debugTimelineData', JSON.stringify(response));
                        resolve(response);
                    });
                }
            } else {
                scheduleDashboardTimelineModel.get(null, null).then(function (response) {
                    setTimeout(function() {
                        resolve(response);
                    }, 0);
                });
            }
        });

        getData.then(function(response) {

        // scheduleDashboardTimelineModel.get(null, null).then(function (response) {


            var vessels = JSON.parse('{ "vessels": [' + response.payload.scheduleDashboardView + "]}").vessels;

            var voyages = new vis.DataSet();
            var groupsDS = new vis.DataSet();
            var groupStrings = [];

            console.log('Vessels: ', vessels.length);

            for (var i = 0; i < vessels.length; i++) {
                // DEBUG: Stop at n groups 
                // if (i > 1000) {
                    // break;
                // }
                // Create voyage object
                var voyage = {
                    id: i + 5000,
                    content: vessels[i].voyageDetail.locationCode,
                    start: moment(vessels[i].voyageDetail.eta).format('YYYY-MM-DD'),
                    // style: 'color: gray; background-color: lightgray; border: 1px dotted gray;'
                };

                // DEVELOP: Fake ETA
                var min = 1;
                var max = 5;
                var randomDays = -Math.floor(Math.random() * (-max - +min)) + min;

                console.log(randomDays);

                if (randomDays) {
                    var fakeVoyage = {
                        id: i,
                        content: vessels[i].voyageDetail.locationCode,
                        start: moment(vessels[i].voyageDetail.eta).subtract('days', randomDays).format('YYYY-MM-DD'),
                        end: moment(vessels[i].voyageDetail.eta).subtract('days', 1).format('YYYY-MM-DD'),
                        style: 'color: gray; background-color: lavander; border: 1px dotted gray;'
                    };
                } else {
                    fakeVoyage = null;
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
                        vesselName: vessels[i].VesselName,
                        companyName: vessels[i].CompanyName,
                        // contentTemplate: 
                        // content: groupString
                    };

                    // Add group to groups
                    groups.push(group);
                    groupsDS.add(group);

                    // Set groupId
                    groupId = group.id;
                }

                // Set group id
                voyage.group = groupId;
                if (fakeVoyage) {
                    fakeVoyage.group = groupId;
                }

                // Add voyage
                if (fakeVoyage) {
                    voyages.add(fakeVoyage);
                }
                voyages.add(voyage);
            }

            var container = document.getElementById('timeline');

            // Create a DataSet (allows two way data-binding)

            // Configuration for the Timeline
            var options = {
                'verticalScroll': true,
                // 'stack': true,
                'maxHeight': 800,
                'orientation': 'top',
                'stack': false,
                // 'zoomable': false,
                groupTemplate: function (group) {
                    // return '-';
                    var tpl = '<div class="vis-custom-group"><span class="vis-custom-group-column"> ' + group.serviceName + '</span>';
                    tpl += '<span class="vis-custom-group-column"> ' + group.buyerName + '</span>';
                    tpl += '<span class="vis-custom-group-column"> ' + group.vesselName + '</span>';
                    tpl += '<span class="vis-custom-group-column last"> ' + (group.companyName || '-') + '</span></div>';
                    return tpl;
                },
            };

            // Create a Timeline
            timeline = new vis.Timeline(container, null, options);  
            timeline.setGroups(new vis.DataSet(groups.slice(0, 20)));
            // timeline.setGroups(groupsDS);
            timeline.setItems(voyages);

            setTimeout(function() {
                // $('.vis-panel').height(voyages.length * 25 + 'px');
                $('.vis-panel').on('scroll', function(e) {
                    // console.log(e);
                    // console.log(this);
                    // console.log($(this).scrollTop(), $(this).innerHeight(), $(this)[0].scrollHeight);
                    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 10) {
                        console.log('got bottom');
                        scrolledToBottom = true;
                        timeline.setGroups(new vis.DataSet(groups.slice(0, groupsIndex * 20)));
                        timeline.setItems(voyages);
                        groupsIndex++;
                    } else {
                        scrolledToBottom = false;
                    }
                });
            });

        });

    }
]);
angular.module('shiptech.pages').component('scheduleDashboardTimeline', {
    templateUrl: 'pages/schedule-dashboard-timeline/views/schedule-dashboard-timeline.html',
    controller: "ScheduleTimelineController"
});

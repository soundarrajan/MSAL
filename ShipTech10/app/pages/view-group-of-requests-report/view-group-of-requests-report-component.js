angular.module('shiptech.pages').controller('ViewGroupOfRequestsReportController', [ 'API', '$scope', '$element', '$attrs', '$tenantSettings', '$http', '$timeout', '$state', 'STATE', function(API, $scope, $element, $attrs,  $tenantSettings, $http, $timeout, $state, STATE) {
    var ctrl = this;
    ctrl.tenantSettings = $tenantSettings;
    ctrl.reportNegotiationConfiguration = {};
    if ($state.params.requestId) {
        $state.params.entity_id = $state.params.groupId;
        $state.params.screen_id = 'request_procurement_report';
    }

    $state.params.screen_id = 'request_procurement_report';
    $scope.NAV = {};
    $scope.NAV.requestId = $state.params.requestId;
    $scope.entity_id = $state.params.groupId;
    $scope.screen_id = 'request_procurement_report';

    ctrl.viewRFQ = function() {
        $state.go(STATE.VIEW_RFQ, {
            requestGroupId: $scope.entity_id
        });
    };

    ctrl.getData = function() {
        let payload = {
            Payload: false
        }
        $http.post(`${API.BASE_URL_DATA_ADMIN}/api/admin/tenantConfiguration/get`, payload).then((response) => {
            if (response.data != 'null') {
                ctrl.showReport =  response.data.reportConfiguration.tabConfigurations[1].showReport;
                let tenantSettings = response.data;
                if (ctrl.showReport) {
                    let payload1 = {
                        Payload: {}
                    }
                    $http.post(`${API.BASE_URL_DATA_PROCUREMENT}/api/procurement/rfq/isAuthorizedForReportsTab`, payload1).then((response) => {
                        if (response) {
                            if (response.data) {
                                ctrl.hasAccess = true;
                                ctrl.reportNegotiationConfiguration = tenantSettings.reportConfiguration.tabConfigurations[1];  
                            }
                        } else {
                            ctrl.hasAccess = false;
                        }
                    });
                }
            }
        });
    }
} ]);
angular.module('shiptech.pages').component('viewGroupOfRequestsReport', {
    templateUrl: 'pages/view-group-of-requests-report/views/view-group-of-requests-report-component.html',
    controller: 'ViewGroupOfRequestsReportController'
});

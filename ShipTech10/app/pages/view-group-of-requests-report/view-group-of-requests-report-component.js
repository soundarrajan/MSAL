angular.module('shiptech.pages').controller('ViewGroupOfRequestsReportController', [ '$scope', '$element', '$attrs', '$tenantSettings', '$timeout', '$state', 'STATE', function($scope, $element, $attrs,  $tenantSettings, $timeout, $state, STATE) {
    var ctrl = this;
    ctrl.tenantSettings = $tenantSettings;
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
} ]);
angular.module('shiptech.pages').component('viewGroupOfRequestsReport', {
    templateUrl: 'pages/view-group-of-requests-report/views/view-group-of-requests-report-component.html',
    controller: 'ViewGroupOfRequestsReportController'
});

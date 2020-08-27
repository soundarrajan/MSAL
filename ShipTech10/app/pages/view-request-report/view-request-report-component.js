angular.module('shiptech.pages')
    .controller('ViewRequestReportController', [ '$scope', '$element', '$attrs', '$tenantSettings', '$timeout', '$state', function($scope, $element, $attrs,  $tenantSettings, $timeout, $state) {
        let ctrl = this;
        ctrl.tenantSettings = $tenantSettings;

        if ($state.params.requestId) {
            $state.params.entity_id = $state.params.requestId;
            $state.params.screen_id = 'request_procurement';
        }

        $scope.NAV = {};
        $scope.NAV.requestId = $state.params.requestId;

    } ]);

angular.module('shiptech.pages').component('viewRequestReport', {
    templateUrl: 'pages/view-request-report/views/view-request-report-component.html',
    controller: 'ViewRequestReportController'
});

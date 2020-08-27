angular.module('shiptech.pages')
    .controller('ViewRequestEmailLogController', [ '$scope', '$element', '$attrs', '$tenantSettings', '$timeout', '$state', function($scope, $element, $attrs, $tenantSettings, $timeout, $state) {
        // $timeout(function(){
        let ctrl = this;
        ctrl.tenantSettings = $tenantSettings;
        if ($state.params.requestId) {
            $state.params.entity_id = $state.params.requestId;
            $state.params.screen_id = 'request_procurement';
        }

        // used in nav
        $scope.NAV = {};
        $scope.NAV.requestId = $state.params.requestId;
        $scope.entity_id = $state.params.requestId;

        // });
    } ]);

angular.module('shiptech.pages').component('viewRequestEmaillog', {
    templateUrl: 'pages/view-request-emaillog/views/view-request-emaillog-component.html',
    controller: 'ViewRequestEmailLogController'
});

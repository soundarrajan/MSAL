angular.module('shiptech.pages')
    .controller('ViewRequestAuditlogController', [ '$scope', '$element', '$attrs', '$timeout', '$state', function($scope, $element, $attrs, $timeout, $state) {
        // $timeout(function(){

        if ($state.params.requestId) {
            $state.params.entity_id = $state.params.requestId;
            $state.params.screen_id = 'request_procurement';
        }

        // used in nav
        $scope.NAV = {};
        $scope.NAV.requestId = $state.params.requestId;

        // });
    } ]);

angular.module('shiptech.pages').component('viewRequestAuditlog', {
    templateUrl: 'pages/view-request-auditlog/views/view-request-auditlog-component.html',
    controller: 'ViewRequestAuditlogController'
});

angular.module("shiptech.pages")
    .controller("groupOfRequestsEmaillogController", ["$scope", "$element", "$attrs", "$timeout", "$state", 'STATE', function($scope, $element, $attrs, $timeout, $state, STATE) {
        // $timeout(function(){
            ctrl = this;
            if ($state.params.requestId) {
                $state.params.entity_id = $state.params.groupId;
                $state.params.screen_id = 'request_procurement';
            }
            // used in nav
            $scope.NAV = {};
            $scope.NAV.requestId = $state.params.requestId;
            $scope.entity_id = $state.params.groupId;
            $scope.screen_id = 'request_procurement';
             ctrl.viewRFQ = function() {
        $state.go(STATE.VIEW_RFQ, {
            requestGroupId: $scope.entity_id
        });
    };
        // });
}]);

angular.module('shiptech.pages').component('groupOfRequestsEmaillog', {
    templateUrl: 'pages/group-of-requests-emaillog/views/group-of-requests-emaillog.html',
    controller: 'groupOfRequestsEmaillogController'
});

angular.module("shiptech.pages")
    .controller("ViewOrderEmailLogController", ["$scope", "$element", "$attrs", "$timeout", "$state", function($scope, $element, $attrs, $timeout, $state) {
        if ($state.params.orderId) {
            $state.params.entity_id = $state.params.orderId;
            $state.params.screen_id = 'order_procurement';
        }

        // used in nav
        $scope.NAV = {};
        $scope.NAV.orderId = $state.params.orderId;
        $scope.entity_id = $state.params.orderId;
}]);

angular.module('shiptech.pages').component('viewOrderEmaillog', {
    templateUrl: 'pages/view-order-emaillog/views/view-order-emaillog-component.html',
    controller: 'ViewOrderEmailLogController'
});

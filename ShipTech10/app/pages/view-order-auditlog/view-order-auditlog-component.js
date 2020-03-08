angular.module('shiptech.pages')
    .controller('ViewOrderAuditlogController', [ '$scope', '$element', '$attrs', '$timeout', '$state', function($scope, $element, $attrs, $timeout, $state) {
        // $timeout(function(){

        if ($state.params.orderId) {
            $state.params.entity_id = $state.params.orderId;
            $state.params.screen_id = 'order_procurement';
        }

        // used in nav
        $scope.NAV = {};
        $scope.NAV.orderId = $state.params.orderId;

        // });
    } ]);

angular.module('shiptech.pages').component('viewOrderAuditlog', {
    templateUrl: 'pages/view-order-auditlog/views/view-order-auditlog-component.html',
    controller: 'ViewOrderAuditlogController'
});

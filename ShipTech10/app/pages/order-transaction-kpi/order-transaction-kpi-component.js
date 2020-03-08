angular.module('shiptech.pages')
    .controller('OrderTransactionKPIController', [ '$scope', '$element', '$attrs', '$timeout',
        function($scope, $element, $attrs, $timeout) {
            let ctrl = this;

            $timeout(() => {
                OrderTransactionKPIQualityDatatable.init({
                    selector: '#quality_table'
                });
            });
        } ]);

angular.module('shiptech.pages').component('orderTransactionKpi', {
    templateUrl: 'pages/order-transaction-kpi/views/order-transaction-kpi-component.html',
    controller: 'OrderTransactionKPIController'
});

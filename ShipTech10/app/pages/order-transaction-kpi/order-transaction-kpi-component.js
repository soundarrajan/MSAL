angular.module("shiptech.pages")
    .controller("OrderTransactionKPIController", ["$scope", "$element", "$attrs", "$timeout",
        function($scope, $element, $attrs, $timeout) {
    
            var ctrl = this;

            $timeout(function(){

                OrderTransactionKPIQualityDatatable.init({
                    selector: '#quality_table'
                });
        
            });

}]);

angular.module('shiptech.pages').component('orderTransactionKpi', {
    templateUrl: 'pages/order-transaction-kpi/views/order-transaction-kpi-component.html',
    controller: "OrderTransactionKPIController"
});
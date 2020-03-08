angular.module('shiptech.components').component('priceGraphComponent', {
    templateUrl: 'components/price-graph-section/views/price-graph-section-component.html',
    controller: 'PriceGraphController',
    bindings: {
        requests: '<'
    }
});

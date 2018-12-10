function MarketPricesController() {

console.log('MarketPricesController');

}

angular.module('shiptech').component('marketPrices', {
    templateUrl: 'components/sidebar/views/market-prices.html',
    controller: MarketPricesController,
    bindings: {
        settings: '='
    }
});

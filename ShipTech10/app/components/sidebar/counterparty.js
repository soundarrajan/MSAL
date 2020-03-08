function CounterpartyController() {
    console.log('CounterpartyController');
}

angular.module('shiptech').component('counterparty', {
    templateUrl: 'components/sidebar/views/counterparty.html',
    controller: CounterpartyController,
    bindings: {
        settings: '='
    }
});

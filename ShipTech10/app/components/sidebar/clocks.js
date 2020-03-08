function ClocksController() {
    console.log('ClocksController');
};

angular.module('shiptech').component('clocks', {
    templateUrl: 'components/sidebar/views/clocks.html',
    controller: ClocksController,
    bindings: {
        settings: '='
    }
});

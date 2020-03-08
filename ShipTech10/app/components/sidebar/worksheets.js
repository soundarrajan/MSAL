function WorksheetsController() {
    console.log('WorksheetsController');
}

angular.module('shiptech').component('worksheets', {
    templateUrl: 'components/sidebar/views/worksheets.html',
    controller: ClocksController,
    bindings: {
        settings: '='
    }
});

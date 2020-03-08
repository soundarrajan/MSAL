function AddRequestController() {
    console.log('addRequestCtrl');
};

angular.module('shiptech').component('addRequest', {
    templateUrl: 'components/sidebar/views/add-request.html',
    controller: AddRequestController,
    bindings: {
        settings: '='
    }
});

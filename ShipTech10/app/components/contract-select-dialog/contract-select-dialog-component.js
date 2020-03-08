angular.module('shiptech.components').component('contractSelectDialog', {
    templateUrl: 'components/contract-select-dialog/views/contract-select-dialog.html',
    controller: 'ContractSelectDialogController',
    bindings: {
        filters: '<',
        onContractSelect: '&'
    }
});

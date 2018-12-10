angular.module('shiptech.components').component('productSelectDialog', {
    templateUrl: 'components/product-select-dialog/views/product-select-dialog.html',
    controller: 'ProductSelectDialogController',
    bindings: {
        filters: '<',
        onProductSelect: '&'
    }
});
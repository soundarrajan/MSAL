angular.module('shiptech.components')
    .controller('AmendDialogController', [ '$scope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP',
        function($scope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP) {
            let ctrl = this;
            ctrl.requestIds = null;
            ctrl.groupId = null;

            ctrl.amendRFQ = function() {
                ctrl.onAmend();
            };
            ctrl.reloadRequest = function() {
                ctrl.onReload();
            };
        } ]);

angular.module('shiptech.components').component('amendDialog', {
    templateUrl: 'components/amend-dialog/views/amend-dialog-component.html',
    controller: 'AmendDialogController',
    bindings: {
        onAmend: '&',
        onReload: '&',
    }
});

angular.module('shiptech.components')
    .controller('ProceedDialogValidatedController', ['$scope', '$state', '$window', '$element', '$attrs', '$timeout', 'uiApiModel', 'MOCKUP_MAP',  'STATE',
        function($scope, $state, $window, $element, $attrs, $timeout, uiApiModel, MOCKUP_MAP, STATE) {

            $scope.STATE = STATE; 
            
            var ctrl = this;

            ctrl.$onChanges = function(changes) {
                
            };

            ctrl.gotoGroupOfRequests = function(request) {
                var href = $state.href(STATE.GROUP_OF_REQUESTS, {groupId: request.requestGroupId}, {absolute: false});
                $window.open(href);
            };

            ctrl.gotoSelectContract = function(request) {
                var href = $state.href(STATE.SELECT_CONTRACT, {requestId: request.requestId}, {absolute: false});
                $window.open(href);
            };

}]);


angular.module('shiptech.components').component('proceedDialogValidated', {
    templateUrl: 'components/proceed-dialog-validated/views/proceed-dialog-validated-component.html',
    controller: 'ProceedDialogValidatedController',
    bindings: {
        request: '<'
    }
});
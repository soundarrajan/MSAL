angular.module('shiptech.components')
    .controller('ProceedDialogValidatedController', [ '$scope', '$state', '$window', '$element', '$attrs', '$timeout', '$tenantSettings', '$location',
    'tenantService','uiApiModel', 'MOCKUP_MAP', 'STATE', 'groupOfRequestsModel',
        function($scope, $state, $window, $element, $attrs, $timeout,  $tenantSettings, $location, tenantService, uiApiModel, MOCKUP_MAP, STATE, groupOfRequestsModel) {
            $scope.STATE = STATE;

            let ctrl = this;

            ctrl.$onChanges = function(changes) {

            };
            tenantService.tenantSettings.then((settings) => {
                ctrl.tenantSettings = settings.payload;
            })

            ctrl.gotoGroupOfRequests = function(request) {

                if (request.requestGroupId) {
	                // let href = $state.href(STATE.GROUP_OF_REQUESTS, { groupId: request.requestGroupId }, { absolute: false });
	                $("proceed-dialog-validated").modal('hide');
	                // $window.open(href);
                    window.open($location.$$absUrl.replace('#'+$location.$$path,
                        'v2/group-of-requests/'+ request.requestGroupId +'/'+ request.requestId), '_self');
                } else {
	                groupOfRequestsModel.groupRequests([ request.requestId ]).then(
	                    (data) => {
	                        // var requestGroup = data.payload;
	                        // $state.go(STATE.GROUP_OF_REQUESTS, {
	                        //     groupId: requestGroup[0].requestGroup.id
	                        // });
                            $("proceed-dialog-validated").modal('hide');
                            window.open($location.$$absUrl.replace('#'+$location.$$path,
                                'v2/group-of-requests/'+ data.groupId +'/'+ request.requestId), '_self');
	                    },
	                    () => {
	                    }
	                ).finally(() => {
	                    screenLoader.hideLoader();
	                });
                }


            };

            ctrl.gotoSelectContract = function(request) {
                let href = $state.href(STATE.SELECT_CONTRACT, { requestId: request.requestId }, { absolute: false });
                $window.open(href);
            };
        } ]);


angular.module('shiptech.components').component('proceedDialogValidated', {
    templateUrl: 'components/proceed-dialog-validated/views/proceed-dialog-validated-component.html',
    controller: 'ProceedDialogValidatedController',
    bindings: {
        request: '<'
    }
});

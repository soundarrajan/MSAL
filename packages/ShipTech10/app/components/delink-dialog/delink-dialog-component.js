angular.module('shiptech.components')
    .controller('DelinkDialogController', ['$scope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state',  
        function($scope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state) {
            var ctrl = this;
            ctrl.requestIds = null;
            ctrl.groupId = null;

            ctrl.$onChanges = function(changes) {
                if ( typeof changes.args !== "undefined" && changes.args.isFirstChange() ) {
                    return false;
                }


                ctrl.requestIds = changes.args.currentValue.selectedRequestIds;
                ctrl.allRequests = changes.args.currentValue.allRequests;
                ctrl.groupId =  changes.args.currentValue.groupId;           
            };

            ctrl.delinkRequest = function() {
            	if (ctrl.requestIds === null || ctrl.requestIds.length === 0 || ctrl.groupId === null) {
            		return false;
            	}
            	groupOfRequestsModel.delinkRequests(ctrl.requestIds, ctrl.groupId).then(function() {
	            	if (ctrl.requestIds.length == ctrl.allRequests.length) {
	            		biggestRequest = 0;
	            		for (var i = ctrl.allRequests.length - 1; i >= 0; i--) {
	            			if (i > biggestRequest) {
	            				biggestRequest = i;
	            			}
	            		}
	            		location.href = "/#/edit-request/" + biggestRequest;
	            	}
            		$state.reload();
            		return;
            		ctrl.onDelink({requestIds : ctrl.requestIds});
            	});
            };
}]);

angular.module('shiptech.components').component('delinkDialog', {
    templateUrl: 'components/delink-dialog/views/delink-dialog-component.html',
    controller: 'DelinkDialogController',
    bindings: {
        args: '<',
        onDelink: '&'
    }
});
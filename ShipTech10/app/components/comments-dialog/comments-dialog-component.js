angular.module('shiptech.components')
    .controller('CommentsDialogController', ['$scope', '$element', '$attrs', '$timeout', 'uiApiModel', 'MOCKUP_MAP', 'groupOfRequestsModel',
        function($scope, $element, $attrs, $timeout, uiApiModel, MOCKUP_MAP, groupOfRequestsModel) {
            var ctrl = this;

            ctrl.$onChanges = function(changes) {
                if(!changes.args) {
                    return;
                }  

                ctrl.args = changes.args.currentValue;

               	ctrl.internalComments = ctrl.args.internalComments;
                ctrl.externalComments = ctrl.args.externalComments;
            };            

            ctrl.saveComments = function () {
				ctrl.onSaveComments({internalComments : ctrl.internalComments, 
            	 					externalComments : ctrl.externalComments});
            };
}]);


angular.module('shiptech.components').component('commentsDialog', {
    templateUrl: 'components/comments-dialog/views/comments-dialog-component.html',
    controller: 'CommentsDialogController',
    bindings: {
	    args: '<',
	    onSaveComments: "&"
	}
});
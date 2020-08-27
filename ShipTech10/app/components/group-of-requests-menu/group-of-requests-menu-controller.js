angular.module('shiptech').controller('GroupOfRequestsMenuController', [ '$scope', '$state', '$tenantSettings', 'STATE',
    function($scope, $state, $tenantSettings, STATE) {
        let ctrl = this;
        ctrl.tenantSettings = $tenantSettings;
    	if ($state.params.groupId) {
	        $scope.entity_id = $state.params.groupId;
    	} else if ($state.params.requestId) {
	        $scope.entity_id = $state.params.requestId;
    	}
        $scope.state = $state;
        $scope.STATE = STATE;
        $scope.tenantSettings = ctrl.tenantSettings;
        ctrl.groupId = $scope.entity_id;
    }
]);

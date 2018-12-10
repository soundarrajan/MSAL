angular.module('shiptech').controller('GroupOfRequestsMenuController', ['$scope', '$state', 'STATE',
    function($scope, $state, STATE) {
        var ctrl = this;
    	if ($state.params.groupId) {
	        $scope.entity_id = $state.params.groupId;
    	} else if ($state.params.requestId) {
	        $scope.entity_id = $state.params.requestId;
    	}
        $scope.state = $state;
        $scope.STATE = STATE;
        ctrl.groupId =     $scope.entity_id ;
    }
]);
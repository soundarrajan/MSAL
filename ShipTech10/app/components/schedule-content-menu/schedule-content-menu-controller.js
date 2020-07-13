angular.module('shiptech').controller('ScheduleContentMenuController', [ '$scope', '$state', '$tenantSettings', 'STATE',
    function($scope, $state, $tenantSettings, STATE) {
    	$scope.tenantSettings = $tenantSettings;
        $scope.state = $state;
        $scope.STATE = STATE;
    }
]);

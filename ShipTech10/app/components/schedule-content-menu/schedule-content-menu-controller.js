angular.module('shiptech').controller('ScheduleContentMenuController', [ '$rootScope', '$scope', '$state', '$tenantSettings', 'STATE', '$tenantConfiguration',
    function($rootScope, $scope, $state, $tenantSettings, STATE, $tenantConfiguration) {
    	$scope.tenantSettings = $tenantSettings;
        $scope.state = $state;
        $scope.STATE = STATE;
        
        $scope.isShowCalanderView = $tenantConfiguration.scheduleDashboardConfiguration? $tenantConfiguration.scheduleDashboardConfiguration.showCalenderView: false;
 
    }
]);

angular.module('shiptech').controller('ScheduleContentMenuController', [ '$rootScope', '$scope', '$state', '$tenantSettings', 'STATE', '$tenantConfiguration',
    function($rootScope, $scope, $state, $tenantSettings, STATE, $tenantConfiguration) {
    	$scope.tenantSettings = $tenantSettings;
        $scope.state = $state;
        $scope.STATE = STATE;
        $rootScope.isPageRefresh=true;
        
        $scope.isShowCalanderView = $tenantConfiguration.scheduleDashboardConfiguration? $tenantConfiguration.scheduleDashboardConfiguration.showCalenderView: false;
        // isPageRefresh flag to check whether page reload or not to call timeline function
        $scope.onPageRefresh = function() {
            $rootScope.isPageRefresh=false;
        }
    }
]);

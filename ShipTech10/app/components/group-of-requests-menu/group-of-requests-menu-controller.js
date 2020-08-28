angular.module('shiptech').controller('GroupOfRequestsMenuController', [ 'API', '$scope', '$state',  '$http',  '$tenantSettings', 'STATE',
    function(API, $scope, $state, $http, $tenantSettings, STATE) {
        let ctrl = this;
        ctrl.tenantSettings = $tenantSettings;
        $scope.showReport = false;
        $scope.hasAccess = false;
    	if ($state.params.groupId) {
	        $scope.entity_id = $state.params.groupId;
    	} else if ($state.params.requestId) {
	        $scope.entity_id = $state.params.requestId;
    	}
        $scope.state = $state;
        $scope.STATE = STATE;
        $scope.tenantSettings = ctrl.tenantSettings;
        ctrl.groupId = $scope.entity_id;

        // $scope.getData = function() {
            let payload = {
                Payload: false
            }
            $http.post(`${API.BASE_URL_DATA_ADMIN}/api/admin/tenantConfiguration/get`, payload).then((response) => {
                if (response.data != 'null') {
                  $scope.showReport =  response.data.reportConfiguration.tabConfigurations[1].showReport;
                  let payload1 = {
                    Payload: {}
                   }
                   $http.post(`${API.BASE_URL_DATA_PROCUREMENT}/api/procurement/rfq/isAuthorizedForReportsTab`, payload1).then((response) => {
                        if (response) {
                            if (response.data) {
                                $scope.hasAccess = true;
                            }
                        } else {
                            $scope.hasAccess = false;
                        }
                    }); 
                }
            });
        // }
    }
]);

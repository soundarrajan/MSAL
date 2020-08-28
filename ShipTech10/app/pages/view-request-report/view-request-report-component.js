angular.module('shiptech.pages')
    .controller('ViewRequestReportController', [ 'API', '$scope', '$rootScope', '$element', '$attrs', '$tenantSettings', '$http', '$timeout', '$state', function(API, $scope, $rootScope,  $element, $attrs,  $tenantSettings, $http, $timeout, $state) {
        let ctrl = this;
        ctrl.tenantSettings = $tenantSettings;
        ctrl.reportConfiguration = {};

        if ($state.params.requestId) {
            $state.params.entity_id = $state.params.requestId;
            $state.params.screen_id = 'request_procurement';
        }

        $scope.NAV = {};
        $scope.NAV.requestId = $state.params.requestId;


        ctrl.getData = function() {
            let payload = {
                Payload: false
            }
            $http.post(`${API.BASE_URL_DATA_ADMIN}/api/admin/tenantConfiguration/get`, payload).then((response) => {
                if (response.data != 'null') {
                    ctrl.showReport =  response.data.reportConfiguration.tabConfigurations[0].showReport;
                    let tenantSettings = response.data;
                    if (ctrl.showReport) {
                        let payload1 = {
                            Payload: {}
                        }
                        $http.post(`${API.BASE_URL_DATA_PROCUREMENT}/api/procurement/request/isAuthorizedForReportsTab`, payload1).then((response) => {
                            if (response) {
                                if (response.data) {
                                    ctrl.hasAccess = true;
                                    ctrl.reportRequestConfiguration = tenantSettings.reportConfiguration.tabConfigurations[0];  
                                }
                            } else {
                                ctrl.hasAccess = false;
                            }
                        });
                    }
                }
            });
         
        }

       

    } ]);

angular.module('shiptech.pages').component('viewRequestReport', {
    templateUrl: 'pages/view-request-report/views/view-request-report-component.html',
    controller: 'ViewRequestReportController'
});

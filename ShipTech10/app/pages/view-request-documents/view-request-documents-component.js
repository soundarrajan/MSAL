angular.module('shiptech.pages')
    .controller('ViewRequestDocumentsController', [ 'API', '$scope', '$element', '$attrs', '$tenantSettings', '$http', '$timeout', '$state', function(API, $scope, $element, $attrs, $tenantSettings, $http, $timeout, $state) {
        // $timeout(function(){
        let ctrl = this;
        ctrl.tenantSettings = $tenantSettings;
        ctrl.showReport = false;
        ctrl.hasAccess = false;
        if ($state.params.requestId) {
            $state.params.entity_id = $state.params.requestId;
            $state.params.screen_id = 'request_procurement';
        }

        // used in nav
        $scope.NAV = {};
        $scope.NAV.requestId = $state.params.requestId;
        ctrl.getData = function() {
            let payload = {
                Payload: false
            }
            $http.post(`${API.BASE_URL_DATA_ADMIN}/api/admin/tenantConfiguration/get`, payload).then((response) => {
                if (response.data != 'null') {
                    ctrl.showReport =   (response.data.reportConfiguration && response.data.reportConfiguration.tabConfigurations.length)  ? response.data.reportConfiguration.tabConfigurations[0].showReport : false; 
                    if (ctrl.showReport) {
                        let payload1 = {
                            Payload: {}
                        }
                        $http.post(`${API.BASE_URL_DATA_PROCUREMENT}/api/procurement/request/isAuthorizedForReportsTab`, payload1).then((response) => {
                            if (response) {
                                if (response.data) {
                                    ctrl.hasAccess = true;
                                }
                            } else {
                                ctrl.hasAccess = false;
                            }
                        });
                    }
                }
            });
        }

        // });
    } ]);

angular.module('shiptech.pages').component('viewRequestDocuments', {
    templateUrl: 'pages/view-request-documents/views/view-request-documents-component.html',
    controller: 'ViewRequestDocumentsController'
});

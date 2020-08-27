angular.module('shiptech.pages')
    .controller('ViewRequestDocumentsController', [ '$scope', '$element', '$attrs', '$tenantSettings', '$timeout', '$state', function($scope, $element, $attrs, $tenantSettings, $timeout, $state) {
        // $timeout(function(){
        let ctrl = this;
        ctrl.tenantSettings = $tenantSettings;

        if ($state.params.requestId) {
            $state.params.entity_id = $state.params.requestId;
            $state.params.screen_id = 'request_procurement';
        }

        // used in nav
        $scope.NAV = {};
        $scope.NAV.requestId = $state.params.requestId;

        // });
    } ]);

angular.module('shiptech.pages').component('viewRequestDocuments', {
    templateUrl: 'pages/view-request-documents/views/view-request-documents-component.html',
    controller: 'ViewRequestDocumentsController'
});

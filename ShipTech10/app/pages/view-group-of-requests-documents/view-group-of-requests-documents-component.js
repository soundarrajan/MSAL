angular.module('shiptech.pages').controller('ViewGroupOfRequestsDocumentsController', [ '$scope', '$element', '$attrs', '$timeout', '$state', 'STATE', function($scope, $element, $attrs, $timeout, $state, STATE) {
    var ctrl = this;
    // $timeout(function(){
    if ($state.params.requestId) {
        $state.params.entity_id = $state.params.groupId;
        $state.params.screen_id = 'request_procurement_documents';
    }
    $state.params.screen_id = 'request_procurement_documents';
    // used in nav
    $scope.NAV = {};
    $scope.NAV.requestId = $state.params.requestId;
    $scope.entity_id = $state.params.groupId;
    $scope.screen_id = 'request_procurement_documents';
    ctrl.viewRFQ = function() {
        $state.go(STATE.VIEW_RFQ, {
            requestGroupId: $scope.entity_id
        });
    };
    // });
} ]);
angular.module('shiptech.pages').component('viewGroupOfRequestsDocuments', {
    templateUrl: 'pages/view-group-of-requests-documents/views/view-group-of-requests-documents-component.html',
    controller: 'ViewGroupOfRequestsDocumentsController'
});

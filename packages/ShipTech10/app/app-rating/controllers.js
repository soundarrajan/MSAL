/**
 * Labs Controller
 */
APP_RATING.controller('Controller_Rating', ['$scope', '$Api_Service', 'Factory_Rating', '$state', '$location', '$q', '$compile', function($scope, $Api_Service, Factory_Alerts, $state, $location, $q, $compile) {
    var vm = this;
    var guid = '';
    vm.master_id = $state.params.master_id;
    vm.entity_id = $state.params.entity_id;
    $scope.addedFields = new Object;
    vm.response = "";
    vm.ids = '';
  

}]);
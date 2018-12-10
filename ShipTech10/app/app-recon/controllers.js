/**
 * Recon Controller
 */
APP_RECON.controller('Controller_Recon', ['$scope', '$rootScope', '$Api_Service', 'Factory_Recon', 'Factory_Master', '$state', '$location', '$q', '$compile', function ($scope, $rootScope, $Api_Service, Factory_Recon, Factory_Master, $state, $location, $q, $compile) {
    var vm = this;
    var guid = '';
    vm.master_id = $state.params.master_id;
    vm.entity_id = $state.params.entity_id;
    $scope.addedFields = new Object;
    vm.response = "";
    vm.ids = '';

    if ($state.params.path) {
        vm.app_id = $state.params.path[0].uisref.split('.')[0];
    }
    if ($scope.screen) {
        vm.screen_id = $scope.screen;
    } else {
        vm.screen_id = $state.params.screen_id;
    }

    vm.reconTree = [];
    vm.reconCatalog = function () {
        vm.reconTree = [

            { id: 1, title: 'Recon List', slug: 'recon', icon: 'fa fa-folder icon-lg', nodes: 1 }

        ];
    };
    vm.selectReconScreen = function (id, name) {
        $location.path('/recon/' + id);
        $scope.recon_screen_name = name;
    };

    $scope.reconQuantityDispute = function() {
        var ClaimTypeId = 1;
        DeliveryProductId = $scope.selectedReconProduct;
        if (typeof(DeliveryProductId != 'undefined') && DeliveryProductId != null) {
            var data = {
                "LabTestResultIds": [],
                "DeliveryQualityParameterIds": [],
                "DeliveryProductId": DeliveryProductId,
                "ClaimTypeId": ClaimTypeId
            }
            Factory_Master.raise_claim(data, function(response) {
                if (response) {
                    if (response.status == true) {
                        $scope.loaded = true;
                        toastr.success(response.message);
                        localStorage.setItem('claimsclaims_newEntity', angular.toJson(response.data));
                        window.open($location.$$absUrl.replace($location.$$path, '/claims/claim/edit/'), '_blank');
                    } else {
                        $scope.loaded = true;
                        toastr.error(response.message);
                    }
                }
            })
        } else {
            toastr.error("Please select one row in quantity table")
        }
    }
    $scope.setPageTitle = function(title){

        $rootScope.$broadcast('$changePageTitle', {
            title: title
        })
    }
    
    $scope.$on('formValues', function(){
        if(vm.app_id == "recon"){
        console.log($scope.formValues);
               //1. use request id
            if($scope.formValues.requestInfo){
                if($scope.formValues.requestInfo.request){
                    var title = "Recon - " + $scope.formValues.requestInfo.request.name + " - " + $scope.formValues.requestInfo.vesselName;
                    $scope.setPageTitle(title);
                    return;
                }
            }

            //2. use order
            if($scope.formValues.order){
                var title = "Recon - " + $scope.formValues.order.name + " - " + $scope.formValues.vesselName;
                $scope.setPageTitle(title);
            }

            
        }

    });

}]);
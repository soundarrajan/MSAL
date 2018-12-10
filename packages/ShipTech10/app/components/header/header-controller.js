angular.module('shiptech').controller('HeaderController', ['$scope', '$rootScope', '$state', '$timeout', 'Factory_Admin', 'STATE','adalAuthenticationService', function($scope, $rootScope, $state, $timeout, Factory_Admin, STATE,adalService) {

    $scope.currentDate = moment().format('dddd, MMMM Do YYYY');
    $scope.state = $state;
    $scope.STATE = STATE;

    $scope.$on('userId', function(e, v) {
        Factory_Admin.getUsername(v, function(response){
            if(response){
                  $scope.userProfile = response.payload.username + " | " + response.payload.displayName;
                  $rootScope.user = {
                    id: response.payload.id,
                    name: response.payload.username
                }
            }else{
                $scope.userProfile = "";
            }
        })
    });
    $scope.logout = function(){
         adalService.logOut();
         if (!localStorage.getItem('loggedOut')) {
             localStorage.setItem('loggedOut', true)
         }
         sessionStorage.clear();
    }

    $timeout(function () {
    	Layout.init();
    });
}]);

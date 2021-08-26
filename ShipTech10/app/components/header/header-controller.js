angular.module('shiptech').controller('HeaderController', [ '$scope', '$rootScope', '$state', '$timeout', 'Factory_Admin', 'STATE', 'adalAuthenticationService', '$tenantSettings', function($scope, $rootScope, $state, $timeout, Factory_Admin, STATE, adalService, $tenantSettings) {
    $scope.currentDate = moment().format('dddd, MMMM Do YYYY');
    $scope.state = $state;
    $scope.STATE = STATE;
    $scope.userManualLink = $tenantSettings.userManualLink;
    $scope.smartTraderLink = $tenantSettings.smartTraderLink;

    $scope.$on('userId', (e, v) => {
        Factory_Admin.getUsername(v, (response) => {
            if(response) {
                $scope.userProfile = `${response.payload.username } | ${ response.payload.displayName}`;
                $rootScope.user = {
                    id: response.payload.id,
                    name: response.payload.username,
                    displayName: response.payload.displayName
                };
              
            }else{
                $scope.userProfile = '';
            }
        });
    });
    $scope.logout = function() {
        adalService.logOut();
        if (!localStorage.getItem('loggedOut')) {
            localStorage.setItem('loggedOut', true);
        }
        sessionStorage.clear();
    };

    $scope.setDefaultLandingPage = function() {
        $rootScope.productTypeView = null;
    }

    $timeout(() => {
    	Layout.init();
    });
} ]);

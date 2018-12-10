angular.module('shiptech').controller('AllRequestsContentMenuController', ['$scope', '$state', 'STATE',
    function($scope, $state, STATE) {

        $scope.state = $state;
        $scope.STATE = STATE;
    }
]);
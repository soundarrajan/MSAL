angular.module('shiptech').controller('ScheduleContentMenuController', [ '$scope', '$state', 'STATE',
    function($scope, $state, STATE) {
        $scope.state = $state;
        $scope.STATE = STATE;
    }
]);

angular.module('shiptech.pages').directive('stTable', function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/st-table.html',
        scope: {
            table: '=table',
        }
    };
});
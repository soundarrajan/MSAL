angular.module('shiptech.pages').directive('stTable', () => {
    return {
        restrict: 'E',
        templateUrl: 'directives/st-table.html',
        scope: {
            table: '=table',
        }
    };
});

angular.module('shiptech.pages').directive('calendarPopover', ['tenantService', function(tenantService) {

    return {        
        restrict: 'E',
        templateUrl: 'directives/calendar-popover.html',
        scope: {
            voyageStop: '=voyageStop',
        },

        link: function(scope, element, attrs) {
            scope.numberPrecision = tenantService.tenantSettings.defaultValues;
        }
    };
}]);
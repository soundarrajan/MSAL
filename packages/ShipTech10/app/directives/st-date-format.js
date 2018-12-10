angular.module('shiptech.pages').directive('stDateFormat', ['$window', '$injector', function($window, $injector) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
            var moment = $window.moment;
            var tenantService,
                dateFormat;
            if (attrs.stDateFormat === 'supplierPortal') {
                tenantService = $injector.get('tenantSupplierPortalService');
            } else {
                tenantService = $injector.get('tenantService');
            }
              // if (attrs.onlyDate) alert(1)
            // dateFormat = tenantService.getDateFormat();
            ctrl.$formatters.unshift(function(modelValue) {
                // debugger;
                if (!dateFormat)
                    if (attrs.onlyDate) {
                        dateFormat = tenantService.getDateFormat();
                        dateFormat = dateFormat.split(" ")[0];
                        // dateFormat = 'DD/MM/YYYY';
                    } else {
                        dateFormat = tenantService.getDateFormat();
                    }
                if (!dateFormat || !modelValue) return "";
                var retVal;
                // We're getting UTC dates from server.
                // moment.js uses by default local timezone (http://momentjs.com/docs/#/parsing/utc/).
                // We want to display server time (UTC), unless specifically
                // required to display local time, via the st-date-to-local
                // custom attribute.
                if (!dateFormat)
                    if (attrs.onlyDate) {
                        dateFormat = tenantService.getDateFormat();
                        dateFormat = dateFormat.split(" ")[0];
                        // dateFormat = 'DD/MM/YYYY';
                    } else {
                        dateFormat = tenantService.getDateFormat();
                    }
                if (attrs.stDateToLocal !== undefined) {
                    // moment.js default behavior: return date in LOCAL TIME.
                    retVal = moment.utc(modelValue).local().format(dateFormat);
                } else {
                    // Make moment.js use UTC (as the server date provided).
                    retVal = moment.utc(modelValue).format(dateFormat);
                }
                return retVal;
            });
            ctrl.$parsers.unshift(function(viewValue) {
                if (!dateFormat)
                    if (attrs.onlyDate) {
                        dateFormat = tenantService.getDateFormat();
                        dateFormat = dateFormat.split(" ")[0];
                        // dateFormat = 'DD/MM/YYYY';
                    } else {
                        dateFormat = tenantService.getDateFormat();
                    }
                var date;
                // When parsing the model value, always use UTC, since this goes to the server.
                if (attrs.stDateToLocal !== undefined) {
                    date = moment(viewValue, dateFormat);
                }else{
                    date = moment.utc(viewValue, dateFormat);
                }
                return date.format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ');
            });
        }
    };
}]);

angular.module('shiptech.pages').directive('dateBefore', [ 'tenantService', 
    function(tenantService) {

        var link = function($scope, $element, $attrs, ctrl) {

            var validate = function(viewValue) {
                var compare = $attrs.dateBefore,
                    viewDate;

                if(!viewValue || !compare){
                    // It's valid because we have nothing to compare against.
                    ctrl.$setValidity('dateBefore', true);
                }

                compare = moment(compare);
                viewDate = moment(viewValue, tenantService.getDateFormat());

                // It's valid if model date is lower than the model we're comparing against
                ctrl.$setValidity('dateBefore', viewDate.isBefore(compare) || viewDate.isSame(compare));
                
                return viewValue;
            };

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.push(validate);

            $attrs.$observe('dateBefore', function(compare){
                // Whenever the comparison model changes we'll re-validate
                // console.log("observe " + ctrl.$viewValue);
                return validate(ctrl.$viewValue);
            });

        };

        return {
            require: 'ngModel',
            link: link
        };

    }
]);
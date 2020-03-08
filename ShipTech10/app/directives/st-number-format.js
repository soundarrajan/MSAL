angular.module('shiptech.pages').directive('stNumberFormat', [ '$filter', function($filter, tenantService) {
    return {
        require:'^ngModel',
        restrict:'A',


        link: function(scope, element, attrs, ctrl) {
            let precision = attrs.stNumberFormat,
                decimalSeparator = getDecimalSeparator();


            function getDecimalSeparator() {
                let n = 1.1;
                n = n.toLocaleString().substring(1, 2);
                return n;
            }


            ctrl.$formatters.unshift((modelValue) => {
                if(!modelValue) {
                    return modelValue;
                }

                return parseFloat(modelValue).toFixed(precision);
            });


            ctrl.$parsers.unshift((viewValue) => {
                let parts = viewValue.split(decimalSeparator),
                    decimalLength = 0;

                if(parts[1]) {
                    decimalLength = parts[1].length;
                }

                if(decimalLength > precision) {
                    viewValue = parseFloat(viewValue).toFixed(precision);
                    ctrl.$setViewValue(viewValue);
                    ctrl.$render();
                }

                return viewValue;
            });
        }
    };
} ]);

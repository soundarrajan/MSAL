angular.module('shiptech.pages').directive('decodeInputFormat', [ '$window', '$injector', function($window, $injector) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$formatters.unshift((modelValue) => {
                var decode = function(str) {
                    return str.replace(/&#(\d+);/g, function(match, dec) {
                        return String.fromCharCode(dec);
                    });
                };
                if (modelValue) {
                    console.log(modelValue);
                }
                return decode(_.unescape(modelValue));
            });
            ctrl.$parsers.unshift((viewValue) => {
                 return viewValue;
            });
        }
    };
} ]);

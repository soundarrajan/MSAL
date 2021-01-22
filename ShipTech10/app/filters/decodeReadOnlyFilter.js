(function() {
    'use strict';

    angular
        .module('shiptech.pages')
        .filter('decodeReadOnly', [ 'tenantService', Filter ]);

    function Filter(tenantService) {
        return function(value, format) {
            var decode = function(str) {
                return str.replace(/&#(\d+);/g, function(match, dec) {
                    return String.fromCharCode(dec);
                });
            };
            return decode(_.unescape(value));
 
        };
    }
}());
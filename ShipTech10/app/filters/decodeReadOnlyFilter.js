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
            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    value[i].name = decode(_.unescape(value[i].name));
                }
                return value;
            }
            return decode(_.unescape(value));
 
        };
    }
}());
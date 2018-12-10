(function () {
    'use strict';

    angular
        .module('shiptech.pages')
        .filter('utcToLocal', ["$filter", Filter]);

    function Filter($filter) {
        return function (utcDateString, format) {

            if(!format) {
                format = 'yyyy-MM-ddTHH:mm:ss';
            }

            // return if input date is null or undefined
            if (!utcDateString) {
                return;
            }

            // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
            if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
                utcDateString += 'Z';
            }

            // convert and format date using the built in angularjs date filter
            return $filter('date')(utcDateString, format);
        };
    }
})();
(function () {
    'use strict';

    angular
        .module('shiptech.pages')
        .filter('stDateFormat', ['tenantService', Filter]);

    function Filter(tenantService) {
        return function (utcDateString, format) {

            if(!format) {
                format = tenantService.getDateFormat();
            }

            // return if input date is null or undefined
            if (!utcDateString) {
                return;
            }

            // convert and format date using the built in angularjs date filter
            // return moment.utc(utcDateString).format(format);

            // convert and format date using the built in angularjs date filter
            var formattedDate = moment.utc(utcDateString).format(format);
            if(formattedDate == "Invalid date"){
                //date in of type date only => results in invalid, give specific format
                var formattedDateOnly = moment.utc(moment(utcDateString,'DD/MM/YYYY')).format(format);
            }else{
                //else return date
                return formattedDate;
            }


        };
    }
})();

angular.module('shiptech')
    .service('dateService', [
        function() {
            // Date format differs between moment.js and the datepicker component,
            // resulting in gross date errors when user selects the date via the datepicker.
            // The array below contains the format equivalencies.
            // Order matters in this array!
            let moment2picker = [
                {
                    group: 0,
                    m: 'DD',
                    p: 'dd'
                },
                {
                    group: 1,
                    m: 'mm',
                    p: 'ii'
                },
                {
                    group: 2,
                    m: 'MMM',
                    p: 'M'
                },
                {
                    group: 2,
                    m: 'MM',
                    p: 'mm'
                },
                {
                    group: 3,
                    m: 'YYYY',
                    p: 'yyyy'
                },
                {
                    group: 3,
                    m: 'YY',
                    p: 'yy'
                },
                {
                    group: 4,
                    m: 'HH',
                    p: 'hh'
                },
                {
                    group: 4,
                    m: 'hh',
                    p: 'HH'
                }
            ];

            /**
                * Produces a datetime format apropriate for the datetimepicker component, based on
                * the tenant format.
                */
            function getDateFormatForPicker(tenantSettings) {
                let format = getDateFormat(tenantSettings),
                    re,
                    group,
                    temp,
                    done = [];

                // console.log(format);

                if(!format) {
                    return;
                }

                for(let i = 0; i < moment2picker.length; i++) {
                    // If a token from the current group has already been
                    // replaced, don't replace it again.
                    if(done.indexOf(moment2picker[i].group) >= 0) {
                        continue;
                    }

                    re = new RegExp(moment2picker[i].m, 'g');

                    // Save the string for later comparison to determine if a replacement
                    // has actually occured.
                    temp = format;

                    format = format.replace(re, moment2picker[i].p);

                    // If a replacement actually occured, save the group
                    // into the "done" array.
                    if(temp !== format) {
                        done.push(moment2picker[i].group);
                    }
                }

                // console.log(format);

                return format;
            }


            function getDateFormat(tenantSettings) {
                if(!tenantSettings || !tenantSettings.tenantFormats) {
                    return;
                }

                return tenantSettings.tenantFormats.dateFormat.name.replace(/y/g, 'Y').replace(/d/g, 'D');
            }


            function formatDate(date, tenantSettings) {
                return moment.utc(date).format(getDateFormat(tenantSettings));
            }


            return {
                getDateFormat: getDateFormat,
                getDateFormatForPicker: getDateFormatForPicker,
                formatDate: formatDate
            };
        } ]);

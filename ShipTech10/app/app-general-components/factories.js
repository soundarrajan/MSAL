/**
 * General Components Factory
 */

APP_GENERAL_COMPONENTS.factory('Factory_General_Components', [ '$http', '$Api_Service', 'API', function($http, $Api_Service, API) {
    // var general_api = 'api'; // not used anymore

    let table_config = '';

    return {

        /**
         * not used anymore
        list_table: function (master_id) {
            return general_api + master_id;
        },
        */

        get_table_config: function(app_id, config_id, callback) {
            console.log(app_id);

            $http({
                method: 'POST',
                url: 'http://shiptech.dev.ascensys.ro/clc2/master_config.php', // CLC_table_config
                data: $.param({
                    app_id: app_id,
                    config_id: config_id
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then((response) => {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
        },
        entity_export: function(param, callback) {
            $Api_Service.entity.export(param, (result) => {
                callback(result);
            });
        },
        entity_copy: function(id, url, callback) {
            $http({
                method: 'POST',
                url: $Api_Service.route.get('entity_copy'),
                data: $.param({
                    entity_id: id
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then((response) => {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
        },

        entity_new: function(id, url, callback) {
            $http({
                method: 'POST',
                url: $Api_Service.route.get('entity_new'),
                data: $.param({
                    entity_id: id
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then((response) => {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
        },

        entity_save: function(callback) {
            callback(false);
        },

        entity_discard: function(callback) {
            callback(false);
        },

        entity_delete: function(id, payload, callback) {
            // callback(true);
            let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/documentupload/delete`;

            $http.post(url, { Payload: payload }, {})
                .then((response) => {
                    if (response) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                }, (response) => {
                    console.log('HTTP ERROR');
                    callback(false);
                });
        },

        structure_save: function(callback) {
            callback(false);
        },

        structure_discard: function(callback) {
            callback(false);
        },

        action: function(ajax_method) {
            switch (ajax_method) {
            case 'new_entity':
                break;
            }
        },

        /*
        structure_save_changes: function (callback) {
            console.log('saving data');
            callback(true);
        },

        structure_discard_changes: function (callback) {
            console.log('discard data');
            callback(false);
        },
        */
        update_scheduler_configuration: function(payload, callback) {
            var url = `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/updateschedulerconfiguration`;

            $http.post(url, { Payload: payload }, {})
                .then((response) => {
                    if(response && response.status == 200) {
                        toastr.success('Successfully updated schedule');
                    }
                }, (response) => {
                    console.log('HTTP ERROR');
                    toastr.error('Error occured');
                });
        },

        get_note: function(payload, callback) {
            url = `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/getnotebyid`;

            $http.post(url, { Payload: payload }, {})
                .then((response) => {
                    if(response && response.status == 200) {
                        callback(response.data.payload);
                    }
                }, (response) => {
                    console.log('HTTP ERROR');
                });
        },

        update_note: function(payload, callback) {
            url = `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/updatenote`;

            $http.post(url, { Payload: payload }, {})
                .then((response) => {
                    if(response && response.status == 200) {
                    // toastr.success('Successfully updated note');
                    }
                }, (response) => {
                    console.log('HTTP ERROR');
                // toastr.error("Error occured");
                });
        },

        update_documents_note: function(payload, callback) {
            url = `${API.BASE_URL_DATA_MASTERS }/api/masters/documentupload/notes`;

            $http.post(url, { Payload: payload }, {})
                .then((response) => {
                    if(response && response.status == 200) {
                        callback(response);
                    }
                }, (response) => {
                    console.log('HTTP ERROR');
                    callback(response);
                });
        },

        delete_upload_log: function(payload, callback) {
            url = `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/deleteuploadlog`;

            $http.post(url, { Payload: payload }, {})
                .then((response) => {
                    if(response && response.status == 200) {
                    // toastr.success('Successfully deleted log');
                    // $('table.ui-jqgrid-btable').trigger("reloadGrid");
                        callback(response);
                    }
                }, (response) => {
                    console.log('HTTP ERROR');
                    toastr.error('Error occured');
                });
        },
        updateTreasuryInfo: function(payload, callback) {
            url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/updateTreasuryInfo`;
            $http.post(url, { Payload: payload }, {})
                .then((response) => {
                    if(response && response.status == 200) {
                        callback(response.data);
	                // toastr.success("Saved successfully");
                    } else {
	                toastr.error('Error occured while saving');
                    }
                }, (response) => {
                    console.log('HTTP ERROR');
                    toastr.error('Error occured');
                });
        },
        updateDocumentVerify: function(payload, callback) {
            url = `${API.BASE_URL_DATA_MASTERS }/api/masters/documentupload/update`;
            $http.post(url, { Payload: payload }, {})
                .then((response) => {
                    if(response && response.status == 200) {
                        callback(response);
                    }
                }, (response) => {
                    console.log('HTTP ERROR');
                    toastr.error('Error occured');
                });
        }

    };
} ]);

APP_GENERAL_COMPONENTS.factory('Factory_App_Dates_Processing', [ '$tenantSettings', '$filter', function($tenantSettings, $filter) {
    // / FACTORY INITIALIZATION

    //  helper functions
    let datePositions = {
        day: 0,
        month: 0,
        year: 0
    };
    let charCodes = {
        47: '/',
        45: '-',
        46: '.'
    };
    function parseHour(str) {
        str = str.split(' ')[1];
        return {
            hours: str.split(':')[0],
            minutes: str.split(':')[1]
        };
    }
    function parseDate(str, separator, positions) {
        str = str.split(' ')[0];
        return {
            day: str.split(separator)[positions.day],
            month: str.split(separator)[positions.month],
            year: str.split(separator)[positions.year]
        };
    }
    function findSeparator(str) {
    	return null;
    }
    function calculateDatePositions(format) {
        format = format.toLowerCase();
        format = format.split(' ')[0]; // remove hour
        let separator = findSeparator(format);
        let bits = format.split(separator);
        $.each(bits, (key, val) => {
            if(val.indexOf('y') >= 0) {
                datePositions.year = key;
            }
            if(val.indexOf('m') >= 0) {
                datePositions.month = key;
            }
            if(val.indexOf('d') >= 0) {
                datePositions.day = key;
            }
        });

        return datePositions;
    }
    function normalizeFormatter(str) {
        str.replace('MMM', 'MM');
        return str;
    }
    function formMomentFormat(format, dateOnly) {
        let date = format.split(' ')[0].toUpperCase();
        if(dateOnly) {
            return date;
        }
        return `${date } HH:mm`; // default 24hours and minutes
    }
    function formMaskFormat(format, dateOnly) {
        // debugger;
        let idx;
        let mask = '';
        format = format.toLowerCase();
        if(format.indexOf('mmm') < 0) {
            // only numbers
            for(idx = 0; idx < format.length; idx++) {
                if(format.charCodeAt(idx) >= 97 && format.charCodeAt(idx) <= 122) { // is letter
                    mask = `${mask }0`; // allow any number
                }else{
                    mask = mask + format[idx];
                }
            }
        }else{
            // for 'MMM' allow letters
            for(idx = 0; idx < format.length; idx++) {
                if(format.charCodeAt(idx) >= 97 && format.charCodeAt(idx) <= 122) { // is letter
                    if(format.charCodeAt(idx) == 109) {
                        mask = `${mask }A`; // allow any letter
                    }else{
                        mask = `${mask }0`; // allow any number
                    }
                }else{
                    mask = mask + format[idx];
                }
            }
        }
        if(dateOnly) {
            return mask.split(' ')[0];
        }
        return mask;
    }
    // end helper functions

    // / initialization
    //  --------------- 1. normal dates
    let currentFormat = $tenantSettings.tenantFormats.dateFormat.name;

    let DATE_POSITIONS = calculateDatePositions(currentFormat);
    let SEPARATOR = findSeparator(currentFormat);
    let momentFormat = formMomentFormat(currentFormat);
    let momentFormatDateOnly = formMomentFormat(currentFormat, true);
    let maskFormat = formMaskFormat(currentFormat);
    let maskFormatDateOnly = formMaskFormat(currentFormat, true);

    let DATE_OPTIONS = {
        datePositions: DATE_POSITIONS,
        separator: SEPARATOR,
        momentFormat: momentFormat,
        momentFormatDateOnly: momentFormatDateOnly,
        maskFormat: maskFormat,
        maskFormatDateOnly: maskFormatDateOnly
    };

    // -------------- 2. filter dates
    let filterFormat = null;
    let FILTER_DATE_POSITIONS = null;
    let FILTER_SEPARATOR = null;
    let f_momentFormat = null;
    let f_momentFormatDateOnly = null;
    let f_maskFormat = null;
    let f_maskFormatDateOnly = null;
    let filterDatesInitialized = false;

    let FILTER_DATE_OPTIONS = {
        datePositions: null,
        separator: null,
        momentFormat: null,
        momentFormatDateOnly: null,
        maskFormat: null,
        maskFormatDateOnly: null
    };


    // mask options
    let options = {
        translation: {
            // -----  date
            // 1. day
            d: { pattern: /[0-2]/ }, // fist digit of day ( 0 / 2 ),
            e: { pattern: /[0-9]/ }, // second digit of day ( 0 / 9 ),
            f: { pattern: /[0-1]/ }, // second digit of day ( 0 / 1 ),
            // 2. month
            m: { pattern: /[0-1]/ }, // first digit of month ( 0 / 1)
            n: { pattern: /[0-9]/ }, // second digit of month ( 0 -9 )
            o: { pattern: /[0-2]/ }, // second digit of month ( 0 -2 )
            // 3. year
            y: { pattern: /[0-9]/ },
            // ----- hour
            // 4. hour
            h: { pattern: /[0-2]/ }, // first digit of hour ( 0 - 2)
            j: { pattern: /[0-9]/ }, // second digit of hour ( 0 - 9 )
            K: { pattern: /[0-4]/ }, // second digit of hour ( 0 - 4)
            // 5. min
            a: { pattern: /[0-5]/ }, // first digit of minute ( 0 - 5 )
            b: { pattern: /[0-9]/ }, // second digit of minute ( 0 - 9)
        },
        onKeyPress: function(value, e, field, options) {
            // select formatter
            let formatUsed = '';
            if(field.hasClass('date-only')) {
                formatUsed = vm.DATE_OPTIONS.momentFormatDateOnly;
            }else{
                formatUsed = vm.DATE_OPTIONS.momentFormat;
            }

            // process date
            let val = moment(value, formatUsed, true);

            // console.log(field.hasClass('date-only'))
            // console.log(val, val.isValid());

            // test date validity
            if(vm.invalidDate === undefined) {
                vm.invalidDate = {};
            }
            if(val.isValid()) {
                vm.invalidDate[field[0].name] = false;
            }else{
                vm.invalidDate[field[0].name] = true;
            }
        }
    };
    // end mask options


    // / END FACTORY INITIALIZATION

    var formatDateTime = function(elem, dateFormat, fieldUniqueId) {
        // console.log(fieldUniqueId)
        if (elem) {
            dateFormat = $tenantSettings.tenantFormats.dateFormat.name;
            dateFormat = dateFormat.replace(/D/g, 'd').replace(/Y/g, 'y');
            if (typeof fieldUniqueId == 'undefined') {
                fieldUniqueId = 'date';
            }
            if (fieldUniqueId == 'deliveryDate' && vm.app_id == 'recon') {
                return vm.formatDate(elem, 'dd/MM/yyyy');
            }
            if (fieldUniqueId == 'invoiceDate' && vm.app_id == 'invoices') {
                return vm.formatDate(elem, 'dd/MM/yyyy');
            }
            if (fieldUniqueId == 'eta' ||
                fieldUniqueId == 'orderDetails.eta' ||
                fieldUniqueId == 'etb' ||
                fieldUniqueId == 'etd' ||
                fieldUniqueId.toLowerCase().indexOf('delivery') >= 0 ||
                fieldUniqueId.toLowerCase().indexOf('eta') >= 0 ||
                fieldUniqueId == 'pricingDate') {
                // debugger;
                // return moment.utc(elem).format($scope.tenantSetting.tenantFormatss.dateFormat.name);
                var utcDate = moment.utc(elem).format();
                var formattedDate = $filter('date')(utcDate, dateFormat, 'UTC');
                // return moment.utc(elem).format(dateFormat);
            } else {
                formattedDate = $filter('date')(elem, dateFormat);
            }
            return formattedDate;
        }
    };

    var formatSimpleDate = function(date) {
        var dateFormat = $tenantSettings.tenantFormats.dateFormat.name;
        window.tenantFormatsDateFormat = dateFormat;
        dateFormat = dateFormat.replace(/d/g, 'D').replace(/y/g, 'Y').split(' ')[0];
        if (date) {
            return moment.utc(date).format(dateFormat);
        }
        return;
    };

    var doFilterDatesInitialization = function() {
        filterFormat = window.tenantFormatsDateFormat;
        if(filterFormat) {
            FILTER_DATE_POSITIONS = calculateDatePositions(filterFormat);
            FILTER_SEPARATOR = findSeparator(filterFormat);
            f_momentFormat = formMomentFormat(filterFormat);
            f_momentFormatDateOnly = formMomentFormat(filterFormat, true);
            f_maskFormat = formMaskFormat(filterFormat);
            f_maskFormatDateOnly = formMaskFormat(filterFormat, true);

            FILTER_DATE_OPTIONS = {
                datePositions: FILTER_DATE_POSITIONS,
                separator: FILTER_SEPARATOR,
                momentFormat: f_momentFormat,
                momentFormatDateOnly: f_momentFormatDateOnly,
                maskFormat: f_maskFormat,
                maskFormatDateOnly: f_maskFormatDateOnly
            };
        }
    };

    return {
        formatDateTime: formatDateTime,
        formatSimpleDate: formatSimpleDate,
    };
} ]);

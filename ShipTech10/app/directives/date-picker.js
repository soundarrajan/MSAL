angular.module('shiptech.pages').directive('newDatePicker', ['$window', '$injector', '$tenantSettings', function($window, $injector, $tenantSettings) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ngModel) {
            var BLOCKS = {
                YYYY: {
                    mask: IMask.MaskedRange,
                    from: 1970,
                    to: 2030
                },
                MM: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12
                },
                MMM: {
                  mask: IMask.MaskedEnum,
                  enum: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                  ]
                },
                DD: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 31
                },
                HH: {
                    mask: IMask.MaskedRange,
                    from: 0,
                    to: 23
                },
                mm: {
                    mask: IMask.MaskedRange,
                    from: 0,
                    to: 59,
                },
            };

            function reset(element) {
                scope.$apply(function() {
                    ngModel.$setViewValue(null);
                    ngModel.$commitViewValue();
                });
            }

            function picker(element, params) {
            }

            var prevValue = null;

            var currentFormat = $tenantSettings.tenantFormats.dateFormat.name;
            // currentFormat = 'dd/MMM/yyyy HH:mm';

            if (attrs['pickerType'] == 'date') {
                currentFormat = currentFormat.split(' ')[0];
            }

            currentFormat = currentFormat.replace(/d/g, "D");
            currentFormat = currentFormat.replace(/y/g, "Y");

            var dateInputId = attrs['id'] + '_dateinput';
            var dateInput = '<input type="text" class="form-control" id="' + dateInputId + '">';
            var dateIcon = '<i class="fa fa-calendar date-picker-icon"></i>';

            var maskTyping = false;
            var element = null;

            var init = new Promise(function(resolve, reject) {
                setTimeout(function() {
                    if ($('#' + attrs['id'] + '_dateinput').length) {
                        return;
                    }

                    if (attrs['noIcon']) {
                        $('#' + attrs['id']).after(dateInput);
                    } else {
                        $('#' + attrs['id']).after(dateInput).after(dateIcon);
                    }

                    element = document.getElementById(dateInputId);

                    resolve(new IMask(element, {
                        mask: Date,
                        pattern: currentFormat,
                        // lazy: false,
                        min: new Date(1970, 0, 1),
                        max: new Date(2030, 0, 1),
                        blocks: BLOCKS,
                        format: function (date) {
                            return moment.utc(date).format(currentFormat);
                        },
                        parse: function (str) {
                            return moment.utc(str, currentFormat, true);
                        }
                    }));
                }, 0);
            });

            init.then(function(mask) {
                $(element).datetimepicker({
                    format: currentFormat,
                    // showMeridian: true,
                    keepOpen: false,
                    keepInvalid: true,
                    useStrict: true,
                    useCurrent: false,
                    // sideBySide: true,
                    // debug: true,
                    // inline: true,
                    widgetParent: $('.page-container')
                });

                $('#' + dateInputId).on('dp.change', function(e) {
                    if (moment(e.oldDate).format(currentFormat) != moment(e.date).format(currentFormat)) {
                        mask.value = moment(e.date).format(currentFormat);
                        maskTyping = false;
                    }
                });

                $(element).on('focus', function(e) {
                    $(element).removeClass('focusedOut');
                    $('.bootstrap-datetimepicker-widget').css($(element).offset());
                });

                $(element).on('blur', function(e) {
                    if ($(element).hasClass('focusedOut')) {
                        return;
                    }
                    $(element).addClass('focusedOut');

                    if (maskTyping) {
                        if (!attrs['required'] && !mask.value) {
                            $(element).removeClass('invalid');
                            reset();
                        } else {
                            toastr.error("Please enter the correct format");
                            $(element).addClass('invalid');
                        }
                    } else {
                        if (mask.value) {
                            value = moment.utc(mask.value, currentFormat, true); 
                            if ((value && !prevValue) || (value && value.format(currentFormat) != prevValue)) {
                                prevValue = value.format(currentFormat);
                                scope.$apply(function() {
                                    ngModel.$setViewValue(value.format('YYYY-MM-DDTHH:mm:ss') + '+00:00');
                                    ngModel.$commitViewValue();
                                    maskTyping = false;
                                    mask.value = moment.utc(value).format(currentFormat);
                                    $(element).removeClass('invalid');
                                });
                            }
                        } else {
                            if (!attrs['required'] && !mask.value) {
                                $(element).removeClass('invalid');
                                reset();
                            }
                        }
                        /*
                        value = '';
                        if (mask.value) {
                            value = moment.utc(mask.value, currentFormat, true); 
                        } else if ($('#' + dateInputId).data("DateTimePicker").date()) {
                            value = $('#' + dateInputId).data("DateTimePicker").date();
                        }
                        if ((value && !prevValue) || (value && value.format(currentFormat) != prevValue)) {
                        // if (value) {
                            prevValue = value.format(currentFormat);
                            scope.$apply(function() {
                                ngModel.$setViewValue(value.format('YYYY-MM-DDTHH:mm:ss') + '+00:00');
                                ngModel.$commitViewValue();
                                maskTyping = false;
                                mask.value = moment.utc(value).format(currentFormat);
                                $(element).removeClass('invalid');
                            });
                        }
                        */
                    }
                });

                // if (ngModel.$viewValue) {
                // }
                // mask.value = moment(ngModel.$viewValue, "YYYY-MM-DDTHH:mm:ss").add(moment().utcOffset(), 'minutes').format(currentFormat);

                if (ngModel.$viewValue && $('#' + dateInputId).data("DateTimePicker")) {
                    $('#' + dateInputId).data("DateTimePicker").date(moment.utc(ngModel.$viewValue));
                    prevValue = moment.utc(ngModel.$viewValue).format(currentFormat);
                  
                }

                scope.$watch(attrs['ngModel'], function(v) {
                    if (v && $('#' + dateInputId).data("DateTimePicker")) {
                        $('#' + dateInputId).data("DateTimePicker").date(moment.utc(v));
                        prevValue = moment.utc(v).format(currentFormat);
                        mask.value = moment.utc(v).format(currentFormat);
                    }
                });
                scope.$watch(attrs['ngDisabled'], function(v) {
                    if (v) {
                        $('#' + dateInputId).attr('disabled', attrs['ngDisabled']);
                    }
                });
                scope.$watch(attrs['ngRequired'], function(v) {
                    if (v) {
                        $('#' + dateInputId).attr('required', attrs['ngRequired']);
                    }
                });
                /*
                scope.$watch(attrs['ngClass'], function(v) {
                    if (v) {
                        $('#' + dateInputId).attr('class', attrs['ngClass']);
                    }
                });
                */

                mask.on('accept', function() {
                    maskTyping = true;
                });

                mask.on('complete', function() {
                    maskTyping = false;
                });
            });
        }
    };
}]);

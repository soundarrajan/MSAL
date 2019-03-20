angular.module('shiptech.pages').directive('newDatePicker', ['tenantModel', '$window', '$injector', '$tenantSettings', '$stateParams', function(tenantModel, $window, $injector, $tenantSettings, $stateParams) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ngModel) {
            var BLOCKS = {
                YYYY: {
                    mask: IMask.MaskedRange,
                    from: 1753,
                    to: 3000
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
            if (attrs.screenType === 'supplierPortal') {
            	tenantService = tenantModel.getGlobalConfigurationForSupplierPortal($stateParams.token).payload;
	            var currentFormat = tenantService.tenantFormats.dateFormat.name;
            } else {
	            var currentFormat = $tenantSettings.tenantFormats.dateFormat.name;
            }

            if (attrs['pickerType'] == 'date') {
                currentFormat = currentFormat.split(' ')[0];
            }

            currentFormat = currentFormat.replace(/d/g, "D");
            currentFormat = currentFormat.replace(/y/g, "Y");

            var dateInputId = attrs['id'] + '_dateinput';
            var dateInput = '<input type="text" class="form-control" id="' + dateInputId + '">';
            var dateIcon = '<i class="fa fa-calendar date-picker-icon"';

            if (attrs['pickerType'] == 'datetime') {
                dateIcon += ' style="right: 34px;"></i>';
            } else {
                dateIcon += '></i>';
            }

            if (attrs['pickerType'] == 'datetime') {
                var timeIcon = '<i class="fa fa-clock-o time-picker-icon" id="' + dateInputId + '_timeicon"></i>';

                var timeTpl = '<div class="time-picker-container" id="' + dateInputId + '_time">';

                timeTpl += '<div class="custom-time-picker-header"> Hour </div><div class="custom-time-picker-row">';

                for (var i = 0; i < 24; i++) {
                    timeTpl += '<span class="' + dateInputId + '_hour custom-time-picker-cell">' + String(i) + ' </span>';
                    if ((i + 1) % 12 == 0) {
                        timeTpl += '</div><div class="custom-time-picker-row">';
                    }
                }

                timeTpl += '</div>';

                timeTpl += '<div class="custom-time-picker-header"> Minute </div><div class="custom-time-picker-row">';

                for (var i = 0; i < 60; i++) {
                    timeTpl += '<span class="' + dateInputId + '_minute custom-time-picker-cell">' + String(i) + ' </span>';
                    if ((i + 1) % 12 == 0) {
                        timeTpl += '</div><div class="custom-time-picker-row">';
                    }
                }

                timeTpl += '</div>';
            }

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
                        if (attrs['pickerType'] == 'datetime') {
                            $('#' + attrs['id']).after(dateInput).after(dateIcon).after(timeIcon);
                        } else {
                            $('#' + attrs['id']).after(dateInput).after(dateIcon);
                        }
                    }

                    element = document.getElementById(dateInputId);

                    resolve(new IMask(element, {
                        mask: Date,
                        pattern: currentFormat,
                        // lazy: false,
                        min: new Date(1753, 0, 1),
                        max: new Date(3000, 0, 1),
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

                if (attrs['pickerType'] == 'datetime') {
                    $('#' + dateInputId + '_timeicon').click(function() {
                        if (!mask.value) {
                            return;
                        }
                        $('.page-container').append(timeTpl);
                        $('#' + dateInputId + '_time').css($('#' + dateInputId).offset());

                        $('.' + dateInputId + '_minute').click(function() {
                            if (mask.value) {
                                newVal = moment.utc(mask.value, currentFormat, true).minute(parseInt($(this).text())).format('YYYY-MM-DDTHH:mm:ss') + '+00:00';
                                ngModel.$setViewValue(newVal);
                                ngModel.$commitViewValue();
                                mask.value = moment.utc(newVal).format(currentFormat);
                                $('#' + dateInputId + '_time').remove();
                            }
                        });
                        $('.' + dateInputId + '_hour').click(function() {
                            if (mask.value) {
                                newVal = moment.utc(mask.value, currentFormat, true).hour(parseInt($(this).text())).format('YYYY-MM-DDTHH:mm:ss') + '+00:00';
                                ngModel.$setViewValue(newVal);
                                ngModel.$commitViewValue();
                                mask.value = moment.utc(newVal).format(currentFormat);
                                // $('#' + dateInputId + '_time').remove();
                            }
                        });
                    });
                }

                $('body').click(function(e) {
                    if ($(e.target).closest('#' + dateInputId + '_time').length === 0 &&
                        $(e.target).closest('#' + dateInputId + '_timeicon').length === 0 ) {
                            $('#' + dateInputId + '_time').remove();
                    }
                });

                $('#' + dateInputId).on('dp.change', function(e) {
                    if (moment(e.oldDate).format(currentFormat) != moment(e.date).format(currentFormat)) {
                        mask.value = moment(e.date).format(currentFormat);
                        maskTyping = false;
                    }
                });

                if (attrs["defaultToday"] == "true") {
                	value = moment();
                	scope.$apply(function() {
                        ngModel.$setViewValue(value.format('YYYY-MM-DDTHH:mm:ss') + '+00:00');
                        ngModel.$commitViewValue();
                        maskTyping = false;
                        mask.value = moment.utc(value).format(currentFormat);
                        $(element).removeClass('invalid');
                    });
                }

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
                        $('#' + dateInputId).attr('disabled', "disabled");
                    } else {
                        $('#' + dateInputId).removeAttr('disabled');
                    }
                });
                scope.$watch(attrs['ngRequired'], function(v) {
                    if (v) {
                        $('#' + dateInputId).attr('required', 'required');
                    } else {
                        $('#' + dateInputId).removeAttr('required');
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

                if (parseInt($(element).css('width').split('px')[0]) < 190) {
                    $('#' + dateInputId).css('font-size', '0.9em');
                }
            });
        }
    };
}]);

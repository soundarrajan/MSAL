angular.module('shiptech.pages').directive('newDatePicker', [ 'tenantModel', '$window', '$injector', '$tenantSettings', '$stateParams', '$compile', '$timeout', function(tenantModel, $window, $injector, $tenantSettings, $stateParams, $compile, $timeout) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ngModel) {
           let BLOCKS = {
                YYYY: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 9999
                },
                MM: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 99
                },
                MMM: {
                    mask: IMask.MaskedEnum,
                    enum: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
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
                    to: 99
                },
                HH: {
                    mask: IMask.MaskedRange,
                    from: 0,
                    to: 99
                },
                mm: {
                    mask: IMask.MaskedRange,
                    from: 0,
                    to: 99,
                },
            };

            let WEEK_DAYS = {
                Sunday: 0,
                Monday: 1
            };

            function reset(element) {
                $timeout(() => {
                    ngModel.$setViewValue(null);
                    ngModel.$commitViewValue();
                    wasReset = true;
                });

                /*
                scope.$apply(function() {
                });
                */
            }

            function isDynamicFormat(val) {
                let newVal = moment(val).format(currentFormat);
                if (newVal == 'Invalid date') {
                    newVal = moment(val).format(currentFormat.split(' ')[0]);
                    if (newVal != 'Invalid date') {
                        return true;
                    }
                    return false;
                }
                return false;
            }

            function getDynamicFormat(val) {
                if (isDynamicFormat(val)) {
                    let newVal = moment(val).format(currentFormat);
                    if (newVal == 'Invalid date') {
                        newVal = moment(val).format(currentFormat.split(' ')[0]);
                        if (newVal != 'Invalid date') {
                            return newVal;
                        }
                    }
                }
            }

            let prevValue = null;
            let hasDayOfWeek = false;          
            if (attrs.screenType === 'supplierPortal') {
                var tenantService = tenantModel.getGlobalConfigurationForSupplierPortal($stateParams.token).payload;
                var currentFormat = tenantService.tenantFormats.dateFormat.name;
                if (currentFormat.startsWith('DDD ')) {
                    hasDayOfWeek = true;
                    currentFormat = currentFormat.split('DDD ')[1];
                }
            } else {
                var currentFormat = $tenantSettings.tenantFormats.dateFormat.name;
                if (currentFormat.startsWith('DDD ')) {
                    hasDayOfWeek = true;
                    currentFormat = currentFormat.split('DDD ')[1];
                }
            }

            if (attrs.pickerType == 'date') {
                currentFormat = currentFormat.split(' ')[0];                    
            }
            currentFormat = currentFormat.replace(/d/g, 'D');
            currentFormat = currentFormat.replace(/y/g, 'Y');

            let dayOfWeekClass = '';
            if(hasDayOfWeek) {
                dayOfWeekClass = 'dateInputHasDayOfWeek';
            }

            let dateInputId = `${attrs.id }_dateinput`;
            // var dateInput = '<input type="text" class="form-control new-date-picker-input '+dayOfWeekClass+' " id="' + dateInputId + '">';
            let dateInput = `<input type="text" class="form-control ${dayOfWeekClass} " id="${ dateInputId }">`;
            let dateIcon = '<i class="fa fa-calendar date-picker-icon"';

            if (attrs.pickerType == 'datetime' || attrs.pickerType == 'dynamic') {
                dateIcon = `${dateIcon } style="right: 34px;"></i>`;
            } else {
                dateIcon = `${dateIcon }></i>`;
            }

            if (hasDayOfWeek) {
                var dayOfWeek = '<span class="datePickerDayOfWeek"></span>';
            } else {
                var dayOfWeek = '';
            }
            if (attrs.pickerType == 'datetime' || attrs.pickerType == 'dynamic') {
                var timeIcon = `<i class="fa fa-clock-o time-picker-icon" id="${ dateInputId }_timeicon"></i>`;

                var timeTpl = `<div class="time-picker-container" id="${ dateInputId }_time">`;

                timeTpl = `${timeTpl }<div class="custom-time-picker-header"> Hour </div><div class="custom-time-picker-row">`;

                for (var i = 0; i < 24; i++) {
                    timeTpl = `${timeTpl }<span class="${ dateInputId }_hour custom-time-picker-cell">${ String(i) } </span>`;
                    if ((i + 1) % 12 == 0) {
                        timeTpl = `${timeTpl }</div><div class="custom-time-picker-row">`;
                    }
                }

                timeTpl = `${timeTpl }</div>`;

                timeTpl = `${timeTpl }<div class="custom-time-picker-header"> Minute </div><div class="custom-time-picker-row">`;

                for (var i = 0; i < 60; i++) {
                    timeTpl = `${timeTpl }<span class="${ dateInputId }_minute custom-time-picker-cell">${ String(i) } </span>`;
                    if ((i + 1) % 12 == 0) {
                        timeTpl = `${timeTpl }</div><div class="custom-time-picker-row">`;
                    }
                }

                timeTpl = `${timeTpl }</div>`;
            }


            let maskTyping = false;
            let hasTyped = false;
            var wasReset = false;
            let element = null;

            $(elm).attr('tabindex', '-1');
            $(elm).css('opacity', '0');

            let init = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if ($(`#${ attrs.id }_dateinput`).length) {
                        return;
                    }

                    if (attrs.noIcon) {
                        $(`#${ attrs.id}`).after(dateInput);
                    } else if (attrs.pickerType == 'datetime' || attrs.pickerType == 'dynamic') {
                        $(`#${ attrs.id}`).after(dateInput).after(dateIcon).after(timeIcon).after(dayOfWeek);
                    } else {
                        $(`#${ attrs.id}`).after(dateInput).after(dateIcon).after(dayOfWeek);
                    }

                    element = document.getElementById(dateInputId);

                    if (!element) {
                        return;
                    }

                    var inputPattern = currentFormat;
                    // inputPattern = "`DD/`MM/`YYYY";

                    if (attrs.pickerType == 'dynamic') {
                        inputPattern = `${currentFormat.split(' ')[0] }\`[\\ ]\`[\`HH:\`mm]`;
                    }

                    /* PREVENT DELETION OF CHARS FROM RIGHT */
                    var separator;
                        if (currentFormat.split(' ')[0].indexOf('/') != -1) {
                        separator = '/';
                    }
                    if (currentFormat.split(' ')[0].indexOf('.') != -1) {
                        separator = '.';
                    }
                    if (currentFormat.split(' ')[0].indexOf('-') != -1) {
                        separator = '-';
                    }
                    if (separator) {
                        inputPattern = inputPattern.split(separator).join(`\`${separator}`);
                    }                 

                    /* PREVENT DELETION OF CHARS FROM RIGHT */


                    resolve(new IMask(element, {
                        mask: Date,
                        pattern: inputPattern,
                        // lazy: false,
                        min: new Date(1, 0, 1),
                        max: new Date(9999, 0, 1),
                        blocks: BLOCKS,
                        format: function(date) {
                            return moment.utc(date).format(currentFormat);
                        },
                        parse: function(str) {
                            return moment.utc(str, currentFormat, true);
                        }
                    }));
                }, 0);
            });
            // if ($(".new-date-picker").length > 0) {
            //  $compile($(".new-date-picker").parent())(scope);
            // }

            init.then((mask) => {
                let calendarWeekStartsFrom = _.get($tenantSettings, 'tenantFormats.calendarWeekStartsFrom.name');
                let dow = 1;
                if (calendarWeekStartsFrom && WEEK_DAYS[calendarWeekStartsFrom] !== undefined) {
                    dow = WEEK_DAYS[calendarWeekStartsFrom];
                }
                let datePickerOptions = {
                    format: currentFormat,
                    // showMeridian: true,
                    keepOpen: false,
                    keepInvalid: true,
                    useStrict: true,
                    useCurrent: false,
                    keyBinds: false,
                    locale:  moment.locale('en', {
				        week: {
                            dow: dow
                        }
				    }),
                    // sideBySide: true,
                    // debug: true,
                    // inline: true,
                    widgetParent: $('.page-container')
                };
                // $('#' + dateInputId).addClass('ng-invalid-required ng-touched');
                $(element).datetimepicker(datePickerOptions).on('dp.show', (e) => {
                    setTimeout(() => {
                        if ($('.bootstrap-datetimepicker-widget').length > 0) {
                            if ($('.bootstrap-datetimepicker-widget').offset().left > $(window).width() - 250) {
                                $('.bootstrap-datetimepicker-widget').css('transform', 'translateX(-30%)');
                            }
                        }
                    });
                });

                $(element).on('keydown', function(e) {
                    let keyCode = e.keyCode || e.which;

                    if (keyCode == 9 && $(this).parents('.treasury-datepicker-input').length > 0) {
                        e.preventDefault();
                        // setTimeout(function(){
                        // })
                        var nextEditableElement = $($($(this)).parents('td').nextAll('td').find('input, textarea, dropdown')[0]);
                        $('#gview_flat_invoices_app_complete_view_list').animate({
						    scrollLeft: $(nextEditableElement).offset().left - 200
                        }, 100);
                        setTimeout(() => {
                            $(nextEditableElement).focus();
                        }, 100);
                    }

                    if (keyCode == 13) {
                        $('.bootstrap-datetimepicker-widget').remove();
                    }
                });

                if (attrs.pickerType == 'datetime' || attrs.pickerType == 'dynamic') {
                    $(`#${ dateInputId }_timeicon`).click(() => {
                        if ($(`#${ dateInputId }_time`).length > 0) {
                            $(`#${ dateInputId }_time`).remove();
                            return;
                        }

                        if (!mask.value || attrs.disabled) {
                            return;
                        }

                        $('.page-container').append(timeTpl);

                        $(`#${ dateInputId }_time`).css($(`#${ dateInputId}`).offset());


                        $(`.${ dateInputId }_minute`).click(function() {
                            if (mask.value) {
                                var newVal = `${moment.utc(mask.value, currentFormat).minute(parseInt($(this).text())).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
                                ngModel.$setViewValue(newVal);
                                ngModel.$commitViewValue();
                                wasReset = false;

                                var newFormattedValue = moment.utc(newVal).format(currentFormat);
                                if (newFormattedValue.split(' ')[1] == '00:00') {
                                    mask.value = newFormattedValue.split(' ')[0];
                                }

                                $(`#${ dateInputId }_time`).remove();
                            }
                        });
                        $(`.${ dateInputId }_hour`).click(function() {
                            if (mask.value) {
                                var newVal = `${moment.utc(mask.value, currentFormat).hour(parseInt($(this).text())).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
                                ngModel.$setViewValue(newVal);
                                ngModel.$commitViewValue();
                                wasReset = false;

                                var newFormattedValue = moment.utc(newVal).format(currentFormat);
                                if (newFormattedValue.split(' ')[1] == '00:00') {
                                    mask.value = newFormattedValue.split(' ')[0];
                                }
                                // $('#' + dateInputId + '_time').remove();
                            }
                        });
                    });
                }

                $('body').click((e) => {
                    if ($(e.target).closest(`#${ dateInputId }_time`).length === 0 &&
                        $(e.target).closest(`#${ dateInputId }_timeicon`).length === 0) {
                        $(`#${ dateInputId }_time`).remove();
                    }
                    if ($(e.target).closest('.new-date-picker-input').length === 0 && $(e.target).parent().find('input[new-date-picker]').length == 0) {
                        $timeout(() => {
                            if ($('#datetimepicker').data('DateTimePicker')) {
                                $('#datetimepicker').data('DateTimePicker').destroy();
                            }
                            $('.bootstrap-datetimepicker-widget').remove();
                        });
                    }
                });

                $(window).resize((e) => {
                    $('.bootstrap-datetimepicker-widget').remove();
                    if ($('#datetimepicker').data('DateTimePicker')) {
                        $('#datetimepicker').data('DateTimePicker').destroy();
                    }
                    $timeout(() => {
                        $('.bootstrap-datetimepicker-widget').remove();
                        if ($('#datetimepicker').data('DateTimePicker')) {
                            $('#datetimepicker').data('DateTimePicker').destroy();
                        }
                    });
                });

                $(`#${ dateInputId}`).on('dp.change', (e) => {
                    if (moment(e.oldDate).format(currentFormat) != moment(e.date).format(currentFormat)) {
                        let newVal = moment(e.date).format(currentFormat);
                        if ((!e.oldDate && !hasTyped) || wasReset) {
                            newVal = `${newVal.split(' ')[0] } 00:00`;
                            wasReset = false;
                        }
                        if (newVal == 'Invalid date') {
                            newVal = moment(e.date).format(currentFormat.split(' ')[0]);
                            if (newVal != 'Invalid date') {
                                mask.value = newVal;
                            } else if (!e.date) {
                                reset();
                            }
                        } else if (newVal.split(' ')[1] == '00:00') {
                            mask.value = newVal.split(' ')[0];
                        } else {
                            mask.value = newVal;
                        }
                        $(`#${ dateInputId}`).data('DateTimePicker').hide();
                    }
                });

                if (attrs.defaultToday == 'true') {
                    var value = moment();
                    scope.$apply(() => {
                        ngModel.$setViewValue(`${value.format('YYYY-MM-DDTHH:mm:ss') }+00:00`);
                        ngModel.$commitViewValue();
                        wasReset = false;
                        maskTyping = false;
                        mask.value = moment.utc(value).format(currentFormat);
                        $(element).removeClass('invalid');
                        // $('#' + dateInputId).removeClass('ng-invalid-required ng-touched');
                        try {
                            ngModel.$setValidity('required', true);
                        } catch (TypeError) {
                            console.log('Failed to set date-picker validity');
                        }
                    });
                }

                $(element).on('focus', (e) => {
                    $(element).removeClass('focusedOut');
                    if (window.location.href.indexOf("invoices/treasuryreport") != -1 && ($(e.target)[0].id).indexOf("clc") != -1) {
                        var top = $(element).offset().top;
                        var left = $(element).offset().left;
                        $('.bootstrap-datetimepicker-widget').css('top', top - 285);
                        $('.bootstrap-datetimepicker-widget').css('left', left);
                    } else {
                        $('.bootstrap-datetimepicker-widget').css($(element).offset());

                    }
                   

                });

                $(element).on('blur', (e) => {
                    if ($(element).hasClass('focusedOut')) {
                        return;
                    }
                    $(element).addClass('focusedOut');

                    let isValidDynamic = attrs.pickerType == 'dynamic' && moment.utc(
                        mask.value.trim(),
                        currentFormat.split(' ')[0], true).isValid();

                    let showError = false;

                    if (!isValidDynamic) {
                        if (maskTyping) {
                            showError = true;
                        }
                    }

                    if (showError) {
                        if (!attrs.required && !mask.value) {
                            $(element).removeClass('invalid');
                            // $('#' + dateInputId).removeClass('ng-invalid-required ng-touched');
                            try {
                                ngModel.$setValidity('required', true);
                            } catch (TypeError) {
                                console.log('Failed to set date-picker validity');
                            }
                            reset();
                        } else {
                            if ($(element).val() == '') {
                                toastr.error('Please fill in required field');
                            } else {
                                toastr.error('Please enter the correct format');
                            }
                            $(`#${ dateInputId}`).parent().find('.datePickerDayOfWeek').text('');
                            $(element).addClass('invalid');
                            try {
                                ngModel.$setValidity('required', false);
                            } catch (TypeError) {
                                console.log('Failed to set date-picker validity');
                            }
                            if (!mask.value) {
                                wasReset = true;
                            }
                        }
                    } else if (mask.value) {
                        value = moment.utc(mask.value, currentFormat, true);
                        var formattedValue = value.format(currentFormat);
                        if (formattedValue == 'Invalid date') {
                            value = moment.utc(mask.value.trim(), currentFormat.split(' ')[0], true);
                            formattedValue = moment(value).format(currentFormat.split(' ')[0]);
                        }
                        if (value && !prevValue || value && formattedValue != prevValue) {
                            if (value.year() < 1753) {
                                $(element).addClass('invalid');
                                try {
                                    ngModel.$setValidity('required', false);
                                } catch (TypeError) {
                                    console.log('Failed to set date-picker validity');
                                }
                                toastr.error('Please enter the correct format');
                                return;
                            }
                            prevValue = formattedValue;
                            scope.$apply(() => {
                                ngModel.$setViewValue(`${value.format('YYYY-MM-DDTHH:mm:ss') }+00:00`);
                                ngModel.$commitViewValue();
                                maskTyping = false;
                                let newMaskVal = moment.utc(value).format(currentFormat);
                                if (newMaskVal.split(' ')[1] == '00:00') {
                                    mask.value = newMaskVal.split(' ')[0];
                                } else {
                                    mask.value = newMaskVal;
                                }
                                $(element).removeClass('invalid');
                                // $('#' + dateInputId).removeClass('ng-invalid-required ng-touched');
                                try {
                                    ngModel.$setValidity('required', true);
                                } catch (TypeError) {
                                    console.log('Failed to set date-picker validity');
                                }
                            });
                        }
                    } else {
                        if (!attrs.required && !mask.value) {
                            $(element).removeClass('invalid');
                            // $('#' + dateInputId).removeClass('ng-invalid-required ng-touched');
                            try {
                                ngModel.$setValidity('required', true);
                            } catch (TypeError) {
                                console.log('Failed to set date-picker validity');
                            }
                            reset();
                        }
                        if (attrs.required && !mask.value || attrs.required && mask.value == '') {
                            $(element).addClass('invalid');
                            // $('#' + dateInputId).addClass('ng-invalid-required ng-touched');
                        }
                    }
                });

                if (ngModel.$viewValue && $(`#${ dateInputId}`).data('DateTimePicker')) {
                    $(`#${ dateInputId}`).data('DateTimePicker').date(moment.utc(ngModel.$viewValue));
                    prevValue = moment.utc(ngModel.$viewValue).format(currentFormat);
                }

                if (hasDayOfWeek) {
                    let dayOfWeekText = '';
                    if (ngModel.$viewValue) {
                        if (moment(ngModel.$viewValue).isValid()) {
                            dayOfWeekText = moment.utc(ngModel.$viewValue).format('ddd');
                        }
                    }
                    $(`#${ dateInputId}`).parent().find('.datePickerDayOfWeek').text(dayOfWeekText);
                }
                scope.$watch(() => {
                    return ngModel.$invalid;
                }, (newVal, oldVal) => {
                    if (newVal) {
                        $(element).addClass('ng-invalid');
                    } else {
                        $(element).removeClass('ng-invalid');
                    }
                });

                scope.$watch(attrs.ngModel, (v) => {
                    if (hasDayOfWeek) {
                        let dayOfWeekText = '';
                        if (v) {
                            if (moment(v).isValid()) {
                                dayOfWeekText = moment.utc(v).format('ddd');
                            }
                        }
                        $(`#${ dateInputId}`).parent().find('.datePickerDayOfWeek').text(dayOfWeekText);
                    }
                    if (v && $(`#${ dateInputId}`).data('DateTimePicker')) {
                        $(`#${ dateInputId}`).data('DateTimePicker').date(moment.utc(v));
                        let newVal = moment.utc(v).format(currentFormat);
                        if (newVal.split(' ')[1] == '00:00') {
                            prevValue = newVal.split(' ')[0];
                            $(element).removeClass('invalid');
                        } else {
                            prevValue = newVal;
                        }
                        mask.value = prevValue;
                    } else {
                        prevValue = null;
                        if (typeof v == 'undefined') {
                            $(`#${ dateInputId}`).data('DateTimePicker').clear();
                            $(`#${ dateInputId}`).data('DateTimePicker').date(null);
                            ngModel.$setViewValue(null);
                            ngModel.$commitViewValue();
                            wasReset = true;
                            prevValue = null;
                        }
                    }
                });
                scope.$watch(attrs.ngDisabled, (v) => {
                    if (v) {
                        $(`#${ dateInputId}`).attr('disabled', 'disabled');
                        $(`#${ dateInputId}`).parent('.input-group').addClass('disabled');
                        $(`#${ dateInputId }_timeicon`).addClass('disabled');
                    } else {
                        $(`#${ dateInputId}`).removeAttr('disabled');
                        $(`#${ dateInputId}`).parent('.input-group').removeClass('disabled');
                        $(`#${ dateInputId }_timeicon`).removeClass('disabled');
                    }
                });
                scope.$watch(attrs.ngRequired, (v) => {
                    if (v) {
                        $(`#${ dateInputId}`).attr('required', 'required');
                    } else {
                        $(`#${ dateInputId}`).removeAttr('required');
                    }
                });

                /*
                scope.$watch(attrs['ngClass'], function(v) {
                    if (v) {
                        $('#' + dateInputId).attr('class', attrs['ngClass']);
                    }
                });
                */

                mask.on('accept', () => {
                    maskTyping = true;
                    hasTyped = true;
                });

                mask.on('complete', () => {
                    maskTyping = false;
                });

                if (parseInt($(element).css('width').split('px')[0]) < 190) {
                    $(`#${ dateInputId}`).css('font-size', '0.9em');
                }
            });
        }
    };
} ]);

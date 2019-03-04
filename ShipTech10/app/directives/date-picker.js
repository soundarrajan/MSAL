angular.module('shiptech.pages').directive('newDatePicker', ['$window', '$injector', '$tenantSettings', function($window, $injector, $tenantSettings) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ngModel) {

            function reset(element) {
                scope.$apply(function() {
                    ngModel.$setViewValue('');
                    ngModel.$commitViewValue();
                });
            }

            var currentFormat = $tenantSettings.tenantFormats.dateFormat.name;

            currentFormat = currentFormat.split(' ')[0];
            currentFormat = currentFormat.replace('yyyy', 'YYYY');
            currentFormat = currentFormat.replace('dd', 'DD');

            var dateInputId = attrs['id'] + '_dateinput';
            var dateInput = '<input type="text" class="form-control" id="' + dateInputId + '">';
            var dateIcon = '<i class="fa fa-calendar date-picker-icon"></i>';

            var maskTyping = false;

            var element = null

            var init = new Promise(function(resolve, reject) {
                setTimeout(function() {
                    $('#' + attrs['id']).after(dateInput).after(dateIcon);

                    element = document.getElementById(dateInputId);

                    resolve(new IMask(element, {
                        mask: Date,
                        pattern: currentFormat,
                        // lazy: false,
                        min: new Date(1970, 0, 1),
                        max: new Date(2030, 0, 1),

                        format: function (date) {
                            return moment(date).format(currentFormat);
                        },
                        parse: function (str) {
                            return moment(str, currentFormat);
                        },

                        blocks: {
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
                                to: 59
                            }
                        }
                    }));
                }, 0);
            });

            init.then(function(mask) {
                $(element).datepicker({
                    format: 'dd/mm/yyyy',
                    autoclose: true,
                    forceParse: false
                }).on('hide', function(e) {
                    if (maskTyping) {
                        scope.$apply(function() {
                            toastr.error("Please enter the correct format");
                            $(element).addClass('invalid');
                            reset(element);
                        });
                    }
                });

                scope.$watch(attrs['ngModel'], function(v) {
                    if (v) {
                        $('#' + dateInputId).val(moment(v).format(currentFormat));
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

                mask.on('accept', function() {
                    mask.value;
                    maskTyping = true;
                });

                mask.on('complete', function() {
                    scope.$apply(function() {
                        ngModel.$setViewValue(moment.utc(mask.value, currentFormat).format());
                        ngModel.$commitViewValue();
                        maskTyping = false;
                        $(element).removeClass('invalid');
                    });
                });
            });
        }
    };
}]);

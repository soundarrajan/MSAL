angular.module('shiptech.pages').directive('stDateFormat', [ '$window', '$injector', function($window, $injector) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
            let moment = $window.moment;
            let tenantService,
                dateFormat;
            if (attrs.stDateFormat === 'supplierPortal') {
                tenantService = $injector.get('tenantSupplierPortalService');
            } else {
                tenantService = $injector.get('tenantService');
            }
            // if (attrs.onlyDate) alert(1)
            // dateFormat = tenantService.getDateFormat();
            ctrl.$formatters.unshift((modelValue) => {
	            dateFormat = tenantService.getDateFormat();
	            if (dateFormat && dateFormat.startsWith('DDD ')) {
	            	hasDayOfWeek = true;
	                dateFormat = dateFormat.split('DDD ')[1];
	            }
                // debugger;
                if (!dateFormat) {
                    if (attrs.onlyDate) {
                        dateFormat = tenantService.getDateFormat();
                    	var hasDayOfWeek = false;
                        if (dateFormat && dateFormat.startsWith('DDD ')) {
                        	hasDayOfWeek = true;
	                        dateFormat = dateFormat.split('DDD ')[1];
                        }
                        if (dateFormat) {
	                        dateFormat = dateFormat.split(' ')[0];
                        }
                        // dateFormat = 'DD/MM/YYYY';
                    } else {
                        dateFormat = tenantService.getDateFormat();
                        if (dateFormat && dateFormat.startsWith('DDD ')) {
                        	hasDayOfWeek = true;
	                        dateFormat = dateFormat.split('DDD ')[1];
                        }
                    }
                } else if (dateFormat && dateFormat.startsWith('DDD ')) {
	                	hasDayOfWeek = true;
	                    dateFormat = dateFormat.split('DDD ')[1];
	                }
                if (!dateFormat || !modelValue) {
                    return '';
                }
                let retVal;
                // We're getting UTC dates from server.
                // moment.js uses by default local timezone (http://momentjs.com/docs/#/parsing/utc/).
                // We want to display server time (UTC), unless specifically
                // required to display local time, via the st-date-to-local
                // custom attribute.
                if (!dateFormat) {
                    if (attrs.onlyDate) {
                        dateFormat = tenantService.getDateFormat();
                        if (dateFormat.startsWith('DDD ')) {
                        	hasDayOfWeek = true;
	                        dateFormat = dateFormat.split('DDD ')[1];
                        }
                        dateFormat = dateFormat.split(' ')[0];
                    // dateFormat = 'DD/MM/YYYY';
                    } else {
                        dateFormat = tenantService.getDateFormat();
                        if (dateFormat.startsWith('DDD ')) {
                        	hasDayOfWeek = true;
	                        dateFormat = dateFormat.split('DDD ')[1];
                        }
                    }
                }
                if (attrs.stDateToLocal !== undefined) {
                    // moment.js default behavior: return date in LOCAL TIME.
                    retVal = moment.utc(modelValue).local().format(dateFormat);
                } else {
                    // Make moment.js use UTC (as the server date provided).
                    retVal = moment.utc(modelValue).format(dateFormat);
                }
                if (hasDayOfWeek) {
                    retVal = `${moment(modelValue).format('ddd') } ${ retVal}`;
                }
                return retVal;
            });
            ctrl.$parsers.unshift((viewValue) => {
                if (!dateFormat) {
                    if (attrs.onlyDate) {
                        dateFormat = tenantService.getDateFormat();
                        dateFormat = dateFormat.split(' ')[0];
                    // dateFormat = 'DD/MM/YYYY';
                    } else {
                        dateFormat = tenantService.getDateFormat();
                    }
                }
                let date;
                // When parsing the model value, always use UTC, since this goes to the server.
                if (attrs.stDateToLocal !== undefined) {
                    date = moment(viewValue, dateFormat);
                }else{
                    date = moment.utc(viewValue, dateFormat);
                }
                return date.format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ');
            });
        }
    };
} ]);

/*
jQuery Masked Input Plugin
Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
Version: 1.4.1
*/
// !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b,c=navigator.userAgent,d=/iphone/i.test(c),e=/chrome/i.test(c),f=/android/i.test(c);a.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},autoclear:!0,dataName:"rawMaskFn",placeholder:"_"},a.fn.extend({caret:function(a,b){var c;if(0!==this.length&&!this.is(":hidden"))return"number"==typeof a?(b="number"==typeof b?b:a,this.each(function(){this.setSelectionRange?this.setSelectionRange(a,b):this.createTextRange&&(c=this.createTextRange(),c.collapse(!0),c.moveEnd("character",b),c.moveStart("character",a),c.select())})):(this[0].setSelectionRange?(a=this[0].selectionStart,b=this[0].selectionEnd):document.selection&&document.selection.createRange&&(c=document.selection.createRange(),a=0-c.duplicate().moveStart("character",-1e5),b=a+c.text.length),{begin:a,end:b})},unmask:function(){return this.trigger("unmask")},mask:function(c,g){var h,i,j,k,l,m,n,o;if(!c&&this.length>0){h=a(this[0]);var p=h.data(a.mask.dataName);return p?p():void 0}return g=a.extend({autoclear:a.mask.autoclear,placeholder:a.mask.placeholder,completed:null},g),i=a.mask.definitions,j=[],k=n=c.length,l=null,a.each(c.split(""),function(a,b){"?"==b?(n--,k=a):i[b]?(j.push(new RegExp(i[b])),null===l&&(l=j.length-1),k>a&&(m=j.length-1)):j.push(null)}),this.trigger("unmask").each(function(){function h(){if(g.completed){for(var a=l;m>=a;a++)if(j[a]&&C[a]===p(a))return;g.completed.call(B)}}function p(a){return g.placeholder.charAt(a<g.placeholder.length?a:0)}function q(a){for(;++a<n&&!j[a];);return a}function r(a){for(;--a>=0&&!j[a];);return a}function s(a,b){var c,d;if(!(0>a)){for(c=a,d=q(b);n>c;c++)if(j[c]){if(!(n>d&&j[c].test(C[d])))break;C[c]=C[d],C[d]=p(d),d=q(d)}z(),B.caret(Math.max(l,a))}}function t(a){var b,c,d,e;for(b=a,c=p(a);n>b;b++)if(j[b]){if(d=q(b),e=C[b],C[b]=c,!(n>d&&j[d].test(e)))break;c=e}}function u(){var a=B.val(),b=B.caret();if(o&&o.length&&o.length>a.length){for(A(!0);b.begin>0&&!j[b.begin-1];)b.begin--;if(0===b.begin)for(;b.begin<l&&!j[b.begin];)b.begin++;B.caret(b.begin,b.begin)}else{for(A(!0);b.begin<n&&!j[b.begin];)b.begin++;B.caret(b.begin,b.begin)}h()}function v(){A(),B.val()!=E&&B.change()}function w(a){if(!B.prop("readonly")){var b,c,e,f=a.which||a.keyCode;o=B.val(),8===f||46===f||d&&127===f?(b=B.caret(),c=b.begin,e=b.end,e-c===0&&(c=46!==f?r(c):e=q(c-1),e=46===f?q(e):e),y(c,e),s(c,e-1),a.preventDefault()):13===f?v.call(this,a):27===f&&(B.val(E),B.caret(0,A()),a.preventDefault())}}function x(b){if(!B.prop("readonly")){var c,d,e,g=b.which||b.keyCode,i=B.caret();if(!(b.ctrlKey||b.altKey||b.metaKey||32>g)&&g&&13!==g){if(i.end-i.begin!==0&&(y(i.begin,i.end),s(i.begin,i.end-1)),c=q(i.begin-1),n>c&&(d=String.fromCharCode(g),j[c].test(d))){if(t(c),C[c]=d,z(),e=q(c),f){var k=function(){a.proxy(a.fn.caret,B,e)()};setTimeout(k,0)}else B.caret(e);i.begin<=m&&h()}b.preventDefault()}}}function y(a,b){var c;for(c=a;b>c&&n>c;c++)j[c]&&(C[c]=p(c))}function z(){B.val(C.join(""))}function A(a){var b,c,d,e=B.val(),f=-1;for(b=0,d=0;n>b;b++)if(j[b]){for(C[b]=p(b);d++<e.length;)if(c=e.charAt(d-1),j[b].test(c)){C[b]=c,f=b;break}if(d>e.length){y(b+1,n);break}}else C[b]===e.charAt(d)&&d++,k>b&&(f=b);return a?z():k>f+1?g.autoclear||C.join("")===D?(B.val()&&B.val(""),y(0,n)):z():(z(),B.val(B.val().substring(0,f+1))),k?b:l}var B=a(this),C=a.map(c.split(""),function(a,b){return"?"!=a?i[a]?p(b):a:void 0}),D=C.join(""),E=B.val();B.data(a.mask.dataName,function(){return a.map(C,function(a,b){return j[b]&&a!=p(b)?a:null}).join("")}),B.one("unmask",function(){B.off(".mask").removeData(a.mask.dataName)}).on("focus.mask",function(){if(!B.prop("readonly")){clearTimeout(b);var a;E=B.val(),a=A(),b=setTimeout(function(){B.get(0)===document.activeElement&&(z(),a==c.replace("?","").length?B.caret(0,a):B.caret(a))},10)}}).on("blur.mask",v).on("keydown.mask",w).on("keypress.mask",x).on("input.mask paste.mask",function(){B.prop("readonly")||setTimeout(function(){var a=A(!0);B.caret(a),h()},0)}),e&&f&&B.off("input.mask").on("input.mask",u),A()})}})});

angular.module('shiptech.pages').directive('editableDateWithMask', [ '$injector', '$parse', '$compile', function($injector, $parse, $compile) {
    return {
        require: 'ngModel',
        link: function(scope, element, attributes, ctrl, ngModel) {
			var currentElement = element;
			var currentScope = scope;
			var currentAttrs = attributes;
			var currentModel = currentScope[attributes.ngModel];
			var currentCtrl = ctrl;
			var tenantService = $injector.get('tenantService');
			var dateFormat;
            if (attributes.onlyDate) {
                dateFormat = tenantService.getDateFormat();
                dateFormat = dateFormat.split(' ')[0];
                // window.dateFormat = dateFormat;
            } else {
                dateFormat = tenantService.getDateFormat();
                // window.dateTimeFormat = dateFormat;
            }

            $(element).attr('uniqueIdentifier', window.crypto.getRandomValues(new Uint8Array(1)).toString(36).substring(7));

            $(element).parent().before(`<input uniqueIdentifier='${$(element).attr('uniqueIdentifier') }' placeholder='${ dateFormat }' date-format='${ dateFormat }' class='editableDateInputWithMask form-control' />`);

            $(element[0]).attr('placeholder', dateFormat);

            if (!window.editableDateInputWithMaskResources) {
            	window.editableDateInputWithMaskResources = [];
            }
        	window.editableDateInputWithMaskResources[$(element).attr('uniqueIdentifier')] = {
                currentElement: currentElement,
                currentScope: currentScope,
                currentAttrs: currentAttrs,
                currentModel: currentModel,
                currentCtrl: currentCtrl,
            };

            var siblingElement;
            attributes.$observe('disabled', (value) => {
                siblingElement = $(`.editableDateInputWithMask[uniqueIdentifier='${$(attributes.$$element[0]).attr('uniqueIdentifier') }']`);
                $(siblingElement).attr('disabled', value);
            });
            attributes.$observe('required', (value) => {
                siblingElement = $(`.editableDateInputWithMask[uniqueIdentifier='${$(attributes.$$element[0]).attr('uniqueIdentifier') }']`);
                $(siblingElement).attr('required', value);
            });

            $('.editableDateInputWithMask').on('change', function() {
				var modelResources = window.editableDateInputWithMaskResources[$(this).attr('uniqueIdentifier')];
				var modelValue = modelResources.currentScope.$eval(modelResources.currentAttrs.ngModel);
				var dateFormat = $(this).attr('date-format');
            	modelResources.currentValue = $(this).val();
            	var retVal;
                if (modelResources.currentAttrs.stDateToLocal !== undefined) {
                    retVal = moment.utc(modelResources.currentValue).local().format(dateFormat);
                } else {
                    retVal = moment.utc(modelResources.currentValue).format(dateFormat);
                }

            	$(this).removeClass('invalid');
                if (moment(modelResources.currentValue, dateFormat, true).isValid()) {
                	$(this).removeClass('invalid');
	               	modelResources.currentCtrl.$setViewValue(moment(modelResources.currentValue, dateFormat).format('YYYY-MM-DDTHH:mm:ss'));
                    let modelValueSetter = $parse(modelResources.currentAttrs.ngModel).assign;
                    modelValueSetter(modelResources.currentScope, moment(modelResources.currentValue, dateFormat).format('YYYY-MM-DDTHH:mm:ss'));

                    // $(this).next("span").children("[editable-date-with-mask]").parent().datepicker('remove')
	            	$(this).next('span').children('[editable-date-with-mask]').parent().datepicker('setDate', moment(modelResources.currentValue, dateFormat).toDate());
	            	$(this).next('span').children('[editable-date-with-mask]').val(modelResources.currentValue).datepicker('update');
                } else {
                	if ($(this).next('span').children('[editable-date-with-mask]').hasClass('ng-invalid')) {
                		$(this).addClass('invalid');
                	}
	               	modelResources.currentCtrl.$setViewValue(null);
	               	modelResources.currentCtrl.$modelValue = null;
	               	$(this).val('');
	            	$(this).next('span').children('[editable-date-with-mask]').parent().datepicker('setDate', null);
	            	$(this).next('span').children('[editable-date-with-mask]').val('').datepicker('update');
                }
            });


            $('.editableDateInputWithMask').on('blur', function() {
				var currentEl = this;
                setTimeout(() => {
                    if ($(currentEl).hasClass('invalid')) {
                        if (!$(currentEl).attr('error-shown')) {
                            toastr.error('Please enter correct date format');
                            $(currentEl).attr('error-shown', 'true');
                        }
                    }
                    setTimeout(() => {
                        $(currentEl).removeAttr('error-shown');
                    }, 300);
                });
            });


            ctrl.$formatters.unshift((modelValue) => {
            	siblingElement = $(`.editableDateInputWithMask[uniqueIdentifier='${$(attributes.$$element[0]).attr('uniqueIdentifier') }']`);
            	$(siblingElement).removeClass('invalid');
            	modelResources = window.editableDateInputWithMaskResources[$(siblingElement).attr('uniqueIdentifier')];
                if (attributes.onlyDate) {
                    dateFormat = tenantService.getDateFormat();
                    if (dateFormat) {
                        dateFormat = dateFormat.split(' ')[0];
                    }
                } else {
                    dateFormat = tenantService.getDateFormat();
                }
                if (attributes.stDateToLocal !== undefined) {
                    retVal = moment.utc(modelValue, 'YYYY-MM-DDTHH:mm:ss').local().format(dateFormat);
                } else {
                    retVal = moment.utc(modelValue, 'YYYY-MM-DDTHH:mm:ss').format(dateFormat);
                }


                if (moment(retVal, dateFormat, true).isValid()) {
	            	$(siblingElement).next('span').children('[editable-date-with-mask]').parent().datepicker('setDate', moment(retVal, dateFormat).toDate());
	            	$(siblingElement).next('span').children('[editable-date-with-mask]').val(retVal);
	                $(siblingElement).val(retVal);
	                return retVal;
                }
                	if ($(siblingElement).next('span').children('[editable-date-with-mask]').hasClass('ng-invalid')) {
                		$(siblingElement).addClass('invalid');
                	}
	               	$(siblingElement).val('');
	            	$(siblingElement).next('span').children('[editable-date-with-mask]').val('').datepicker('update');
	                $(siblingElement).val('');
	                return '';
            });

            ctrl.$parsers.unshift((viewValue) => {
            	siblingElement = $(`.editableDateInputWithMask[uniqueIdentifier='${$(attributes.$$element[0]).attr('uniqueIdentifier') }']`);
                if (attributes.onlyDate) {
                    dateFormat = tenantService.getDateFormat();
                    if (dateFormat) {
                        dateFormat = dateFormat.split(' ')[0];
                    }
                } else {
                    dateFormat = tenantService.getDateFormat();
                }
            	if ($(attributes.$$element[0]).parent().data('datepicker')) {
					var jsDateVal = $(attributes.$$element[0]).parent().data('datepicker').getDate();
	            	viewValue = moment(jsDateVal).format(dateFormat);
            	}
                let date;
                // When parsing the model value, always use UTC, since this goes to the server.
                if (attributes.stDateToLocal !== undefined) {
                    date = moment(viewValue, dateFormat);
                }else{
                    date = moment.utc(viewValue, dateFormat);
                }
                if (moment(viewValue, dateFormat, true).isValid()) {
	                $(siblingElement).val(moment(date, dateFormat).format(dateFormat));
	                return date.format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ');
                }
	                return null;
            });


			var initMask = function(selector) {
	            // vm.formatted = "";
	            // if(!$scope.formatDates)  $scope.formatDates = {};

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
	                let idx = 0;
	                while(charCodes[str[idx].charCodeAt(0)] === undefined) {
                        idx++;
                    }
	                return str[idx];
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
	                let idx = 0;
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
	            let currentFormat = $(selector).attr('date-format');

	            let DATE_POSITIONS = calculateDatePositions(currentFormat);
	            let SEPARATOR = findSeparator(currentFormat);

	            let momentFormat = formMomentFormat(currentFormat);
	            let momentFormatDateOnly = formMomentFormat(currentFormat, true);
	            let maskFormat = formMaskFormat(currentFormat);
	            let maskFormatDateOnly = formMaskFormat(currentFormat, true);


	            var DATE_OPTIONS = {
	                datePositions: DATE_POSITIONS,
	                separator: SEPARATOR,
	                momentFormat: momentFormat,
	                momentFormatDateOnly: momentFormatDateOnly,
	                maskFormat: maskFormat,
	                maskFormatDateOnly: maskFormatDateOnly
	            };

	            // / end variables initialization


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
	                        formatUsed = DATE_OPTIONS.momentFormatDateOnly;
	                    }else{
	                        formatUsed = DATE_OPTIONS.momentFormat;
	                    }

	                    // process date
	                    let val = moment(value, formatUsed, true);

	                    // console.log(field.hasClass('date-only'))
	                    // console.log(val, val.isValid());

	                    // test date validity
	                    // if(vm.invalidDate === undefined) vm.invalidDate = {};
	                    // if(val.isValid()){
	                    //     vm.invalidDate[field[0].name] = false;
	                    // }else{
	                    //     vm.invalidDate[field[0].name] = true;
	                    // }
	                }
	            };
	            // end mask options


	            // ACTUAL MASK INITIALIZATION
	            function init() {
	            	if ($(selector).attr('only-date') == true) {
	                    $(selector).mask(maskFormatDateOnly, options);
	            	} else {
	                    $(selector).mask(maskFormat, options);
	            	}
	            }
	            init();


	            // END ACTUAL MASK INITIALIZATION
			    };
            initMask($(`.editableDateInputWithMask[uniqueIdentifier='${$(attributes.$$element[0]).attr('uniqueIdentifier') }']`));
        }


    };
} ]);

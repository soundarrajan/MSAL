angular.module('shiptech.components')
    .controller('RequoteDialogController', ['$scope', '$element', '$attrs', '$timeout', 'MOCKUP_MAP', 'groupOfRequestsModel', 'tenantService', '$tenantSettings', '$state',
        'EMAIL_TRANSACTION', 'STATE', '$listsCache','$rootScope', 'Factory_App_Dates_Processing',
        function($scope, $element, $attrs, $timeout, MOCKUP_MAP, groupOfRequestsModel, tenantService, $tenantSettings, $state,
            EMAIL_TRANSACTION, STATE, $listsCache, $rootScope, Factory_App_Dates_Processing) {
            var ctrl = this;
            ctrl.tenantSettings = $tenantSettings;
            ctrl.lists = $listsCache;
            // console.log(tenantService.tenantSettings)
            tenantService.tenantSettings.then(function(settings) {
                ctrl.quoteByTimezone = settings.payload.tenantFormats.timeZone;
                ctrl.quoteByCurrency = {
                    id: 1,
                    name: "US Dollar"
                };
			})
            tenantService.procurementSettings.then(function(settings) {
				ctrl.isQuoteDateAutoPopulated = settings.payload.offer.isQuoteDateAutoPopulated;
			})

            function initializeDateInputs() {
                var date = $(".form_meridian_datetime");
                date.datetimepicker({
                    format: tenantService.getDateFormatForPicker(),
                    isRTL: App.isRTL(),
                    showMeridian: true,
                    autoclose: true,
                    pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
                    todayBtn: false
                }).on('changeDate', function(ev) {
                    $timeout(function() {
                        $(ev.target).find('input').val(tenantService.formatDate(ev.date));
                    });
                }).on('hide', function(ev) {
                    $timeout(function() {
                        $(ev.target).find('input').val(tenantService.formatDate(ev.date));
                    });
                });
            }

            initializeDateInputs();

            ctrl.$onChanges = function(changes) {
                if (typeof changes.requirements !== "undefined" && !changes.requirements.isFirstChange()) {
                    ctrl.requirements = changes.requirements.currentValue;
                }

                if (typeof changes.requoteCurrency !== "undefined" && !changes.requoteCurrency.isFirstChange()) {
                    ctrl.quoteByCurrency = changes.requoteCurrency.currentValue;
                }

                if (typeof changes.quoteByCurrency !== "undefined" && !changes.quoteByCurrency.isFirstChange()) {
                    ctrl.groupId = changes.groupId.currentValue;
                }
            };

            ctrl.actionButtonsEnabled = function() {
                enabled = true
                $.each(ctrl.requirements, function(reqK, reqV) {
                    if (reqV.RfqId == null) {
                        enabled = false
                    }
                })
                if (!ctrl.requirements || ctrl.requirements.length == 0) {
                    enabled = false
                }
                return enabled;
            }
            ctrl.sendRequote = function() {
                console.log()
                if (!ctrl.actionButtonsEnabled()) {
                    if (!ctrl.requirements) {
                        toastr.error("You cannot Requote, as No RFQ is associated with Sellers Offer.");
                    } else {

                        toastr.error("You cannot save the changes because no RFQ is associated with this seller's offers");
                    }
                    return;
                }
                var rfq_data = {
                    "Requirements": ctrl.requirements,
                    "QuoteByDate": ctrl.quoteByDate,
                    "QuoteByCurrencyId": ctrl.quoteByCurrency.id,
                    "QuoteByTimeZoneId": ctrl.quoteByTimezone.id,
                    "Comments": ctrl.internalComments
                };

                groupOfRequestsModel.requoteRFQ(rfq_data).then(function(response) {
                    ctrl.onRequote();
                });
            };

            ctrl.setQuoteByTimezone = function(timeZoneId, timeZoneName) {
                ctrl.quoteByTimezone = {
                    id: timeZoneId,
                    name: timeZoneName
                };
            };

            ctrl.requotePreviewEmail = function() {
                if (!ctrl.actionButtonsEnabled()) {
                    toastr.error("You cannot preview email because no RFQ is associated with this seller's offers");
                    return;
                }
                if (ctrl.requirements) {
                    var rfq_data = {
                        "Requirements": ctrl.requirements,
                        "QuoteByDate": ctrl.quoteByDate ? ctrl.quoteByDate : null,
                        "QuoteByCurrencyId": ctrl.quoteByCurrency.id ? ctrl.quoteByCurrency.id : null,
                        "QuoteByTimeZoneId": ctrl.quoteByTimezone.id ? ctrl.quoteByTimezone.id : null,
                        "Comments": ctrl.internalComments ? ctrl.internalComments : null,
                        "groupId": ctrl.groupId
                    };

                    $state.go(STATE.PREVIEW_EMAIL, { data: rfq_data, transaction: EMAIL_TRANSACTION.REQUOTE });
                }
            };


			ctrl.initMask = function(){
	            Factory_App_Dates_Processing.doMaskInitialization();
	        }
	        ctrl.setValue = function(inputDetails, direction, simpleDate, app){
	            
	            /** See @param inputDetails
	            /**     @param direction
	            /**     @param simpleDate
	            /**     @param app
	             *   explained in controller_master
	             */


	            var DATE_FORMAT = ctrl.tenantSettings.tenantFormats.dateFormat;
	    
	            var rootMap = {
	                '$scope': $scope,
	                '$rootScope': $rootScope,
	                '$ctrl': ctrl
	            }

	            if (!ctrl.overrideInvalidDate) {
	                ctrl.overrideInvalidDate = {}
	            }
	            ctrl.overrideInvalidDate[inputDetails.pickerId] = true;
	    
	            if(direction == 1){
	                // datepicker input -> date typing input
	                $timeout(function() {
	                    if(simpleDate){
	                        var dateValue = _.get(rootMap[inputDetails.root],inputDetails.path);
	                        var formattedDate = Factory_App_Dates_Processing.formatSimpleDate(dateValue, DATE_FORMAT, app);
	                        _.set(rootMap[inputDetails.root], "formatDates." + inputDetails.path, formattedDate); 
	                    } else{
	                        var dateValue = _.get(rootMap[inputDetails.root],inputDetails.path);
	                        var formattedDate = Factory_App_Dates_Processing.formatDateTime(dateValue, DATE_FORMAT, inputDetails.fieldId);
	                        _.set(rootMap[inputDetails.root], "formatDates." + inputDetails.path, formattedDate); 
	                    }
	                    ctrl.overrideInvalidDate[inputDetails.pickerId] = false;
	                });
	            }
	            if(direction == 2){
	                // date typing input -> datepicker input 
	                $timeout(function() { 
	                    var date = _.get(rootMap[inputDetails.root], "formatDates." +  inputDetails.path);
	                    var copy = angular.copy(date);
	                    var formattedDate = Factory_App_Dates_Processing.formatDateTimeReverse(copy, simpleDate);
	                    _.set(rootMap[inputDetails.root], inputDetails.path, formattedDate); 
	    
	                    // also change datepicker value
	                    $('.formatted-date-button#' + inputDetails.pickerId).datetimepicker('setDate', new Date(formattedDate));
	                });
	            }
	        }


        }
    ]);


angular.module('shiptech.components').component('requoteDialog', {
    templateUrl: 'components/requote-dialog/views/requote-dialog-component.html',
    controller: 'RequoteDialogController',
    bindings: {
        requirements: "<",
        requoteCurrency: "<",
        groupId: "<",
        onRequote: "&"
    }
});
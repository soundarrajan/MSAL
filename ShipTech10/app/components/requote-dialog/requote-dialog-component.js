angular.module('shiptech.components')
    .controller('RequoteDialogController', [ '$scope', '$element', '$attrs', '$timeout', 'MOCKUP_MAP', 'groupOfRequestsModel', 'tenantService', '$tenantSettings', '$state',
        'EMAIL_TRANSACTION', 'STATE', '$listsCache', '$rootScope', 'Factory_App_Dates_Processing',
        function($scope, $element, $attrs, $timeout, MOCKUP_MAP, groupOfRequestsModel, tenantService, $tenantSettings, $state,
            EMAIL_TRANSACTION, STATE, $listsCache, $rootScope, Factory_App_Dates_Processing) {
            let ctrl = this;
            ctrl.tenantSettings = $tenantSettings;
            ctrl.lists = $listsCache;
            // console.log(tenantService.tenantSettings)
            tenantService.tenantSettings.then((settings) => {
                ctrl.quoteByTimezone = settings.payload.tenantFormats.timeZone;
                ctrl.quoteByCurrency = {
                    id: 1,
                    name: 'US Dollar'
                };
            });
            tenantService.procurementSettings.then((settings) => {
                ctrl.isQuoteDateAutoPopulated = settings.payload.offer.isQuoteDateAutoPopulated;
            });

            ctrl.$onChanges = function(changes) {
                if (typeof changes.requirements !== 'undefined' && !changes.requirements.isFirstChange()) {
                    ctrl.requirements = changes.requirements.currentValue;
                }

                if (typeof changes.requoteCurrency !== 'undefined' && !changes.requoteCurrency.isFirstChange()) {
                    ctrl.quoteByCurrency = changes.requoteCurrency.currentValue;
                }

                if (typeof changes.quoteByCurrency !== 'undefined' && !changes.quoteByCurrency.isFirstChange()) {
                    ctrl.groupId = changes.groupId.currentValue;
                }
            };

            ctrl.actionButtonsEnabled = function() {
                enabled = true;
                $.each(ctrl.requirements, (reqK, reqV) => {
                    if (reqV.RfqId == null) {
                        enabled = false;
                    }
                });
                if (!ctrl.requirements || ctrl.requirements.length == 0) {
                    enabled = false;
                }
                return enabled;
            };

            ctrl.sendRequote = function() {
                console.log();
                if (!ctrl.actionButtonsEnabled()) {
                    if (!ctrl.requirements) {
                        toastr.error('You cannot Requote, as No RFQ is associated with Sellers Offer.');
                    } else {
                        toastr.error('You cannot save the changes because no RFQ is associated with this seller\'s offers');
                    }
                    return;
                }
                let rfq_data = {
                    Requirements: ctrl.requirements,
                    QuoteByDate: ctrl.quoteByDate,
                    QuoteByCurrencyId: ctrl.quoteByCurrency.id,
                    QuoteByTimeZoneId: ctrl.quoteByTimezone.id,
                    Comments: ctrl.internalComments
                };

                groupOfRequestsModel.requoteRFQ(rfq_data).then((response) => {
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
                    toastr.error('You cannot preview email because no RFQ is associated with this seller\'s offers');
                    return;
                }
                if (ctrl.requirements) {
                    let rfq_data = {
                        Requirements: ctrl.requirements,
                        QuoteByDate: ctrl.quoteByDate ? ctrl.quoteByDate : null,
                        QuoteByCurrencyId: ctrl.quoteByCurrency.id ? ctrl.quoteByCurrency.id : null,
                        QuoteByTimeZoneId: ctrl.quoteByTimezone.id ? ctrl.quoteByTimezone.id : null,
                        Comments: ctrl.internalComments ? ctrl.internalComments : null,
                        groupId: ctrl.groupId
                    };

                    $state.go(STATE.PREVIEW_EMAIL, { data: rfq_data, transaction: EMAIL_TRANSACTION.REQUOTE });
                }
            };
        }
    ]);


angular.module('shiptech.components').component('requoteDialog', {
    templateUrl: 'components/requote-dialog/views/requote-dialog-component.html',
    controller: 'RequoteDialogController',
    bindings: {
        requirements: '<',
        requoteCurrency: '<',
        groupId: '<',
        onRequote: '&'
    }
});

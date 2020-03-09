angular.module('shiptech.pages')
    .controller('ViewRfqController', [ '$scope', '$rootScope', '$element', '$attrs', '$timeout', '$state', '$stateParams', 'uiApiModel', 'groupOfRequestsModel', 'tenantService',
        'screenActionsModel', 'STATE', 'EMAIL_TRANSACTION', 'SCREEN_ACTIONS', 'screenLoader', '$listsCache', 'statusColors',
        function($scope, $rootScope, $element, $attrs, $timeout, $state, $stateParams, uiApiModel, groupOfRequestsModel, tenantService,
            screenActionsModel, STATE, EMAIL_TRANSACTION, SCREEN_ACTIONS, screenLoader, $listsCache, statusColors) {
            let ctrl = this;

            $scope.STATE = STATE;

            ctrl.groupId = $stateParams.requestGroupId || 1;
            ctrl.checkboxes = [];
            ctrl.requirements = [];
            ctrl.quoteByTimezoneId = 1;
            ctrl.quoteByTimezone = '(UTC-12:00) International Date Line West';
            ctrl.buttonsDisabled = false;
            ctrl.multipleRequests = false;
            ctrl.STATUS = {};
            ctrl.lists = $listsCache;

            ctrl.init = function() {
                tenantService.tenantSettings
                    .then((settings) => {
                        ctrl.numberPrecision = settings.payload.defaultValues;
                        ctrl.currency = settings.payload.tenantFormats.currency;
                        ctrl.quoteByCurrencyId = ctrl.currency.id;
                        ctrl.quoteByCurrency = ctrl.currency.name;
                    });
                var endpoint;
                if ($rootScope.bladeRfqGroupId) {
                    endpoint = 5;
                } else {
                    endpoint = '';
                };
                uiApiModel.get().then((data) => {
                    ctrl.ui = data;
                    screenLoader.showLoader();
                    // Get the generic data Lists.

                    if ($rootScope.bladeRfqGroupId) {
                        ctrl.groupId = $rootScope.bladeRfqGroupId;
                    }
                    if ($rootScope.bladeFilteredRfq) {
                        var SellerId = $rootScope.bladeFilteredRfq.randUnique.split('-')[0];
                        var PhysicalSupplierId = $rootScope.bladeFilteredRfq.randUnique.split('-')[1];
                        if (PhysicalSupplierId == '') {
                            PhysicalSupplierId = null;
                        }
                        // LocationId = $rootScope.bladeFilteredRfq.requestLocationId;
                        var locationId;
                        if ($rootScope.bladeFilteredRfq.locationData.location) {
                            LocationId = $rootScope.bladeFilteredRfq.locationData.location.id;
                        } else {
                            LocationId = $rootScope.bladeFilteredRfq.locationData.id;
                        }
                        data = {
                            SellerId : SellerId,
                            PhysicalSupplierId : PhysicalSupplierId,
                            LocationId : LocationId,
                            RequestGroupId : ctrl.groupId
                        };
                    } else {
                        data = {
                            RequestGroupId : ctrl.groupId
                        };
                    }

                    groupOfRequestsModel.getViewRFQ(data).then((data) => {
                        ctrl.rfqs = data.payload;
                        if(ctrl.rfqs.length) {
                            let id = ctrl.rfqs[0].requestId;

                            // check if multiple requests are selected
                            for (let i = 1; i < ctrl.rfqs.length; i++) {
                                if (ctrl.rfqs[i].requestId != id) {
                                    ctrl.multipleRequests = true;
                                    break;
                                }
                            }
                        }

                        $timeout(() => {
                            ViewRfqDataTable.init({
                                selector: '#view_rfq_table',
                                dom:'lBfrtip'
                            });

                            initializeDateInputs();
                            $rootScope.overrideCloseNavigation = true;
                        });
                    });
                }).finally(() => {

                });
            };

            ctrl.init();

            ctrl.toggleSelection = function(index, rfq) {
                let req;
                if (ctrl.checkboxes[index]) {
                    req = {
                        RequestLocationId: rfq.requestLocationId,
                        SellerId: rfq.sellerId,
                        RequestId: rfq.requestId,
                        VesselId: rfq.vesselId,
                        LocationId: rfq.locationId,
                        VesselVoyageDetailId: rfq.vesselVoyageDetailId,
                        ProductId: rfq.productId,
                        RfqId: rfq.rfqId,
                        WorkflowId: rfq.workflowId,
                        OrderFields: null,
                        screenActions: rfq.screenActions,
                        productStatus: rfq.productStatus
                    };

                    ctrl.requirements.push(req);
                } else {
                    for (let i = ctrl.requirements.length - 1; i >= 0; i--) {
                        req = ctrl.requirements[i];
                        if (rfq.sellerId == req.SellerId &&
                            rfq.locationId == req.LocationId &&
                            rfq.requestLocationId == req.RequestLocationId &&
                            rfq.productId == req.ProductId) {
                            ctrl.requirements.splice(i, 1);
                        }
                    }
                }
            };

            function initializeDateInputs() {
                let date = $('.form_meridian_datetime');

                date.datetimepicker({
                    format: tenantService.getDateFormatForPicker(),
                    isRTL: App.isRTL(),
                    showMeridian: true,
                    autoclose: true,
                    pickerPosition: App.isRTL() ? 'bottom-right' : 'bottom-left',
                    todayBtn: false
                })
                    .on('changeDate', (ev) => {
                        $timeout(() => {
                            $(ev.target).find('input').val(tenantService.formatDate(ev.date));
                        });
                    })
                    .on('hide', (ev) => {
                        $timeout(() => {
                            $(ev.target).find('input').val(tenantService.formatDate(ev.date));
                        });
                    });
            }

            ctrl.getColorCodeFromLabels = function(statusObj) {
                return statusColors.getColorCodeFromLabels(statusObj, ctrl.lists.ScheduleDashboardLabelConfiguration);
            };

            ctrl.setQuoteByCurrency = function(currencyId, currencyName) {
                ctrl.quoteByCurrencyId = currencyId;
                ctrl.quoteByCurrency = currencyName;
            };

            ctrl.setQuoteByTimezoneId = function(timeZoneId, timeZoneName) {
                ctrl.quoteByTimezoneId = timeZoneId;
                ctrl.quoteByTimezone = timeZoneName;
            };

            ctrl.amend = function() {
                if (ctrl.requirements.length === 0) {
                    return false;
                }

                let rfq_data = ctrl.requirements;

                // remove superfluous cached parameters
                for (let i = 0; i < rfq_data.length; i++) {
                    delete rfq_data[i].screenActions;
                    delete rfq_data[i].productStatus.id;
                }

                ctrl.buttonsDisabled = true;

                groupOfRequestsModel.amendRFQ(rfq_data).then((data) => {
                    ctrl.buttonsDisabled = false;
                    $state.reload();
                    $rootScope.$broadcast('initScreenAfterSendOrSkipRfq', true);
                }, () => {
                    ctrl.buttonsDisabled = false;
                    $state.reload();
                    $rootScope.$broadcast('initScreenAfterSendOrSkipRfq', true);
                });
            };

            ctrl.revoke = function() {
                if (ctrl.requirements.length === 0) {
                    return false;
                }

                let requirements = ctrl.requirements;

                // remove superfluous cached parameters
                for (let i = 0; i < requirements.length; i++) {
                    delete requirements[i].screenActions;
                    delete requirements[i].productStatus;
                }

                let rfq_data = {
                    Requirements: requirements,
                    QuoteByTimeZoneId: ctrl.quoteByTimezoneId,
                    QuoteByCurrencyId: ctrl.quoteByCurrencyId,
                    Comments: null
                };

                ctrl.buttonsDisabled = true;

                groupOfRequestsModel.revokeRFQ(rfq_data).then((data) => {
                    if (data.payload) {
                        if (data.payload.redirectToRequest) {
                            var lastRequestId = rfq_data.Requirements[0].RequestId;
                            location.href = `/#/edit-request/${lastRequestId}`;
                            return;
                        }
                    }
                    ctrl.buttonsDisabled = false;
                    $state.reload();
                    $rootScope.$broadcast('initScreenAfterSendOrSkipRfq', true);
                }, () => {
                    ctrl.buttonsDisabled = false;
                    $state.reload();
                    $rootScope.$broadcast('initScreenAfterSendOrSkipRfq', true);
                });
            };

            ctrl.viewRFQ = function() {
                $state.go(STATE.VIEW_RFQ, { requestGroupId: ctrl.groupId });
            };

            ctrl.goSpot = function() {
                $state.go(STATE.GROUP_OF_REQUESTS, { groupId: ctrl.groupId });
            };

            ctrl.previewRFQ = function(rfq) {
                var req;
                if (!ctrl.requirements) {
                    ctrl.requirements = [];
                }
                req = {
                    RequestLocationId: rfq.requestLocationId,
                    SellerId: rfq.sellerId,
                    RequestId: rfq.requestId,
                    VesselId: rfq.vesselId,
                    LocationId: rfq.locationId,
                    VesselVoyageDetailId: rfq.vesselVoyageDetailId,
                    ProductId: rfq.productId,
                    RfqId: rfq.rfqId,
                    WorkflowId: rfq.workflowId,
                    OrderFields: null,
                    screenActions: rfq.screenActions,
                    productStatus: rfq.productStatus
                };
                ctrl.requirements.push(req);
                let data = {
                    rfqId: rfq.rfqId,
                    rfqRequirements : ctrl.requirements
                };
                $state.go(STATE.PREVIEW_EMAIL, { data: data, transaction: EMAIL_TRANSACTION.VIEW_RFQ, multipleRequests: ctrl.multipleRequests });
            };

            ctrl.canAmendRFQ = function() {
	            let requirement;
	            let isCorrect = true;
	            // for (var i = 0; i < ctrl.requirements.length; i++) {
	            //     requirement = ctrl.requirements[i];
	            //     if (typeof requirement.requestOfferId == "undefined" || requirement.requestOfferId === null) {
	            //         isCorrect = false;
	            //         break;
	            //     }
	            // }
	            return isCorrect;
            };

            ctrl.canRevokeRFQ = function() {
                let canRevoke = false;

                for (let i = 0; i < ctrl.requirements.length; i++) {
                    if (screenActionsModel.hasProductAction(SCREEN_ACTIONS.REVOKERFQ, ctrl.requirements[i].screenActions)) {
                        canRevoke = true;
                    } else {
                        canRevoke = false;
                        break;
                    }
                }

                return canRevoke;
            };

            // ctrl.parseLists = function(){
            //     if(typeof ctrl.STATUS == 'undefined') ctrl.STATUS = {};
            //     $.each($listsCache.Status, function(key,val){
            //         ctrl.STATUS[val.name] = val;
            //     })
            // }
            // ctrl.parseLists();
        } ]);

angular.module('shiptech.pages').component('viewRfq', {
    templateUrl: 'pages/view-rfq/views/view-rfq-component.html',
    controller: 'ViewRfqController'
});

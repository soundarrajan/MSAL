angular.module('shiptech.components').controller('ConfirmOffersDialogController', ['$scope', '$rootScope', '$state', '$element', '$attrs', '$timeout','tenantService', '$filter', 'uiApiModel', 'MOCKUP_MAP', 'groupOfRequestsModel', 'orderModel', 'STATE',
    function($scope, $rootScope, $state, $element, $attrs, $timeout,tenantService, $filter, uiApiModel, MOCKUP_MAP, groupOfRequestsModel, orderModel, STATE) {
        var ctrl = this;
        console.log('offer')
        ctrl.requestOfferItems = [];
        ctrl.availableContractItems = [];
        ctrl.requirements = [];
        ctrl.warningValidation = false;
        ctrl.isHardStop = false;
        ctrl.$onInit = function() {
            var endpoint = MOCKUP_MAP['unrouted.confirm-dialog'];
            uiApiModel.get(endpoint).then(function(data) {
                ctrl.ui = data;
            });
        };
        tenantService.procurementSettings.then(function(settings) {
            ctrl.captureConfirmedQuantity = settings.payload.order.captureConfirmedQuantity
        });        
        // setTimeout(function() {
        //     $('#confirm').on('hidden.bs.modal', function() {
        //         $scope.$emit('buttonsEnabled');
        //     })
        // }, 10);
        ctrl.enableButtons = function() {
            $rootScope.$emit('buttonsDisabled');
        }
        ctrl.$onChanges = function(changes) {
            $('#offer').show();
            $('#warning').hide();
            if (changes.confirmationProductOffers.isFirstChange()) {
                return false; 
            }
            //get details from GOR page
            var confirmationProductOfferIds = changes.confirmationProductOffers.currentValue.requestProductIds;
            ctrl.requirements = changes.confirmationProductOffers.currentValue.requirements;
            ctrl.quoteByDate = changes.confirmationProductOffers.currentValue.quoteByDate;
            ctrl.quoteByCurrencyId = changes.confirmationProductOffers.currentValue.quoteByCurrencyId;
            ctrl.quoteByTimezoneId = changes.confirmationProductOffers.currentValue.quoteByTimeZoneId;
            ctrl.comments = changes.confirmationProductOffers.currentValue.comments;
            ctrl.fullGroupData = changes.confirmationProductOffers.currentValue.fullGroupData;
            var productIds = [];
            var offerIds = [];
            for (var i = 0; i < confirmationProductOfferIds.length; i++) {
                if (confirmationProductOfferIds[i].requestProductId) {
                    productIds.push(confirmationProductOfferIds[i].requestProductId);
                }
                if (confirmationProductOfferIds[i].requestOfferId) {
                    offerIds.push(confirmationProductOfferIds[i].requestOfferId);
                }
            }
            groupOfRequestsModel.confirmOfferView($.unique(productIds).join(","), $.unique(offerIds).join(",")).then(function(data) {
                if (data.payload !== null) {
                    ctrl.requestOfferItems = data.payload.requestOfferItems;
                    ctrl.isBestOffer = data.payload.isBestOffer;
                    for (var offr in ctrl.requestOfferItems) ctrl.requestOfferItems[offr].confirmedQuantity = ctrl.requestOfferItems[offr].maxQuantity;
                    ctrl.availableContractItems = data.payload.availableContractItems;
                }
            });
        };
        ctrl.confirmOffers = function(shouldValidate) {
            // var needSupplier = ctrl.args().needSupplierVerif;
            // var bestOffers = ctrl.args().bestOffer;
            // console.log(bestOffers);
            // ctrl.warningValidation = false;
            // ctrl.isHardStop = false;
            // $('#termCtrWarning').hide();
            // $('#betterOffWarning').hide();
            // $('#lessMinWarning').hide();
            // $('#grMaxWarning').hide();
            // $('#grMaxWarningH').hide();
            // $('#grMaxWarningS').hide();
            // $('#grAvailableQty').hide();
            // if (shouldValidate) {
            //     if (ctrl.availableContractItems.length > 0) {
            //         ctrl.warningValidation = true;
            //         $('#termCtrWarning').show();
            //     }
            //     for (var offr in ctrl.requestOfferItems) {
            //         if (!ctrl.isBestOffer) {
            //             ctrl.warningValidation = true;
            //             $('#betterOffWarning').show();
            //         }
            //         if (ctrl.requestOfferItems[offr].confirmedQuantity < ctrl.requestOfferItems[offr].minQuantity) {
            //             ctrl.warningValidation = true;
            //             $('#lessMinWarning').show();
            //         }
            //         if (ctrl.requestOfferItems[offr].confirmedQuantity > ctrl.requestOfferItems[offr].maxQuantity) {
            //             ctrl.warningValidation = true;
            //             $('#grMaxWarning').show();
            //         }
            //         var date = moment.utc(ctrl.requestOfferItems[offr].validity, moment.ISO_8601);
            //         var today = moment();
            //         if (today.isAfter(date)) {
            //             ctrl.isHardStop = true && (needSupplier.id == 1);
            //             ctrl.warningValidation = true;
            //             if (ctrl.isHardStop) $('#grMaxWarningH').show();
            //             else $('#grMaxWarningS').show();
            //         }
            //     }
            // }
            ctrl.BEvalidationMessages = []
            $.each(ctrl.availableContractItems, function(k,v){
            	if (v.validationMessage) {
		            ctrl.BEvalidationMessages.push(v.validationMessage)
            	}
            })
            if (ctrl.BEvalidationMessages.length > 0) {
                $("#offer").hide();
                $("#warning").show();
                return;
            }            
            // if (ctrl.warningValidation) {
            //     $('#offer').hide();
            //     $('#warning').show();
            //     return;
            // }
            // $('#confirm').modal('hide');
            setConfirmedQuantities();
            requestProductIdsForOrder = [];
            $.each(ctrl.requirements, function(rqK, rqV) {
                requestProductIdsForOrder.push(rqV.RequestProductId);
            })
            ctrl.buttonsDisabled = true;
            orderModel.getExistingOrders(requestProductIdsForOrder.join(',')).then(function(responseData) {
                responseOrderData = responseData.payload;
                productsWithErrors = []
                errorMessages = [];
                $.each(ctrl.requirements, function(rqK, rqV) {
                    hasOrder = false;
                    hasError = false;
                    $.each(responseOrderData, function(rodK, rodV) {
                        hasError = false;
                        $.each(rodV.products, function(rodProdK, rodProdV) {
                            if (rodV.requestLocationId == rqV.RequestLocationId /*&& rodProdV.requestProductId == rqV.RequestProductId*/ ) {
                                hasOrder = true;
                                errorType = [];
                                if (rodV.seller.id != rqV.SellerId) {
                                    if (productsWithErrors.indexOf(rqV.RequestProductId) == -1) {
                                        productsWithErrors.push(rqV.RequestProductId);
                                        hasError = true;
                                        errorType.push("Seller");
                                    }
                                }
                                if (rodProdV.currency.id != rqV.currencyId) {
                                    if (productsWithErrors.indexOf(rqV.RequestProductId) == -1) {
                                        productsWithErrors.push(rqV.RequestProductId);
                                        hasError = true;
                                        errorType.push("Currency");
                                    }
                                }
                                etasDifference = new Date(rqV.vesselETA) - new Date(rodV.orderEta)
                                if (etasDifference > 259200000 || etasDifference < -259200000) {
                                    if (productsWithErrors.indexOf(rqV.RequestProductId) == -1) {
                                        productsWithErrors.push(rqV.RequestProductId);
                                        hasError = true;
                                        errorType.push("ETA Difference");
                                    }
                                }
                                if (!hasError) {
                                    rqV.ExistingOrderId = rodV.id;
                                } else {
                                    errorMessages.push(createOrderErrorMessage(rqV.RequestProductId, errorType));
                                }
                            }
                        })
                    })
                    // if (!hasOrder) {
                    //  if (productsWithErrors.indexOf(rqV.RequestProductId) == -1) {
                    //      productsWithErrors.push(rqV.RequestProductId);
                    //  }
                    // }
                });
                // $.each(productsWithErrors, function(rpK, rpV){
                //  errorMessages.push(createOrderErrorMessage(rpV));
                // })


                // if capture conf qty == "Offer", confirmed qty is visible & required
                if(ctrl.captureConfirmedQuantity.name == 'Offer'){
                    var errorConf = false;
                    $.each(ctrl.requestOfferItems, function(key, val){
                        if(!val.confirmedQuantity){
                            $scope.requestOfferItems["confirmedQuantity_" + key].$setValidity('required', false);
                            errorConf = true;
                        }
                    });
                    if(errorConf){
                        toastr.error("Confirmed Quantity is required!");
                        ctrl.buttonsDisabled = false;
                        return;
                    }
                }
            

                errorMessages = errorMessages.join('\n\n');
                if (errorMessages.length > 0) {
                    toastr.error(errorMessages)
                }
                var rfq_data = {
                    "Requirements": ctrl.requirements,
                    "QuoteByDate": ctrl.quoteByDate,
                    "QuoteByCurrencyId": ctrl.quoteByCurrencyId,
                    "QuoteByTimeZoneId": ctrl.quoteByTimezoneId,
                    "Comments": ctrl.comments
                };
                // $bladeEntity.close();
                ctrl.buttonsDisabled = true;
                toastr.info("Please wait while the offer is confirmed");
                setTimeout(function() {
                    groupOfRequestsModel.confirm(rfq_data).then(function(data) {
                        ctrl.buttonsDisabled = false;
                        receivedOffers = data.payload;
                        $rootScope.tempFilterOrdersFromConfirm = receivedOffers;
                        // if (receivedOffers.length == 1) {
                            $state.go(STATE.EDIT_ORDER, {
                                orderId: receivedOffers[0]
                            });
                        // } else if (receivedOffers.length > 1) {
                        //     $state.go(STATE.ORDER_LIST);
                        // }
                    });
                }, 200)
            }, function(responseData) {
                ctrl.buttonsDisabled = false;
            });
        };

        function createOrderErrorMessage(requestProductId, errorType) {
            errorMessage = null;
            errorTypes = errorType.join(", ");
            if (!errorType) {
                return
            };
            $.each(ctrl.fullGroupData, function(gdK, gdV) {
                $.each(gdV.locations, function(locK, locV) {
                    $.each(locV.products, function(prodK, prodV) {
                        if (prodV.id == requestProductId) {
                            errorMessage = "Unable to add " + prodV.product.name + " for " + gdV.vesselDetails.vessel.name + " in existing stemmed order due to conflicting " + errorTypes + ". New order will be created. " + errorTypes + " will be only that did not met the criteria for extending the order"
                        }
                    })
                })
            })
            if (errorMessage) {
                return errorMessage;
            }
        }
        /**
         * Set confirmed quantites on the requirements depending on user input on offers
         */
        function setConfirmedQuantities() {
            var requirement, offer;
            for (var i = 0; i < ctrl.requirements.length; i++) {
                requirement = ctrl.requirements[i];
                for (var j = 0; j < ctrl.requestOfferItems.length; j++) {
                    offer = ctrl.requestOfferItems[i];
                    if (offer && offer.requestId === requirement.RequestId && offer.locationId === requirement.LocationId && offer.productId === requirement.ProductId && offer.sellerId === requirement.SellerId) {
                        requirement.OrderFields = {
                            ConfirmedQuantity: offer.confirmedQuantity
                        };
                    }
                }
            }
        }
    }
]);
angular.module('shiptech.components').component('confirmOffersDialog', {
    templateUrl: 'components/confirm-offers-dialog/views/confirm-offers-dialog.html',
    controller: 'ConfirmOffersDialogController',
    bindings: {
        confirmationProductOffers: '<',
        args: "&"
    }
});
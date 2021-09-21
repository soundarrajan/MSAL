angular.module('shiptech.components').controller('ConfirmOffersDialogController', [ '$scope', '$rootScope', '$state', '$element', '$attrs', '$timeout', 'tenantService', '$filter', 'uiApiModel', 'MOCKUP_MAP', 'groupOfRequestsModel', 'orderModel', 'STATE',
    function($scope, $rootScope, $state, $element, $attrs, $timeout, tenantService, $filter, uiApiModel, MOCKUP_MAP, groupOfRequestsModel, orderModel, STATE) {
        let ctrl = this;
        console.log('offer');
        ctrl.requestOfferItems = [];
        ctrl.availableContractItems = [];
        ctrl.requirements = [];
        ctrl.warningValidation = false;
        ctrl.isHardStop = false;
        ctrl.$onInit = function() {
            let endpoint = MOCKUP_MAP['unrouted.confirm-dialog'];
            uiApiModel.get(endpoint).then((data) => {
                ctrl.ui = data;
            });
        };
        tenantService.procurementSettings.then((settings) => {
            ctrl.captureConfirmedQuantity = settings.payload.order.captureConfirmedQuantity;
            ctrl.procurementSettings = settings.payload;
        });
        tenantService.tenantSettings.then((settings) => {
            ctrl.tenantSettings = settings.payload;
        })
        // setTimeout(function() {
        //     $('#confirm').on('hidden.bs.modal', function() {
        //         $scope.$emit('buttonsEnabled');
        //     })
        // }, 10);
        ctrl.enableButtons = function() {
            $rootScope.$emit('buttonsDisabled');
        };
	    ctrl.closeBlade = function() {
	    	$('.bladeEntity').removeClass('open');
	    	$('body').css('overflow-y', 'initial');
	    	setTimeout(() => {
		    	$rootScope.bladeTemplateUrl = '';
	    	}, 500);
	    };          
        ctrl.$onChanges = function(changes) {
            $('#offer').show();
            $('#warning').hide();
            if (changes.confirmationProductOffers.isFirstChange()) {
                return false;
            }
            // get details from GOR page
            let confirmationProductOfferIds = changes.confirmationProductOffers.currentValue.requestProductIds;
            ctrl.requirements = changes.confirmationProductOffers.currentValue.requirements;
            ctrl.quoteByDate = changes.confirmationProductOffers.currentValue.quoteByDate;
            ctrl.quoteByCurrencyId = changes.confirmationProductOffers.currentValue.quoteByCurrencyId;
            ctrl.quoteByTimezoneId = changes.confirmationProductOffers.currentValue.quoteByTimeZoneId;
            ctrl.comments = changes.confirmationProductOffers.currentValue.comments;
            ctrl.fullGroupData = changes.confirmationProductOffers.currentValue.fullGroupData;
            let productIds = [];
            let offerIds = [];
            for (let i = 0; i < confirmationProductOfferIds.length; i++) {
                if (confirmationProductOfferIds[i].requestProductId) {
                    productIds.push(confirmationProductOfferIds[i].requestProductId);
                }
                if (confirmationProductOfferIds[i].requestOfferId) {
                    offerIds.push(confirmationProductOfferIds[i].requestOfferId);
                }
            }
            groupOfRequestsModel.confirmOfferView(_.uniq(productIds).join(','), _.uniq(offerIds).join(',')).then((data) => {
                if (data.payload !== null) {
                    ctrl.requestOfferItems = data.payload.requestOfferItems;
                    ctrl.isBestOffer = data.payload.isBestOffer;
                    for (let offr in ctrl.requestOfferItems) {
                        ctrl.requestOfferItems[offr].confirmedQuantity = ctrl.requestOfferItems[offr].maxQuantity;
                        if (!ctrl.procurementSettings.fieldVisibility.isSupplyQuantityHidden && ctrl.requestOfferItems[offr].supplyQuantity) {
	                        ctrl.requestOfferItems[offr].confirmedQuantity = ctrl.requestOfferItems[offr].supplyQuantity;
                        }
                    }
                    ctrl.availableContractItems = data.payload.availableContractItems;
                }
            });
        };
        
        $scope.roundDown = (value, pricePrecision) => {
            var precisionFactor = 1;
            var response = 0;
            var intvalue = parseFloat(value);
            if(pricePrecision == 1) {precisionFactor = 10}   
            if(pricePrecision == 2) {precisionFactor = 100}   
            if(pricePrecision == 3) {precisionFactor = 1000}   
            if(pricePrecision == 4) {precisionFactor = 10000}   
            response = Math.floor(intvalue * precisionFactor) / precisionFactor;
            return response.toString();
        }
        ctrl.priceFormat = (value, pricePrecision) => {
            if (pricePrecision == null) {
                pricePrecision = ctrl.tenantSettings.defaultValues.pricePrecision; 
            }
            plainNumber = $scope.roundDown(value, pricePrecision);
            return $filter("number")(plainNumber, pricePrecision);
        }
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
            //
            //

            if (_.uniqBy(ctrl.requestOfferItems, 'quotedProductGroupId').length != 1) {
            	ctrl.buttonsDisabled = false;
	        	toastr.error('Product types from different groups cannot be stemmed in one order. Please select the products with same group to proceed');
		    	return;
            }

            ctrl.BEvalidationMessages = [];
            $.each(ctrl.availableContractItems, (k, v) => {
            	if (v.validationMessage) {
		            ctrl.BEvalidationMessages.push(v.validationMessage);
            	}
            });
            if (ctrl.BEvalidationMessages.length > 0) {
                $('#offer').hide();
                $('#warning').show();
                return;
            }
            // if (ctrl.warningValidation) {
            //     $('#offer').hide();
            //     $('#warning').show();
            //     return;
            // }
            // $('#confirm').modal('hide');
            setConfirmedQuantities();
            var requestProductIdsForOrder = [];
            $.each(ctrl.requirements, (rqK, rqV) => {
                requestProductIdsForOrder.push(rqV.RequestProductId);
            });
            // ctrl.buttonsDisabled = true;
            orderModel.getExistingOrders(requestProductIdsForOrder.join(',')).then((responseData) => {
                var responseOrderData = responseData.payload;
                var productsWithErrors = [];
                var errorMessages = [];
                $.each(ctrl.requirements, (rqK, rqV) => {
                    var foundRelatedOrder = false;
                    var hasOrder = false;
                    $.each(responseOrderData, (rodK, rodV) => {
                        // hasError = false;
                        $.each(rodV.products, (rodProdK, rodProdV) => {
                            if (rodV.requestLocationId == rqV.RequestLocationId /* && rodProdV.requestProductId == rqV.RequestProductId*/) {
			                    var hasError = false;
                                var hasOrder = true;
                                var errorType = [];
                                if (rodV.seller.id != rqV.SellerId) {
                                    if (productsWithErrors.indexOf(rqV.RequestProductId) == -1) {
                                        productsWithErrors.push(rqV.RequestProductId);
                                        errorType.push('Seller');
                                    }
                                    hasError = true;
                                }
                                if (rodProdV.currency.id != rqV.currencyId) {
                                    if (productsWithErrors.indexOf(rqV.RequestProductId) == -1) {
                                        productsWithErrors.push(rqV.RequestProductId);
                                        errorType.push('Currency');
                                    }
                                    hasError = true;
                                }
                                var etasDifference = new Date(rqV.vesselETA) - new Date(rodV.orderEta);
                                if (etasDifference > 259200000 || etasDifference < -259200000) {
                                    if (productsWithErrors.indexOf(rqV.RequestProductId) == -1) {
                                        productsWithErrors.push(rqV.RequestProductId);
                                        errorType.push('ETA Difference');
                                    }
                                    hasError = true;
                                }
                                if (!hasError) {
		                            foundRelatedOrder = rodV.id;
                                } else if (errorType.length > 0) {
				                        errorMessages.push(createOrderErrorMessage(rqV.RequestProductId, errorType));
                                	}
                            }
                        });
                    });
                	if (foundRelatedOrder) {
                        rqV.ExistingOrderId = foundRelatedOrder;
                    }
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
                if(ctrl.captureConfirmedQuantity.name == 'Offer') {
                    let errorConf = false;
                    $.each(ctrl.requestOfferItems, (key, val) => {
                        if(!val.confirmedQuantity) {
                            $scope.requestOfferItems[`confirmedQuantity_${ key}`].$setValidity('required', false);
                            errorConf = true;
                        }
                    });
                    if(errorConf) {
                        toastr.error('Confirmed Quantity is required!');
                        ctrl.buttonsDisabled = false;
                        return;
                    }
                }


                errorMessages = errorMessages.join('\n\n');
                if (errorMessages.length > 0) {
                    toastr.error(errorMessages);
                }
                let rfq_data = {
                    Requirements: ctrl.requirements,
                    QuoteByDate: ctrl.quoteByDate,
                    QuoteByCurrencyId: ctrl.quoteByCurrencyId,
                    QuoteByTimeZoneId: ctrl.quoteByTimezoneId,
                    Comments: ctrl.comments
                };
                // $bladeEntity.close();
                // ctrl.buttonsDisabled = true;
                toastr.info('Please wait while the offer is confirmed');
                // return;
                setTimeout(() => {
                    groupOfRequestsModel.confirm(rfq_data).then((data) => {
                        ctrl.buttonsDisabled = false;
                        var receivedOffers = data.payload;
                        $rootScope.tempFilterOrdersFromConfirm = receivedOffers;
                        // if (receivedOffers.length == 1) {
                        /*
                            $state.go(STATE.EDIT_ORDER, {
                                orderId: receivedOffers[0]
                            });
                            */
                        if (receivedOffers.length == 1) {
	                           	$('a.closeBlade').click();
	                           	// $rootScope.$broadcast("initScreenAfterSendOrSkipRfq", true);
                            window.location.href = `/#/edit-order/${ receivedOffers[0]}`;
                        } else {
	                           	$('a.closeBlade').click();
	                           	$rootScope.$broadcast('initScreenAfterSendOrSkipRfq', true);
                        }
                        // for (var i = 0; i < receivedOffers.length; i++) {
                        //     window.open('/#/edit-order/' + receivedOffers[i], '_blank');
                        // }
                        // } else if (receivedOffers.length > 1) {
                        //     $state.go(STATE.ORDER_LIST);
                        // }
                    }, () => {
                    	ctrl.buttonsDisabled = false;
                    });
                }, 200);
            }, (responseData) => {
                ctrl.buttonsDisabled = false;
            });
        };

        function createOrderErrorMessage(requestProductId, errorType) {
            var errorMessage = null;
            var errorTypes = errorType.join(', ');
            if (!errorType) {
                return;
            };
            $.each(ctrl.fullGroupData, (gdK, gdV) => {
                $.each(gdV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        if (prodV.id == requestProductId) {
                            errorMessage = `Unable to add ${ prodV.product.name } for ${ gdV.vesselDetails.vessel.name } in existing stemmed order due to conflicting ${ errorTypes }. New order will be created. ${ errorTypes } will be only that did not met the criteria for extending the order`;
                        }
                    });
                });
            });
            if (errorMessage) {
                return errorMessage;
            }
        }

        /**
         * Set confirmed quantites on the requirements depending on user input on offers
         */
        function setConfirmedQuantities() {
            let requirement, offer;
            for (let i = 0; i < ctrl.requirements.length; i++) {
                requirement = ctrl.requirements[i];
                for (let j = 0; j < ctrl.requestOfferItems.length; j++) {
                    offer = ctrl.requestOfferItems[j];
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
        args: '&'
    }
});

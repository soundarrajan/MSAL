angular.module("shiptech.components").controller("ConfirmOrderDialogController", [
    "$scope",
    "$element",
    "$state",
    "$attrs",
    "$timeout",
    "$filter",
    "$rootScope",
    "uiApiModel",
    "MOCKUP_MAP",
    "orderModel",
    "STATE",
    "tenantService",
    function($scope, $element, $state, $attrs, $timeout, $filter, $rootScope, uiApiModel, MOCKUP_MAP, orderModel, STATE, tenantService) {
        var ctrl = this;
        ctrl.warningValidation = false;
        setTimeout(function() {
            $("#confirm").on("hidden.bs.modal", function() {
                $scope.$emit("buttonsEnabled");
            });
        }, 10);
        console.log("order");
        ctrl.enableButtons = function() {
            console.log("!@#!@#!@#");
            $rootScope.$emit("buttonsDisabled");
        };
        $scope.isRequest = function() {
            if ($state.current.name == "default.edit-request") {
                return true;
            } else {
                return false;
            }
        };
        tenantService.procurementSettings.then(function(settings) {
            ctrl.captureConfirmedQuantity = settings.payload.order.captureConfirmedQuantity;
        });
        ctrl.$onInit = function() {
            var endpoint = MOCKUP_MAP["unrouted.confirm-dialog"];
            uiApiModel.get(endpoint).then(function(data) {
                ctrl.ui = data;
                console.log(ctrl.ui);
            });
        };
        ctrl.$onChanges = function(changes) {
            $("#offer").show();
            $("#warning").hide();
            if (changes.confirmationProductOrders.isFirstChange()) {
                return false;
            }
            /*for data coming from request (Proceed to order)*/
            if (changes.confirmationProductOrders.currentValue.requestOrder) {
                ctrl.orderDataFromRequest = changes.confirmationProductOrders.currentValue.requestOrder;
            } else {
                ctrl.orderDataFromRequest = null;
            }
            if (changes.confirmationProductOrders.currentValue.confirmationProductOrders) {
                changedConfirmationProductOrders = changes.confirmationProductOrders.currentValue.confirmationProductOrders;
            } else {
                changedConfirmationProductOrders = changes.confirmationProductOrders.currentValue;
            }
            /*end for data coming from request (Proceed to order)*/
            var filters = {
                requestId: changedConfirmationProductOrders.requestId,
                contractId: changedConfirmationProductOrders.contractId,
                contractProductId: changedConfirmationProductOrders.contractProductId,
                requestProductId: changedConfirmationProductOrders.requestProductId
            };
            orderModel.createWithContract(null, filters).then(function(data) {
                if (ctrl.orderDataFromRequest) {
                    $.each(data.payload.orders, function(ordK, ordV) {
                        $.each(ctrl.orderDataFromRequest, function(odfrK, odfrV) {
                            if (ordV.requestLocationId == odfrV.requestLocationId) {
                                ordV.existingOrderId = odfrV.id;
                            }
                        });
                    });
                }
                ctrl.orderList = data.payload.orders;
                ctrl.requestOfferItems = normalizeOfferData(data.payload.orders);
                ctrl.availableContractItems = data.payload.termContract;
            });
        };
        ctrl.changeOrderQty = function(item) {
            $.each(ctrl.orderList, function(k, v) {
                if (item.oId == v.id) {
                    $.each(v.products, function(kp, vp) {
                        if (item.requestProductId == vp.requestProductId && item.productId == vp.product.id) {
                            vp.confirmedQuantity = item.confirmedQuantity
                        }
                    })
                }
            });
            console.log(ctrl.orderList);
        };
        ctrl.confirmOffers = function(shouldValidate) {
            // ctrl.warningValidation = false;
            // $("#termCtrWarning").hide();
            // $("#betterOffWarning").hide();
            // $("#lessMinWarning").hide();
            // $("#grMaxWarning").hide();
            // $("#grMaxWarningH").hide();
            // $("#grMaxWarningS").hide();
            // $("#grAvailableQty").hide();
            // if (shouldValidate) {
            //     for (var offr in ctrl.requestOfferItems) {
            //         if (ctrl.requestOfferItems[offr].confirmedQuantity < ctrl.requestOfferItems[offr].minQuantity) {
            //             ctrl.warningValidation = true;
            //             $("#lessMinWarning").show();
            //         }
            //         if (ctrl.requestOfferItems[offr].confirmedQuantity > ctrl.requestOfferItems[offr].maxQuantity) {
            //             ctrl.warningValidation = true;
            //             $("#grMaxWarning").show();
            //         }
            //         // Remember to change API if/when pagination will be added
            //         if (
            //             $filter("filter")(ctrl.availableContractItems, {
            //                 contract: {
            //                     id: ctrl.requestOfferItems[offr].contractId
            //                 }
            //             })[0].availableQuantity < ctrl.requestOfferItems[offr].confirmedQuantity
            //         ) {
            //             ctrl.warningValidation = true;
            //             $("#grAvailableQty").show();
            //         }
            //     }
            // }


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


            ctrl.BEvalidationMessages = []
            $.each(ctrl.availableContractItems, function(k,v){
            	if (v.validationMessage) {
		            ctrl.BEvalidationMessages.push(v.validationMessage)
            	}
            })
            if (ctrl.BEvalidationMessages.length > 0 && shouldValidate) {
                $("#offer").hide();
                $("#warning").show();
                return;
            }
            $("#confirm").modal("hide");
            $scope.$broadcast("buttonsEnabled");
            ctrl.buttonsDisabled = true;
            requestProductIds = [];
            contractIds = [];
            $.each(ctrl.orderList, function(ordk, ordv) {
                $.each(ordv.products, function(prodk, prodv) {
                    requestProductIds.push(prodv.requestProductId);
                });
            });
            contractIds.push(parseInt(changedConfirmationProductOrders.contractId));
            // $.each(ctrl.availableContractItems, function(ack, acv) {
            //     if (acv.contract) {
            //         contractIds.push(acv.contract.id)
            //     }
            // })
            checkIfOrderFfilters = [
                {
                    ColumnName: "RequestProductIds",
                    Value: JSON.stringify(requestProductIds)
                },
                {
                    ColumnName: "ContractIds",
                    Value: JSON.stringify(contractIds)
                }
            ];
            orderModel.checkIfOrderCanBeCreatedUsingSelectedContract(checkIfOrderFfilters).then(function(data) {
                if (data.payload) {
                    if (data.payload.length > 0) {
                        toastr.error(data.payload);
                    }
                } else {
                    // alert("createOrders");
                    // return
                    toastr.info("Please wait, the order is being created");
                    orderModel.createOrders(ctrl.orderList).then(
                        function(data) {
                            // debugger
                            ctrl.buttonsDisabled = false;
                            receivedOffers = data.payload;
                            $rootScope.tempFilterOrdersFromConfirm = [];
                            // if (receivedOffers.length == 1) {
                                $rootScope.tempFilterOrdersFromConfirm = receivedOffers[0];
                                $state.go(STATE.EDIT_ORDER, {
                                    orderId: receivedOffers[0]
                                });
                            // } else if (receivedOffers.length > 1) {
                            //     $rootScope.tempFilterOrdersFromConfirm[0] = changedConfirmationProductOrders.requestId;
                            //     localStorage.setItem("tempFilterOrdersFromConfirm", JSON.stringify($rootScope.tempFilterOrdersFromConfirm));
                            //     console.log($rootScope.tempFilterOrdersFromConfirm);
                            //     $state.go(STATE.ORDER_LIST);
                            // }
                        },
                        function() {
                            ctrl.buttonsDisabled = false;
                        }
                    );
                }
                ctrl.buttonsDisabled = false;
            }).finally(function(){
                ctrl.buttonsDisabled = false;
            });
        };
        //set user params on products inside order list from dialog
        function setUserParamsOnOrders(data) {
            var product, order;
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].products.length; j++) {
                    product = data[i].products[j];
                    for (var k = 0; k < ctrl.requestOfferItems.length; k++) {
                        order = ctrl.requestOfferItems[k];
                        if (order.requestProductId === product.requestProductId) {
                            product.confirmedQuantity = order.confirmedQuantity;
                        }
                    }
                }
            }
        }
        //normalize offer and contract data to fill in the confirm template
        function normalizeOfferData(data) {
            var offerData = [];
            $.each(data, function(k, v) {
                $.each(v.products, function(pk, pv) {
                    var item = {};
                    var product;
                    // product = pv;
                    item.sellerName = v.seller.name;
                    item.existingOrderId = v.existingOrderId;
                    item.locationName = v.location.name;
                    item.productName = pv.product ? pv.product.name : null;
                    item.minQuantity = pv.minQuantity;
                    item.maxQuantity = pv.maxQuantity;
                    item.confirmedQuantity = pv.maxQuantity;
                    item.offerPrice = pv.price;
                    item.totalPrice = pv.price;
                    item.productId = pv.id;
                    item.requestProductId = pv.requestProductId;
                    item.conversionFactorToUomOfPriceFromContract = pv.conversionFactorToUomOfPriceFromContract;
                    item.physicalSupplierName = pv.physicalSupplier.name;
                    item.oId = v.id;
                    if(pv.quantityUom) item.quantityUomName = pv.quantityUom.name;
                    // item.quantityUomName = pv.quantityUomm.name;
                    // item.contractId = v.contract.id;
                    console.log(pv);
                    offerData.push(item);
                });
            });
            // for (var i = 0; i < data.length; i++) {
            //     for (var j = 0; j < data[i].products.length; j++) {
            //         product = data[i].products[j];
            //         item.sellerName = data[i].seller.name;
            //         item.existingOrderId = data[i].existingOrderId;
            //         item.locationName = data[i].location.name;
            //         item.productName = product.product ? product.product.name : null;
            //         item.minQuantity = product.minQuantity;
            //         item.maxQuantity = product.maxQuantity;
            //         item.confirmedQuantity = product.maxQuantity;
            //         item.offerPrice = product.price;
            //         item.totalPrice = product.price;
            //         item.productId = product.id;
            //         item.conversionFactorToUomOfPriceFromContract = product.conversionFactorToUomOfPriceFromContract;
            //         item.physicalSupplierName = product.physicalSupplier.name;
            //         // item.contractId = data[i].contract.id;
            //         console.log(item)
            //         offerData.push(item);
            //     }
            // }
            return offerData;
        }

        function normalizeContractData(data) {
            var contractData = [];
            var item = {};
            for (var i = 0; i < data.length; i++) {
                item.sellerName = data[i].seller.name;
                item.locationName = data[i].location.name;
                item.productName = data[i].product.name;
                item.contractQuantity = data[i].contractedQuantity;
                item.liftedQuantity = data[i].utilizedQuantity;
                item.availableQuantity = data[i].availableQuantity;
                item.quantityUomName = data[i].uom.name;
                item.price = data[i].convertedPrice;
                contractData.push(item);
            }
            return contractData;
        }
    }
]);
angular.module("shiptech.components").component("confirmOrderDialog", {
    templateUrl: "components/confirm-offers-dialog/views/confirm-offers-dialog.html",
    controller: "ConfirmOrderDialogController",
    bindings: {
        confirmationProductOrders: "<"
    }
});

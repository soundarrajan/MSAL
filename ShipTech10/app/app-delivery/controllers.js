/**
 * Delivery Controller
 */
APP_DELIVERY.controller('Controller_Delivery', ['$scope', '$rootScope', '$Api_Service', 'Factory_Delivery', '$state', '$location', '$q', '$compile', '$filter', 'Factory_Master', '$listsCache', 'statusColors', '$http', 'API', 'screenLoader', function($scope, $rootScope, $Api_Service, Factory_Delivery, $state, $location, $q, $compile, $filter, Factory_Master, $listsCache, statusColors, $http, API, screenLoader) {
    var vm = this;
    var guid = '';
    vm.master_id = $state.params.screen_id;
    vm.app_id = $state.params.path[0].uisref.split('.')[0];
    vm.entity_id = $state.params.entity_id;
    $scope.addedFields = new Object;
    $scope.disabledSplitBtn = false;
    vm.response = "";
    vm.listsCache = $listsCache
    vm.ids = '';
    if ($state.params.path) {
        vm.app_id = $state.params.path[0].uisref.split('.')[0];
    }
    if ($scope.screen) {
        vm.screen_id = $scope.screen;
    } else {
        vm.screen_id = $state.params.screen_id;
    }
    $scope.finalQuantityRules = [];
    vm.deliveryTree = [];
    vm.deliveryCatalog = function() {
        vm.deliveryTree = [{
            id: 1,
            title: 'Orders delivery',
            slug: 'deliverylist',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, {
            id: 2,
            title: 'Delivery',
            slug: 'delivery',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, {
            id: 3,
            title: 'Deliveries to be verified',
            slug: 'deliveriestobeverified',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, ];
    };
    vm.selectDeliveryScreen = function(id, name) {
        $location.path('/delivery/' + id);
        $scope.delivery_screen_name = name;
    };
    $scope.add_delivery_product = function() {
        if (!$scope.formValues.deliveryProducts) {
            $scope.formValues.deliveryProducts = [];
        }
        $scope.formValues.deliveryProducts.push({
            "id": 0
        });
        toastr.success('Product added');
    }
    $scope.raise_note_of_protest = function() {
        toastr.success('It Works');
    }
    /*SELCTIONS FOR RAISE CLAIM IN DELIVERY*/
    $scope.initClaimInfo = function() {
        $scope.currentProductIndex = null;
        $scope.currentClaimTypeId = null;
        $scope.currentSpecParameters = [];
    }
    /* get claim info based on checkbox
    $scope.getClaimInfo = function($event) {

        selected=$($event.target);
        activeProductIndex = selected.attr('product-index');
        activeClaimType = selected.attr('claim-type');
        activeClaimTypeId = selected.attr('claim-type-id');
        activeSpecParamId = selected.attr('spec-param-id');

        if (selected.prop("checked") == true) {
            $rootScope.currentProductIndex = activeProductIndex;
            $rootScope.currentClaimType = activeClaimType;
            $rootScope.currentClaimTypeId = activeClaimTypeId;
            if (typeof($rootScope.currentSpecParamIds) == 'undefined') {
                $rootScope.currentSpecParamIds = [];
            }
            $(".claimInfoCheckbox[product-index!="+$rootScope.currentProductIndex+"]").attr("disabled", "disabled");
            $(".claimInfoCheckbox[claim-type!="+$rootScope.currentClaimType+"]").attr("disabled", "disabled");
            $(".claimInfoCheckbox[claim-type-id!="+$rootScope.currentClaimTypeId+"]").attr("disabled", "disabled");
            if (activeClaimType == 'quality') {
                $rootScope.currentSpecParamIds.push(activeSpecParamId);
            }
        }

        if (selected.prop("checked") == false) {
            if (activeClaimType == 'quantity') {
                $rootScope.currentProductIndex = null;
                $rootScope.currentClaimType = null;
                $rootScope.currentClaimTypeId = null;
                $(".claimInfoCheckbox").removeAttr("disabled");
            }
            if (activeClaimType == 'quality') {
                $rootScope.currentSpecParamIds.splice($rootScope.currentSpecParamIds.indexOf(activeSpecParamId), 1);
                if ($rootScope.currentSpecParamIds.length == 0) {
                    $(".claimInfoCheckbox").removeAttr("disabled");
                    $rootScope.currentProductIndex = null;
                    $rootScope.currentClaimType = null;
                    $rootScope.currentClaimTypeId = null;
                }
            }
        }
        $rootScope.raiseClaimInfo = {
            'productIndex':  $rootScope.currentProductIndex,
            'currentClaimTypeId':  $rootScope.currentClaimTypeId,
            'currentSpecParamIds':  $rootScope.currentSpecParamIds,
        }
        console.log('productIndex: ', $rootScope.currentProductIndex);
        console.log('currentClaimType: ', $rootScope.currentClaimType);
        console.log('currentClaimTypeId: ', $rootScope.currentClaimTypeId);
        console.log('currentSpecParamIds: ', $rootScope.currentSpecParamIds);

        // $rootScope.raiseClaimInfo = $scope.claimInfo;
    }
    */
    $scope.initRaiseClaimInfo = function() {
        $rootScope.raiseClaimInfo = {};
        console.log('init raise claim info');
    }
    $scope.getClaimInfo = function(specParams, prodId) {
        $rootScope.raiseClaimInfo = {};
        $rootScope.raiseClaimInfo.allSpecParams = specParams;
        $rootScope.raiseClaimInfo.productId = prodId;
        console.log($rootScope.raiseClaimInfo);
    }
    $scope.clearClaimInfo = function() {
        $(".claimInfoCheckbox").prop("checked", false);
        $scope.claimInfo = {};
    }
    $scope.triggerChangeFieldsAppSpecific = function(name, id) {
        if (name == 'OrderNumber') {
            if(typeof $scope.formValues.order != 'undefined'){
                if (!$scope.formValues.order.id) {
                    return
                };
            }
            $scope.formValues.SellerName = "";
            $scope.formValues.Port = "";
            $scope.formValues.OrderBuyer = "";
            if(typeof $scope.formValues.order != 'undefined'){
                Factory_Master.get_master_entity($scope.formValues.order.id, 'orders', 'orders', function(response) {
                    $scope.formValues.sellerName = response.seller.name;
                    $scope.formValues.port = response.location.name;
                    $scope.formValues.OrderBuyer = response.buyer.name;
                    $scope.formValues.temp.orderedProducts = response.products;
                    $scope.formValues.deliveryProducts = [];
                    if (response.surveyorCounterparty) {
                        $scope.formValues.surveyorName = response.surveyorCounterparty.name;
                    }
                });
            }
            $scope.getRelatedDeliveries($scope.formValues.order.id)
            $scope.getDeliveryOrderSummary($scope.formValues.order.id);
        }
        if (name.indexOf("orderedProduct") >= 0) {
            ///////////////////////////////////////////////////// - Betty 30/07/2018
            // var productIndex = name.split('_')[1];
            // productID = null
            // if ($scope.formValues.deliveryProducts[productIndex].orderedProduct) {
            //     productID = $scope.formValues.deliveryProducts[productIndex].orderedProduct.id;
            // }
            // orderProductId = null;
            // orderProductSpecGroupId = null;
            // $.each($scope.formValues.temp.deliverysummary.products, function(_, ordProd) {
            //     if (productID == ordProd.product.id) {
            //         orderProductId = ordProd.id;
            //         orderProductSpecGroupId = ordProd.specGroup.id;
            //     }
            // })
            // data = {
            //     "Payload": {
            //         "Filters": [{
            //             "ColumnName": "OrderProductId",
            //             "Value": orderProductId
            //         }, {
            //             "ColumnName": "SpecGroupId",
            //             "Value": orderProductSpecGroupId
            //         }]
            //     }
            // }
            // Factory_Master.getSpecParamsDeliveryProduct(data, function(response) {
            //     $scope.formValues.deliveryProducts[productIndex].qualityParameters = response;
            // })
            // if (typeof productData == 'undefined') {
            //     productData = {};
            // }
            // $.each($scope.formValues.temp.deliverysummary.products, function(_, value) {
            //     if (value.product.id == productID) {
            //         productData.orderedQuantity = value.orderedQuantity;
            //     }
            // })
            // Factory_Master.get_conversion_info(productID, function(response) {
            //     $scope.conversionInfoData = response.data;
            // })
            // $scope.calculateVarianceAndReconStatus(productIndex);
        }

        if(name == 'berthingTime'){
          //$scope.setLimitForPickers();
        }
        if(name == 'bargeAlongside'){
          //$scope.setLimitForPickers();
        }
        if(name == 'pumpingStart'){
          // $scope.setLimitForPickers();
        }
        if(name == 'pumpingEnd'){
          // $scope.setLimitForPickers();
        }
        if(name == 'bdnDate'){
          // $scope.setLimitForPickers();
        }
    }
    $scope.getDeliveryOrderSummary = function(orderId) {
        Factory_Master.get_master_entity(orderId, 'deliverysummary', vm.app_id, function(response) {
            if (typeof($scope.formValues.temp) == 'undefined') {
                $scope.formValues.temp = {};
            }
            $scope.formValues.temp.deliverysummary = response;
            if (!vm.entity_id) {
                delID = 0;
                //new delivery
                //also set pricing date for delivery to delivery date if null
                $.each($scope.formValues.deliveryProducts, function(_, deliveryProd) {
                    $.each($scope.formValues.temp.deliverysummary.products, function(key2, summaryProd) {
                        if (summaryProd.id == deliveryProd.orderProductId) {
                            if (summaryProd.pricingDate != null) {
                                deliveryProd.pricingDate = summaryProd.pricingDate;
                            } else {
                                deliveryProd.pricingDate = $scope.formValues.temp.deliverysummary.deliveryDate
                            }
                        }
                    })
                })
                // $scope.formValues.pricingDate = $scope.formValues.temp.deliverysummary.products[0].pricingDate;
                $scope.formValues.deliveryDate = $scope.formValues.temp.deliverysummary.deliveryDate;
            } else {
                delID = vm.entity_id;
            }
            if (typeof($scope.formValues.deliveryStatus) != 'undefined') {
                if ($scope.formValues.deliveryStatus.name) {
                    // $state.params.title = "DEL - " + delID + " - " + $scope.formValues.order.name + ' - ' + $scope.formValues.temp.deliverysummary.vesselName;
                    // $state.params.title = 'CTRL' + $scope.formValues.name;
                    $state.params.title = $scope.formValues.name;
                    // $state.params.status.name = $scope.formValues.deliveryStatus.name;
                    $state.params.status.name = $scope.formValues.deliveryStatus.displayName;
                    $state.params.status.bg = statusColors.getColorCodeFromLabels($scope.formValues.deliveryStatus, $listsCache.ScheduleDashboardLabelConfiguration);
                    $state.params.status.color = 'white';
                }
            } else {
                $state.params.status.name = null;
            }
            if ($scope.formValues.deliveryProducts) {
                vm.setProductsPhysicalSupplier();
                vm.setQtyUoms();
            }
        });
    }
    vm.setProductsPhysicalSupplier = function() {
        $.each($scope.formValues.deliveryProducts, function(_, deliveryProd) {
            $.each($scope.formValues.temp.deliverysummary.products, function(_, summaryProd) {
                if (deliveryProd.orderProductId == summaryProd.id) {
                	if (!deliveryProd.physicalSupplier && !$scope.formValues.id) {
	                    deliveryProd.physicalSupplier = angular.copy(summaryProd.physicalSupplier);
                	}
                }
            })
        })
    }
    vm.setQtyUoms = function() {
        $.each($scope.formValues.deliveryProducts, function(_, deliveryProd) {
            $.each($scope.formValues.temp.deliverysummary.products, function(_, summaryProd) {
                if (summaryProd.id == deliveryProd.orderProductId) {
                    if (!deliveryProd.surveyorQuantityUom) deliveryProd.surveyorQuantityUom = summaryProd.orderedQuantity.uom;
                    if (!deliveryProd.vesselQuantityUom) deliveryProd.vesselQuantityUom = summaryProd.orderedQuantity.uom;
                    if (!deliveryProd.agreedQuantityUom) deliveryProd.agreedQuantityUom = summaryProd.orderedQuantity.uom;
                    if (!deliveryProd.bdnQuantityUom) deliveryProd.bdnQuantityUom = summaryProd.orderedQuantity.uom;
                    if (!deliveryProd.vesselFlowMeterQuantityUom) deliveryProd.vesselFlowMeterQuantityUom = summaryProd.orderedQuantity.uom;
                    if (!deliveryProd.finalQuantityUom) deliveryProd.finalQuantityUom = summaryProd.orderedQuantity.uom;
                }
            })
        })
    }
    vm.setSpecParams = function() {
        $.each($scope.formValues.deliveryProducts, function(_, deliveryProd) {
            $.each($scope.formValues.temp.deliverysummary.products, function(_, summaryProd) {
                if (summaryProd.id == deliveryProd.orderProductId) {
                    deliveryProd.specGroup = angular.copy(summaryProd.specGroup);
            
                    //init spec params
                    orderProductId = summaryProd.id;
                    orderProductSpecGroupId = summaryProd.specGroup.id;
                    data = {
                        "Payload": {
                            "Filters": [{
                                "ColumnName": "OrderProductId",
                                "Value": orderProductId
                            }, {
                                "ColumnName": "SpecGroupId",
                                "Value": orderProductSpecGroupId
                            }]
                        }
                    }
                    Factory_Master.getSpecParamsDeliveryProduct(data, function(response) {
                        deliveryProd.qualityParameters = angular.copy(response);
                    })
                    Factory_Master.getQtyParamsDeliveryProsuct(data, function(response) {
                        deliveryProd.quantityParameters = angular.copy(response);
                    })
                }
            })
        })
    }
    /*END SELCTIONS FOR RAISE CLAIM IN DELIVERY*/
    /*delivery quantity variance and status calculations*/
    $scope.initGetConversionInfo = function(productID, productIdx) {
        if (typeof($scope.formValues.temp.variances) == 'undefined') {
            $scope.formValues.temp.variances = [];
        }

        Factory_Master.get_conversion_info(productID, function(response) {
            // console.log(response);
            $scope.formValues.temp.variances['product_' + productIdx] = null;
            $scope.conversionInfoData = response.data;
            $scope.calculateVarianceAndReconStatus(productIdx);
        })
    }
    $scope.calculateVarianceAndReconStatus = function(productIdx) {
        //function called for all quantities, call here calculate final quantity
        $scope.calculateFinalQuantity(productIdx);
        conversionInfo = $scope.conversionInfoData;
        activeProduct = $scope.formValues.deliveryProducts[productIdx];
        // get fields values and uom
        activeProduct.confirmedQuantityUom == null ? confirmedQuantityUom = null : confirmedQuantityUom = activeProduct.confirmedQuantityUom.name;
        activeProduct.vesselQuantityUom == null ? vesselQuantityUom = null : vesselQuantityUom = activeProduct.vesselQuantityUom.name;
        activeProduct.bdnQuantityUom == null ? bdnQuantityUom = null : bdnQuantityUom = activeProduct.bdnQuantityUom.name;
        activeProduct.vesselFlowMeterQuantityUom == null ? vesselFlowMeterQuantityUom = null : vesselFlowMeterQuantityUom = activeProduct.vesselFlowMeterQuantityUom.name;
        // activeProduct.bargeFlowMeterQuantityUom == null ? bargeFlowMeterQuantityUom = null : bargeFlowMeterQuantityUom = activeProduct.bargeFlowMeterQuantityUom.name;
        activeProduct.surveyorQuantityUom == null ? surveyorQuantityUom = null : surveyorQuantityUom = activeProduct.surveyorQuantityUom.name;
        Confirm = {
            'val': activeProduct.confirmedQuantityAmount,
            'uom': confirmedQuantityUom
        };
        Vessel = {
            'val': activeProduct.vesselQuantityAmount,
            'uom': vesselQuantityUom
        };
        Bdn = {
            'val': activeProduct.bdnQuantityAmount,
            'uom': bdnQuantityUom
        };
        VesselFlowMeter = {
            'val': activeProduct.vesselFlowMeterQuantityAmount,
            'uom': vesselFlowMeterQuantityUom
        };
        // BargeFlowMeter = {
        //     'val': activeProduct.bargeFlowMeterQuantityAmount,
        //     'uom': bargeFlowMeterQuantityUom
        // };
        Surveyor = {
            'val': activeProduct.surveyorQuantityAmount,
            'uom': surveyorQuantityUom
        };
        currentFieldValues = {
            "Confirm": Confirm,
            "Vessel": Vessel,
            "Bdn": Bdn,
            "VesselFlowMeter": VesselFlowMeter,
            "Surveyor": Surveyor
        };
        // "BargeFlowMeter": BargeFlowMeter,
        fieldUoms = {
            "Confirm": 'confirmedQuantityUom',
            "Vessel": 'vesselQuantityUom',
            "Bdn": 'bdnQuantityUom',
            "VesselFlowMeter": 'vesselFlowMeterQuantityUom',
            "Surveyor": 'surveyorQuantityUom'
        }
        // "BargeFlowMeter": 'bargeFlowMeterQuantityUom',
        convertedFields = []
        baseUom = '';
        convFact = 1;
        if (typeof conversionInfo == 'undefined') {
            conversionInfo = {}
        }
        if ((productIdx == 0) && (typeof($scope.formValues.temp.variances) == 'undefined')) {
            $scope.formValues.temp.variances = [];
        }
        if ($scope.formValues.deliveryProducts[productIdx].sellerQuantityType &&
            typeof $scope.formValues.deliveryProducts[productIdx].sellerQuantityType != 'null' &&
            typeof $scope.formValues.deliveryProducts[productIdx].sellerQuantityType.name != 'undefined') {

            uomObjId = fieldUoms[$scope.formValues.deliveryProducts[productIdx].sellerQuantityType.name];
            baseUom = $scope.formValues.deliveryProducts[productIdx][uomObjId];

        }
        if (!baseUom) {
            $scope.formValues.temp.variances['uom_' + productIdx] = null;
            $scope.formValues.temp.variances['product_' + productIdx] = null;
            $scope.setVarianceColor(productIdx);
            // return;
        }
        $.each(currentFieldValues, function(fieldKey, fieldVal) {
            $.each(conversionInfo.uomConversionFactors, function(factKey, factVal) {
                if (fieldVal.uom == factVal.sourceUom.name) {
                    convertedValue = fieldVal.val * factVal.conversionFactor;
                    convertedFields[fieldKey] = convertedValue;
                }
            })
        })
        if (baseUom && conversionInfo.toleranceQuantityUom) {
            if (baseUom.name != conversionInfo.toleranceQuantityUom.name) {
                $.each(conversionInfo.uomConversionFactors, function(factKey, factVal) {
                    if (baseUom.name == factVal.sourceUom.name) {
                        convFact = factVal.conversionFactor;
                    }
                })
            } else {
                convFact = 1;
            }
        }
        $scope.formValues.temp.variances['mfm_product_' + productIdx] = null;
        $scope.formValues.temp.variances['mfm_uom_' + productIdx] = null;
        if (activeProduct.vesselFlowMeterQuantityUom && activeProduct.bdnQuantityUom && activeProduct.bdnQuantityAmount && activeProduct.vesselFlowMeterQuantityAmount) {
            mfm_baseUom = activeProduct.vesselFlowMeterQuantityUom;
            if (mfm_baseUom && conversionInfo.toleranceQuantityUom) {
                if (mfm_baseUom.name != conversionInfo.toleranceQuantityUom.name) {
                    $.each(conversionInfo.uomConversionFactors, function(factKey, factVal) {
                        if (mfm_baseUom.name == factVal.sourceUom.name) {
                            mfm_convFact = factVal.conversionFactor;
                        }
                    })
                } else {
                    console.log('same');
                    mfm_convFact = 1;
                }
                mfm_qty = convertedFields['VesselFlowMeter'];
                bdn_qty = convertedFields['Bdn'];
                variance = parseFloat(mfm_qty - bdn_qty);
                mfm_variance = (mfm_qty - bdn_qty) / mfm_convFact;
                $scope.formValues.temp.variances['mfm_product_' + productIdx] = $filter('number')(mfm_variance, 3);
                $scope.formValues.temp.variances['mfm_uom_' + productIdx] = mfm_baseUom.name;
            }
        }
        if (!activeProduct.buyerQuantityType) {
            return;
        }
        if (!activeProduct.sellerQuantityType) {
            return;
        }
        buyerOption = activeProduct.buyerQuantityType.name;
        sellerOption = activeProduct.sellerQuantityType.name;
        buyerConvertedValue = convertedFields[buyerOption];
        sellerConvertedValue = convertedFields[sellerOption];
        if (!sellerConvertedValue || !buyerConvertedValue) {
            variance = null;
            $scope.formValues.temp.variances['product_' + productIdx] = variance;
            $scope.setVarianceColor(productIdx);
        } else {

            // this is where variance is calculated. rn it's buyer - seler (15/08)
            variance = parseFloat(buyerConvertedValue - sellerConvertedValue);

            //
            varianceDisplay = variance / convFact;
            $scope.formValues.temp.variances['product_' + productIdx] = $filter('number')(varianceDisplay, 3);
            $scope.formValues.temp.variances['uom_' + productIdx] = baseUom.name;
            $scope.setVarianceColor(productIdx);
        }
        if (typeof($scope.formValues.temp.reconStatus) == 'undefined') {
            $scope.formValues.temp.reconStatus = [];
        }
        if (variance != null) {
            if (conversionInfo.quantityReconciliation.name == 'Flat') {
                if (variance < conversionInfo.minToleranceLimit) {
                    $scope.formValues.temp.reconStatus['product_' + productIdx] = 1 //Matched Green
                }
                if (variance > conversionInfo.minToleranceLimit && variance < conversionInfo.maxToleranceLimit) {
                    $scope.formValues.temp.reconStatus['product_' + productIdx] = 2 // Unmatched Amber
                }
                if (variance > conversionInfo.maxToleranceLimit) {
                    $scope.formValues.temp.reconStatus['product_' + productIdx] = 3 // Unmatched Red
                }
            } else {
                minValue = conversionInfo.minToleranceLimit * $scope.formValues.deliveryProducts[productIdx].confirmedQuantityAmount / 100;
                maxValue = conversionInfo.maxToleranceLimit * $scope.formValues.deliveryProducts[productIdx].confirmedQuantityAmount / 100;
                if (variance < minValue) {
                    $scope.formValues.temp.reconStatus['product_' + productIdx] = 1 //Matched Green
                }
                if (variance > minValue && variance < maxValue) {
                    $scope.formValues.temp.reconStatus['product_' + productIdx] = 2 // Unmatched Amber
                }
                if (variance > maxValue) {
                    $scope.formValues.temp.reconStatus['product_' + productIdx] = 3 // Unmatched Red
                }
            }
        } else {
            $scope.formValues.temp.reconStatus['product_' + productIdx] = null;
        }
        // Update buyer & seller amount and uom
        vm.setBuyerSellerQuantityAndUom('buyer');
        vm.setBuyerSellerQuantityAndUom('seller');
    }

    $scope.calculateFinalQuantity = function(productIdx){

        // debugger;
        if (typeof(productIdx) == 'undefined') {return}
        if (typeof($scope.formValues.deliveryProducts[productIdx]) == 'undefined') {return}
        var dataSet = false;


        // rules are in order, check for each if quantity exists and set that
        // if not, go on
    
        $.each($scope.finalQuantityRules, function(_, rule){
            if((typeof($scope.formValues.deliveryProducts[productIdx][rule.deliveryMapping + "Uom"]) != 'undefined') &&
                ($scope.formValues.deliveryProducts[productIdx][rule.deliveryMapping + "Amount"] != "") &&
                ($scope.formValues.deliveryProducts[productIdx][rule.deliveryMapping + "Amount"] != null)){

                // quantity exists, set it
                $scope.formValues.deliveryProducts[productIdx].finalQuantityUom = $scope.formValues.deliveryProducts[productIdx][rule.deliveryMapping + "Uom"];
                $scope.formValues.deliveryProducts[productIdx].finalQuantityAmount = $scope.formValues.deliveryProducts[productIdx][rule.deliveryMapping + "Amount"];
                dataSet = true;
        
            }

            if(dataSet) return false; // break loop

        });

        if(!dataSet){
            $scope.formValues.deliveryProducts[productIdx].finalQuantityUom = null;
            $scope.formValues.deliveryProducts[productIdx].finalQuantityAmount = null;

        }
    }
    /*delivery quantity variance and status calculations*/
    vm.setBuyerSellerQuantityAndUom = function(qtyToChange) {
        if (qtyToChange == 'seller') {
            var rule = $scope.formValues.temp.sellerPrecedenceRule;
            var sellerQty = $scope.formValues.temp.sellerPrecedenceRule.name;
            if (sellerQty == "Surveyor") {
                $.each($scope.formValues.deliveryProducts, function(key, val) {
                    $scope.formValues.deliveryProducts[key].sellerQuantityUom = $scope.formValues.deliveryProducts[key].surveyorQuantityUom;
                    $scope.formValues.deliveryProducts[key].sellerQuantityAmount = $scope.formValues.deliveryProducts[key].surveyorQuantityAmount;
                })
            }
            if (sellerQty == "Bdn") {
                $.each($scope.formValues.deliveryProducts, function(key, val) {
                    $scope.formValues.deliveryProducts[key].sellerQuantityUom = $scope.formValues.deliveryProducts[key].bdnQuantityUom;
                    $scope.formValues.deliveryProducts[key].sellerQuantityAmount = $scope.formValues.deliveryProducts[key].bdnQuantityAmount;
                })
            }
            if (sellerQty == "Vessel") {
                $.each($scope.formValues.deliveryProducts, function(key, val) {
                    $scope.formValues.deliveryProducts[key].sellerQuantityUom = $scope.formValues.deliveryProducts[key].vesselQuantityUom;
                    $scope.formValues.deliveryProducts[key].sellerQuantityAmount = $scope.formValues.deliveryProducts[key].vesselQuantityAmount;
                })
            }
            if (sellerQty == "VesselFlowMeter") {
                $.each($scope.formValues.deliveryProducts, function(key, val) {
                    $scope.formValues.deliveryProducts[key].sellerQuantityUom = $scope.formValues.deliveryProducts[key].vesselFlowMeterQuantityUom;
                    $scope.formValues.deliveryProducts[key].sellerQuantityAmount = $scope.formValues.deliveryProducts[key].vesselFlowMeterQuantityAmount;
                })
            }
            if (sellerQty == "Confirm") {
                $.each($scope.formValues.deliveryProducts, function(key, val) {
                    $scope.formValues.deliveryProducts[key].sellerQuantityUom = $scope.formValues.deliveryProducts[key].confirmedQuantityUom;
                    $scope.formValues.deliveryProducts[key].sellerQuantityAmount = $scope.formValues.deliveryProducts[key].confirmedQuantityAmount;
                })
            }
        }
        if (qtyToChange == 'buyer') {
            var rule = $scope.formValues.temp.buyerPrecedenceRule;
            var buyerQty = $scope.formValues.temp.buyerPrecedenceRule.name;
            if (buyerQty == "Surveyor") {
                $.each($scope.formValues.deliveryProducts, function(key, val) {
                    $scope.formValues.deliveryProducts[key].buyerQuantityUom = $scope.formValues.deliveryProducts[key].surveyorQuantityUom;
                    $scope.formValues.deliveryProducts[key].buyerQuantityAmount = $scope.formValues.deliveryProducts[key].surveyorQuantityAmount;
                })
            }
            if (buyerQty == "Bdn") {
                $.each($scope.formValues.deliveryProducts, function(key, val) {
                    $scope.formValues.deliveryProducts[key].buyerQuantityUom = $scope.formValues.deliveryProducts[key].bdnQuantityUom;
                    $scope.formValues.deliveryProducts[key].buyerQuantityAmount = $scope.formValues.deliveryProducts[key].bdnQuantityAmount;
                })
            }
            if (buyerQty == "Vessel") {
                $.each($scope.formValues.deliveryProducts, function(key, val) {
                    $scope.formValues.deliveryProducts[key].buyerQuantityUom = $scope.formValues.deliveryProducts[key].vesselQuantityUom;
                    $scope.formValues.deliveryProducts[key].buyerQuantityAmount = $scope.formValues.deliveryProducts[key].vesselQuantityAmount;
                })
            }
            if (buyerQty == "VesselFlowMeter") {
                $.each($scope.formValues.deliveryProducts, function(key, val) {
                    $scope.formValues.deliveryProducts[key].buyerQuantityUom = $scope.formValues.deliveryProducts[key].vesselFlowMeterQuantityUom;
                    $scope.formValues.deliveryProducts[key].buyerQuantityAmount = $scope.formValues.deliveryProducts[key].vesselFlowMeterQuantityAmount;
                })
            }
            if (buyerQty == "Confirm") {
                $.each($scope.formValues.deliveryProducts, function(key, val) {
                    $scope.formValues.deliveryProducts[key].buyerQuantityUom = $scope.formValues.deliveryProducts[key].confirmedQuantityUom;
                    $scope.formValues.deliveryProducts[key].buyerQuantityAmount = $scope.formValues.deliveryProducts[key].confirmedQuantityAmount;
                })
            }
        }
        //function called for all quantities, call here calculate final quantity
        $scope.calculateFinalQuantity($scope.selectedProduct);
    }
    $scope.setVarianceQty = function(qtyToChange, rule) {
        //sets buyer/seller qty for all products
        if (qtyToChange == 'seller') {
            $.each($scope.formValues.deliveryProducts, function(key, val) {
                val.sellerQuantityType = rule;
                vm.setBuyerSellerQuantityAndUom('seller');
                $scope.calculateVarianceAndReconStatus(key);
            })
        }
        if (qtyToChange == 'buyer') {
            $.each($scope.formValues.deliveryProducts, function(key, val) {
                val.buyerQuantityType = rule;
                vm.setBuyerSellerQuantityAndUom('buyer');
                $scope.calculateVarianceAndReconStatus(key);
            })
        }
    }
    /*delivery  raise Claims and Note of Protest*/
    $scope.raiseNoteOfProtestProduct = function(productIndex) {
        var DeliveryProductId = $scope.formValues.deliveryProducts[productIndex].id;
        var DeliveryId = vm.entity_id;
        data = {
            "Payload": {
                "DeliveryId": DeliveryId,
                "DeliveryProductId": DeliveryProductId
            }
        };
        Factory_Master.raiseNoteOfProtestProduct(data, function(response) {
            if (response) {
                if (response.status == true) {
                    toastr.success(response.message);
                } else {
                    toastr.error(response.message);
                }
            }
        })
        console.log(data);
    }
    $scope.raiseNoteOfProtest = function($event, productIndex, type) {
        var DeliveryProductId = $scope.formValues.deliveryProducts[productIndex].id
        var DeliveryQualityParameterIds = [];
        if (type == 'quantity') {
            var ClaimTypeId = 1;
        }
        if (type == 'quality') {
            var ClaimTypeId = $scope["product" + productIndex + "claimId"];
            $.each($scope.formValues.deliveryProducts[productIndex].qualityParameters, function(key, val) {
                DeliveryQualityParameterIds.push(val.specParameter.id);
            })
        }
        var data = {
            "LabTestResultIds": [],
            "DeliveryQualityParameterIds": $scope["product" + productIndex + "specParamIds"],
            "DeliveryProductId": DeliveryProductId,
            "ClaimTypeId": ClaimTypeId
        }
        $scope.raiseClaim(data);
    }
    $scope.raiseClaim = function(data) {
    	console.log($scope.CM.availableClaimTypes);
    	specParamsIds = []
    	$.each($scope.CM.availableClaimTypes, function(typeK, typeV){
    		$.each(typeV.specParams, function(specK,specV) {
				if (specV.isSelected) {
			    	specParamsIds.push(specV.id);
			    	claimId = typeV.id;
				}
    		})
    	}) 
    	$.each($scope.CM.availableClaimTypes, function(k,v){
    		if (v.isTypeSelected) {
    			claimId = v.id;		
    		}
    	})
    	if(!claimId) {
    		toastr.error("Please select at least one spec parameter");
    		return;
    	} 	
        if (!data) {
            data = {
                "LabTestResultIds": specParamsIds,
                "DeliveryQualityParameterIds": [],
                "DeliveryProductId": null,
                "ClaimTypeId": claimId
            }
        }

        screenLoader.showLoader();
        Factory_Master.raise_claim(data, function(response) {
            
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    // toastr.success(response.message);
                    $rootScope.transportData = response.data;
                    console.log('-----', response.data);
                    $location.path('claims/claim/edit/');
                    screenLoader.hideLoader();
                } else {
                    $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        })
    }
    $scope.verifyDeliveryFromList = function() {
        var CLC = $('#flat_deliveries_to_be_verified');
        // multiple select verify
        var selectedRowsIds = $('#flat_deliveries_to_be_verified').jqGrid('getGridParam', 'selarrrow');
        // console.log(selectedRowsIds);
        if (selectedRowsIds.length == 0) {
            toastr.error("Please select at least one delivery");
        } else {
            var selectedRowsData = [];
            $.each(selectedRowsIds, function(key, val) {
                rowData = CLC.jqGrid.Ascensys.gridObject.rows[val - 1];
                deliveryID = rowData.delivery.id;
                selectedRowsData.push({
                    DeliveryId: deliveryID
                });
            });
            Factory_Master.bulk_verify_delivery(vm.app_id, 'delivery', selectedRowsData, function(callback) {
                if (callback.status == true) {
                    toastr.success(callback.message);
                    CLC.trigger('reloadGrid');
                } else {
                    toastr.error(callback.message);
                }
            });
        }
    }

    $scope.save_changes_for_verify = function(){
        // this function has the same logic as save_master_changes
        // in order to get formData to send to verify action
        // returns formatted payload
        vm.editInstance = $scope.getEditInstance();

		hasFinalQuantityError = false;
        $.each($scope.formValues.deliveryProducts, function(k,product){
        	if (!product.finalQuantityAmount) {
        		hasFinalQuantityError = true;
        		toastr.error("Please make sure that Quantity to be invoiced for "+product.product.name+" is computed based on seller/buyer quantity");
        	} else {

        	}
        })
        if (hasFinalQuantityError) {
        	return;
        }

        if(vm.editInstance){
           $("form").addClass("submitted");
      
            if (vm.editInstance.$valid) {
                $scope.filterFromData = {};
                $scope.submitedAction = true;
                $.each($scope.formValues, function(key, val) {
                    if (!angular.equals(val, [{}])) {
                        $scope.filterFromData[key] = val;
                    }
                    if (val && val.id && angular.equals(val.id, -1)) {
                        $scope.filterFromData[key] = null;
                    }
                })

                fields = angular.toJson($scope.filterFromData);
                return fields;

            }else{
                $scope.submitedAction = false;

                var message = "Please fill in required fields:";
                var names = [];
                $.each(vm.editInstance.$error.required, function(key, val) {
                    if (names.indexOf(val.$name) == -1) {
                        message += '<br>' + val.$name;
                    }
                    names += val.$name;
                })
                i = 0;
                $.each(vm.editInstance.$error.pattern, function(key, val) {
                    i++;
                    if (i === 1) {
                        message += "<br>Please check format:";
                    }
                    message += '<br>' + val.$name;
                })
                toastr.error(message);
                setTimeout(function() {
                    $scope.submitedAction = false;
                }, 100)

                return false;
            }
        }else{
            return false;
        }
    }

    $scope.verifyDelivery = function() {
        var deliveryDto =  $scope.save_changes_for_verify();
        if(deliveryDto){
            Factory_Master.verify_delivery(vm.app_id, vm.screen_id, vm.entity_id, deliveryDto, function(callback) {
                if (callback.status == true) {
                    $scope.loaded = true;
                    toastr.success(callback.message);
                    setTimeout(function() {
                        $state.reload();
                    }, 300);
                } else {
                    toastr.error(callback.message);
                }
            });
        }
    }


    $scope.revertVerify = function() {
        var data = {
            "DeliveryId": vm.entity_id,
        }
        Factory_Master.revert_verify(data, function(response) {
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    toastr.success(response.message);
                    setTimeout(function() {
                        $state.reload();
                    }, 300);
                } else {
                    // toastr.error("An error has occured");
                    toastr.error(response.message);
                }
            } else {
                toastr.error("An error has occured");
            }
        })
    }
    $scope.viewLabs = function() {
        var data = {
            "DeliveryId": vm.entity_id,
        }
        $rootScope.deliveryIDlabs = vm.entity_id;
        $location.path('labs/labresult');
    }
    $scope.sendLabsTemplateEmail = function(prodId) {
        var data = {
            "deliveryId": parseInt(vm.entity_id),
            "deliveryProductId": prodId
        }
        Factory_Master.send_labs_template_email(data, function(response) {
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    toastr.success(response.message);
                    // localStorage.setItem('claimsclaims_newEntity', angular.toJson(response.data));
                    // window.open($location.$$absUrl.replace($location.$$path, '/claims/claim/edit/0'), '_blank');
                } else {
                    // $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        })
        // $rootScope.deliveryIDlabs = vm.entity_id;
        // $location.path('labs/labresult');
    }
    $scope.raiseNewClaim = function(raiseClaim) {
        if (raiseClaim != 'true') {
            $scope.deliveryProductChanged($scope.formValues.deliveryProducts[$scope.CM.selectedProduct]);
            if ($rootScope.deliveryProductChanged) {
                toastr.error("Please save the delivery first!")
                return;
            }
            if (typeof($rootScope.raiseClaimInfo.allSpecParams) == 'undefined' || $rootScope.raiseClaimInfo.allSpecParams == null) {
                toastr.error("Claim can not be raised for this product!");
                return;
            }
            console.log('$rootScope.raiseClaimInfo', $rootScope.raiseClaimInfo);
            $scope.triggerModal('raiseClaimType');
            $scope.CM.availableClaimTypes = [];
            var claimType = {
                displayName: '',
                claim: {},
                specParams: [],
            }
            console.log('$scope.CM.listsCache.ClaimType', $scope.CM.listsCache.ClaimType);
            $.each($scope.CM.listsCache.ClaimType, function(ind, val) {
                //only allow these 3 types of claim
                if (val.id == 1 || val.id == 3 || val.id == 6 || val.id == 2) {} else {
                    return;
                }
                params = [];
                $.each($rootScope.raiseClaimInfo.allSpecParams, function(paramKey, paramVal) {
                    $.each(paramVal.claimTypes, function (key,element) {
                        if (element.id == val.id) {
                            paramVal.disabled = 'false';
                            params.push(paramVal);
                        }
                    });
                });
                claimType = {
                    claim: val,
                    specParams: params
                };
                claimType.disabled = true;
                if (params.length > 0) claimType.disabled = false;
                if ($scope.formValues.feedback)
                    if ($scope.formValues.feedback.hasLetterOfProtest.id == 1) claimType.disabled = false;
                if (val.name == 'Quantity') {
                    var claim1 = {};
                    claim1.claim = val;
                    claim1.specParams = params;
                    claim1.disabled = claimType.disabled;
                    claim1.displayName = 'Overstated Density';
                    claim1.id = 1;
                    $scope.CM.availableClaimTypes.push(angular.copy(claim1));
                    var claim2 = {};
                    claim2.claim = val;
                    claim2.specParams = [];
                    claim2.disabled = false;
                    if ((typeof($scope.formValues.temp.variances) != 'undefined')) {
                        if ((typeof($scope.formValues.temp.variances['product_' + $scope.CM.selectedProduct]) == 'undefined') || ($scope.formValues.temp.variances['product_' + $scope.CM.selectedProduct] == null)) {
                            claim2.disabled = true;
                        }
                    } else {
                        claim2.disabled = true;
                    }
                    claim2.displayName = 'Quantity Variance';
                    claim2.id = 1;
                    $scope.CM.availableClaimTypes.push(angular.copy(claim2));
                }
                if (val.name == 'Compliance') {
                    claimType.displayName = 'Sulphur Variance';
                    claimType.id = 3;
                    $scope.CM.availableClaimTypes.push(angular.copy(claimType));
                }
                if (val.name == 'Quality') {
                    claimType.displayName = 'Quality';
                    claimType.id = 2;
                    $scope.CM.availableClaimTypes.push(angular.copy(claimType));
                }
                if (val.name == 'Others') {
                    claimType.displayName = 'Letter of Protest Claim';
                    claimType.id = 4;
                    $scope.CM.availableClaimTypes.push(angular.copy(claimType));
                }
            });
            $rootScope.raiseClaimInfo.currentSpecParamIds = [];
            console.log('$scope.CM.availableClaimTypes', $scope.CM.availableClaimTypes);
        }
        if (raiseClaim == 'true') {
            if ($rootScope.raiseClaimInfo) {
                DeliveryProductId = $rootScope.raiseClaimInfo.productId + "";
            	console.log($scope.CM.availableClaimTypes);
		    	specParamsIds = []
		    	$.each($scope.CM.availableClaimTypes, function(typeK, typeV){
		    		$.each(typeV.specParams, function(specK,specV) {
						if (specV.isSelected) {
					    	specParamsIds.push(specV.id);
					    	claimTypeId = typeV.id;
						}
		    		})
		    	}) 
		    	$.each($scope.CM.availableClaimTypes, function(k,v){
		    		if (v.isTypeSelected) {
		    			claimTypeId = v.id;		
		    		}
		    	})
		    	if(!claimTypeId) {
		    		toastr.error("Please select at least one spec parameter");
		    		return;
		    	} 

                var data = {
                    "LabTestResultIds": [],
                    "DeliveryQualityParameterIds": specParamsIds,
                    "DeliveryProductId": DeliveryProductId,
                    "ClaimTypeId": claimTypeId
                }
                console.log(data);
                $scope.raiseClaim(data);
            }
        }
    }


    $scope.selectParamToRaiseClaim = function(claimTypeKey, paramKey) {
    	$.each($scope.CM.availableClaimTypes, function(typeK, typeV){
    		$.each(typeV.specParams, function(specK,specV) {
    			if (typeK != claimTypeKey) {
    				specV.isDisabled = true;
    			}
    		})
    	})
    	selectedSpecsInCurrentClaim = 0;
    	$.each($scope.CM.availableClaimTypes[claimTypeKey].specParams, function(specK, specV){
			if (specV.isSelected) {
		    	selectedSpecsInCurrentClaim += 1;
			}
    	})
    	if (selectedSpecsInCurrentClaim == 0) {
	    	$.each($scope.CM.availableClaimTypes, function(typeK, typeV){
	    		$.each(typeV.specParams, function(specK,specV) {
	    			if (typeK != claimTypeKey) {
	    				specV.isDisabled = false;
	    			}
	    		})
	    	})
    	}
    	if (selectedSpecsInCurrentClaim == $scope.CM.availableClaimTypes[claimTypeKey].specParams.length) {
    		$scope.CM.availableClaimTypes[claimTypeKey].isTypeSelected = true;
    	} else {
    		$scope.CM.availableClaimTypes[claimTypeKey].isTypeSelected = false;
    	}
    }

	$scope.selectAllParamsToRaiseClaim = function(claimTypeKey, checked) {
		console.log(claimTypeKey);
		if (checked) {
	    	$.each($scope.CM.availableClaimTypes, function(typeK, typeV){
	    		if (typeK != claimTypeKey) {
	    			typeV.isTypeSelected = false
	    		}
	    		$.each(typeV.specParams, function(specK,specV) {
					specV.isSelected = false;
					specV.isDisabled = true;
	    			if (typeK == claimTypeKey) {
						specV.isDisabled = false;
	    				specV.isSelected = true;
	    			}
	    		})
	    	})
		} else {
	    	$.each($scope.CM.availableClaimTypes, function(typeK, typeV){
	    		$.each(typeV.specParams, function(specK,specV) {
					specV.isDisabled = false;
					specV.isSelected = false;
	    		})
	    	})
		}
    	$scope.$apply();
	}    

    $scope.addSpecParamsToClaim = function(event) {
        //check if valid
        selectedDisabled = event.currentTarget.attributes['ng-disabled'].value;
        selectedParamId = parseInt(event.currentTarget.attributes['spec-param-id'].value); //specParam.id
        selectedParamClaimType = parseInt(event.currentTarget.attributes['claim-type'].value); //claim.claim.id (actual id to send)
        selectedParamRadioId = event.currentTarget.attributes['radio-id'].value; //claim.id (given id for validation)
        selectedClaimId = selectedParamRadioId.split('_')[3];
        // console.log(selectedClaimId);
        //cancel selection if disabled
        if (selectedDisabled == 'true') {
            event.currentTarget.checked = false;
            return;
        }
        //mark parameters disabled
        if (typeof($rootScope.raiseClaimInfo.currentClaimTypeId) == 'undefined') {
            $rootScope.raiseClaimInfo.currentClaimTypeId = selectedParamClaimType;
            $rootScope.raiseClaimInfo.currentClaimId = selectedClaimId;
            $(selectedParamRadioId)[0].checked = true;
            $.each($scope.CM.availableClaimTypes, function(_, claimVal) {
                if (claimVal.id != selectedClaimId) {
                    $.each(claimVal.specParams, function(_, paramVal) {
                        paramVal.disabled = 'true';
                    });
                }
            });
            $rootScope.raiseClaimInfo.currentSpecParamIds.push(selectedParamId);
        } else {
            if (($rootScope.raiseClaimInfo.currentClaimId == selectedClaimId) || ($rootScope.raiseClaimInfo.currentSpecParamIds.length == 0)) {
                //add / erase from array if it fits
                i = $.inArray(selectedParamId, $rootScope.raiseClaimInfo.currentSpecParamIds);
                if (i >= 0) {
                    $rootScope.raiseClaimInfo.currentSpecParamIds.splice(i, 1);
                    //remove restrictions if unchecked all params
                    if ($rootScope.raiseClaimInfo.currentSpecParamIds.length == 0) {
                        $.each($scope.CM.availableClaimTypes, function(_, claimVal) {
                            $.each(claimVal.specParams, function(_, paramVal) {
                                paramVal.disabled = 'false';
                            });
                        });
                        $(selectedParamRadioId)[0].checked = false;
                        delete $rootScope.raiseClaimInfo.currentClaimTypeId;
                    }
                } else {
                    $rootScope.raiseClaimInfo.currentSpecParamIds.push(selectedParamId);
                    $rootScope.raiseClaimInfo.currentClaimTypeId = selectedParamClaimType;
                }
            }
        }
    }
    $scope.selectClaimInfoId = function(claimTypeId, claimId) {
        //claimId = just for disabling checkboxes
        $rootScope.raiseClaimInfo.currentClaimTypeId = claimTypeId;
        $rootScope.raiseClaimInfo.currentClaimId = claimId;
        paramsSet = false;
        $rootScope.raiseClaimInfo.currentSpecParamIds = [];
        $.each($scope.CM.availableClaimTypes, function(_, claimVal) {
            if (claimVal.id != $rootScope.raiseClaimInfo.currentClaimId) {
                //uncheck checkboxes that do not fit & disable them
                $.each(claimVal.specParams, function(_, paramVal) {
                    id = "#claim_info_checkbox_" + paramVal.specParameter.id;
                    $(id)[0].checked = false;
                    paramVal.disabled = 'true';
                });
            } else {
                //check current claim boxes & make available
                $.each(claimVal.specParams, function(_, paramVal) {
                    paramVal.disabled = 'false';
                    id = "#claim_info_checkbox_" + paramVal.specParameter.id;
                    $(id)[0].checked = true;
                    $rootScope.raiseClaimInfo.currentSpecParamIds.push(paramVal.id);
                    paramsSet = true;
                });
            }
        });
    }
    $scope.deliveryProductChanged = function(prod) {
        // debugger;
        if(typeof prod == 'object'){
            if (prod.product != $scope.formValues.temp.savedProdForCheck) {
                $rootScope.deliveryProductChanged = true;
                console.log($rootScope.deliveryProductChanged);
                return true;
            }
        }

        $rootScope.deliveryProductChanged = false;
        console.log($rootScope.deliveryProductChanged);
        return false;
    }
    /*DeliveryList*/
    $scope.createDeliveryFromDeliveryList = function() {
     
        if (typeof($rootScope.selectDeliveryRow) !== 'undefined' && $rootScope.selectDeliveryRow != null) {
            if ($rootScope.selectDeliveryRow.delivery != null) {
                toastr.error("This item already has a delivery!")
                return;
            } else {
                localStorage.setItem('deliveryFromOrder', angular.toJson($rootScope.selectDeliveryRow));
            }
        }
        // var selectedRowsIds = $('#flat_orders_delivery_list').jqGrid('getGridParam', 'selarrrow');
        // if (typeof(selectedRowsIds) !== 'undefined' && selectedRowsIds != null && selectedRowsIds.length > 0) {
        //     $.each(selectedRowsIds, function(key, val) {
        //         rowData = $('#flat_orders_delivery_list').jqGrid.Ascensys.gridObject.rows[val - 1];
        //         if ($rootScope.selectDeliveryRows != null) {
        //             $rootScope.selectDeliveryRows.push(rowData);
        //         } else {
        //             $rootScope.selectDeliveryRows = [];
        //             $rootScope.selectDeliveryRows.push(rowData);
        //         }
        //     })
        //     console.log($rootScope.selectDeliveryRows);
        // }
        console.log($rootScope.selectDeliveryRows);
        if ($rootScope.selectDeliveryRows) {
            if ($rootScope.selectDeliveryRows.length == 1) {
                localStorage.setItem('deliveryFromOrder', angular.toJson($rootScope.selectDeliveryRows[0]));
            } else {
                localStorage.setItem('deliveriesFromOrder', angular.toJson($rootScope.selectDeliveryRows));
            }
        }
        $location.path(vm.app_id + '/' + 'delivery' + '/edit/');
    }
    $scope.watchSelectDeliveryRow = function() {
        setTimeout(function() {
            if (!localStorage.getItem('deliveryFromOrder')) {
                return
            }
            data = JSON.parse(localStorage.getItem('deliveryFromOrder'));
            localStorage.removeItem('deliveryFromOrder');
            $rootScope.selectDeliveryRow = null;
            $scope.formValues.order = data.order;
            $scope.formValues.surveyor = data.surveyor;
            if (typeof($scope.formValues.deliveryProducts) == 'undefined') {
                $scope.formValues.deliveryProducts = []
            }
            $scope.formValues.deliveryProducts.push({
                'orderedProduct': data.product,
                'product': data.product,
                'confirmedQuantityAmount': data.confirmedQuantityAmount,
                'confirmedQuantityUom': data.confirmedQuantityUom,
                'productTypeId': data.productType.id,
                'orderProductId': data.orderProductId
            });
            //add quality and quantity params for product
            orderProductId = data.orderProductId;
            orderProductSpecGroupId = data.specGroup.id;
            dataForInfo = {
                "Payload": {
                    "Filters": [{
                        "ColumnName": "OrderProductId",
                        "Value": orderProductId
                    }, {
                        "ColumnName": "SpecGroupId",
                        "Value": orderProductSpecGroupId
                    }]
                }
            }
            var qualityParams = {};
            var quantityParams = {};
            Factory_Master.getSpecParamsDeliveryProduct(dataForInfo, function(response) {
                console.log(response);
                $scope.formValues.deliveryProducts[0].qualityParameters = response;
            })
            Factory_Master.getQtyParamsDeliveryProsuct(dataForInfo, function(response) {
                quantityParams = response;
                $scope.formValues.deliveryProducts[0].quantityParameters = response;
            })
            console.log($scope.formValues.deliveryProducts);
            Factory_Master.get_master_entity($scope.formValues.order.id, 'orders', 'orders', function(response) {
                $scope.formValues.sellerName = response.seller.name;
                $scope.formValues.port = response.location.name;
                $scope.formValues.OrderBuyer = response.buyer.name;
                $scope.formValues.temp.orderedProducts = response.products;
                // $scope.formValues.deliveryProducts = [];
                if (response.surveyorCounterparty) {
                    $scope.formValues.surveyorName = response.surveyorCounterparty.name;
                }
            });
            $scope.getDeliveryOrderSummary($scope.formValues.order.id);
        })
        setTimeout(function() {
            if (!localStorage.getItem('deliveriesFromOrder')) {
                return
            }
            data = JSON.parse(localStorage.getItem('deliveriesFromOrder'));
            localStorage.removeItem('deliveriesFromOrder');
            $rootScope.selectDeliveryRows = [];
            $scope.formValues.order = data[0].order;
            $scope.formValues.surveyor = data[0].surveyor;
            if (typeof($scope.formValues.deliveryProducts) == 'undefined') {
                $scope.formValues.deliveryProducts = []
            }
            $.each(data, function(key, delivery) {
                $scope.formValues.deliveryProducts.push({
                    'orderedProduct': delivery.product,
                    'product': delivery.product,
                    'confirmedQuantityAmount': delivery.confirmedQuantityAmount,
                    'confirmedQuantityUom': delivery.confirmedQuantityUom,
                    'orderProductId': delivery.orderProductId
                });
                orderProductId = delivery.orderProductId;
                orderProductSpecGroupId = delivery.specGroup.id;
                dataForInfo = {
                    "Payload": {
                        "Filters": [{
                            "ColumnName": "OrderProductId",
                            "Value": orderProductId
                        }, {
                            "ColumnName": "SpecGroupId",
                            "Value": orderProductSpecGroupId
                        }]
                    }
                }
 
                Factory_Master.getSpecParamsDeliveryProduct(dataForInfo, function(response) {
                    $scope.formValues.deliveryProducts[key].qualityParameters = angular.copy(response);
                })
                Factory_Master.getQtyParamsDeliveryProsuct(dataForInfo, function(response) {
                    $scope.formValues.deliveryProducts[key].quantityParameters = angular.copy(response);
                })
            });

            Factory_Master.get_master_entity($scope.formValues.order.id, 'orders', 'orders', function(response) {
                $scope.formValues.sellerName = response.seller.name;
                $scope.formValues.port = response.location.name;
                $scope.formValues.OrderBuyer = response.buyer.name;
                $scope.formValues.temp.orderedProducts = response.products;
                // $scope.formValues.deliveryProducts = [];
                if (response.surveyorCounterparty) {
                    $scope.formValues.surveyorName = response.surveyorCounterparty.name;
                }
            });
            $scope.getDeliveryOrderSummary($scope.formValues.order.id);
        });
    }
    /*DeliveryList*/
    $scope.getRelatedDeliveries = function(orderId, deliveryType) {
        if (deliveryType == 'new_delivery') {
            $scope.relatedDeliveries = [];
            $scope.relatedDeliveries.push({
                deliveryId: 0,
                orderId: 0,
                deliveryNumber: 0,
                deliveryStatus: 'Open',
                products: []
            });
        } else {
            //if new created delivery, add to deliveries list
            if (typeof($scope.relatedDeliveries) != 'undefined') {
                if ($scope.relatedDeliveries[0].deliveryId == 0) {
                    var newDelivery = {
                        deliveryId: 0,
                        orderId: orderId,
                        deliveryStatus: 'Open',
                        deliveryNumber: 0,
                        products: []
                    }
                    $scope.relatedDeliveries = [];
                    $scope.relatedDeliveries.push(newDelivery);
                    $scope.selectedDelivery = 0;
                }
            } else {
                $scope.relatedDeliveries = [];
            }
            //get deliveries
            data = {
                "Payload": orderId
            };
            var duplicate = false;
            Factory_Master.getRelatedDeliveries(data, function(response) {
                if (response) {
                    if (response.status == true) {
                        $.each(response.data, function(key, val) {
                            $.each($scope.relatedDeliveries, function(key2, val2) {
                                if (val2.deliveryId == val.deliveryId) duplicate = true;
                            })
                            if (!duplicate) {
                                $scope.relatedDeliveries.push(val);
                            }
                        })
                    } else {
                        toastr.error("An error has occured!")
                    }
                }
            })
        }
    }
    $scope.getDeliveryConfigurations = function() {
        data = {
            "Payload": "true"
        };
        Factory_Master.getDeliveryConfigurations(data, function(response) {
            if (response) {
                if (response.status == true) {
                    // if(typeof($scope.formValues.delivery == 'undefined')){
                    //     $scope.formValues.delivery = {};
                    //     $scope.formValues.delivery = response.data;
                    // }
                    if (typeof($scope.formValues.temp) == 'undefined') {
                        $scope.formValues.temp = {};
                    }
                    //set buyer & seller qty and uom in temp if no products yet
                    $scope.formValues.temp.buyerPrecedenceRule = {};
                    $scope.formValues.temp.sellerPrecedenceRule = {};
                    $scope.formValues.temp.finalQtyPrecedenceLogicRules = [];
                    $scope.formValues.temp.buyerPrecedenceRule = response.data.buyerPrecedenceLogicRules[0].precedenceRule;
                    $scope.formValues.temp.sellerPrecedenceRule = response.data.sellerPrecedenceLogicRules[0].precedenceRule;
              

                    // final quantity defaultation rules
                    // form local finalQuantityRules, include delivery mapping
                    $scope.formValues.temp.finalQtyPrecedenceLogicRules = response.data.finalQtyPrecedenceLogicRules;
                    $scope.finalQuantityRules = [];
                    $.each( $scope.formValues.temp.finalQtyPrecedenceLogicRules,function(_, rule){
                        var localRule = {
                            ord: rule.ord,
                            precedenceRule: rule.precedenceRule,
                            deliveryMapping: ""
                        }
                        // agreed
                        if(rule.precedenceRule.id == 1) localRule.deliveryMapping = "agreedQuantity";
                        // seller 
                        if(rule.precedenceRule.id == 2) localRule.deliveryMapping = "sellerQuantity";
                        // buyer
                        if(rule.precedenceRule.id == 3) localRule.deliveryMapping = "buyerQuantity";

                        $scope.finalQuantityRules.push(localRule);
                    });
                    $scope.finalQuantityRules = _.orderBy($scope.finalQuantityRules, ['ord'],['asc']); 


                    // buyer and seller is the same across products, se all of them to first product buyer & seller
                    $scope.setBuyerAndSellerAcrossProducts();
                    //when create delivery form order, buyer and seller are not set
                    //show & hide fields
                    $scope.formValues.temp.isShowQuantityReconciliationSection = response.data.isShowQuantityReconciliationSection;
                    $scope.formValues.temp.isShowDeliveryEmailToLabsButton = response.data.isShowDeliveryEmailToLabsButton;
                    $scope.formValues.temp.hiddenFields = {};
                    $.each(response.data.hiddenFields, function(key, val) {
                        if (val.id == 1) {
                            $scope.formValues.temp.hiddenFields.buyerQty = val.hidden;
                        }
                        if (val.id == 2) {
                            $scope.formValues.temp.hiddenFields.sellerQty = val.hidden;
                        }
                        if (val.id == 3) {
                            $scope.formValues.temp.hiddenFields.agreedQty = val.hidden;
                        }
                        if (val.id == 4) {
                            $scope.formValues.temp.hiddenFields.pricingDate = val.hidden;
                        }
                    });

                    $scope.toleranceLimits = {};
                    if(typeof response.data.minToleranceLimit == 'number') $scope.toleranceLimits.minToleranceLimit = response.data.minToleranceLimit;
                    if(typeof response.data.maxToleranceLimit == 'number') $scope.toleranceLimits.maxToleranceLimit = response.data.maxToleranceLimit;
                    console.log( $scope.toleranceLimits)

                } else {
                    toastr.error("An error has occured!");
                }
            }
        })
    }
    $scope.setBuyerAndSellerAcrossProducts = function() {
        $.each($scope.formValues.deliveryProducts, function(index, value) {
            if (value.buyerQuantityType) {
                $scope.formValues.temp.buyerPrecedenceRule = value.buyerQuantityType;
            }
            if (value.sellerQuantityType) {
                $scope.formValues.temp.sellerPrecedenceRule = value.sellerQuantityType;
            }
        });
        $.each($scope.formValues.deliveryProducts, function(index, value) {
            value.buyerQuantityType = $scope.formValues.temp.buyerPrecedenceRule;
            value.sellerQuantityType = $scope.formValues.temp.sellerPrecedenceRule;
        });
    }
    $scope.getDeliveryProductQuantityAmountFromSummary = function(toReturn, orderProductId) {
        retValue = null;
        if ($scope.formValues.temp) {
            if ($scope.formValues.temp.deliverysummary) {
                orderSummaryProducts = $scope.formValues.temp.deliverysummary.products;
                $.each(orderSummaryProducts, function(prodK, prodV) {
                    if (prodV.id == orderProductId) {
                        if (toReturn == 'qty') retValue = prodV.orderedQuantity.amount;
                        if (toReturn == 'uom') retValue = prodV.orderedQuantity.uom.name;
                    }
                })
            }
        }
        return retValue;
    }
    $scope.add_delivery_product = function(selectedProductToAddInDelivery) {
        console.log(selectedProductToAddInDelivery);
        if (!$scope.formValues.deliveryProducts) {
            $scope.formValues.deliveryProducts = [];
        }
        productAlreadyExist = false;
        $.each($scope.formValues.deliveryProducts, function(_, deliveryProduct) {
            if (deliveryProduct.orderProductId == selectedProductToAddInDelivery.id) {
                productAlreadyExist = true;
            }
        })
        if (productAlreadyExist) {
            return toastr.error("The selected product is already added to delivery");
        }

        newProductData = {}
        orderProductId = selectedProductToAddInDelivery.id;

        if(selectedProductToAddInDelivery.specGroup){
            orderProductSpecGroupId = selectedProductToAddInDelivery.specGroup.id;
            data = {
                "Payload": {
                    "Filters": [{
                        "ColumnName": "OrderProductId",
                        "Value": orderProductId
                    }, {
                        "ColumnName": "SpecGroupId",
                        "Value": orderProductSpecGroupId
                    }]
                }
            }
            Factory_Master.getSpecParamsDeliveryProduct(data, function(response) {
                newProductData.qualityParameters = response;
            })
            Factory_Master.getQtyParamsDeliveryProsuct(data, function(response) {
                newProductData.quantityParameters = response;
            })
            newProductData.confirmedQuantityAmount = selectedProductToAddInDelivery.orderedQuantity.amount;
            newProductData.confirmedQuantityUom = selectedProductToAddInDelivery.orderedQuantity.uom;
            //set default uoms
            newProductData.surveyorQuantityUom = selectedProductToAddInDelivery.orderedQuantity.uom;
            newProductData.vesselQuantityUom = selectedProductToAddInDelivery.orderedQuantity.uom;
            newProductData.agreedQuantityUom = selectedProductToAddInDelivery.orderedQuantity.uom;
            newProductData.bdnQuantityUom = selectedProductToAddInDelivery.orderedQuantity.uom;
            newProductData.vesselFlowMeterQuantityUom = selectedProductToAddInDelivery.orderedQuantity.uom;
            newProductData.finalQuantityUom = selectedProductToAddInDelivery.orderedQuantity.uom;
            newProductData.product = selectedProductToAddInDelivery.product;
            newProductData.orderedProduct = selectedProductToAddInDelivery.product;
            //add buyer and seller quantity types
            newProductData.sellerQuantityType = $scope.formValues.temp.sellerPrecedenceRule;
            newProductData.buyerQuantityType = $scope.formValues.temp.buyerPrecedenceRule;
            //add physical supplier -- orderProductId
            newProductData.physicalSupplier = selectedProductToAddInDelivery.physicalSupplier;
            newProductData.productTypeId = selectedProductToAddInDelivery.productType.id;
            //set orderproductid
            newProductData.orderProductId = selectedProductToAddInDelivery.id;
            newProductData.manualPricingDateOverride = selectedProductToAddInDelivery.manualPricingDateOverride;

            //add pricing date
            $.each($scope.formValues.temp.deliverysummary.products,function(_,summaryProd){
                if(summaryProd.id ==  selectedProductToAddInDelivery.orderProductId){
                    if(summaryProd.pricingDate != null){
                        newProductData.pricingDate = summaryProd.pricingDate;
                    }else{
                        newProductData.pricingDate = $scope.formValues.temp.deliverysummary.deliveryDate;
                    }
                }
            })

            $scope.formValues.deliveryProducts.push(newProductData);
            Factory_Master.get_conversion_info(selectedProductToAddInDelivery.product.id, function(response) {
                $scope.conversionInfoData = response.data;
            })
            productIndex = $scope.formValues.deliveryProducts.length - 1;
            $scope.calculateVarianceAndReconStatus(productIndex);
            $scope.orderProductsByProductType('deliveryProducts');
            $scope.orderProductsByProductType('summaryProducts');
        }else{
            toastr.error('Selected product does not have a Spec Group defined.');
        }
    }


    $scope.deleteDelivery = function(deliveryId) {
        if (deliveryId == 0) {
            if ($scope.relatedDeliveries.length == 1) {
                toastr.error('You can not delete the only delivery in list.');
                return;
            } else {
                //delete delivery from list
                $scope.relatedDeliveries.splice(0, 1);
                vm.selectedDelivery = $scope.relatedDeliveries[0].deliveryId;
                var path = "/delivery/delivery/edit/" + vm.selectedDelivery;
                $location.path(path);
                return;
            }
        }
        data = {
            "Payload": deliveryId
        };

        var redirect = 0;
        $.each($scope.relatedDeliveries, function(_,val){
            if(val.deliveryId != deliveryId){
                redirect = val.deliveryId;
                return;
            }
        })

        Factory_Master.deleteDelivery(data, function(response) {
            if (response) {
                if (response.status == true) {
                    toastr.success("Delivery deleted!");
                    console.log($scope.relatedDeliveries);
                    var path = "/delivery/delivery/edit/" + redirect;
                    $location.path(path);
                } else {
                    toastr.error(response.message);
                }
            }
        })
    }
    $scope.setSelectedDelivery = function(val) {
        if (val) {
            $scope.CM.selectedDelivery = val;
            $scope.relatedDeliveries.sort(function(a, b) {
                if (a.deliveryId == val) return -1;
                if (b.deliveryId == val) return 1;
                return 0;
            })
            return;
        }
        if (vm.entity_id) {
            var found = false;
            $.each($scope.relatedDeliveries, function(key, val) {
                if (val.deliveryId == vm.entity_id) {
                    $scope.CM.selectedDelivery = vm.entity_id;
                    found = true;
                }
            });
            if (found) {
                $scope.relatedDeliveries.sort(function(a, b) {
                    if (a.deliveryId == vm.selectedDelivery) return -1;
                    if (b.deliveryId == vm.selectedDelivery) return 1;
                    return 0;
                });
            }
            if (!found) {
                $scope.CM.selectedDelivery = $scope.relatedDeliveries[0].deliveryId;
                vm.entity_id = vm.selectedDelivery;
                var path = "/delivery/delivery/edit/" + vm.selectedDelivery;
                $location.path(path);
            }
        } else {
            //edit page
            $scope.CM.selectedDelivery = 0;
            $scope.formValues.id = 0
        }
    }
    $scope.deleteDeliveryProduct = function(productId, productIdx) {
        // if we have productId, the product is saved
        // else, productId = undefined and we delete by productIdx
        if (typeof(productId) == 'undefined') {
            // simply erase product from list
            var okay = false;
            $.each($scope.formValues.deliveryProducts, function(k, v) {
                if (typeof(v.id) == 'undefined') {
                    if(k == productIdx) okay = true;
                }
            })

            if(okay){
                //product is there and not saved
                $scope.formValues.deliveryProducts.splice(productIdx, 1);
                $scope.CM.selectedProduct = 0;
            }

        }else{
            //make call to delete product
            toastr.info('Deleting product...')
            data = {
                "Payload": productId
            };
	        Factory_Master.deleteDeliveryProduct(data, function(response) {
	            if (response) {
	                if (response.status == true) {
	                    toastr.success("Product deleted!");
	                    setTimeout(function() {
	                        $state.reload();
	                    }, 300);
	                } else {
	                    toastr.error(response.message);
	                }
	            }
	        })
        }
    }
    $scope.formQuantityHeaders = function(orderProdId, ccaiDelivered) {
        //returns index based on prodId
        $.each($scope.formValues.temp.deliverysummary.products, function(idx, summaryProd) {
            if (summaryProd.id == orderProdId) {
                if (!ccaiDelivered) {
                    summaryProd.ccaiDelivered = '';
                    summaryProd.ccaiVariance = '';
                } else {
                    summaryProd.ccaiDelivered = ccaiDelivered;
                    summaryProd.ccaiVariance = $scope.calculatCccaiVariance(summaryProd.ccai, summaryProd.ccaiDelivered);
                }
                $scope.CM.prodOrderInTemp = idx;
            }
        })
    }
    $scope.calculatCccaiVariance = function(offered, delivered) {
        if (offered && delivered) {
            return offered - delivered;
        }
        return;
    }
    $scope.initSplitModalContent = function() {
        $scope.formValues.splitDelivery = {};
        $scope.formValues.splitDelivery.deliveryId = $scope.formValues.id;
        $scope.formValues.splitDelivery.items = [];
        // var sel = $scope.formValues.deliveryProducts[vm.selectedProduct];
        delProd = {};

        $.each($scope.formValues.deliveryProducts, function(_, value) {
            delProd = {
                name: value.orderedProduct.name,
                deliveryProductId: value.id,
                initialConfirmedAmount: value.confirmedQuantityAmount,
                initialConfirmedUom: value.confirmedQuantityUom,
                remainingConfirmedAmount: null,
                remainingConfirmedUom: {},
                updateAgreedQuantityAmount: false,
                initialAgreedAmount: value.agreedQuantityAmount,
                remainingAgreedAmount: null,
                updateVesselQuantityAmount: false,
                initialVesselAmount: value.vesselQuantityAmount,
                remainingVesselAmount: null,
                updateVesselFlowQuantityAmount: false,
                initialVesselFlowAmount: value.vesselFlowMeterQuantityAmount,
                remainingVesselFlowAmount: null,
                updateSurveyorQuantityAmount: false,
                initialSurveyorAmount: value.surveyorQuantityAmount,
                remainingSurveyorAmount: null,
                updateBDNQuantityAmount: false,
                initialBDNAmount: value.bdnQuantityAmount,
                remainingBDNAmount: null,
                productId: value.product.id,
                orderProductId: value.orderProductId
            };
            // updateBargeFlowMeterQuantityAmount: false,
            // initialBargeFlowMeterAmount: value.bargeFlowMeterQuantityAmount,
            // remainingBargeFlowMeterAmount: null,
            $scope.formValues.splitDelivery.items.push(delProd);
        });

        var splitLimits = [];
        $.each($scope.formValues.deliveryProducts, function(key,value){
            var pair = {
                'OrderId': $scope.formValues.order.id,
                'OrderProductId': value.orderProductId, // sending orderProductId in field ProductId, returns in ProductId but its actually orderProductId
                'DeliveryId': $scope.formValues.id
            }
            splitLimits.push(pair);
        });
        $scope.splitDeliveryInLimit = [];
        Factory_Master.getSplitDeliveryLimits({
            "Payload": splitLimits
        }, function(response){
            $.each($scope.formValues.splitDelivery.items, function(key,splitProd){
                $.each(response, function(_, respProd){
                    if(respProd.orderProductId == splitProd.orderProductId){
                        splitProd.orderLimit = respProd.orderLimit;
                        splitProd.remainingConfirmedAmount = respProd.remainingConfirmedAmount;
                        $scope.splitDeliveryInLimit[key] = true;
                    }
                })
            })
        })

    }

    $scope.disabledSplitDelivery = function(splitDeliveryInLimit){
        console.log(splitDeliveryInLimit);
        if(splitDeliveryInLimit.indexOf(false) < 0) return false;
        return true;

    }
    $scope.initSplitDelivery = function() {
        if (!localStorage.getItem('parentSplitDelivery')) {
            return;
        } else {
            data = JSON.parse(localStorage.getItem('parentSplitDelivery'));
            localStorage.removeItem('parentSplitDelivery');

            $rootScope.selectDeliveryRow = null;
            $scope.formValues.order = data.order;

            if (typeof($scope.formValues.deliveryProducts) == 'undefined') {
                $scope.formValues.deliveryProducts = []
            }
            $.each(data.deliveryProducts, function(key, val) {
                $scope.formValues.deliveryProducts.push({
                    product: val.product,
                    id: val.id,
                    orderedProduct: val.orderedProduct,
                    orderProductId: val.orderProductId
                })
            });
            //get related deliveries
            if (typeof($scope.relatedDeliveries) == 'undefined') {
                $scope.relatedDeliveries = []
            }
            $scope.relatedDeliveries.push({
                deliveryId: 0,
                orderId: 0,
                deliveryNumber: 0,
                deliveryStatus: 'Open',
                products: []
            });
            $scope.formValues.splittedDeliveryId = data.splitDelivery.splittedDeliveryId;
            //set confirmed amount
            $.each($scope.formValues.deliveryProducts, function(_, deliveryProd) {
                $.each(data.splitDelivery.items, function(_, splitProd) {
                    if (splitProd.orderProductId == deliveryProd.orderProductId) {
                        deliveryProd.confirmedQuantityAmount = splitProd.remainingConfirmedAmount;
                        deliveryProd.confirmedQuantityUom = splitProd.remainingConfirmedUom;
                    }
                })
            })
            //set quality & qty params
            $.each(data.temp.deliverysummary.products, function(_, summaryProd) {
                $.each($scope.formValues.deliveryProducts, function(_, deliveryProd) {
                    if (summaryProd.id == deliveryProd.orderProductId) {
                        
                        deliveryProd.orderProductId = summaryProd.id;
                        deliveryProd.productType = angular.copy(summaryProd.productType);
                        deliveryProd.productTypeId = summaryProd.productType.id;
                        
                        orderProductId = summaryProd.id;
                        orderProductSpecGroupId = summaryProd.specGroup.id;

                        dataForInfo = {
                            "Payload": {
                                "Filters": [{
                                    "ColumnName": "OrderProductId",
                                    "Value": orderProductId
                                }, {
                                    "ColumnName": "SpecGroupId",
                                    "Value": orderProductSpecGroupId
                                }]
                            }
                        }

                        Factory_Master.getSpecParamsDeliveryProduct(dataForInfo, function(response) {
                            deliveryProd.qualityParameters = angular.copy(response);
                        })
                        Factory_Master.getQtyParamsDeliveryProsuct(dataForInfo, function(response) {
                            deliveryProd.quantityParameters = angular.copy(response);
                        })
                    }
                    //end
                });
            });
        }
    }
    $scope.splitDelivery = function(doSplit) {
        if (doSplit) {
        
            // remove products with 0 qty
            var newProductsList = [];
            $.each($scope.formValues.splitDelivery.items, function(_,split_val){
                $.each($scope.formValues.deliveryProducts, function(_, prod_val){
                        if(split_val.deliveryProductId == prod_val.id){
                            if(split_val.remainingConfirmedAmount != 0){
                                newProductsList.push(prod_val);
                            }
                        }
                }) 
            });

            $scope.formValues.deliveryProducts = angular.copy(newProductsList);

            $scope.formValues.splitDelivery.splittedDeliveryId = $scope.formValues.id;
            dataToAdd = angular.copy($scope.formValues);
            localStorage.setItem('parentSplitDelivery', angular.toJson(dataToAdd));
            $location.path('delivery/delivery/edit/');
        } else {
            $scope.triggerModal('splitDeliveryModal');
        }
    }
    $scope.getTimeBetweenDates = function(start, end) {
        if (!start) return;
        if (!end) return;
        startDate = new Date(start);
        endDate = new Date(end);
        timeBetween = endDate - startDate;
        minutes = (0.001 * timeBetween) / 60;
        mins = minutes % 60;
        hours = (minutes - mins) / 60;
        hours = hours < 10 ? '0' + hours : hours;
        mins = mins < 10 ? '0' + mins : mins;
        result = hours + ":" + mins;
        return result;
    }
    $scope.setLimitForPickers = function() {
        // Berthing Time< Barge alongside < Pumping Start <Pumping End < BDN Date

        var pickers = ['berthingTimeDP', 'bargeAlongsideDP','pumpingStartDP', 'pumpingEndDP', 'bdnDate'];

        var formValuesMap = {
            'berthingTimeDP': 'berthingTime',
            'bargeAlongsideDP': 'bargeAlongside',
            'pumpingStartDP': 'bargePumpingRateStartTime',
            'pumpingEndDP': 'bargePumpingRateEndTime',
            'bdnDate': 'bdnDate'
        }
        if($scope.formValues != 'undefined'){
            $.each(pickers, function(key,val){
                //if(val == 'berthingTimeDP'){
                //    if($scope.formValues.bargeAlongside != null){
                //        $('#berthingTimeDP').datetimepicker('setEndDate', $scope.formValues.bargeAlongside);
                //    }
                //}
               //if(val == 'bargeAlongsideDP'){
               //     //start
               //     if($scope.formValues.berthingTime != null){
               //         $('#bargeAlongsideDP').datetimepicker('setStartDate', $scope.formValues.berthingTime);
               //     }

               //     //end
               //     if($scope.formValues.bargePumpingRateStartTime != null){
               //         $('#bargeAlongsideDP').datetimepicker('setEndDate', $scope.formValues.bargePumpingRateStartTime);
               //     }else{
               //         if($scope.formValues.bargePumpingRateEndTime != null){
               //             $('#bargeAlongsideDP').datetimepicker('setEndDate', $scope.formValues.bargePumpingRateEndTime);
               //         }else{
               //             if($scope.formValues.bdnDate != null){
               //                 $('#bargeAlongsideDP').datetimepicker('setEndDate', $scope.formValues.bdnDate);
               //             }
               //         }
               //     }
               // }
                // if(val == 'pumpingStartDP'){
                //     //start
                //     if($scope.formValues.bargeAlongside != null){
                //         $('#pumpingStartDP').datetimepicker('setStartDate', $scope.formValues.bargeAlongside);
                //     }else{
                //         if($scope.formValues.berthingTime != null){
                //             $('#pumpingStartDP').datetimepicker('setStartDate', $scope.formValues.berthingTime);
                //         }
                //     }
                //
                //     //end
                //     if($scope.formValues.bargePumpingRateEndTime != null){
                //         $('#pumpingStartDP').datetimepicker('setEndDate', $scope.formValues.bargePumpingRateEndTime);
                //     }else{
                //         if($scope.formValues.bdnDate != null){
                //             $('#pumpingStartDP').datetimepicker('setEndDate', $scope.formValues.bdnDate);
                //         }
                //     }
                // }
                // if(val == 'pumpingEndDP'){
                //     //start
                //     if($scope.formValues.bargePumpingRateStartTime != null){
                //         $('#pumpingEndDP').datetimepicker('setStartDate', $scope.formValues.bargePumpingRateStartTime);
                //     }else{
                //         if($scope.formValues.bargeAlongside != null){
                //             $('#pumpingEndDP').datetimepicker('setStartDate', $scope.formValues.bargeAlongside);
                //         }else{
                //             if($scope.formValues.berthingTime != null){
                //                 $('#pumpingEndDP').datetimepicker('setStartDate', $scope.formValues.berthingTime);
                //             }
                //         }
                //     }
                //
                //     //end
                //     if($scope.formValues.bdnDate != null){
                //         $('#pumpingEndDP').datetimepicker('setEndDate', $scope.formValues.bdnDate);
                //     }
                // }
                //if(val == 'bdnDate'){
                //    if($scope.formValues.bargePumpingRateEndTime != null){
                //        $('#bdnDate').datetimepicker('setStartDate', $scope.formValues.bargePumpingRateEndTime);
                //    }else{
                //       if($scope.formValues.bargePumpingRateStartTime != null){
                //            $('#bdnDate').datetimepicker('setStartDate', $scope.formValues.bargePumpingRateStartTime);
                //        }else{
                //            if($scope.formValues.bargeAlongside != null){
                //                $('#bdnDate').datetimepicker('setStartDate', $scope.formValues.bargeAlongside);
                //            }else{
                //                if($scope.formValues.berthingTime != null){
                //                    $('#bdnDate').datetimepicker('setStartDate', $scope.formValues.berthingTime);
                //                }
                //            }
                //        }
                //    }
                //}
            });
        }
    }

    $scope.calculatePumpingRate = function(timeString, prodIndex) {
        console.log(timeString);
        if ((typeof(timeString) == 'undefined') || (typeof($scope.formValues.deliveryProducts) == 'undefined')) return;
        if ((typeof($scope.formValues.deliveryProducts[prodIndex].bdnQuantityUom) == 'undefined') || ($scope.formValues.deliveryProducts[prodIndex].bdnQuantityUom == null) || ($scope.formValues.deliveryProducts[prodIndex].bdnQuantityAmount == null)) return;
        if (typeof($scope.formValues.pumpingRate) == 'undefined') {
            $scope.formValues.pumpingRate = "";
            $scope.formValues.pumpingRateUom = "";
        }
        pumpingTime = (parseInt(timeString.split(':')[0]) * 60 + parseInt(timeString.split(':')[1])) / 60;
        $scope.formValues.pumpingRate = $scope.formValues.deliveryProducts[prodIndex].bdnQuantityAmount / pumpingTime;
        $.each(vm.listsCache.PumpingRateUom, function(key, val) {
            if (val.name.split('/')[0] == $scope.formValues.deliveryProducts[prodIndex].bdnQuantityUom.name) {
                $scope.formValues.pumpingRateUom = val;
            }
        });
    }
    $scope.getRelatedDeliveryLink = function(id) {
        if (id == 0) return "";
        return '#/delivery/delivery/edit/' + id;
    }
    $scope.isDeliveryEditable = function() {
        $scope.CM.isEditable = true;
        if (typeof($scope.formValues.deliveryStatus) != 'undefined') {
            if (($scope.formValues.deliveryStatus.name == 'NotVerified') || ($scope.formValues.deliveryStatus.name == 'Open')) {
		        $scope.CM.isEditable = true;
				return true;
            } else {
		        $scope.CM.isEditable = false;
            }
        }
        if (vm.entity_id == '') {
	        $scope.CM.isEditable = true;
        	return true
        }
        // return false;
    }

    $scope.setVarianceColor = function(idx){
        // debugger
        if(typeof $scope.formValues.temp.variances['color_' + idx] == 'undefined')
            $scope.formValues.temp.variances['color_' + idx] = '';
        if(typeof $scope.formValues.temp.variances['mfm_color_' + idx] == 'undefined')
            $scope.formValues.temp.variances['mfm_color_' + idx] = '';
        // ckeck product_{{idx}}

        if($scope.formValues.temp.variances["product_" + idx] != null){

           /* 
           // old color code
           // 1. Variance < Min Tolerance  => Green
            if(parseFloat($scope.formValues.temp.variances["product_" + idx]) < parseFloat($scope.toleranceLimits.minToleranceLimit))
                $scope.formValues.temp.variances['color_' + idx] = "green";

            // 2. Max Tolerance > Variance > Min Tolerance => Amber
            if((parseFloat($scope.formValues.temp.variances["product_" + idx]) >= parseFloat($scope.toleranceLimits.minToleranceLimit)) &&
                (parseFloat($scope.formValues.temp.variances["product_" + idx]) <= parseFloat($scope.toleranceLimits.maxToleranceLimit))){
                $scope.formValues.temp.variances['color_' + idx] = "amber";
            }

            // 3. Variance > Max Tolerance => Red
            if((parseFloat($scope.formValues.temp.variances["product_" + idx]) > parseFloat($scope.toleranceLimits.maxToleranceLimit))){
                $scope.formValues.temp.variances['color_' + idx] = "red";
            }
            */


            //new color code
            //1. If the variance is Negative value and exceeds Max tolerance, then display the “Variance Qty” value field in “Red” colour
            //2. If the variance is Negative value and less than Max tolerance, then display the “Variance Qty” value field in “Amber” colour
            //3. If the variance is Positive value, then display the “Variance Qty” value field in “Green” colour

            if(parseFloat($scope.formValues.temp.variances["product_" + idx]) < 0){

                // 1 or 2
                if(Math.abs(parseFloat($scope.formValues.temp.variances["product_" + idx])) < parseFloat($scope.toleranceLimits.maxToleranceLimit))
                    $scope.formValues.temp.variances['color_' + idx] = "amber";

                if(Math.abs(parseFloat($scope.formValues.temp.variances["product_" + idx])) >= parseFloat($scope.toleranceLimits.maxToleranceLimit))
                    $scope.formValues.temp.variances['color_' + idx] = "red";

            }else{
                $scope.formValues.temp.variances['color_' + idx] = "green";
            }
        }else{
            // if variance is null, set color to white
            $scope.formValues.temp.variances['color_' + idx] = "white";
        }

        if($scope.formValues.temp.variances["mfm_product_" + idx] != null){
            if(parseFloat($scope.formValues.temp.variances["mfm_product_" + idx]) < 0){

                if(Math.abs(parseFloat($scope.formValues.temp.variances["mfm_product_" + idx])) <= parseFloat($scope.toleranceLimits.maxToleranceLimit))
                    $scope.formValues.temp.variances['mfm_color_' + idx] = "amber";

                if(Math.abs(parseFloat($scope.formValues.temp.variances["mfm_product_" + idx])) > parseFloat($scope.toleranceLimits.maxToleranceLimit))
                    $scope.formValues.temp.variances['mfm_color_' + idx] = "red";

            }else{
                $scope.formValues.temp.variances['mfm_color_' + idx] = "green";
            }
        }else{
            // if variance is null, set color to white
            $scope.formValues.temp.variances['mfm_color_' + idx] = "white";
        }
    }


    $scope.saveAndSendEmail = function(ev) {
        $scope.save_master_changes(ev, true)
    }
    $scope.sendEmails = function() {
        $.each($scope.formValues.deliveryProducts, function(k, v) {
            $scope.sendLabsTemplateEmail(v.id)
        })
    }


    $scope.orderProductsByProductType = function(listName){

        if(listName == "deliveryProducts"){
            $scope.formValues.deliveryProducts = _.orderBy($scope.formValues.deliveryProducts, ['productTypeId'], ['asc']);
            // set CM.selectedProduct and initial selectedProduct
            $scope.formValues.temp.savedProdForCheck = $scope.formValues.deliveryProducts[0].product;
        }
        if(listName == "summaryProducts"){
            $scope.formValues.temp.deliverysummary.products = _.orderBy($scope.formValues.temp.deliverysummary.products, ['productType.id'], ['asc']);
        }

    }

    $scope.getProductTypeById = function(id){
        var prodType = _.filter(vm.listsCache.ProductType, ['id', id]);
        if(prodType.length > 0)
            if(typeof prodType[0] != 'undefined')
                return prodType[0].name;
        return null;
    }

    $scope.setPageTitle = function(title){
        // console.log($state.params);
        if(title){
            //tab title
            var title = "Delivery - " + title;
            $rootScope.$broadcast('$changePageTitle', {
               title: title
            })
        }else{
            // page title
            var deliveryPageTitles = {};
            deliveryPageTitles['ordersdelivery'] = 'Orders Delivery List';
            deliveryPageTitles['deliveriestobeverified'] = 'Deliveries to be Verified';
            if(deliveryPageTitles[$state.params.screen_id]){
                $state.params.title = deliveryPageTitles[$state.params.screen_id];
                // $rootScope.$broadcast('$changePageTitle', {
                //     title: title
                // })
            }else if(deliveryPageTitles[$state.params.screen]){
                $state.params.title = deliveryPageTitles[$state.params.screen];
            }
            
        }
    }

	$scope.sumThose = function(idx,number) {
		return parseFloat(idx) + parseFloat(number);
	}

    $scope.$watch('formValues.validTo', function() {
        if($scope.formValues && typeof($scope.hasDelivery) !== 'undefined' && !$scope.hasDelivery) {
            $scope.formValues.initialValidTo = $scope.formValues.validTo;
        }
    });

    $rootScope.$on("adminConfiguration", function(ev, data) {
    	$scope.adminConfiguration = data;
    })
    $scope.$on('formValues', function(){
        // console.log($scope.formValues);
        if(vm.app_id === 'contracts' && vm.screen_id === 'contract') {
            var navigationPayload = {
                'ContractId': vm.entity_id,
            };
            $http({
                method: "POST",
                url: API.BASE_URL_DATA_INFRASTRUCTURE + '/api/infrastructure/navbar/navbaridslist',
                data: {
                    payload: navigationPayload,
                }
            }).then(function(data){
                if(!data.data.deliveryId) {
                    $scope.hasDelivery = false;
                    if(!$scope.formValues.initialValidTo) {
                        $scope.formValues.initialValidTo = $scope.formValues.validTo;
                    } 
                } else {
                    $scope.hasDelivery = true;
                }
            });
        }
        if(vm.app_id == "delivery"){
            // console.log($scope.formValues);
            if($scope.formValues.name){
                //1. check for request id
                // debugger;
                if($scope.formValues.info != null){
                    if ($scope.formValues.info.request != null){
                        var title = $scope.formValues.info.request.name + " -  " + $scope.formValues.info.vesselName;
                        $scope.setPageTitle(title);
                        return;
                    }
                }
                //2. in no request, check for order id
                if ($scope.formValues.order) {
                    var title = $scope.formValues.order.name + " -  " + $scope.formValues.vesselName;
                    $scope.setPageTitle(title);
                    return;
                }

                //3. else set delivery name as title
                var title = $scope.formValues.name + " -  " + $scope.formValues.vesselName;
                $scope.setPageTitle($scope.formValues.name);
            }
        }
    })
}]);

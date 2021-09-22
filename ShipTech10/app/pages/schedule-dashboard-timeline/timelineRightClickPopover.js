angular.module('shiptech.components')
    .controller('timelineRightClickPopover', [ '$scope', '$rootScope', '$filter', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService', '$tenantSettings', 'API', '$http', '$listsCache', 'statusColors',
        function($scope, $rootScope, $filter, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService, $tenantSettings, API, $http, $listsCache, statusColors) {
	        let ctrl = this;
	        $scope.tenantSettings = $tenantSettings;

            ctrl.collapseContainer = [];
	        tenantService.tenantSettings.then((settings) => {
	            ctrl.numberPrecision = settings.payload.defaultValues;
	            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
	            ctrl.dateFormat = $scope.formatDateToMomentFormat(settings.payload.tenantFormats.dateFormat.name);
	        });

		    ctrl.$onChanges = function(changes) {
		    	$scope.test = new Date();
		    	$scope.rightClickPopoverData = changes.rightClickPopoverData.currentValue;
                ctrl.productTypeView = changes.rightClickPopoverData.currentValue.productTypeView;
                var todayVoyages;
		    	$timeout(() => {
		    		todayVoyages = changes.rightClickPopoverData.currentValue.todayVoyages;
		    		if (changes.rightClickPopoverData.currentValue.bunkerDetails) {
			    		$scope.todaysBunkerDetails = normalizeBunkerDetails(changes.rightClickPopoverData.currentValue.bunkerDetails);
			    		$.each($scope.todaysBunkerDetails, (k, v) => {
			    			todayVoyages.push(v);
			    		});
		    		}
			    	groupVoyages(todayVoyages);
		    	});
		    	ctrl.vesselName = changes.rightClickPopoverData.currentValue.todayVoyages[0].VesselName;
		    };
		    $scope.formatDateToMomentFormat = function(dateFormat) {
	            var dbFormat = dateFormat;
	            var hasDayOfWeek = false;
	            var currentFormat = angular.copy(dateFormat);
	            if (currentFormat.startsWith('DDD ')) {
	                hasDayOfWeek = true;
	                currentFormat = currentFormat.split('DDD ')[1];
	            }
	            currentFormat = currentFormat.replace(/d/g, 'D');
	            currentFormat = currentFormat.replace(/y/g, 'Y');
	            if (hasDayOfWeek) {
	                currentFormat = `ddd ${ currentFormat}`;
	            }
	            return currentFormat;
      		 };

		    var normalizeBunkerDetails = function(bunkerDetails) {
		    	var normalizedBunkerDetails = [];
		    	$.each(bunkerDetails, (k, v) => {
    		    	var	itemStructure = {
    					    voyageDetail: {
    					    	request: {
    					    		requestDetail : {
    					    						vesselName: v.vesselName,
    					    						locationCode: v.portCode,
    					    						eta: v.eta
    					    							}
    					    	},
    					        id: v.voyageDetailId,
    					        hasStrategy: v.hasStrategy,
    					        bunkerPlan: v.bunkerPlan
    					    },
                        };
                    normalizedBunkerDetails.push(itemStructure);
		    	});
		    	return normalizedBunkerDetails;
		    };

		    var groupVoyages = function(voyages) {
		    	var groupedVoyages = _.groupBy(voyages, 'voyageDetail.id');

		    	ctrl.groupedVoyagesDetails = angular.copy(groupedVoyages);

		    	var groupedVoyagesBunker = angular.copy(groupedVoyages);
		    	var groupedVoyagesRequest = angular.copy(groupedVoyages);
                let groupedVoyagesRequestForRightClickPopup = angular.copy(groupedVoyages);
		    	var groupedVoyagesOrder = angular.copy(groupedVoyages);
                var groupedVoyagesOrderForRightClickPopup = angular.copy(groupedVoyages);
		    	var groupedVoyagesAllRequestProductsAreStemmed = [];
		    	var allProductTypes = {};
	    		var orderProductTypes = {};

		    	var uniqueVoyages = [];
		    	$.each(voyages, (k, v) => {
		    		uniqueVoyages.push(v.voyageDetail.id);
		    	});
		    	uniqueVoyages = _.uniq(uniqueVoyages);

		    	var hasEntity = {};
		    	$.each(uniqueVoyages, (k, v) => {
	    			hasEntity[v] = {
	    				hasBunkerPlan : false,
	    				hasRequest : false,
	    				hasOrder : false
	    			};
			    	$.each(voyages, (k1, v1) => {
			    		if (v == v1.voyageDetail.id) {
			    			if (v1.voyageDetail.bunkerPlan) {
			    				hasEntity[v1.voyageDetail.id].hasBunkerPlan = true;
			    			}
			    			if (typeof v1.voyageDetail.request != '{}') {
			    				if (v1.voyageDetail.request.id != 0 && v1.voyageDetail.request.requestDetail.Id) {
			    					hasEntity[v1.voyageDetail.id].hasRequest = true;
			    				}
			    			}
			    			if (v1.voyageDetail.request.requestDetail.orderId) {
			    				hasEntity[v1.voyageDetail.id].hasOrder = true;
			    			}
			    		}
			    	});
		    	});


                $.each(uniqueVoyages, (key, value) => {
                    groupedVoyagesAllRequestProductsAreStemmed[value] = true;
                    $.each(voyages, (key2, value2) => {
                        if (value == value2.voyageDetail.id) {
                            if (value2.voyageDetail.request) {
                                if (value2.voyageDetail.request.id) {
                                    if (!value2.voyageDetail.request.requestDetail.orderId || typeof value2.voyageDetail.request.requestDetail.orderId == 'undefined') {                                                                        
                                        groupedVoyagesAllRequestProductsAreStemmed[value] = false;
                                    }
                                }
                            }
                        }
                    });
                    if (!hasEntity[value].hasOrder) {
                        groupedVoyagesAllRequestProductsAreStemmed[value] = false;
                    }
                });

                _.forEach(groupedVoyagesBunker, (value, key) => {
                    groupedVoyagesBunker[key] = _.groupBy(groupedVoyagesBunker[key], (item) => {
                        if (item.voyageDetail.bunkerPlan) {
                            return item.voyageDetail.bunkerPlan.id;
                        }
                    });
                });
                _.forEach(groupedVoyagesRequest, (value, key) => {
                    groupedVoyagesRequest[key] = _.groupBy(groupedVoyagesRequest[key], (item) => {
                        if (item.voyageDetail.request) {
                            if ((item.voyageDetail.request.id) && (!item.voyageDetail.request.requestDetail.orderId)) {
                            //if ((item.voyageDetail.request.id)) {
                                return item.voyageDetail.request.id;
                            }
                        }
                    });
                });

                groupedVoyagesRequestForRightClickPopup = angular.copy(groupedVoyagesRequest);

                _.forEach(groupedVoyagesOrder, (value, key) => {
                    groupedVoyagesOrder[key] = _.groupBy(groupedVoyagesOrder[key], (item) => {
                        if (item.voyageDetail.request) {
                            if (item.voyageDetail.request.requestDetail.orderId) {
                                return item.voyageDetail.request.requestDetail.orderId;
                            }
                        }
                    });
                });

                groupedVoyagesOrderForRightClickPopup = angular.copy(groupedVoyagesOrder);

                $.each(uniqueVoyages, (k, v) => {
                    allProductTypes[v] = [];
                    orderProductTypes[v] = [];
                });

                Object.keys(groupedVoyagesBunker).forEach((item) => {
                    Object.keys(groupedVoyagesBunker[item]).forEach((item2) => {
                        groupedVoyagesBunker[item][item2] = _.uniqBy(groupedVoyagesBunker[item][item2], 'voyageDetail.bunkerPlan.productType');
                        groupedVoyagesBunker[item][item2] = _.groupBy(groupedVoyagesBunker[item][item2], 'voyageDetail.bunkerPlan.productType');
                        Object.keys(groupedVoyagesBunker[item][item2]).forEach((item3) => {
                            // groupedVoyagesBunker[item][item2][item3] = _.sumBy(groupedVoyagesBunker[item][item2][item3], 'voyageDetail.bunkerPlan.supplyQuantity');
                            if (item3 != 'undefined') {
                                allProductTypes[item].push(item3);
                            }
                        });
                    });
                });
                Object.keys(groupedVoyagesRequest).forEach((item) => {
                    Object.keys(groupedVoyagesRequest[item]).forEach((item2) => {
                        if (item2 != 'undefined') {                    
                            groupedVoyagesRequest[item][item2] = _.uniqBy(groupedVoyagesRequest[item][item2], 'voyageDetail.request.requestDetail.Id');
                            groupedVoyagesRequest[item][item2] = _.groupBy(groupedVoyagesRequest[item][item2], 'voyageDetail.request.requestDetail.fuelType.name');

                            groupedVoyagesRequestForRightClickPopup[item][item2] = _.uniqBy(groupedVoyagesRequestForRightClickPopup[item][item2], 'voyageDetail.request.requestDetail.Id');
                            groupedVoyagesRequestForRightClickPopup[item][item2] = _.groupBy(groupedVoyagesRequestForRightClickPopup[item][item2], 'voyageDetail.request.requestDetail.fuelType.name');
                            
                            Object.keys(groupedVoyagesRequest[item][item2]).forEach((item3) => {
                                if (item3 != 'undefined') {
                                    groupedVoyagesRequest[item][item2][item3] = _.sumBy(groupedVoyagesRequest[item][item2][item3], 'voyageDetail.request.requestDetail.fuelMaxQuantity');
                                    allProductTypes[item].push(item3);
                                } else {
                                    delete groupedVoyagesRequest[item][item2];
                                    delete groupedVoyagesRequestForRightClickPopup[item][item2];
                                }
                            });                
                        }   
                        else
                        {
                            delete groupedVoyagesRequest[item][item2];
                            delete groupedVoyagesRequestForRightClickPopup[item][item2];
                        }
                    
                    });
                });

                console.log(groupedVoyagesRequestForRightClickPopup);

                Object.keys(groupedVoyagesOrder).forEach((item) => {
                    Object.keys(groupedVoyagesOrder[item]).forEach((item2) => {
                        if (item2 != 'undefined') {
                            // groupedVoyagesOrder[item][item2] = _.groupBy(groupedVoyagesOrder[item][item2], 'voyageDetail.request.requestDetail.orderId');
                           
                            groupedVoyagesOrder[item][item2] = _.groupBy(groupedVoyagesOrder[item][item2], 'voyageDetail.request.requestDetail.fuelType.name');

                            groupedVoyagesOrderForRightClickPopup[item][item2] = _.groupBy(groupedVoyagesOrderForRightClickPopup[item][item2], 'voyageDetail.request.requestDetail.fuelType.name');

                            Object.keys(groupedVoyagesOrder[item][item2]).forEach((item3) => {
                                if (item3 != 'undefined') {
                                    groupedVoyagesOrderForRightClickPopup[item][item2][item3] =  _.uniqBy(groupedVoyagesOrderForRightClickPopup[item][item2][item3], 'voyageDetail.request.requestDetail.Id');

                                    groupedVoyagesOrder[item][item2][item3] =  _.uniqBy(groupedVoyagesOrder[item][item2][item3], 'voyageDetail.request.requestDetail.Id');
                                    groupedVoyagesOrder[item][item2][item3] = _.sumBy(groupedVoyagesOrder[item][item2][item3], 'voyageDetail.request.requestDetail.orderProductQuantity');
                                    allProductTypes[item].push(item3);
                                    orderProductTypes[item].push(item3);
                                }
                            });
                        } else {
                            delete groupedVoyagesOrder[item][item2];
                            delete groupedVoyagesOrderForRightClickPopup[item][item2];
                        }
                    });
                });

                console.log(groupedVoyagesOrderForRightClickPopup);

                Object.keys(allProductTypes).forEach((item) => {
                    allProductTypes[item] = _.uniq(allProductTypes[item]);

                });

                $.each(uniqueVoyages, (k, v) => {
                    if (groupedVoyagesAllRequestProductsAreStemmed[v]) {
                        allProductTypes[v] = _.uniq(orderProductTypes[v]);
                    }
                });

                let maxLengthForGroupedVoyagesRequest = {};
                $.each(uniqueVoyages, (key,voyage) => {
                    console.log(key);
                    console.log(voyage);
                    if (typeof  maxLengthForGroupedVoyagesRequest[voyage] == 'undefined') {
                        maxLengthForGroupedVoyagesRequest[voyage] = {};
                    }
                    $.each(groupedVoyagesRequestForRightClickPopup[voyage], (key2, requests) => {
                        console.log(key2);
                        console.log(requests);
                        if (typeof  maxLengthForGroupedVoyagesRequest[voyage][key2] == 'undefined') {
                            maxLengthForGroupedVoyagesRequest[voyage][key2] = {};
                        }
                        let maxLengthArray = 0;
                        maxLengthArray = ctrl.maxLength(requests);
                        maxLengthForGroupedVoyagesRequest[voyage][key2] = maxLengthArray;
                    });

                });

                console.log(maxLengthForGroupedVoyagesRequest);


                let rowValuesForGroupedVoyagesRequest = {};
                $.each(uniqueVoyages, (key, voyage) => {
                    console.log(key);
                    console.log(voyage);
                    if (typeof  rowValuesForGroupedVoyagesRequest[voyage] == 'undefined') {
                        rowValuesForGroupedVoyagesRequest[voyage] = {};
                    }
                    $.each(maxLengthForGroupedVoyagesRequest[voyage], (key2, maxValue) => {
                        console.log(key2);
                        console.log(maxValue);
                        if (typeof  rowValuesForGroupedVoyagesRequest[voyage][key2] == 'undefined') {
                            rowValuesForGroupedVoyagesRequest[voyage][key2] = [];
                        }
                        let requests = groupedVoyagesRequestForRightClickPopup[voyage][key2];
                        console.log(requests);
                        for (let i = 0; i < maxValue; i++) {
                            let valueFromSpecificLine = ctrl.getLineElementsForRequest(requests, i, allProductTypes[voyage]);
                            rowValuesForGroupedVoyagesRequest[voyage][key2].push(valueFromSpecificLine);
                            console.log(valueFromSpecificLine);
                        }
                    });
                })
                console.log(rowValuesForGroupedVoyagesRequest);

                let maxLengthForGroupedVoyagesOrder = {};
                $.each(uniqueVoyages, (key,voyage) => {
                    console.log(key);
                    console.log(voyage);
                    if (typeof  maxLengthForGroupedVoyagesOrder[voyage] == 'undefined') {
                        maxLengthForGroupedVoyagesOrder[voyage] = {};
                    }
                    $.each(groupedVoyagesOrderForRightClickPopup[voyage], (key2, orders) => {
                        console.log(key2);
                        console.log(orders);
                        if (typeof  maxLengthForGroupedVoyagesOrder[voyage][key2] == 'undefined') {
                            maxLengthForGroupedVoyagesOrder[voyage][key2] = {};
                        }
                        let maxLengthArray = 0;
                        maxLengthArray = ctrl.maxLength(orders);
                        maxLengthForGroupedVoyagesOrder[voyage][key2] = maxLengthArray;
                    });

                });
                console.log(maxLengthForGroupedVoyagesOrder);

                let rowValuesForGroupedVoyagesOrder = {};
                $.each(uniqueVoyages, (key, voyage) => {
                    console.log(key);
                    console.log(voyage);
                    if (typeof  rowValuesForGroupedVoyagesOrder[voyage] == 'undefined') {
                        rowValuesForGroupedVoyagesOrder[voyage] = {};
                    }
                    $.each(maxLengthForGroupedVoyagesOrder[voyage], (key2, maxValue) => {
                        console.log(key2);
                        console.log(maxValue);
                        if (typeof  rowValuesForGroupedVoyagesOrder[voyage][key2] == 'undefined') {
                            rowValuesForGroupedVoyagesOrder[voyage][key2] = [];
                        }
                        let orders = groupedVoyagesOrderForRightClickPopup[voyage][key2];
                        console.log(orders);
                        for (let i = 0; i < maxValue; i++) {
                            let valueFromSpecificLine = ctrl.getLineElementsForOrder(orders, i, allProductTypes[voyage]);
                            rowValuesForGroupedVoyagesOrder[voyage][key2].push(valueFromSpecificLine);
                            console.log(valueFromSpecificLine);
                        }
                    });
                })
                console.log(rowValuesForGroupedVoyagesOrder);


                ctrl.groupedVoyages = {
                    hasEntity : hasEntity,
                    allProductTypes : allProductTypes,
                    groupedVoyagesAllRequestProductsAreStemmed : groupedVoyagesAllRequestProductsAreStemmed,
                    groupedVoyagesBunker : groupedVoyagesBunker,
                    groupedVoyagesRequest : groupedVoyagesRequest,
                    groupedVoyagesRequestForRightClickPopup: groupedVoyagesRequestForRightClickPopup,
                    maxLengthForGroupedVoyagesRequest: maxLengthForGroupedVoyagesRequest,
                    rowValuesForGroupedVoyagesRequest: rowValuesForGroupedVoyagesRequest,
                    groupedVoyagesOrder : groupedVoyagesOrder,
                    groupedVoyagesOrderForRightClickPopup: groupedVoyagesOrderForRightClickPopup,
                    maxLengthForGroupedVoyagesOrder: maxLengthForGroupedVoyagesOrder,
                    rowValuesForGroupedVoyagesOrder: rowValuesForGroupedVoyagesOrder,
                    uniqueVoyages : uniqueVoyages
                };
		    };

            ctrl.getLineElementsForRequest = function(values, index, productTypes) {
                let rowValues = [];
                let status = '';
                $.each(productTypes, (key, productType) => {
                    console.log(key);
                    console.log(productType);
                    rowValues.push(null);
                    rowValues.push(null);
                    $.each(values, (ptkey, ptval) => {
                        if (ptkey == productType) {
                            console.log(ptkey);
                            console.log(ptval);
                            if (ptval[index]) {
                                status = ptval[index].voyageDetail.portStatus;
                                rowValues[key * 2] = ptval[index].voyageDetail.request.requestDetail.fuelOilOfRequest;
                                if (ptval[index].voyageDetail.request.requestDetail.fuelMaxQuantity) {
                                    rowValues[key * 2 + 1] = $filter("number")(ptval[index].voyageDetail.request.requestDetail.fuelMaxQuantity, ctrl.numberPrecision.quantityPrecision) +  ' ' + ptval[index].voyageDetail.request.requestDetail.uom;
                                } else {
                                    rowValues[key * 2 + 1] = ptval[index].voyageDetail.request.requestDetail.uom;
                                }
                            }
                            
                        }

                    });
                });
            
                rowValues.push(status);
                return rowValues;
            }

            ctrl.getLineElementsForOrder = function(values, index, productTypes) {
                let rowValues = [];
                let status = '';
                $.each(productTypes, (key, productType) => {
                    console.log(key);
                    console.log(productType);
                    rowValues.push(null);
                    rowValues.push(null);
                    $.each(values, (ptkey, ptval) => {
                        if (ptkey == productType) {
                            console.log(ptkey);
                            console.log(ptval);
                            if (ptval[index]) {
                                status = ptval[index].voyageDetail.request.requestDetail.orderStatus;
                                rowValues[key * 2] = ptval[index].voyageDetail.request.requestDetail.fuelOilOfRequest;
                                if (ptval[index].voyageDetail.request.requestDetail.orderProductQuantity) {
                                    rowValues[key * 2 + 1] = $filter("number")(ptval[index].voyageDetail.request.requestDetail.orderProductQuantity, ctrl.numberPrecision.quantityPrecision) +  ' ' + ptval[index].voyageDetail.request.requestDetail.orderProductQuantityUom;
                                } else {
                                    rowValues[key * 2 + 1] = ptval[index].voyageDetail.request.requestDetail.orderProductQuantityUom;
                                }
                            }
                            
                        }

                    });
                });
            
                rowValues.push(status);
                return rowValues;
            }



            ctrl.getStatusColor = function(portStatus) {
                let colorCode = statusColors.getColorCodeFromLabels(portStatus, $listsCache.ScheduleDashboardLabelConfiguration);
                return colorCode;
            }

            ctrl.getBunkerPlan = function(allProductTypes, groupedVoyagesBunker) {
                let array = [];
                for (let i = 0; i < allProductTypes.length; i++) {
                    array.push(null);
                    array.push(null);
                }
                let i = 0;
                $.each(groupedVoyagesBunker, (ptkey, ptval) => {
                    console.log(ptkey);
                    console.log(ptval);
                    let voyageDetail = '';
                    $.each(ptval, (productType, val) => {
                        voyageDetail = ptval[productType][0].voyageDetail;
                    });
                    if (ptkey != 'undefined') {
                        array[i * 2 + 1] = voyageDetail; 
                        i++; 
                    }
                });
                array.push(null);
                return array;
            }

            ctrl.getElementsFromArray = function(length) {
                let array = [];
                for (let i = 0; i < length; i++) {
                    array.push(i);
                }
                return array;
            }

            ctrl.getListForHeader = function(list) {
                let headerList = [];
                $.each(list, (key, v) => {
                    headerList.push(v + ' Product');
                    headerList.push(v + ' Qty');
                });

                return  headerList;
            }

            ctrl.maxLength = function(list) {
                let max = 0;
                $.each(list, (type, v) => {
                    if (v.length > max) {
                        max = v.length;
                    }
                 });

                return  max;
            }


		    ctrl.getPriorityStatus = function(voyage) {
                var lowestPriorityStatus = _.minBy(ctrl.groupedVoyagesDetails[voyage], 'voyageDetail.portStatusPriority');
                if (lowestPriorityStatus) {
                    var colorCode = statusColors.getColorCodeFromLabels(lowestPriorityStatus.voyageDetail.portStatus, $listsCache.ScheduleDashboardLabelConfiguration);
					$.each(window.scheduleDashboardConfiguration.payload.labels, function(sk,sv){
						if (sv.status.id == lowestPriorityStatus.voyageDetail.portStatus.id && sv.transactionType.id == lowestPriorityStatus.voyageDetail.portStatus.transactionTypeId && !sv.displayInDashboard ) {
							lowestPriorityStatus.voyageDetail.portStatus.hideInDashboard = true;
						}
					})                     
                    lowestPriorityStatus.voyageDetail.portStatus.color = colorCode;
                    lowestPriorityStatus.voyageDetail.portStatus.fontColor = getContrastYIQ(colorCode);
                } else {
                    lowestPriorityStatus = ctrl.groupedVoyagesDetails[voyage][0];
                    var colorCode = statusColors.getColorCodeFromLabels(lowestPriorityStatus.voyageDetail.portStatus, $listsCache.ScheduleDashboardLabelConfiguration);
					$.each(window.scheduleDashboardConfiguration.payload.labels, function(sk,sv){
						if (sv.status.id == lowestPriorityStatus.voyageDetail.portStatus.id && sv.transactionType.id == lowestPriorityStatus.voyageDetail.portStatus.transactionTypeId && !sv.displayInDashboard ) {
							lowestPriorityStatus.voyageDetail.portStatus.hideInDashboard = true;
						}
					});                     
                    lowestPriorityStatus.voyageDetail.portStatus.color = colorCode;
                    lowestPriorityStatus.voyageDetail.portStatus.fontColor = getContrastYIQ(colorCode);
                    if (lowestPriorityStatus.voyageDetail.portStatus.hideInDashboard) {
                        lowestPriorityStatus.voyageDetail.portStatus.color = "#ffffff";
                        lowestPriorityStatus.voyageDetail.portStatus.fontColor = "#000000";
                        lowestPriorityStatus.voyageDetail.portStatus.hideInDashboard = false;
                    }
                }
                return lowestPriorityStatus.voyageDetail.portStatus;
		    };

	        ctrl.addVoyageToContractPlanning = function(voyageStop) {
                var vesselsWithoutProduct = '';
	            $rootScope.scheduleDashboardVesselVoyages = [ ctrl.groupedVoyagesDetails[voyageStop][0] ];
                for (var i = 0 ; i < $rootScope.scheduleDashboardVesselVoyages.length; i++) {
                      if (!$rootScope.scheduleDashboardVesselVoyages[i].DefaultDistillate  &&  !$rootScope.scheduleDashboardVesselVoyages[i].DefaultFuel) {
                        vesselsWithoutProduct = `${vesselsWithoutProduct }${$rootScope.scheduleDashboardVesselVoyages[i].VesselName }, `;
                    }
                }
                if (vesselsWithoutProduct.length > 0) {
                    toastr.error(`For the selected Vessels : ${ vesselsWithoutProduct } there  is no product defined. Please define at least one Product into Vessel master.`);
                    return;
                }
	            localStorage.setItem('scheduleDashboardVesselVoyages', JSON.stringify($rootScope.scheduleDashboardVesselVoyages));
	            // $rootScope.activeBreadcrumbFilters = [];
	            $('.contextmenu a.close').click();
	            window.open('/#/contract-planning/', '_blank');
	        };

            ctrl.$onInit = function() {
            };

            ctrl.canAddToContractPlanning = function(voyage) {
                if (moment(ctrl.groupedVoyagesDetails[voyage][0].voyageDetail.eta) > moment()) {
                    return true;
                }
                return false;
            };

            function getContrastYIQ(hexcolor) {
			    hexcolor = hexcolor.replace('#', '');
			    let r = parseInt(hexcolor.substr(0, 2), 16);
			    let g = parseInt(hexcolor.substr(2, 2), 16);
			    let b = parseInt(hexcolor.substr(4, 2), 16);
			    let yiq = (r * 299 + g * 587 + b * 114) / 1000;
			    return yiq >= 128 ? 'black' : 'white';
            }

	        ctrl.confirmCancelBunkerStrategy = function(bunkerPlan, vsVal) {
                $('.cancelStrategyModal').modal();
                $('.cancelStrategyModal').removeClass('hide');
                $("timeline-right-click-popover").hide();
                $("more-ports-popover").hide();
                $(".vis-item.vis-selected").removeClass("vis-selected");
                ctrl.cancelStrategyModalData = {};
                ctrl.cancelStrategyModalData.vesselName = vsVal.request.requestDetail.vesselName;
                ctrl.cancelStrategyModalData.portCode = vsVal.request.requestDetail.locationCode;
                ctrl.cancelStrategyModalData.eta = ctrl.formatDateUtc(vsVal.request.requestDetail.eta);
                ctrl.cancelStrategyModalData.fuelType = bunkerPlan.productType;
                ctrl.cancelStrategyModalData.quantity = bunkerPlan.supplyQuantity;
                ctrl.cancelStrategyModalData.uom = bunkerPlan.supplyUomName;
                ctrl.cancelStrategyModalData.bunkerPlanId = bunkerPlan.id;
            };


	        ctrl.cancelStrategy = function(bunkerPlanId) {
                let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/cancelStrategy`;
                var payload = {
                    payload : bunkerPlanId
                };
                if (typeof(window.timelineCancelledBunkerStrategies) == "undefined") {
                	window.timelineCancelledBunkerStrategies = [];
                }
                var currentBunkerPlanId = bunkerPlanId;
	            $http.post(url, payload).then((response) => {
	                if (response.status == 200) {
	                	window.timelineCancelledBunkerStrategies.push(currentBunkerPlanId);
			            ctrl.checkIfAllStrategiesAreCancelled();
	                } else {
	                    console.log('Error cancelStrategy');
	                }
	            });
	            $scope.cancelStrategyModalData = null;
            };

            ctrl.checkIfAllStrategiesAreCancelled = function() {
            	hasStrategies = false
            	$.each($scope.rightClickPopoverData.todayVoyages, function(k,v){
            		if(v.voyageDetail) {
	            		if(v.voyageDetail.bunkerPlan) {
		            		if(v.voyageDetail.bunkerPlan.supplyStrategy && 
		            			v.voyageDetail.bunkerPlan.supplyQuantity != 0 && 
		            			window.timelineCancelledBunkerStrategies.indexOf(v.voyageDetail.bunkerPlan.id) == -1) {
				            	hasStrategies = true;
		            		}
	            		}
            		}
            	})
            	if (!hasStrategies) {
	            	$rootScope.$broadcast('allStrategiesAreCancelled', $scope.rightClickPopoverData.todayVoyages[0].voyageDetail.id);
            	}
            }


			ctrl.strategyAlreadyCancelled = function(bunkerPlanId) {
				if (window.timelineCancelledBunkerStrategies) {
					if (window.timelineCancelledBunkerStrategies.indexOf(bunkerPlanId) != -1) {
						return true;
					}
				}
				return false;
			}

            ctrl.formatDateUtc = function(cellValue) {
	            let dateFormat = ctrl.dateFormat;
	            let hasDayOfWeek = false;
	            dateFormat = dateFormat.replace(/D/g, 'd').replace(/Y/g, 'y');
	            var formattedDate = moment(cellValue).format(ctrl.dateFormat);
	            if (formattedDate) {
	                let array = formattedDate.split(' ');
	                let format = [];
	                $.each(array, (k, v) => {
	                    if (array[k] != '00:00') {
	                        format = `${format + array[k] } `;
	                    }
	                });
	                formattedDate = format;
	            }

	            if (formattedDate) {
	                if (formattedDate.indexOf('0001') != -1) {
	                    formattedDate = '';
	                }
	            }
	            if (cellValue != null) {
	                return formattedDate;
	            }
	            return '';
       		};

            ctrl.checkProductTypeView = function(productTypeView) {
                if (productTypeView) {
                    if ([1].indexOf(productTypeView.id) != -1) {
                        return true;
                    } 
                }
                return false;
            }

            ctrl.removePopup = function() {
                $("schedule-dashboard-timeline .contextmenu").remove();

            }
        }

    ]
    );

angular.module('shiptech.components').component('timelineRightClickPopover', {
    templateUrl: 'pages/schedule-dashboard-timeline/views/right-click-popover-timeline.html',
    controller: 'timelineRightClickPopover',
    bindings: {
    	rightClickPopoverData : '<',
    }
});

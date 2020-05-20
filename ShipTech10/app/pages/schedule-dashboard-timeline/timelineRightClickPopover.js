angular.module('shiptech.components')
    .controller('timelineRightClickPopover', [ '$scope', '$rootScope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService', '$tenantSettings', 'API', '$http', '$listsCache', 'statusColors',
        function($scope, $rootScope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService, $tenantSettings, API, $http, $listsCache, statusColors) {
	        let ctrl = this;

	        tenantService.tenantSettings.then((settings) => {
	            ctrl.numberPrecision = settings.payload.defaultValues;
	            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
	            ctrl.dateFormat = $scope.formatDateToMomentFormat(settings.payload.tenantFormats.dateFormat.name);
	        });

		    ctrl.$onChanges = function(changes) {
		    	$scope.test = new Date();
		    	$scope.rightClickPopoverData = changes.rightClickPopoverData.currentValue;
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
		    	var groupedVoyagesOrder = angular.copy(groupedVoyages);
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
                            if (item.voyageDetail.request.id) {
                                return item.voyageDetail.request.id;
                            }
                        }
                    });
                });
                _.forEach(groupedVoyagesOrder, (value, key) => {
                    groupedVoyagesOrder[key] = _.groupBy(groupedVoyagesOrder[key], (item) => {
                        if (item.voyageDetail.request) {
                            if (item.voyageDetail.request.requestDetail.orderId) {
                                return item.voyageDetail.request.requestDetail.orderId;
                            }
                        }
                    });
                });

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
                        groupedVoyagesRequest[item][item2] = _.uniqBy(groupedVoyagesRequest[item][item2], 'voyageDetail.request.requestDetail.Id');
                        groupedVoyagesRequest[item][item2] = _.groupBy(groupedVoyagesRequest[item][item2], 'voyageDetail.request.requestDetail.fuelType.name');
                        Object.keys(groupedVoyagesRequest[item][item2]).forEach((item3) => {
                            if (item3 != 'undefined') {
                                groupedVoyagesRequest[item][item2][item3] = _.sumBy(groupedVoyagesRequest[item][item2][item3], 'voyageDetail.request.requestDetail.fuelMaxQuantity');
                                allProductTypes[item].push(item3);
                            } else {
                                delete groupedVoyagesRequest[item][item2];
                            }
                        });
                    });
                });


                Object.keys(groupedVoyagesOrder).forEach((item) => {
                    Object.keys(groupedVoyagesOrder[item]).forEach((item2) => {
                        if (item2 != 'undefined') {
                            // groupedVoyagesOrder[item][item2] = _.uniqBy(groupedVoyagesOrder[item][item2], 'voyageDetail.request.requestDetail.orderId');
                            groupedVoyagesOrder[item][item2] = _.groupBy(groupedVoyagesOrder[item][item2], 'voyageDetail.request.requestDetail.fuelType.name');
                            Object.keys(groupedVoyagesOrder[item][item2]).forEach((item3) => {
                                if (item3 != 'undefined') {
                                    groupedVoyagesOrder[item][item2][item3] = _.sumBy(groupedVoyagesOrder[item][item2][item3], 'voyageDetail.request.requestDetail.orderProductQuantity');
                                    allProductTypes[item].push(item3);
                                    orderProductTypes[item].push(item3);
                                }
                            });
                        } else {
                            delete groupedVoyagesOrder[item][item2];
                        }
                    });
                });

                Object.keys(allProductTypes).forEach((item) => {
                    allProductTypes[item] = _.uniq(allProductTypes[item]);
                });

                $.each(uniqueVoyages, (k, v) => {
                    if (groupedVoyagesAllRequestProductsAreStemmed[v]) {
                        allProductTypes[v] = orderProductTypes[v];
                    }
                });


                ctrl.groupedVoyages = {
                    hasEntity : hasEntity,
                    allProductTypes : allProductTypes,
                    groupedVoyagesAllRequestProductsAreStemmed : groupedVoyagesAllRequestProductsAreStemmed,
                    groupedVoyagesBunker : groupedVoyagesBunker,
                    groupedVoyagesRequest : groupedVoyagesRequest,
                    groupedVoyagesOrder : groupedVoyagesOrder,
                    uniqueVoyages : uniqueVoyages
                };
		    };

		    ctrl.getPriorityStatus = function(voyage) {
                var highestPriorityStatus = _.maxBy(ctrl.groupedVoyagesDetails[voyage], 'voyageDetail.portStatusPriority');
                if (highestPriorityStatus) {
                    var colorCode = statusColors.getColorCodeFromLabels(highestPriorityStatus.voyageDetail.portStatus, $listsCache.ScheduleDashboardLabelConfiguration);
					$.each(window.scheduleDashboardConfiguration.payload.labels, function(sk,sv){
						if (sv.status.id == highestPriorityStatus.voyageDetail.portStatus.id && sv.transactionType.id == highestPriorityStatus.voyageDetail.portStatus.transactionTypeId && !sv.displayInDashboard ) {
							highestPriorityStatus.voyageDetail.portStatus.hideInDashboard = true;
						}
					})                     
                    highestPriorityStatus.voyageDetail.portStatus.color = colorCode;
                    highestPriorityStatus.voyageDetail.portStatus.fontColor = getContrastYIQ(colorCode);
                } else {
                    highestPriorityStatus = ctrl.groupedVoyagesDetails[voyage][0];
                    var colorCode = statusColors.getColorCodeFromLabels(highestPriorityStatus.voyageDetail.portStatus, $listsCache.ScheduleDashboardLabelConfiguration);
					$.each(window.scheduleDashboardConfiguration.payload.labels, function(sk,sv){
						if (sv.status.id == highestPriorityStatus.voyageDetail.portStatus.id && sv.transactionType.id == highestPriorityStatus.voyageDetail.portStatus.transactionTypeId && !sv.displayInDashboard ) {
							highestPriorityStatus.voyageDetail.portStatus.hideInDashboard = true;
						}
					})                     
                    highestPriorityStatus.voyageDetail.portStatus.color = colorCode;
                    highestPriorityStatus.voyageDetail.portStatus.fontColor = getContrastYIQ(colorCode);
                }
                return highestPriorityStatus.voyageDetail.portStatus;
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
